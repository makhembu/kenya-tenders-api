import { ERRORS, errorResponse } from './errors';
import * as KVService from './kv';
import { handleHealth } from './handlers/health';
import { handleMembers } from './handlers/members';
import { handleContributions } from './handlers/contributions';
import { handlePayouts } from './handlers/payouts';
import { handleWebhooks } from './handlers/webhooks';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const requestId = crypto.randomUUID();

    // 1. Health check (Unauthenticated)
    if (url.pathname === '/v1/health') {
      return handleHealth(env);
    }

    // 2. Auth Middleware
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(ERRORS.MISSING_API_KEY);
    }
    const apiKey = authHeader.split(' ')[1];
    const groupData = await env.BAKIPAY_KV.get(`auth:${apiKey}`);
    if (!groupData) {
      return errorResponse(ERRORS.INVALID_API_KEY);
    }
    const group = JSON.parse(groupData); // contains { id: "group_uuid", name: "..." }

    // 3. Rate Limiting (Simple sliding window per API key in KV)
    const rateLimitKey = `rl:${apiKey}:${Math.floor(Date.now() / 60000)}`;
    const currentRequests = (await env.BAKIPAY_KV.get(rateLimitKey)) || 0;
    if (parseInt(currentRequests) >= 60) {
      return errorResponse(ERRORS.RATE_LIMITED);
    }
    await env.BAKIPAY_KV.put(rateLimitKey, parseInt(currentRequests) + 1, { expirationTtl: 60 });

    // 4. Idempotency Middleware (for POST requests)
    let idempotencyKey = null;
    if (request.method === 'POST') {
      idempotencyKey = request.headers.get('Idempotency-Key');
      if (idempotencyKey) {
        const cached = await KVService.checkIdempotency(env.BAKIPAY_KV, idempotencyKey);
        if (cached) {
            // Check if body matched (simplified)
            return new Response(JSON.stringify(cached), {
                status: 201,
                headers: { 'Content-Type': 'application/json', 'X-Idempotency-Cache': 'HIT' }
            });
        }
      }
    }

    // 5. Routing
    let response;
    try {
      if (url.pathname.startsWith('/v1/members')) {
        response = await handleMembers(request, env, group, url);
      } else if (url.pathname.startsWith('/v1/contributions')) {
        response = await handleContributions(request, env, group, url);
      } else if (url.pathname.startsWith('/v1/payouts')) {
        response = await handlePayouts(request, env, group, url);
      } else if (url.pathname.startsWith('/v1/webhooks')) {
        response = await handleWebhooks(request, env, group, url);
      } else {
        response = errorResponse(ERRORS.NOT_FOUND);
      }
    } catch (e) {
      console.error(e);
      response = errorResponse(ERRORS.INTERNAL_ERROR);
    }

    // 6. Post-processing
    const responseData = await response.clone().json().catch(() => ({}));
    const finalResponse = new Response(JSON.stringify({
        ...responseData,
        meta: {
            timestamp: new Date().toISOString(),
            version: '1.0',
            request_id: requestId
        }
    }), {
        status: response.status,
        headers: {
            ...Object.fromEntries(response.headers),
            'X-Request-ID': requestId,
            'Content-Type': 'application/json'
        }
    });

    // Save for idempotency if applicable
    if (idempotencyKey && response.status >= 200 && response.status < 300) {
        await KVService.saveIdempotency(env.BAKIPAY_KV, idempotencyKey, responseData);
    }

    return finalResponse;
  }
};
