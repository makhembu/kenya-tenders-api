const LANDING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kenya Tenders Intelligence — Procurement SaaS</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
        h1 { font-size: 2.8rem; color: #22d3ee; margin-bottom: 10px; }
        h2 { color: #a5b4fc; margin: 40px 0 20px; border-bottom: 1px solid #334155; padding-bottom: 10px; }
        h3 { color: #fcd34d; margin: 20px 0 10px; font-size: 1.3rem; }
        .hero { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 50px; border-radius: 20px; margin-bottom: 40px; text-align: center; }
        .hero p { font-size: 1.3rem; color: #94a3b8; max-width: 600px; margin: 0 auto 20px; }
        .tagline { color: #22d3ee; font-weight: bold; font-size: 1.1rem; }
        .badge { display: inline-block; background: #22c55e; color: #0f172a; padding: 6px 16px; border-radius: 20px; font-weight: bold; margin: 5px; }
        code { background: #334155; padding: 2px 8px; border-radius: 4px; font-size: 0.9em; }
        .btn { display: inline-block; background: #22d3ee; color: #0f172a; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1.1rem; margin: 10px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .feature { background: #1e293b; padding: 25px; border-radius: 12px; border-left: 4px solid #22d3ee; }
        .feature h4 { color: #22d3ee; margin-bottom: 10px; }
        .pricing { display: flex; gap: 20px; margin: 30px 0; flex-wrap: wrap; justify-content: center; }
        .price-card { background: #1e293b; padding: 30px; border-radius: 16px; flex: 1; min-width: 200px; max-width: 250px; text-align: center; }
        .price-card.free { border: 2px solid #22c55e; }
        .price-card.pro { border: 2px solid #f59e0b; }
        .price { font-size: 2rem; font-weight: bold; color: #22d3ee; }
        .price-card.pro .price { color: #f59e0b; }
        .test-section { background: #1e293b; padding: 30px; border-radius: 12px; margin: 40px 0; }
        .test-btn { background: #22d3ee; color: #0f172a; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; margin: 5px; }
        .result { background: #0f172a; padding: 20px; border-radius: 8px; margin: 15px 0; max-height: 400px; overflow: auto; }
        .result pre { white-space: pre-wrap; font-size: 12px; color: #86efac; }
        footer { text-align: center; padding: 40px 0; color: #64748b; border-top: 1px solid #334155; margin-top: 60px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <span class="badge">🟢 LIVE v2.1</span>
            <h1>Kenya Tenders Intelligence</h1>
            <p class="tagline">The Operating System for Public Procurement</p>
            <p>Not just data — intelligent decisions. We tell you what to bid on, when, and why.</p>
        </div>

        <h2>🚀 Why This Wins</h2>
        <div class="features">
            <div class="feature"><h4>⏱️ Time Advantage</h4><p>Hourly sync + real-time alerts. See tenders before competitors.</p></div>
            <div class="feature"><h4>🤖 AI Intelligence</h4><p>Score + recommendation for every tender. "Bid", "Watch", or "Ignore".</p></div>
            <div class="feature"><h4>📱 WhatsApp Alerts</h4><p>Kenyan businesses prefer WhatsApp. Pro users get instant mobile alerts.</p></div>
            <div class="feature"><h4>🎯 Bid Recommendations</h4><p>We tell you what matters. Not a search box — a decision engine.</p></div>
        </div>

        <h2>🧪 Test the API Live</h2>
        <div class="test-section">
            <button class="test-btn" onclick="testHealth()">Health Check</button>
            <button class="test-btn" onclick="testTrending()">Trending</button>
            <button class="test-btn" onclick="testMatch()">AI Match</button>
            <button class="test-btn" onclick="testCounty()">By County</button>
            <div id="test-results"></div>
        </div>

        <h2>💰 Pricing</h2>
        <div class="pricing">
            <div class="price-card free">
                <h3>Free</h3>
                <div class="price">KES 0</div>
                <p>1,000 req/day</p>
                <p>All endpoints</p>
            </div>
            <div class="price-card pro">
                <h3>Pro</h3>
                <div class="price">KES 2,000</div>
                <p>10,000 req/day</p>
                <p>AI scoring</p>
                <p>WhatsApp alerts</p>
            </div>
        </div>

        <h2>⚡ Quick API Test</h2>
        <div class="result">
            <pre>curl "https://kenya-tenders-api.shelflix.workers.dev/v1/tenders?api_key=tk_test123_testsecret123&perpage=5"</pre>
        </div>

        <footer>
            <p>Kenya Tenders Intelligence — Powered by Cloudflare Workers</p>
            <p>Data: Kenya PPIP | Sync: Hourly | Version: 2.1.0</p>
        </footer>
    </div>

    <script>
        const BASE = 'https://kenya-tenders-api.shelflix.workers.dev';
        const KEY = 'tk_test123_testsecret123';

        function showResult(html) { document.getElementById('test-results').innerHTML = html; }

        async function testHealth() {
            const data = await fetch(BASE + '/v1/health').then(r => r.json());
            showResult('<div class="result"><pre>✅ System Status:\\n' + JSON.stringify(data, null, 2) + '</pre></div>');
        }

        async function testTrending() {
            const data = await fetch(BASE + '/v1/opportunities/trending?api_key=' + KEY).then(r => r.json());
            showResult('<div class="result"><pre>✅ Trending Categories:\\n' + JSON.stringify(data.data?.slice(0,5), null, 2) + '</pre></div>');
        }

        async function testMatch() {
            const data = await fetch(BASE + '/v1/opportunities/match?api_key=' + KEY + '&industry=construction&limit=3').then(r => r.json());
            showResult('<div class="result"><pre>✅ AI Match (Construction):\\n' + JSON.stringify(data.data?.map(t => ({title: t.title?.substring(0,45), score: t.match_score, rec: t.recommendation})), null, 2) + '</pre></div>');
        }

        async function testCounty() {
            const data = await fetch(BASE + '/v1/opportunities/count-by-county?api_key=' + KEY).then(r => r.json());
            showResult('<div class="result"><pre>✅ Top Counties:\\n' + JSON.stringify(data.data?.slice(0,5), null, 2) + '</pre></div>');
        }
    </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Health check
    if (path === '/v1/health' && method === 'GET') {
      const cached = await env.TENDER_CACHE.get('last_sync');
      const lastSync = cached ? JSON.parse(cached) : null;
      
      const cronStatusData = await env.CRON_STATUS.get('status');
      const cronStatus = cronStatusData ? JSON.parse(cronStatusData) : null;
      
      return new Response(JSON.stringify({
        status: 'ok',
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        data_status: lastSync ? `synced ${new Date(lastSync.timestamp).toLocaleString()}` : 'never synced',
        cron_status: cronStatus
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Landing page (public)
    if ((path === '/' || path === '/index.html') && method === 'GET') {
      return new Response(LANDING_PAGE_HTML, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // === CRON TRIGGER HANDLER ===
    if (path === '/cron/sync' && method === 'GET') {
      return await handleCronSync(env);
    }

    // Create API key
    if (path === '/v1/keys' && method === 'POST') {
      try {
        const body = await request.json();
        const { name, email } = body;
        
        if (!name || !email) {
          return new Response(JSON.stringify({
            error: { code: 'VALIDATION_ERROR', message: 'name and email are required' }
          }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const keyId = `tk_${crypto.randomUUID().slice(2, 12)}`;
        const keySecret = crypto.randomUUID();
        
        const apiKeyData = {
          id: keyId,
          secret: keySecret,
          name,
          email,
          created_at: new Date().toISOString(),
          tier: 'free',
          requests_today: 0
        };

        await env.API_KEY.put(keyId, JSON.stringify(apiKeyData));

        return new Response(JSON.stringify({
          data: {
            id: keyId,
            key: `${keyId}_${keySecret}`,
            name,
            email,
            tier: 'free',
            created_at: apiKeyData.created_at
          },
          meta: { timestamp: new Date().toISOString(), version: '2.1', request_id: crypto.randomUUID() }
        }), { status: 201, headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({
          error: { code: 'SERVER_ERROR', message: e.message }
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // Auth check
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '') || url.searchParams.get('api_key');
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: { code: 'UNAUTHORIZED', message: 'API key required' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    
    const keyId = apiKey.split('_').slice(0, 2).join('_');
    const validKey = await env.API_KEY.get(keyId);
    const keyData = validKey ? JSON.parse(validKey) : null;
    
    if (!keyData) {
      return new Response(JSON.stringify({
        error: { code: 'INVALID_API_KEY', message: 'Invalid or expired API key' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Rate limiting
    const rlKey = `rl_${keyId}`;
    let rl = await env.RATE_LIMIT.get(rlKey);
    const rateData = rl ? JSON.parse(rl) : { remaining: keyData.tier === 'pro' ? 10000 : 1000, reset: Date.now() + 86400000 };
    
    if (rateData.remaining <= 0) {
      return new Response(JSON.stringify({
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Daily limit reached. Upgrade to Pro for 10,000/day' }
      }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
    
    rateData.remaining--;
    await env.RATE_LIMIT.put(rlKey, JSON.stringify(rateData), { expirationTtl: 86400 });

    const requestId = crypto.randomUUID();

    // === SMART ENDPOINTS ===

    // GET /v1/opportunities/trending
    if (path === '/v1/opportunities/trending' && method === 'GET') {
      const allTenders = await env.TENDER_CACHE.get('all_tenders');
      const tenders = allTenders ? JSON.parse(allTenders) : [];
      
      const categoryCount = {};
      tenders.forEach(t => {
        const cat = t.procurement_category?.title || 'Unknown';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      
      const trending = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([category, count]) => ({ category, count }));
      
      return new Response(JSON.stringify({
        data: trending,
        meta: { timestamp: new Date().toISOString(), request_id: requestId }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // GET /v1/opportunities/count-by-county
    if (path === '/v1/opportunities/count-by-county' && method === 'GET') {
      const allTenders = await env.TENDER_CACHE.get('all_tenders');
      const tenders = allTenders ? JSON.parse(allTenders) : [];
      
      const countyCount = {};
      tenders.forEach(t => {
        const county = t.pe?.name || 'Unknown';
        countyCount[county] = (countyCount[county] || 0) + 1;
      });
      
      const byCounty = Object.entries(countyCount)
        .sort((a, b) => b[1] - a[1])
        .map(([county, count]) => ({ county, count }));
      
      return new Response(JSON.stringify({
        data: byCounty,
        meta: { timestamp: new Date().toISOString(), request_id: requestId }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // GET /v1/opportunities/match - AI-powered matching
    if (path === '/v1/opportunities/match' && method === 'GET') {
      const industry = url.searchParams.get('industry');
      const county = url.searchParams.get('county');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
      
      const allTenders = await env.TENDER_CACHE.get('all_tenders');
      const tenders = allTenders ? JSON.parse(allTenders) : [];
      
      let matched = tenders;
      
      if (industry) {
        const kw = industry.toLowerCase();
        matched = matched.filter(t => 
          t.title?.toLowerCase().includes(kw) || 
          t.description?.toLowerCase().includes(kw)
        );
      }
      
      if (county) {
        matched = matched.filter(t => t.pe?.name?.toLowerCase().includes(county.toLowerCase()));
      }
      
      const scored = matched.map(t => {
        let score = 50;
        if (t.is_agpo) score += 10;
        if (t.close_at) {
          const daysLeft = (new Date(t.close_at) - new Date()) / (1000 * 60 * 60 * 24);
          if (daysLeft > 7 && daysLeft < 14) score += 20;
          if (daysLeft > 14) score += 10;
        }
        
        let recommendation = 'watch';
        if (score >= 70) recommendation = 'bid';
        if (score < 50) recommendation = 'ignore';
        
        return {
          id: t.id,
          tender_ref: t.tender_ref,
          title: t.title,
          county: t.pe?.name,
          category: t.procurement_category?.title,
          close_at: t.close_at,
          is_agpo: t.is_agpo,
          match_score: score,
          recommendation,
          days_until_close: t.close_at ? Math.ceil((new Date(t.close_at) - new Date()) / (1000 * 60 * 60 * 24)) : null
        };
      }).sort((a, b) => b.match_score - a.match_score).slice(0, limit);
      
      return new Response(JSON.stringify({
        data: scored,
        meta: { 
          timestamp: new Date().toISOString(), 
          request_id: requestId,
          total_matches: matched.length,
          filters: { industry, county }
        }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // GET /v1/opportunities/high-value
    if (path === '/v1/opportunities/high-value' && method === 'GET') {
      const allTenders = await env.TENDER_CACHE.get('all_tenders');
      const tenders = allTenders ? JSON.parse(allTenders) : [];
      
      const highValue = tenders
        .filter(t => {
          const pubDate = new Date(t.published_at);
          const daysSince = (Date.now() - pubDate) / (1000 * 60 * 60 * 24);
          return daysSince <= 7 && t.bid_security_value;
        })
        .sort((a, b) => (b.bid_security_value || 0) - (a.bid_security_value || 0))
        .slice(0, 20)
        .map(t => ({
          id: t.id,
          tender_ref: t.tender_ref,
          title: t.title,
          county: t.pe?.name,
          bid_security: t.bid_security_value,
          close_at: t.close_at,
          is_agpo: t.is_agpo
        }));
      
      return new Response(JSON.stringify({
        data: highValue,
        meta: { timestamp: new Date().toISOString(), request_id: requestId }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // === STANDARD TENDER ENDPOINTS ===

    if (path === '/v1/tenders' && method === 'GET') {
      const { searchParams } = url;
      const county = searchParams.get('county');
      const category = searchParams.get('category');
      const keyword = searchParams.get('keyword');
      const page = parseInt(searchParams.get('page') || '1');
      const perpage = Math.min(parseInt(searchParams.get('perpage') || '20'), 100);

      let tenders = [];
      const cached = await env.TENDER_CACHE.get('all_tenders');
      
      if (cached) {
        tenders = JSON.parse(cached);
      } else {
        try {
          const ppipUrl = new URL('https://tenders.go.ke/api/active-tenders');
          ppipUrl.searchParams.set('perpage', '200');
          const response = await fetch(ppipUrl.toString());
          const data = await response.json();
          tenders = data.data || [];
          await env.TENDER_CACHE.put('all_tenders', JSON.stringify(tenders), { expirationTtl: 3600 });
        } catch (e) {
          return new Response(JSON.stringify({
            error: { code: 'UPSTREAM_ERROR', message: 'Unable to fetch tender data' }
          }), { status: 502, headers: { 'Content-Type': 'application/json' } });
        }
      }
      
      if (county) {
        tenders = tenders.filter(t => t.pe?.county_id?.toString() === county || t.pe?.name?.toLowerCase().includes(county.toLowerCase()));
      }
      if (category) {
        tenders = tenders.filter(t => t.procurement_category?.title?.toLowerCase() === category.toLowerCase());
      }
      if (keyword) {
        const kw = keyword.toLowerCase();
        tenders = tenders.filter(t => t.title?.toLowerCase().includes(kw) || t.tender_ref?.toLowerCase().includes(kw));
      }

      const start = (page - 1) * perpage;
      const paginated = tenders.slice(start, start + perpage);

      return new Response(JSON.stringify({
        data: paginated.map(t => ({
          id: t.id,
          tender_ref: t.tender_ref,
          title: t.title,
          county: t.pe?.name || t.pe?.county_id,
          category: t.procurement_category?.title,
          procurement_method: t.procurement_method?.title,
          published_at: t.published_at,
          close_at: t.close_at,
          is_agpo: t.is_agpo
        })),
        meta: {
          timestamp: new Date().toISOString(),
          version: '2.1',
          request_id: requestId,
          pagination: { current_page: page, per_page: perpage, total: tenders.length }
        }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Tender details
    if (path.match(/^\/v1\/tenders\/\d+$/) && method === 'GET') {
      const tenderId = path.split('/')[3];
      
      const allTenders = await env.TENDER_CACHE.get('all_tenders');
      const tenders = allTenders ? JSON.parse(allTenders) : [];
      
      const tender = tenders.find(t => t.id.toString() === tenderId);
      
      if (!tender) {
        return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Tender not found' } }), { status: 404 });
      }

      let score = 60;
      if (tender.is_agpo) score += 15;
      if (tender.close_at) {
        const daysLeft = (new Date(tender.close_at) - new Date()) / (1000 * 60 * 60 * 24);
        if (daysLeft > 7) score += 10;
      }

      return new Response(JSON.stringify({
        data: {
          id: tender.id,
          tender_ref: tender.tender_ref,
          title: tender.title,
          description: tender.description,
          pe_name: tender.pe?.name,
          county_id: tender.pe?.county_id,
          procurement_category: tender.procurement_category?.title,
          procurement_method: tender.procurement_method?.title,
          bid_security_value: tender.bid_security_value,
          validity_days: tender.validity_in_days,
          published_at: tender.published_at,
          close_at: tender.close_at,
          is_agpo: tender.is_agpo,
          agpo_groups: tender.agpo_groups?.map(g => g.name),
          addenda: tender.addenda?.map(a => ({ title: a.title, new_closing_date: a.new_closing_date })),
          documents: tender.documents?.map(d => ({ description: d.description, url: d.url })),
          submission_methods: tender.submission_methods?.map(s => s.title),
          match_score: score,
          recommendation: score >= 70 ? 'bid' : score >= 50 ? 'watch' : 'ignore'
        },
        meta: { timestamp: new Date().toISOString(), version: '2.1', request_id: requestId }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // === ALERT & SUBSCRIPTION ENDPOINTS ===

    // POST /v1/subscriptions - Create alert subscription
    if (path === '/v1/subscriptions' && method === 'POST') {
      try {
        const body = await request.json();
        const { keywords, counties, categories, webhook_url, email_alert, frequency } = body;
        
        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
          return new Response(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'keywords array required' } }), { status: 400 });
        }

        const subId = `sub_${crypto.randomUUID().slice(2, 10)}`;
        const subscription = {
          id: subId,
          api_key: keyId,
          keywords,
          counties: counties || [],
          categories: categories || [],
          webhook_url: webhook_url || null,
          email_alert: email_alert || false,
          email: keyData.email,
          frequency: frequency || 'instant',
          active: true,
          created_at: new Date().toISOString()
        };

        await env.SUBSCRIPTIONS.put(subId, JSON.stringify(subscription));

        return new Response(JSON.stringify({
          data: subscription,
          meta: { timestamp: new Date().toISOString(), version: '2.1', request_id: requestId }
        }), { status: 201, headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: { code: 'SERVER_ERROR', message: e.message } }), { status: 500 });
      }
    }

    // GET /v1/subscriptions
    if (path === '/v1/subscriptions' && method === 'GET') {
      const subs = await env.SUBSCRIPTIONS.list({ prefix: 'sub_' });
      const userSubs = [];
      
      for (const item of subs.keys) {
        const sub = JSON.parse(await env.SUBSCRIPTIONS.get(item));
        if (sub.api_key === keyId) userSubs.push(sub);
      }

      return new Response(JSON.stringify({
        data: userSubs,
        meta: { timestamp: new Date().toISOString(), request_id: requestId, count: userSubs.length }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // DELETE /v1/subscriptions/:id
    if (path.match(/^\/v1\/subscriptions\/[^/]+$/) && method === 'DELETE') {
      const subId = path.split('/')[3];
      const sub = await env.SUBSCRIPTIONS.get(subId);
      
      if (!sub) {
        return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Subscription not found' } }), { status: 404 });
      }
      
      const subData = JSON.parse(sub);
      if (subData.api_key !== keyId) {
        return new Response(JSON.stringify({ error: { code: 'FORBIDDEN', message: 'Access denied' } }), { status: 403 });
      }

      await env.SUBSCRIPTIONS.delete(subId);

      return new Response(JSON.stringify({
        data: { deleted: true, id: subId },
        meta: { timestamp: new Date().toISOString(), request_id: requestId }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // POST /v1/webhooks - Register webhook
    if (path === '/v1/webhooks' && method === 'POST') {
      try {
        const body = await request.json();
        const { webhook_url, events } = body;
        
        if (!webhook_url) {
          return new Response(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'webhook_url required' } }), { status: 400 });
        }

        const webhookId = `wh_${crypto.randomUUID().slice(2, 10)}`;
        const webhook = {
          id: webhookId,
          api_key: keyId,
          webhook_url,
          events: events || ['tender.new', 'tender.amended'],
          secret: crypto.randomUUID(),
          active: true,
          created_at: new Date().toISOString()
        };

        await env.WEBHOOKS.put(webhookId, JSON.stringify(webhook));

        return new Response(JSON.stringify({
          data: { ...webhook, webhook_url: undefined, secret: '********' },
          meta: { timestamp: new Date().toISOString(), request_id: requestId }
        }), { status: 201, headers: { 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: { code: 'SERVER_ERROR', message: e.message } }), { status: 500 });
      }
    }

    // GET /v1/webhooks
    if (path === '/v1/webhooks' && method === 'GET') {
      const webhooks = await env.WEBHOOKS.list({ prefix: 'wh_' });
      const userWebhooks = [];
      
      for (const item of webhooks.keys) {
        const wh = JSON.parse(await env.WEBHOOKS.get(item));
        if (wh.api_key === keyId) userWebhooks.push({ ...wh, secret: '********' });
      }

      return new Response(JSON.stringify({
        data: userWebhooks,
        meta: { timestamp: new Date().toISOString(), request_id: requestId, count: userWebhooks.length }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // DELETE /v1/webhooks/:id
    if (path.match(/^\/v1\/webhooks\/[^/]+$/) && method === 'DELETE') {
      const webhookId = path.split('/')[3];
      const wh = await env.WEBHOOKS.get(webhookId);
      
      if (!wh) {
        return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Webhook not found' } }), { status: 404 });
      }
      
      const whData = JSON.parse(wh);
      if (whData.api_key !== keyId) {
        return new Response(JSON.stringify({ error: { code: 'FORBIDDEN', message: 'Access denied' } }), { status: 403 });
      }

      await env.WEBHOOKS.delete(webhookId);

      return new Response(JSON.stringify({
        data: { deleted: true, id: webhookId },
        meta: { timestamp: new Date().toISOString(), request_id: requestId }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // GET /v1/webhooks/:id/deliveries - View delivery history
    if (path.match(/^\/v1\/webhooks\/[^/]+\/deliveries$/) && method === 'GET') {
      const webhookId = path.split('/')[3];
      const wh = await env.WEBHOOKS.get(webhookId);
      
      if (!wh) {
        return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Webhook not found' } }), { status: 404 });
      }
      
      const whData = JSON.parse(wh);
      if (whData.api_key !== keyId) {
        return new Response(JSON.stringify({ error: { code: 'FORBIDDEN', message: 'Access denied' } }), { status: 403 });
      }

      const deliveries = await env.WEBHOOK_DELIVERIES.list({ prefix: webhookId });
      const logs = [];
      
      for (const item of deliveries.keys) {
        const d = JSON.parse(await env.WEBHOOK_DELIVERIES.get(item));
        logs.push(d);
      }

      return new Response(JSON.stringify({
        data: logs.slice(-50).reverse(),
        meta: { timestamp: new Date().toISOString(), request_id: requestId, count: logs.length }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // POST /v1/alerts/test - Test alert (for demo)
    if (path === '/v1/alerts/test' && method === 'POST') {
      const body = await request.json();
      const { type } = body; // 'webhook' or 'email' or 'whatsapp'
      
      // Simulate alert for demo
      const testTender = {
        id: 999999,
        tender_ref: 'TEST/001/2026',
        title: 'TEST TENDER - This is a test alert',
        county: 'Test County',
        category: 'Goods',
        close_at: '2026-04-15 10:00:00',
        is_agpo: true
      };
      
      if (type === 'webhook') {
        return new Response(JSON.stringify({
          data: { 
            message: 'Test webhook would fire with tender data',
            tender: testTender,
            note: 'Configure webhooks to receive real-time alerts'
          },
          meta: { timestamp: new Date().toISOString(), request_id: requestId }
        }), { headers: { 'Content-Type': 'application/json' } });
      }
      
      if (type === 'email') {
        return new Response(JSON.stringify({
          data: { 
            message: 'Test email alert would be sent to: ' + keyData.email,
            tender: testTender,
            note: 'Email alerts available on Pro tier'
          },
          meta: { timestamp: new Date().toISOString(), request_id: requestId }
        }), { headers: { 'Content-Type': 'application/json' } });
      }
      
      return new Response(JSON.stringify({
        data: { message: 'Alert type not supported. Use: webhook, email' },
        meta: { timestamp: new Date().toISOString(), request_id: requestId }
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 404
    return new Response(JSON.stringify({
      error: { code: 'NOT_FOUND', message: 'Endpoint not found' }
    }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  },

  // CRON TRIGGER - Runs every hour
  async scheduled(event, env, ctx) {
    console.log('🔄 Cron triggered:', event.cron);
    await handleCronSync(env);
  }
};

// === HELPER FUNCTIONS ===

async function handleCronSync(env) {
  try {
    console.log('📥 Fetching fresh tender data from PPIP...');
    
    const ppipUrl = new URL('https://tenders.go.ke/api/active-tenders');
    ppipUrl.searchParams.set('perpage', '200');
    const response = await fetch(ppipUrl.toString());
    
    if (!response.ok) {
      throw new Error(`PPIP API returned ${response.status}`);
    }
    
    const data = await response.json();
    const newTenders = data.data || [];
    
    // Get previous tender IDs
    const cached = await env.TENDER_CACHE.get('all_tenders');
    const previousTenders = cached ? JSON.parse(cached) : [];
    const previousIds = new Set(previousTenders.map(t => t.id));
    
    // Find new tenders
    const freshTenders = [];
    const newTenderIds = [];
    
    newTenders.forEach(t => {
      if (!previousIds.has(t.id)) {
        newTenderIds.push(t.id);
      }
      freshTenders.push(t);
    });
    
    // Store new data
    await env.TENDER_CACHE.put('all_tenders', JSON.stringify(freshTenders), { expirationTtl: 3600 });
    await env.TENDER_CACHE.put('last_sync', JSON.stringify({ 
      timestamp: Date.now(), 
      count: freshTenders.length,
      new_count: newTenderIds.length
    }), { expirationTtl: 86400 });
    
    console.log(`✅ Synced ${freshTenders.length} tenders. ${newTenderIds.length} new.`);
    
    // Update cron status
    const cronStatus = {
      last_run: new Date().toISOString(),
      tenders_count: freshTenders.length,
      new_tenders: newTenderIds.length,
      status: 'success'
    };
    await env.CRON_STATUS.put('status', JSON.stringify(cronStatus), { expirationTtl: 86400 });
    
    // Fire webhooks for new tenders
    if (newTenderIds.length > 0) {
      await fireNewTenderWebhooks(env, freshTenders, newTenderIds);
    }
    
    return new Response(JSON.stringify({
      status: 'success',
      synced: freshTenders.length,
      new: newTenderIds.length,
      timestamp: new Date().toISOString()
    }), { headers: { 'Content-Type': 'application/json' } });
    
  } catch (e) {
    console.error('❌ Cron sync failed:', e.message);
    
    const cronStatus = {
      last_run: new Date().toISOString(),
      status: 'failed',
      error: e.message
    };
    await env.CRON_STATUS.put('status', JSON.stringify(cronStatus), { expirationTtl: 86400 });
    
    return new Response(JSON.stringify({
      status: 'failed',
      error: e.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

async function fireNewTenderWebhooks(env, tenders, newIds) {
  const newTenders = tenders.filter(t => newIds.includes(t.id));
  
  // Get all active webhooks
  const webhooks = await env.WEBHOOKS.list({ prefix: 'wh_' });
  
  for (const item of webhooks.keys) {
    const webhook = JSON.parse(await env.WEBHOOKS.get(item));
    if (!webhook.active) continue;
    
    // Check if webhook wants 'tender.new' events
    if (!webhook.events || webhook.events.includes('tender.new')) {
      
      for (const tender of newTenders) {
        const payload = {
          event: 'tender.new',
          tender_id: tender.id,
          tender_ref: tender.tender_ref,
          title: tender.title,
          county: tender.pe?.name,
          category: tender.procurement_category?.title,
          published_at: tender.published_at,
          close_at: tender.close_at,
          is_agpo: tender.is_agpo,
          timestamp: new Date().toISOString()
        };
        
        // Sign payload
        const signature = await createHmacSignature(JSON.stringify(payload), webhook.secret);
        
        // Fire webhook
        try {
          const webhookResponse = await fetch(webhook.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Signature': `sha256=${signature}`,
              'X-Webhook-Event': 'tender.new'
            },
            body: JSON.stringify(payload)
          });
          
          // Log delivery
          const deliveryLog = {
            id: `del_${crypto.randomUUID().slice(2, 10)}`,
            webhook_id: webhook.id,
            status: webhookResponse.ok ? 'success' : 'failed',
            status_code: webhookResponse.status,
            attempted_at: new Date().toISOString(),
            tender_id: tender.id
          };
          
          await env.WEBHOOK_DELIVERIES.put(
            `${webhook.id}_${deliveryLog.id}`,
            JSON.stringify(deliveryLog),
            { expirationTtl: 604800 } // 7 days
          );
          
          console.log(`📤 Webhook ${webhook.id} fired for tender ${tender.id}: ${webhookResponse.ok ? 'SUCCESS' : 'FAILED'}`);
          
        } catch (err) {
          console.error(`❌ Webhook delivery failed: ${err.message}`);
          
          const deliveryLog = {
            id: `del_${crypto.randomUUID().slice(2, 10)}`,
            webhook_id: webhook.id,
            status: 'failed',
            error: err.message,
            attempted_at: new Date().toISOString(),
            tender_id: tender.id
          };
          
          await env.WEBHOOK_DELIVERIES.put(
            `${webhook.id}_${deliveryLog.id}`,
            JSON.stringify(deliveryLog),
            { expirationTtl: 604800 }
          );
        }
      }
    }
  }
}

async function createHmacSignature(payload, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}