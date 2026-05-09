export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/setup-test-key' && url.searchParams.get('secret') === 'devonly123') {
      const keyId = 'tk_test123';
      const keySecret = 'testsecret123';
      const apiKeyData = {
        id: keyId,
        secret: keySecret,
        name: 'Test User',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        tier: 'free'
      };
      await env.API_KEY.put(keyId, JSON.stringify(apiKeyData));
      
      return new Response(JSON.stringify({ 
        status: 'created',
        key: `${keyId}_${keySecret}` 
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response('Not found', { status: 404 });
  }
};