-- ═══════════════════════════════════════════════════════════
-- PhysioSthanak — Bot Monitoring & GEO Audit Tables
-- Migration 002: GEO/AEO KPI Monitoring System
-- ═══════════════════════════════════════════════════════════

-- 1. Bot Visits — logs AI bot crawl activity
CREATE TABLE bot_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_name TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for bot_visits
ALTER TABLE bot_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow bot logging"
  ON bot_visits FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can read bot visits"
  ON bot_visits FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for analytics queries
CREATE INDEX idx_bot_visits_created ON bot_visits(created_at);
CREATE INDEX idx_bot_visits_bot ON bot_visits(bot_name);
CREATE INDEX idx_bot_visits_path ON bot_visits(path);

-- 2. GEO Audit Results — manual monthly audit of AI search citations
CREATE TABLE geo_audit_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  prompt TEXT NOT NULL,
  platform TEXT NOT NULL,
  is_cited BOOLEAN DEFAULT false,
  is_mentioned BOOLEAN DEFAULT false,
  facts_accurate BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for geo_audit_results
ALTER TABLE geo_audit_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage audits"
  ON geo_audit_results FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index for querying by audit date
CREATE INDEX idx_geo_audit_date ON geo_audit_results(audit_date);
