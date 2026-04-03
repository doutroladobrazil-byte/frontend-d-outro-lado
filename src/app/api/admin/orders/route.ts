import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/supabase/adminGuard";
import { listAdminOrders } from "@/lib/supabase/commerce";

export async function GET() {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  try {
    const data = await listAdminOrders();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Falha ao carregar pedidos." }, { status: 400 });
  }
}
