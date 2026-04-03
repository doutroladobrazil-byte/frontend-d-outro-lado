import { NextResponse } from "next/server";
import { getStoreOrderByPublicId, syncOrderFromCheckoutSession } from "@/lib/supabase/commerce";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;

  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (sessionId) {
      await syncOrderFromCheckoutSession(sessionId).catch(() => null);
    }

    const data = await getStoreOrderByPublicId(id);

    if (!data) {
      return NextResponse.json({ message: "Pedido não encontrado." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Falha ao carregar pedido." },
      { status: 400 }
    );
  }
}
