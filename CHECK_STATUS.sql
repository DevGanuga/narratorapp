-- Check current status of all demo projects
SELECT name, status, demo_count
FROM projects
WHERE name LIKE '%Demo'
ORDER BY name;

-- If any are draft, fix them to active:
-- UPDATE projects SET status = 'active' WHERE name LIKE '%Demo' AND status != 'active';
