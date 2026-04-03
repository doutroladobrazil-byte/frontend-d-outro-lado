alter table public.orders
  add column if not exists stripe_session_id text,
  add column if not exists payment_intent_id text,
  add column if not exists checkout_currency text,
  add column if not exists stripe_payment_status text;

create index if not exists idx_orders_stripe_session_id on public.orders(stripe_session_id);
