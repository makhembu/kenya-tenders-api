import { ERRORS, errorResponse } from '../errors';
import { validateWebhook } from '../validation';

export async function handleWebhooks(request, env, group, url) {
  const KV = env.BAKIPAY_KV;

  if (request.method === 'POST') {
    const body = await request.json();
    const errorField = validateWebhook(body);
    if (errorField) return errorResponse(ERRORS.VALIDATION_ERROR, errorField);

    const webhookId = crypto.randomUUID();
    const webhookData = {
      id: webhookId,
      groupId: group.id,
      ...body,
      secret: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };

    await KV.put(`webhook:${group.id}:${webhookId}`, JSON.stringify(webhookData));
    return new Response(JSON.stringify({ data: webhookData }), { status: 201 });
  }

  if (request.method === 'DELETE') {
    const segments = url.pathname.split('/');
    const webhookId = segments[3];
    if (!webhookId) return errorResponse(ERRORS.NOT_FOUND);

    await KV.delete(`webhook:${group.id}:${webhookId}`);
    return new Response(JSON.stringify({ data: { status: 'deleted' } }), { status: 200 });
  }

  return errorResponse(ERRORS.NOT_FOUND);
}

// Utility for signing payloads (used in background jobs/worker internal calls)
export async function signWebhookPayload(payload, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(JSON.stringify(payload))
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
