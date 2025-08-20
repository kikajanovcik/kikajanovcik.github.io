---
layout: page
title: Node.js in Production
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
Design stateless services so any instance can serve any request.

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
- Streaming: prefer streams for large payloads; enable HTTP/2 where viable; be mindful of head-of-line blocking.

```js
// Undici global agent
import { Agent, setGlobalDispatcher } from 'undici';

setGlobalDispatcher(new Agent({ keepAliveTimeout: 10_000, connections: 100 }));
```

## Caching<a name="caching"></a>
Use multiple layers and plan invalidation.

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
Move non-critical work off the request path.

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
Make databases reliable and fast.

- Pooling: set sensible pool sizes; avoid exhausting DB with too many connections; consider PgBouncer.
- Queries: always parameterize; add proper indexes; avoid N+1 (batching, caching).
- ORM/tooling: Prisma/Knex/TypeORM—know their query patterns; use transactions for multi-step writes.
- MongoDB: design for access patterns; use projections; compound indexes; `lean()` with Mongoose for speed.
- Timeouts: set client and query timeouts; circuit breakers around DB calls.

## Deployment<a name="deployment"></a>
Ship minimal, predictable artifacts.

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