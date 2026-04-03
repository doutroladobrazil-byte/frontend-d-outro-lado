import { NextResponse } from "next/server";
import { getStoreProductBySlug } from "@/lib/supabase/commerce";

type Params = Promise<{ slug: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? undefined;
  const { slug } = await params;

  try {
    const data = await getStoreProductBySlug(slug, region);

    if (!data) {
      return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Falha ao carregar produto." },
      { status: 400 }
    );
  }
}
