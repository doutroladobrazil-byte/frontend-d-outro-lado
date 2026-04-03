import { NextResponse } from "next/server";
import { listStoreProducts } from "@/lib/supabase/commerce";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? undefined;
  const categorySlug = searchParams.get("categorySlug") ?? undefined;
  const featuredParam = searchParams.get("featured");
  const featured = featuredParam === null ? undefined : featuredParam === "true";

  try {
    const data = await listStoreProducts(region, { categorySlug, featured });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Falha ao carregar produtos." },
      { status: 400 }
    );
  }
}
