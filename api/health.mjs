export default {
  fetch() {
    return Response.json(
      { ok: true, service: 'chargepath-planner-api' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  },
};
