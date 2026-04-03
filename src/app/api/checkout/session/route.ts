import { NextResponse } from "next/server";
import { createStoreCheckout } from "@/lib/supabase/commerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const originHeader = request.headers.get("origin");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const originUrl =
      originHeader ||
      (forwardedHost ? `${forwardedProto || "http"}://${forwardedHost}` : process.env.NEXT_PUBLIC_SITE_URL || undefined);

    const data = await createStoreCheckout({
      ...body,
      ...(originUrl ? { originUrl } : {}),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message ?? "Falha ao criar checkout.",
        issues: error.issues,
      },
      { status: 400 }
    );
  }
}
