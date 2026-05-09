const API_BASE = 'https://kenya-tenders-api.shelflix.workers.dev';
const API_KEY = 'tk_test123_testsecret123';

async function testAPI() {
    console.log('🧪 Kenya Tenders API - Full Test Suite\n');
    console.log('='.repeat(50));

    // Test 1: Health Check
    console.log('\n1️⃣ Testing /v1/health (no auth)...');
    try {
        const health = await fetch(`${API_BASE}/v1/health`).then(r => r.json());
        console.log('✅ Health:', JSON.stringify(health));
    } catch (e) {
        console.log('❌ Health failed:', e.message);
    }

    // Test 2: Create API Key
    console.log('\n2️⃣ Testing POST /v1/keys...');
    try {
        const keyResult = await fetch(`${API_BASE}/v1/keys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Demo Company', email: 'demo@company.com' })
        }).then(r => r.json());
        console.log('✅ New Key:', keyResult.data?.key?.substring(0, 20) + '...');
    } catch (e) {
        console.log('❌ Create key failed:', e.message);
    }

    // Test 3: Fetch Tenders
    console.log('\n3️⃣ Testing GET /v1/tenders...');
    try {
        const tenders = await fetch(`${API_BASE}/v1/tenders?perpage=3`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Tenders:', tenders.data?.length, 'found');
        console.log('   First:', tenders.data?.[0]?.title?.substring(0, 45) + '...');
    } catch (e) {
        console.log('❌ Fetch tenders failed:', e.message);
    }

    // Test 4: Filter by keyword
    console.log('\n4️⃣ Testing GET /v1/tenders?keyword=construction...');
    try {
        const filtered = await fetch(`${API_BASE}/v1/tenders?keyword=construction&perpage=5`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Filtered:', filtered.data?.length, 'tenders match');
    } catch (e) {
        console.log('❌ Filter failed:', e.message);
    }

    // Test 5: Get Tender Details
    console.log('\n5️⃣ Testing GET /v1/tenders/284099...');
    try {
        const details = await fetch(`${API_BASE}/v1/tenders/284099`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        }).then(r => r.json());
        console.log('✅ Details:', details.data?.title?.substring(0, 40) + '...');
    } catch (e) {
        console.log('❌ Details failed:', e.message);
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
                counties: ['Nairobi']
            })
        }).then(r => r.json());
        console.log('✅ Subscription:', subResult.data?.id);
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
        console.log('❌ List failed:', e.message);
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
                events: ['tender.new']
            })
        }).then(r => r.json());
        console.log('✅ Webhook:', whResult.data?.id);
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

    // Test 10: Error Handling
    console.log('\n🔟 Testing error handling (invalid key)...');
    try {
        const error = await fetch(`${API_BASE}/v1/tenders`, {
            headers: { 'Authorization': 'Bearer invalid_key' }
        });
        console.log('✅ Invalid key rejected:', error.status);
    } catch (e) {
        console.log('❌ Error test failed:', e.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests complete!');
}

testAPI();