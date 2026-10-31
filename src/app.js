import express from 'express';
import { greet, sum } from './lib.js';

/**
 * Create the Express app without starting a server,
 * so tests can mount it on a random port.
 */
export function createApp({ version = process.env.APP_VERSION ?? 'dev' } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  // Liveness endpoint used by the Docker HEALTHCHECK and the CI smoke test.
  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok', version });
  });

  // GET /api/greet?name=Ada -> { "message": "Hello, Ada!" }
  app.get('/api/greet', (req, res) => {
    res.json({ message: greet(req.query.name) });
  });

  // POST /api/sum { "numbers": [1, 2, 3] } -> { "sum": 6 }
  app.post('/api/sum', (req, res) => {
    try {
      res.json({ sum: sum(req.body?.numbers) });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler (four arguments). Malformed JSON bodies end up here as 400s.
  app.use((err, _req, res, _next) => {
    const status = Number.isInteger(err.status) ? err.status : 500;
    res.status(status).json({ error: status >= 500 ? 'Internal Server Error' : err.message });
  });

  return app;
}
