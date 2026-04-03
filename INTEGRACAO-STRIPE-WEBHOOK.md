# Integração real do Stripe + webhook

## O que esta etapa faz
- checkout agora cria pedido no Supabase e, se `STRIPE_SECRET_KEY` estiver configurada, abre uma sessão real do Stripe
- webhook em `frontend/src/app/api/stripe/webhook/route.ts`
- ao receber `checkout.session.completed` ou `checkout.session.async_payment_succeeded`:
  - pedido vira `paid`
  - `paid_at` é preenchido
  - ids do Stripe são gravados
  - estoque é baixado automaticamente uma única vez
- ao receber `checkout.session.expired`:
  - pedido pendente vira `cancelled`

## Variáveis necessárias no frontend
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY_FALLBACK`

## URL de webhook no Stripe
Use a URL pública do frontend:

`https://SEU-DOMINIO/api/stripe/webhook`

## Migração SQL
Rodar também:
- `src/lib/supabase/migrations/0003_stripe_checkout.sql`

## Fluxo
1. checkout cria o pedido no Supabase
2. checkout cria a sessão do Stripe
3. cliente paga no Stripe
4. webhook confirma o pagamento
5. pedido é atualizado para `paid`
6. estoque é abatido automaticamente
