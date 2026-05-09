-- ============================================
-- Kenya Tenders SaaS - D1 Database Schema
-- Production-ready SQL for Cloudflare D1
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    tier TEXT DEFAULT 'free' CHECK(tier IN ('free', 'starter', 'pro', 'business', 'enterprise')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    mpesa_phone TEXT,
    whatsapp_enabled INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    trial_ends_at TEXT,
    subscription_ends_at TEXT,
    is_active INTEGER DEFAULT 1
);

-- Index for email lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_stripe ON users(stripe_customer_id);

-- ============================================
-- API KEYS TABLE
-- ============================================
CREATE TABLE api_keys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    name TEXT,
    tier TEXT DEFAULT 'free',
    requests_today INTEGER DEFAULT 0,
    requests_total INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    last_used_at TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- ============================================
-- TENDERS TABLE (Normalized)
-- ============================================
CREATE TABLE tenders (
    id INTEGER PRIMARY KEY,
    ppip_id INTEGER UNIQUE,
    ocid TEXT,
    tender_ref TEXT,
    title TEXT NOT NULL,
    description TEXT,
    pe_name TEXT,
    county_id INTEGER,
    county_name TEXT,
    procurement_category TEXT,
    procurement_method TEXT,
    bid_security_value REAL,
    tender_fee REAL,
    validity_days INTEGER,
    published_at TEXT,
    close_at TEXT,
    is_agpo INTEGER DEFAULT 0,
    agpo_groups TEXT,
    source TEXT DEFAULT 'ppip',
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_tenders_ppip ON tenders(ppip_id);
CREATE INDEX idx_tenders_county ON tenders(county_name);
CREATE INDEX idx_tenders_category ON tenders(procurement_category);
CREATE INDEX idx_tenders_close ON tenders(close_at);
CREATE INDEX idx_tenders_agpo ON tenders(is_agpo);

-- ============================================
-- TENDER DOCUMENTS
-- ============================================
CREATE TABLE tender_documents (
    id TEXT PRIMARY KEY,
    tender_id INTEGER NOT NULL,
    description TEXT,
    url TEXT,
    document_type TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tender_id) REFERENCES tenders(id)
);

CREATE INDEX idx_tender_docs_tender ON tender_documents(tender_id);

-- ============================================
-- SUBSCRIPTIONS (Alert Rules)
-- ============================================
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT,
    keywords TEXT NOT NULL,
    counties TEXT,
    categories TEXT,
    min_bid_security REAL,
    is_agpo_only INTEGER DEFAULT 0,
    frequency TEXT DEFAULT 'instant' CHECK(frequency IN ('instant', 'daily', 'weekly')),
    email_alert INTEGER DEFAULT 1,
    whatsapp_alert INTEGER DEFAULT 0,
    webhook_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(is_active);

-- ============================================
-- ALERT LOGS
-- ============================================
CREATE TABLE alert_logs (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL,
    tender_id INTEGER NOT NULL,
    channel TEXT NOT NULL CHECK(channel IN ('email', 'whatsapp', 'webhook')),
    status TEXT NOT NULL CHECK(status IN ('sent', 'failed', 'pending')),
    error_message TEXT,
    sent_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (tender_id) REFERENCES tenders(id)
);

CREATE INDEX idx_alert_logs_subscription ON alert_logs(subscription_id);
CREATE INDEX idx_alert_logs_tender ON alert_logs(tender_id);
CREATE INDEX idx_alert_logs_status ON alert_logs(status);

-- ============================================
-- TENDER SCORES (AI/ML)
-- ============================================
CREATE TABLE tender_scores (
    tender_id INTEGER PRIMARY KEY,
    relevance_score REAL DEFAULT 50,
    difficulty_score REAL DEFAULT 50,
    competition_estimate TEXT,
    recommendation TEXT CHECK(recommendation IN ('bid', 'watch', 'ignore')),
    generated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tender_id) REFERENCES tenders(id)
);

-- ============================================
-- USER PREFERENCES
-- ============================================
CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY,
    industry TEXT,
    company_type TEXT,
    past_tenders TEXT,
    target_counties TEXT,
    target_categories TEXT,
    annual_revenue REAL,
    employees_count INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- PAYMENT HISTORY
-- ============================================
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'KES',
    status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT CHECK(payment_method IN ('mpesa', 'stripe', 'bank_transfer')),
    stripe_payment_id TEXT,
    mpesa_receipt TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_id);

-- ============================================
-- WEBHOOKS
-- ============================================
CREATE TABLE webhooks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT,
    secret TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_webhooks_user ON webhooks(user_id);

-- ============================================
-- WEBHOOK DELIVERIES
-- ============================================
CREATE TABLE webhook_deliveries (
    id TEXT PRIMARY KEY,
    webhook_id TEXT NOT NULL,
    event_type TEXT,
    payload TEXT,
    status_code INTEGER,
    response_body TEXT,
    delivered_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
);

CREATE INDEX idx_webhook_delivery_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_delivery_date ON webhook_deliveries(delivered_at);

-- ============================================
-- ANALYTICS
-- ============================================
CREATE TABLE daily_stats (
    date TEXT PRIMARY KEY,
    total_tenders INTEGER DEFAULT 0,
    new_tenders INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    total_api_calls INTEGER DEFAULT 0,
    alerts_sent INTEGER DEFAULT 0,
    revenue REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- COMPETITOR TRACKING (Future Feature)
-- ============================================
CREATE TABLE competitors (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE competitor_wins (
    id TEXT PRIMARY KEY,
    competitor_id TEXT NOT NULL,
    tender_id INTEGER,
    award_value REAL,
    awarded_at TEXT,
    source TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (competitor_id) REFERENCES competitors(id),
    FOREIGN KEY (tender_id) REFERENCES tenders(id)
);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active users with subscription
CREATE VIEW active_subscribers AS
SELECT 
    u.id, u.email, u.name, u.tier, u.subscription_ends_at,
    COUNT(s.id) as alert_count
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.is_active = 1
WHERE u.is_active = 1 AND (u.subscription_ends_at IS NULL OR u.subscription_ends_at > datetime('now'))
GROUP BY u.id;

-- Tenders closing soon
CREATE VIEW tenders_closing_soon AS
SELECT id, tender_ref, title, pe_name, county_name, close_at
FROM tenders
WHERE close_at IS NOT NULL 
AND datetime(close_at) > datetime('now')
AND datetime(close_at) < datetime('now', '+7 days')
ORDER BY close_at ASC;

-- Revenue by month
CREATE VIEW monthly_revenue AS
SELECT 
    strftime('%Y-%m', created_at) as month,
    SUM(amount) as revenue,
    COUNT(*) as transactions
FROM payments
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC;