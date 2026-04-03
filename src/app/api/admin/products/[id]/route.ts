import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/supabase/adminGuard";
import { deleteAdminProduct, updateAdminProduct } from "@/lib/supabase/commerce";

type Params = Promise<{ id: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const body = await request.json();
    const data = await updateAdminProduct(Number(id), body);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Falha ao atualizar produto.", issues: error.issues },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const data = await deleteAdminProduct(Number(id));
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Falha ao remover produto." }, { status: 400 });
  }
}
