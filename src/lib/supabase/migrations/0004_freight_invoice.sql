alter table public.orders
  add column if not exists shipping_brl numeric(12,2) not null default 0,
  add column if not exists shipping_provider text,
  add column if not exists shipping_service_code text,
  add column if not exists shipping_service_name text,
  add column if not exists shipping_delivery_days integer,
  add column if not exists destination_zip text,
  add column if not exists shipping_city text,
  add column if not exists shipping_state text,
  add column if not exists customer_document text,
  add column if not exists invoice_status text default 'pending',
  add column if not exists invoice_provider text,
  add column if not exists invoice_id text,
  add column if not exists invoice_number text,
  add column if not exists invoice_pdf_url text,
  add column if not exists invoice_xml_url text,
  add column if not exists invoice_message text;

create index if not exists idx_orders_destination_zip on public.orders(destination_zip);
create index if not exists idx_orders_invoice_status on public.orders(invoice_status);
