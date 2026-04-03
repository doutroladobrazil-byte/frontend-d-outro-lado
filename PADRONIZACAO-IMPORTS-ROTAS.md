# Padronização final de imports e rotas

## O que foi consolidado
- Contexto de autenticação centralizado em `src/contexts/AuthContext.tsx`
- `src/components/AuthContext.tsx` virou apenas compatibilidade de import legado
- Roles padronizadas para: `client`, `importer`, `admin`
- `approved` padronizado como campo único para liberar atacado
- Rotas centralizadas em `src/lib/routes.ts`
- `middleware.ts` passou a usar constantes centralizadas de rota
- Criação da rota correta `src/app/api/importer/request/route.ts`
- Rota antiga aninhada mantida apenas como compatibilidade
- APIs admin de usuários deixaram de ficar vazias

## Impacto esperado
- Menos conflito entre imports antigos e novos
- Menos inconsistência entre páginas client-side, middleware e rotas server-side
- Fluxo mais coerente para login, atacado e admin

## Próximo passo recomendado
- Revisão final de telas que ainda usam mock local em vez de Supabase real
- Integração do painel `/admin/importadores` com dados reais
- Build local para validar últimos ajustes finos
