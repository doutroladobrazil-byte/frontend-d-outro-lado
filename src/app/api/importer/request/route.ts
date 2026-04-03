import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role: "importer",
      approved: true,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível liberar sua conta de importador." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    role: "importer",
    approved: true,
    message: "Conta de importador liberada com sucesso.",
  });
}
