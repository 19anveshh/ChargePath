import { planTrip } from '../planner-core.mjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

    try {
      const input = await request.json();
      return Response.json(planTrip(input), { headers: corsHeaders });
    } catch (error) {
      return Response.json(
        { error: 'Invalid planning request', message: error.message },
        { status: 400, headers: corsHeaders },
      );
    }
  },
};
