import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/auth";

type Params = Promise<{ id: string }>;

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const nextRole = body?.role as UserRole | undefined;
  const nextApproved =
    typeof body?.approved === "boolean" ? Boolean(body.approved) : undefined;

  if (!nextRole || !["client", "importer", "admin"].includes(nextRole)) {
    return NextResponse.json({ error: "Role inválida." }, { status: 400 });
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { data: targetProfile, error: targetError } = await admin
    .from("profiles")
    .select("approved")
    .eq("id", id)
    .maybeSingle();

  if (targetError) {
    return NextResponse.json({ error: targetError.message }, { status: 400 });
  }

  const approved =
    nextRole === "admin"
      ? true
      : nextRole === "client"
      ? false
      : nextApproved ?? targetProfile?.approved ?? true;

  const { data, error } = await admin
    .from("profiles")
    .update({
      role: nextRole,
      approved,
    })
    .eq("id", id)
    .select("id, email, full_name, role, approved, created_at, updated_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
