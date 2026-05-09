import { ERRORS, errorResponse } from '../errors';
import * as KVService from '../kv';
import { validateMember } from '../validation';

export async function handleMembers(request, env, group, url) {
  const KV = env.BAKIPAY_KV;

  if (request.method === 'POST') {
    const body = await request.json();
    const errorField = validateMember(body);
    if (errorField) return errorResponse(ERRORS.VALIDATION_ERROR, errorField);

    const memberId = crypto.randomUUID();
    const memberData = {
      id: memberId,
      groupId: group.id,
      ...body,
      created_at: new Date().toISOString()
    };

    await KVService.saveMember(KV, group.id, memberId, memberData);
    return new Response(JSON.stringify({ data: memberData }), { status: 201 });
  }

  if (request.method === 'GET') {
    const segments = url.pathname.split('/');
    const memberId = segments[3]; // /v1/members/:id

    if (memberId) {
      const member = await KVService.getMember(KV, group.id, memberId);
      if (!member) return errorResponse(ERRORS.NOT_FOUND);
      return new Response(JSON.stringify({ data: member }), { status: 200 });
    } else {
      const members = await KVService.listMembers(KV, group.id);
      return new Response(JSON.stringify({ data: members }), { status: 200 });
    }
  }

  return errorResponse(ERRORS.NOT_FOUND);
}
