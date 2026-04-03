import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  ADMIN_ROUTE_PREFIXES,
  APP_ROUTES,
  WHOLESALE_ROUTE_PREFIXES,
  isRouteWithinPrefix,
} from "@/lib/routes";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, any>) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: Record<string, any>) {
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = isRouteWithinPrefix(pathname, ADMIN_ROUTE_PREFIXES);
  const isWholesaleRoute = isRouteWithinPrefix(pathname, WHOLESALE_ROUTE_PREFIXES);

  if (!isAdminRoute && !isWholesaleRoute) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = APP_ROUTES.login;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, approved")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = APP_ROUTES.accessDenied;
    deniedUrl.search = "";
    return NextResponse.redirect(deniedUrl);
  }

  if (isAdminRoute && profile.role !== "admin") {
    const deniedUrl = request.nextUrl.clone();
    deniedUrl.pathname = APP_ROUTES.accessDenied;
    deniedUrl.search = "";
    return NextResponse.redirect(deniedUrl);
  }

  if (isWholesaleRoute) {
    const canAccessWholesale =
      profile.role === "admin" || profile.role === "importer";

    if (!canAccessWholesale) {
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = APP_ROUTES.accessDenied;
      deniedUrl.search = "";
      return NextResponse.redirect(deniedUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/atacado/:path*"],
};
