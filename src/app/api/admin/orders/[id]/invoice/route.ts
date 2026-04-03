import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/supabase/adminGuard";
import { retryOrderInvoice } from "@/lib/supabase/commerce";

type Params = Promise<{ id: string }>;

export async function POST(_request: Request, { params }: { params: Params }) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const data = await retryOrderInvoice(id);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Falha ao reenviar nota fiscal." }, { status: 400 });
  }
}
