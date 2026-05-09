export async function getMember(KV, groupId, memberId) {
  const data = await KV.get(`member:${groupId}:${memberId}`);
  return data ? JSON.parse(data) : null;
}

export async function saveMember(KV, groupId, memberId, data) {
  await KV.put(`member:${groupId}:${memberId}`, JSON.stringify(data));
}

export async function listMembers(KV, groupId) {
  const list = await KV.list({ prefix: `member:${groupId}:` });
  const members = [];
  for (const key of list.keys) {
    const val = await KV.get(key.name);
    if (val) members.push(JSON.parse(val));
  }
  return members;
}

export async function saveContribution(KV, groupId, memberId, data) {
  // Use transaction_id in key to prevent exact duplicate ingestion unless explicitly handled by idempotency
  await KV.put(`contrib:${groupId}:${memberId}:${data.transaction_id}`, JSON.stringify(data));
}

export async function listContributions(KV, groupId, memberId) {
  const prefix = memberId ? `contrib:${groupId}:${memberId}:` : `contrib:${groupId}:`;
  const list = await KV.list({ prefix });
  const contribs = [];
  for (const key of list.keys) {
    const val = await KV.get(key.name);
    if (val) contribs.push(JSON.parse(val));
  }
  return contribs;
}

export async function checkIdempotency(KV, key) {
  const cached = await KV.get(`idemp:${key}`);
  return cached ? JSON.parse(cached) : null;
}

export async function saveIdempotency(KV, key, responseBody) {
  await KV.put(`idemp:${key}`, JSON.stringify(responseBody), { expirationTtl: 86400 });
}
