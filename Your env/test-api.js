const API_BASE = 'https://kenya-tenders-api.shelflix.workers.dev';
const API_KEY = 'tk_test123_testsecret123';

async function testAPI() {
    console.log('🧪 Kenya Tenders API - Full Test Suite\n');
    console.log('='.repeat(50));

    // Test 1: Health Check
    console.log('\n1️⃣ Testing /v1/health (no auth required)...');
    try {
        const health = await fetch(`${API_BASE}/v1/health`).then(r => r.json());
        console.log('✅ Health:', JSON.stringify(health, null, 2));
    } catch (e) {
        console.log('❌ Health failed:', e.message);
    }

    // Test 2: Create API Key
    console.log('\n2️⃣ Testing POST /v1/keys (create new key)...');
    try {
        const keyResult = await fetch(`${API_BASE}/v1/keys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Demo Company', email: 'demo@company.com' })
        }).then(r => r.json());
        console.log('✅ New Key Created:', JSON.stringify(keyResult, null, 2));
    } catch (e) {
        console.log('❌ Create key failed:', e.message);
    }

    // Test 3: Fetch Tenders (unfiltered)
    console.log('\n3️⃣ Testing GET /v1/tenders (list tenders)...');
    try {
        const tenders = await fetch(`${API_BASE}/v1/tenders?perpage=3`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Tenders fetched:', tenders.data?.length, 'tenders');
        console.log('   Sample tender:', tenders.data?.[0]?.title?.substring(0, 50) + '...');
    } catch (e) {
        console.log('❌ Fetch tenders failed:', e.message);
    }

    // Test 4: Filter Tenders
    console.log('\n4️⃣ Testing GET /v1/tenders?keyword=construction...');
    try {
        const filtered = await fetch(`${API_BASE}/v1/tenders?keyword=construction&perpage=5`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Filtered tenders:', filtered.data?.length, 'matches');
    } catch (e) {
        console.log('❌ Filter failed:', e.message);
    }

    // Test 5: Get Tender Details
    console.log('\n5️⃣ Testing GET /v1/tenders/284099 (tender details)...');
    try {
        const details = await fetch(`${API_BASE}/v1/tenders/284099`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Tender details:', details.data?.title?.substring(0, 40) + '...');
        console.log('   County:', details.data?.pe_name);
        console.log('   Category:', details.data?.procurement_category);
    } catch (e) {
        console.log('❌ Tender details failed:', e.message);
    }

    // Test 6: Create Subscription
    console.log('\n6️⃣ Testing POST /v1/subscriptions...');
    try {
        const subResult = await fetch(`${API_BASE}/v1/subscriptions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                keywords: ['construction', 'building'],
                counties: ['Nairobi'],
                categories: ['Goods', 'Works']
            })
        }).then(r => r.json());
        console.log('✅ Subscription created:', subResult.data?.id);
    } catch (e) {
        console.log('❌ Subscription failed:', e.message);
    }

    // Test 7: List Subscriptions
    console.log('\n7️⃣ Testing GET /v1/subscriptions...');
    try {
        const subs = await fetch(`${API_BASE}/v1/subscriptions`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Subscriptions:', subs.data?.length, 'active');
    } catch (e) {
        console.log('❌ List subscriptions failed:', e.message);
    }

    // Test 8: Create Webhook
    console.log('\n8️⃣ Testing POST /v1/webhooks...');
    try {
        const whResult = await fetch(`${API_BASE}/v1/webhooks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                webhook_url: 'https://example.com/webhook',
                events: ['tender.new', 'tender.amended']
            })
        }).then(r => r.json());
        console.log('✅ Webhook created:', whResult.data?.id);
    } catch (e) {
        console.log('❌ Webhook failed:', e.message);
    }

    // Test 9: List Webhooks
    console.log('\n9️⃣ Testing GET /v1/webhooks...');
    try {
        const webhooks = await fetch(`${API_BASE}/v1/webhooks`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Webhooks:', webhooks.data?.length, 'registered');
    } catch (e) {
        console.log('❌ List webhooks failed:', e.message);
    }

    // Test 10: Error handling - invalid key
    console.log('\n🔟 Testing error handling (invalid API key)...');
    try {
        const error = await fetch(`${API_BASE}/v1/tenders`, {
            headers: { 'Authorization': 'Bearer invalid_key_123' }
        });
        console.log('✅ Invalid key rejected:', error.status, error.statusText);
    } catch (e) {
        console.log('❌ Error test failed:', e.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Test Suite Complete!');
}

testAPI();