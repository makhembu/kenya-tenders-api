export function validateMember(body) {
  if (!body.name || typeof body.name !== 'string') return 'name';
  if (!body.phone || !/^254\d{9}$/.test(body.phone)) return 'phone';
  if (!body.join_date || isNaN(Date.parse(body.join_date))) return 'join_date';
  return null;
}

export function validateContribution(body) {
  if (!body.member_id || typeof body.member_id !== 'string') return 'member_id';
  if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) return 'amount';
  if (!body.date || isNaN(Date.parse(body.date))) return 'date';
  if (!body.transaction_id || typeof body.transaction_id !== 'string') return 'transaction_id';
  return null;
}

export function validatePayoutCalculation(body) {
  if (!body.total_surplus || typeof body.total_surplus !== 'number' || body.total_surplus <= 0) return 'total_surplus';
  if (!body.basis || !['contribution_tenure', 'equal_split'].includes(body.basis)) return 'basis';
  return null;
}

export function validateWebhook(body) {
  if (!body.url || !body.url.startsWith('http')) return 'url';
  if (!body.event_type || typeof body.event_type !== 'string') return 'event_type';
  return null;
}
