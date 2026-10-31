import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = createApp({ version: 'test' }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server.closeAllConnections();
  server.close();
  await once(server, 'close');
});

describe('HTTP API', () => {
  it('GET /healthz returns ok with the version', async () => {
    const res = await fetch(`${baseUrl}/healthz`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok', version: 'test' });
  });

  it('GET /api/greet uses the name query parameter', async () => {
    const res = await fetch(`${baseUrl}/api/greet?name=Ada`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { message: 'Hello, Ada!' });
  });

  it('GET /api/greet falls back to World', async () => {
    const res = await fetch(`${baseUrl}/api/greet`);
    assert.deepEqual(await res.json(), { message: 'Hello, World!' });
  });

  it('POST /api/sum adds the numbers', async () => {
    const res = await fetch(`${baseUrl}/api/sum`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ numbers: [2, 3, 5] }),
    });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { sum: 10 });
  });

  it('POST /api/sum answers 400 for bad input', async () => {
    const res = await fetch(`${baseUrl}/api/sum`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ numbers: ['two'] }),
    });
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /finite number/);
  });

  it('answers 400 for malformed JSON and 404 for unknown routes', async () => {
    const bad = await fetch(`${baseUrl}/api/sum`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"numbers": [1, 2',
    });
    assert.equal(bad.status, 400);

    const missing = await fetch(`${baseUrl}/nope`);
    assert.equal(missing.status, 404);
  });
});
