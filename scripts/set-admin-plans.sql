-- Set admin accounts to elite plan in user_subscriptions
-- Run this in the Supabase SQL editor to ensure DB-level elite access
-- These accounts also have code-level unlimited bypass (ADMIN_EMAILS in plan-config.ts)

INSERT INTO user_subscriptions (user_id, plan, status, current_period_end)
SELECT
  au.id,
  'elite'::text,
  'active'::text,
  (now() + interval '100 years')::timestamptz
FROM auth.users au
WHERE au.email IN (
  'ukamakaene@gmail.com',
  'townshub1@gmail.com',
  'eneonyeka32@gmail.com',
  'childrenfromlight@gmail.com'
)
ON CONFLICT (user_id) DO UPDATE
  SET
    plan             = 'elite',
    status           = 'active',
    current_period_end = (now() + interval '100 years')::timestamptz;
