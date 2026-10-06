import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { planTrip } from './planner-core.mjs';

const publicRoot = join(fileURLToPath(new URL('.', import.meta.url)), 'public');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function json(response, status, payload) {
  response.status(status).setHeader('Cache-Control', 'no-store').json(payload);
}

async function body(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  let raw = '';
  for await (const chunk of request) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(request, response) {
  const path = (request.url || '/').split('?')[0];
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (request.method === 'OPTIONS') return response.status(204).end();
  if (path === '/api/health' && request.method === 'GET') return json(response, 200, { ok: true, service: 'chargepath-planner-api' });
  if (path === '/api/plan' && request.method === 'POST') {
    try {
      return json(response, 200, planTrip(await body(request)));
    } catch (error) {
      return json(response, 400, { error: 'Invalid planning request', message: error.message });
    }
  }
  if (path.startsWith('/api/')) return json(response, 404, { error: 'API route not found' });

  const file = path === '/' ? 'index.html' : path.replace(/^\//, '');
  if (!file || file.includes('..')) return response.status(404).send('Not found');
  try {
    const content = await readFile(join(publicRoot, file));
    return response.status(200).setHeader('Content-Type', types[extname(file)] || 'application/octet-stream').send(content);
  } catch {
    return response.status(404).send('Not found');
  }
}
