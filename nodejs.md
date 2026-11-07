---
layout: page
title: Node.js in Production
description: Notes on running Node.js in production, from the event loop, errors, and streams to delivery and deployment.
permalink: /nodejs
---

## Runtime model<a name="runtime-model"></a>
Node’s single-threaded event loop excels at I/O-bound work. Keep the event loop free; offload CPU-heavy tasks.

- Event loop basics: callbacks are processed in phases (timers, pending callbacks, idle/prepare, poll, check, close). Long-running JS blocks all requests.
- Avoid blocking: heavy JSON parsing, crypto, compression, image/video processing should move off-thread.
- Worker Threads vs processes:
  - Worker Threads share memory (via `SharedArrayBuffer`), lower IPC overhead for compute.
  - Child processes are fully isolated; good for running other CLIs.
- Threadpool (`libuv`): used by `fs`, `crypto.scrypt`, `dns.lookup` (non-`verbatim`), compression. Default size is 4; increase for parallel I/O:
  - `UV_THREADPOOL_SIZE=32 node server.js` (max 128). Benchmark before increasing.
- Detect blocking: use `clinic flame|doctor`, `0x`, or measure `eventLoopUtilization` from `perf_hooks`.

```js
// Worker Threads for CPU-bound tasks
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url), { workerData: { n: 40 } });
} else {
  // compute(workerData.n) ...
  parentPort.postMessage('done');
}
```

## Scaling services<a name="scaling-services"></a>
Design stateless services so any instance can serve any request. The general shape of vertical and horizontal scale is in [Scalability](/system-design#scalability).

- Horizontal scale: run multiple processes/containers (K8s/PM2/Docker). Prefer one process per container; scale out rather than `cluster` in containers.
- WebSockets: use sticky sessions on the LB or a shared pub/sub (Redis) to broadcast events across instances.
- Health endpoints:
  - `/livez` indicates the process is alive.
  - `/readyz` indicates the instance can serve traffic (DB/cache connected).
- Graceful shutdown:
  - Stop accepting new connections, drain keep-alive, finish inflight work, close pools, then exit.
  - In K8s, use `preStop` hook and a termination grace period.

```js
// Graceful shutdown
const server = app.listen(process.env.PORT || 3000);
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
});
```

## Resilience patterns<a name="resilience-patterns"></a>
Expect failures and timeouts; design for idempotency and retries.

- Timeouts: set client and server timeouts explicitly (HTTP, DB, queues).
- Retries: exponential backoff with jitter; retry only idempotent operations.
- Idempotency: use request IDs on write endpoints; dedupe on the server (e.g., store ID in DB).
- Circuit breakers: fail fast when dependency is degraded; provide fallbacks.
- Bulkheads: isolate resources with separate pools/queues to prevent cascade failures.
- Queues and DLQs: buffer work; move repeatedly failing messages to a dead-letter queue.

```js
// Safe outbound calls with timeout + circuit breaker
import opossum from 'opossum';
import { fetch } from 'undici';

const doFetch = (url, opts) =>
  fetch(url, { ...opts, bodyTimeout: 3000, headersTimeout: 3000 });

const breaker = new opossum(doFetch, {
  timeout: 3500,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});

await breaker.fire('https://api.example.com');
```

## Errors<a name="errors"></a>
A failed request should fail that request. It should not take the process down.

- A bad request or a thrown handler returns a 4xx or a 5xx from one place at the edge. Log the stack once, with the request id.
- `unhandledRejection` and `uncaughtException` mean a bug escaped the handler. Log it and exit. A process that keeps going after that is in a state you did not plan. Let the orchestrator start a new one. See [Delivery](#delivery).
- A timeout from a dependency is worth a retry. A bug is not. Retrying a bug only fills the log.

## Observability<a name="observability"></a>
Make behavior measurable and debuggable.

- Logs: use structured logging (Pino). Inject a request ID; log at INFO in prod, DEBUG locally.
- Metrics: expose Prometheus metrics. Track latency histograms, RPS, error rates, resource usage.
- Tracing: instrument HTTP, DB, and queue spans with OpenTelemetry; export to Jaeger/Tempo/OTLP.

```js
// Metrics + simple request timing
import { register, collectDefaultMetrics, Histogram } from 'prom-client';

collectDefaultMetrics();

const httpLatency = new Histogram({
  name: 'http_latency_ms',
  help: 'HTTP latency',
  buckets: [50, 100, 300, 1000]
});

app.use((req, res, next) => {
  const t = Date.now();
  res.on('finish', () => httpLatency.observe(Date.now() - t));
  next();
});

app.get('/metrics', async (_req, res) => res.end(await register.metrics()));
```

## Security<a name="security"></a>
Harden endpoints and supply chain.

- HTTP protections: `helmet`, strict CORS, HSTS, disable `x-powered-by`.
- Validation: validate all inputs (`zod`/`joi`), use parameterized queries, sanitize output where needed.
- Auth: sessions vs JWT; rotate keys; short-lived access tokens + refresh flow.
- Secrets: never in repo; use environment/secret managers (KMS/SM/ Vault).
- Rate limiting: per-IP or per-user using Redis (`rate-limiter-flexible`).
- SSRF/egress: restrict outbound hosts, validate URLs, prefer allowlists.

## HTTP performance<a name="http-performance"></a>
Optimize client/server I/O and payloads.

- Client: use `undici` agent with keep-alive; reuse connections; DNS cache (`cacheable-lookup`) if needed.
- Server: enable gzip/brotli; ETag/Last-Modified; cache headers; conditional requests.
- Framework: Fastify + JSON schema validation for speed and safer handlers.
- Streaming: a large body is a [stream](#streams). HTTP/2 avoids the head-of-line blocking of HTTP/1.1.

```js
// Undici global agent
import { Agent, setGlobalDispatcher } from 'undici';

setGlobalDispatcher(new Agent({ keepAliveTimeout: 10_000, connections: 100 }));
```

## Streams<a name="streams"></a>
A stream moves bytes in chunks. When the consumer's buffer fills, the producer pauses. That pause is backpressure. Without it a fast sender or a large file fills memory, and the process dies.

- Use one for a file, an upload, or a response you are proxying. `pipeline` from `node:stream/promises` connects the pieces and cleans up when one of them errors.
- Do not buffer a body you could forward. `response.text()` and `Buffer.concat` hold the whole thing.
- The same rule applies on HTTP/2. The protocol changes the blocking, not the memory.

```js
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

app.get('/file', async (_req, res) => {
  await pipeline(createReadStream('./report.csv'), res);
});
```

## Memory<a name="memory"></a>
The heap is where objects live, and the garbage collector frees whatever nothing references. A leak is a reference you kept: a Map that only grows, a listener you never removed, a closure holding a request.

- A leak climbs and stays high after the traffic has gone. A busy process spikes and settles.
- Take a heap snapshot while it is large, and another a few minutes later. The objects that grew are the leak. `clinic heapprofiler`, or Chrome devtools attached to the process, shows them.
- `--max-old-space-size` gives a leak more room. It does not remove it. Set a limit so the process exits and restarts instead of swapping.

## Caching<a name="caching"></a>
Use multiple layers and plan invalidation. Which store to put the copy in is in [Cache](/system-design#cache).

- Strategies: read-through, write-through, write-behind; set TTLs; use versioned keys.
- Stampede control: single-flight locks, request coalescing, jittered TTLs, stale-while-revalidate.
- Redis tips: use `ioredis` or `@redis/client`; consider Redlock for distributed locks; watch memory and eviction policy.
- In-process cache: small LRU for ultra-hot keys; invalidate on updates or on pub/sub messages.

## Real-time<a name="real-time"></a>
Scale live updates predictably.

- WebSockets/Socket.IO: use Redis adapter to fan out messages across instances; prefer LB stickiness or a broker.
- SSE: simpler firewall traversal; implement backpressure and reconnection.
- Presence/state: store transient state in Redis; set expirations; avoid pinning to a single node.

## Background jobs and scheduling<a name="background-jobs"></a>
Move non-critical work off the request path. A job that can be retried belongs with the [resilience](#resilience-patterns) notes.

- Queues: `bullmq`/`bee-queue`/`agenda`. Run workers in separate processes/containers.
- Idempotency: dedupe keys, job IDs; ensure handlers can safely retry.
- Retries/backoff: limit max attempts; exponential or decorrelated jitter; DLQ for poison jobs.
- Scheduling: cron-like repeats, time zones, daylight saving awareness.

```js
// BullMQ example
import { Queue } from 'bullmq';

const emails = new Queue('emails', { connection: { host: '127.0.0.1', port: 6379 } });

await emails.add('send', { to: 'user@example.com' }, {
  attempts: 5,
  backoff: { type: 'exponential' }
});
```

## Data access<a name="data-access"></a>
Make databases reliable and fast. Replication, sharding, and when to leave SQL are in [Databases](/system-design#databases).

- Pooling: set sensible pool sizes; avoid exhausting DB with too many connections; consider PgBouncer.
- Queries: always parameterize; add proper indexes; avoid N+1 (batching, caching).
- ORM/tooling: Prisma/Knex/TypeORM—know their query patterns; use transactions for multi-step writes.
- MongoDB: design for access patterns; use projections; compound indexes; `lean()` with Mongoose for speed.
- Timeouts: set client and query timeouts; circuit breakers around DB calls.

## Delivery<a name="delivery"></a>
What runs in production is an artifact that was built once.

- **Container:** an image is a filesystem and a command to start. The running container is one process, with its own files and its own network namespace. Run one process in it. The same image goes to every environment, and the config comes from the environment, not from building again.
- **Pipeline:** a push runs the tests, builds the image, and deploys that digest. Do not build a second time on the server.
- **Infrastructure as code:** Terraform or Pulumi describe the load balancer, the database, and the machines. The change is a diff in review. A click in the console drifts from that file, and the next apply puts the click back.
- **Rollout:** bring up a new instance, wait until it is ready, then drain the old one. If the new one never becomes ready, stop. Rolling back is deploying the previous image.

## Deployment<a name="deployment"></a>
Ship minimal, predictable artifacts. How that artifact is built and rolled out is in [Delivery](#delivery).

- Images: use slim or distroless; avoid heavy Alpine if native deps/openssl issues; cache layers.
- Runtime: `NODE_ENV=production`; source maps for error tracking; health endpoints.
- Resources: set CPU/memory limits; only tune GC/heap flags when profiling indicates it.
- Config: 12-Factor; env vars; secret mounts; immutable images; rolling/canary deploys.
- Startup/shutdown: readiness/liveness probes; preStop hooks; graceful termination.

## Testing and reliability<a name="testing"></a>
Prove SLOs under realistic load and failure.

- Load tests: `autocannon`, `k6`, `artillery`; test steady-state and spikes; define SLOs/SLIs (latency, error rate).
- Integration/contract tests: verify interfaces between services (e.g., Pact).
- Chaos drills: dependency outages, slow responses, network partitions; practice incident runbooks.
- Feature flags: gradual rollouts; fast rollbacks; dark launches.