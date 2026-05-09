import { ERRORS, errorResponse } from '../errors';
import * as KVService from '../kv';
import { validateContribution } from '../validation';

export async function handleContributions(request, env, group, url) {
  const KV = env.BAKIPAY_KV;

  if (request.method === 'POST') {
    const body = await request.json();
    const errorField = validateContribution(body);
    if (errorField) return errorResponse(ERRORS.VALIDATION_ERROR, errorField);

    // Verify member exists
    const member = await KVService.getMember(KV, group.id, body.member_id);
    if (!member) return errorResponse(ERRORS.NOT_FOUND, 'member_id');

    await KVService.saveContribution(KV, group.id, body.member_id, body);
    return new Response(JSON.stringify({ data: body }), { status: 201 });
  }

  if (request.method === 'GET') {
    const memberId = url.searchParams.get('member_id');
    const contribs = await KVService.listContributions(KV, group.id, memberId);
    return new Response(JSON.stringify({ data: contribs }), { status: 200 });
  }

  return errorResponse(ERRORS.NOT_FOUND);
}
