import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminRequest() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Não autenticado." }, { status: 401 }),
    };
  }

  const { data: me, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: profileError.message }, { status: 400 }),
    };
  }

  if (!me || me.role !== "admin") {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Acesso negado." }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    supabase,
    user,
  };
}
