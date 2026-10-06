import { planTrip } from '../planner-core.mjs';

function cors(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

export default async function handler(request, response) {
  cors(response);
  response.setHeader('Cache-Control', 'no-store');

  if (request.method === 'OPTIONS') return response.status(204).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  try {
    const input = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : (request.body || {});
    return response.status(200).json(planTrip(input));
  } catch (error) {
    return response.status(400).json({ error: 'Invalid planning request', message: error.message });
  }
}
