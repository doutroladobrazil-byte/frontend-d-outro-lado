import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/supabase/adminGuard";
import { deleteAdminOrder, updateAdminOrder } from "@/lib/supabase/commerce";

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const body = await request.json();
    const data = await updateAdminOrder(id, body);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Falha ao atualizar pedido.", issues: error.issues },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const data = await deleteAdminOrder(id);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Falha ao remover pedido." }, { status: 400 });
  }
}
