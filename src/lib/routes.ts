export const APP_ROUTES = {
  home: "/",
  login: "/login",
  accessDenied: "/acesso-negado",
  waitingApproval: "/aguardando-aprovacao",
  wholesale: "/atacado",
  admin: "/admin",
  checkout: "/checkout",
} as const;

export const ADMIN_ROUTE_PREFIXES = [APP_ROUTES.admin] as const;
export const WHOLESALE_ROUTE_PREFIXES = [APP_ROUTES.wholesale] as const;

export function isRouteWithinPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
