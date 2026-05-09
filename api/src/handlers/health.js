export async function handleHealth(env) {
  try {
    // Check KV connectivity
    await env.BAKIPAY_KV.get('health_check');
    return new Response(JSON.stringify({ data: { status: 'ok' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ data: { status: 'error', message: 'KV unreachable' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
