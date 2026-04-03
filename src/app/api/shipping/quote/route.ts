import { NextResponse } from "next/server";
import { getCheckoutFreightQuote } from "@/lib/freight";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getCheckoutFreightQuote(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error?.message ?? "Falha ao cotar frete." }, { status: 400 });
  }
}
