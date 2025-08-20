---
layout: page
title: Node.js in Production
permalink: /nodejs
---

## Runtime model<a name="runtime-model"></a>
- Event loop and non-blocking I/O; avoid blocking the thread.
- CPU-bound work: use Worker Threads or move to separate services.
- Tune libuv threadpool with `UV_THREADPOOL_SIZE` for I/O-heavy addons (hash, fs, crypto).

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
- Horizontal scale with multiple processes (Docker/K8s, PM2, cluster).
- Use sticky sessions for WebSockets.
- Implement health checks (readiness/liveness) and graceful shutdown.

```js
// Graceful shutdown
const server = app.listen(process.env.PORT || 3000);
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
});
```

## Resilience patterns<a name="resilience-patterns"></a>
- Timeouts, retries with jittered backoff, idempotency keys.
- Circuit breakers and bulkheads for fragile deps; DLQs for jobs.

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

### Observability
- Structured logging (Pino); propagate correlation IDs.
- Metrics (Prometheus `prom-client`): latency, QPS, errors.
- Tracing (OpenTelemetry) for HTTP/DB/queue spans.

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

### Security
- `helmet`, CORS, input validation (`zod`/`joi`), rate limiting (`rate-limiter-flexible`).
- Auth: JWT vs sessions, refresh tokens, key rotation, secrets management.
- Dependency and image scanning in CI; supply-chain protections.

### HTTP performance
- Use `undici` with keep-alive and connection pooling; enable compression; cache headers.
- Prefer Fastify with schema validation for higher throughput where suitable.
- Consider streaming and HTTP/2 where beneficial.

```js
// Undici global agent
import { Agent, setGlobalDispatcher } from 'undici';

setGlobalDispatcher(new Agent({ keepAliveTimeout: 10_000, connections: 100 }));
```

## Caching<a name="caching"></a>
- Redis clients (`ioredis`, `@redis/client`): read-through/write-through, TTLs, SWR.
- Local LRU for hot small items; ensure invalidation strategy.

## Real-time<a name="real-time"></a>
- WebSockets/SSE; scale `socket.io` with Redis adapter.
- Use LB stickiness or a shared pub/sub layer.

## Background jobs and scheduling<a name="background-jobs"></a>
- Use `bullmq`/`bee-queue`/`agenda` for queues and cron.
- Idempotent job handlers, dedupe keys, retries/backoff, DLQs.

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
- RDBMS (Prisma/Knex/TypeORM): connection pooling, avoid N+1, proper indices.
- MongoDB: schema design, compound indexes, projections; use transactions when needed.
- Migrations and rollbacks; seed data strategy.

## Deployment<a name="deployment"></a>
- `NODE_ENV=production`, minimal Docker images, health endpoints.
- Resource limits; tune Node heap (`--max-old-space-size`) only when required.
- Twelve-Factor config and secrets; graceful rollouts.

## Testing and reliability<a name="testing"></a>
- Load tests (`autocannon`, `k6`, `artillery`); SLOs and error budgets.
- Contract tests between services; chaos basics for failure drills.