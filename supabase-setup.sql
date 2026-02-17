-- CONSULTORIA IA - Supabase Database Setup

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client configuration table
CREATE TABLE IF NOT EXISTS client_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  scale INTEGER DEFAULT 100 CHECK (scale >= 20 AND scale <= 100),
  logo_url TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id)
);

-- Blocks table
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public read access for client_config" ON client_config FOR SELECT USING (true);
CREATE POLICY "Public read access for blocks" ON blocks FOR SELECT USING (true);

-- Authenticated write access (for admin)
CREATE POLICY "Authenticated can insert clients" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update clients" ON clients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete clients" ON clients FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert client_config" ON client_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update client_config" ON client_config FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert blocks" ON blocks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update blocks" ON blocks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete blocks" ON blocks FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_clients_slug ON clients(slug);
CREATE INDEX IF NOT EXISTS idx_blocks_client_id ON blocks(client_id);
CREATE INDEX IF NOT EXISTS idx_client_config_client_id ON client_config(client_id);
