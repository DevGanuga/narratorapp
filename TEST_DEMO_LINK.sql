-- Test creating a demo session manually
-- This simulates what the API should do

-- Get FLO CU project ID
SELECT id, name, status FROM projects WHERE name = 'FLO CU Demo';

-- Create a test demo session (replace PROJECT_ID with actual ID from above)
INSERT INTO demo_sessions (id, project_id, status, expires_at)
VALUES (
  'demo_test_' || floor(random() * 1000000)::text,
  (SELECT id FROM projects WHERE name = 'FLO CU Demo' LIMIT 1),
  'pending',
  now() + interval '24 hours'
)
RETURNING *;

-- Verify it was created
SELECT * FROM demo_sessions ORDER BY created_at DESC LIMIT 5;

-- Clean up test session
DELETE FROM demo_sessions WHERE id LIKE 'demo_test_%';
