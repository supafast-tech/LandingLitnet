-- Fix existing advent_content table by making category nullable or setting default
-- Run this if you get "null value in column category violates not-null constraint" error

-- Option 1: Set a default value for category (recommended)
ALTER TABLE advent_content 
ALTER COLUMN category SET DEFAULT 'general';

-- Option 2: Make category nullable (alternative)
-- ALTER TABLE advent_content 
-- ALTER COLUMN category DROP NOT NULL;

-- Update existing rows without category
UPDATE advent_content 
SET category = CASE 
  WHEN key LIKE '%admin%' OR key LIKE '%settings%' THEN 'settings'
  WHEN key LIKE '%footer%' THEN 'footer'
  WHEN key LIKE '%social%' THEN 'social'
  ELSE 'general'
END
WHERE category IS NULL;

-- Insert or update show_admin_icon
INSERT INTO advent_content (key, value, category) 
VALUES ('show_admin_icon', 'true', 'settings')
ON CONFLICT (key) 
DO UPDATE SET 
  value = 'true',
  category = 'settings',
  updated_at = NOW();
