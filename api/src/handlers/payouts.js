import { ERRORS, errorResponse } from '../errors';
import * as KVService from '../kv';
import { validatePayoutCalculation } from '../validation';

export async function handlePayouts(request, env, group, url) {
  const KV = env.BAKIPAY_KV;

  if (request.method === 'POST') {
    const segments = url.pathname.split('/');
    const action = segments[3]; // /v1/payouts/calculate or /v1/payouts/execute

    if (action === 'calculate') {
      const body = await request.json();
      const errorField = validatePayoutCalculation(body);
      if (errorField) return errorResponse(ERRORS.VALIDATION_ERROR, errorField);

      // 1. Fetch all members and their contributions
      const members = await KVService.listMembers(KV, group.id);
      const allContribs = await KVService.listContributions(KV, group.id);

      // 2. Calculation logic (Basis: contribution_tenure)
      const calculation = members.map(member => {
        const memberContribs = allContribs.filter(c => c.member_id === member.id);
        const totalAmount = memberContribs.reduce((sum, c) => sum + c.amount, 0);
        
        // Simple tenure-weight: Sum of (amount * months since contribution)
        // For MVP: Simple proportional split of total_surplus based on total contribution
        const totalGroupContribution = allContribs.reduce((sum, c) => sum + c.amount, 0);
        const share = totalGroupContribution > 0 ? (totalAmount / totalGroupContribution) : 0;
        
        return {
          member_id: member.id,
          name: member.name,
          phone: member.phone,
          amount: Math.floor(body.total_surplus * share)
        };
      });

      const calculationId = crypto.randomUUID();
      const result = {
        calculation_id: calculationId,
        basis: body.basis,
        total_surplus: body.total_surplus,
        data: calculation
      };

      // Store calculation for later execution
      await KV.put(`calc:${group.id}:${calculationId}`, JSON.stringify(result), { expirationTtl: 3600 });
      return new Response(JSON.stringify({ data: result }), { status: 200 });
    }

    if (action === 'execute') {
      const body = await request.json();
      const calcData = await KV.get(`calc:${group.id}:${body.calculation_id}`);
      if (!calcData) return errorResponse(ERRORS.NOT_FOUND, 'calculation_id');

      const calculation = JSON.parse(calcData);
      
      // Simulate M-Pesa B2C Integration
      // In a real prod env, we would call Safaricom B2C endpoint for each item
      const results = calculation.data.map(item => ({
        member_id: item.member_id,
        phone: item.phone,
        status: 'SUCCESS',
        transaction_id: 'BS' + Math.random().toString(36).substring(2, 10).toUpperCase()
      }));

      const payoutId = crypto.randomUUID();
      const finalResult = {
        payout_id: payoutId,
        calculation_id: body.calculation_id,
        payouts: results
      };

      await KV.put(`payout:${group.id}:${payoutId}`, JSON.stringify(finalResult));
      return new Response(JSON.stringify({ data: finalResult }), { status: 201 });
    }
  }

  return errorResponse(ERRORS.NOT_FOUND);
}
