-- Create advent_content table for storing landing page content
CREATE TABLE IF NOT EXISTS advent_content (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default values for show_admin_icon
INSERT INTO advent_content (key, value, category) 
VALUES ('show_admin_icon', 'true', 'settings')
ON CONFLICT (key) DO NOTHING;

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_advent_content_key ON advent_content(key);

-- Enable Row Level Security (RLS)
ALTER TABLE advent_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for service role
CREATE POLICY "Allow all operations for service role" ON advent_content
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- If table already exists but category column is NOT NULL, make it nullable or add default
-- Run this separately if you get "column category violates not-null constraint" error:
-- ALTER TABLE advent_content ALTER COLUMN category SET DEFAULT 'general';
-- ALTER TABLE advent_content ALTER COLUMN category DROP NOT NULL;
