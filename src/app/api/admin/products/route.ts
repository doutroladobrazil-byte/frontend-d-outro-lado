import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/supabase/adminGuard";
import { createAdminProduct, listAdminProducts } from "@/lib/supabase/commerce";

export async function GET() {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  try {
    const data = await listAdminProducts();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Falha ao carregar produtos." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const data = await createAdminProduct(body);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Falha ao criar produto.", issues: error.issues },
      { status: 400 }
    );
  }
}
