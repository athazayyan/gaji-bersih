-- Run this in Supabase SQL Editor to clear failed migration entries
-- This will allow you to re-run the migrations cleanly

DELETE FROM supabase_migrations.schema_migrations
WHERE version IN ('20250101', '20250117');

-- Verify deletion
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 10;
