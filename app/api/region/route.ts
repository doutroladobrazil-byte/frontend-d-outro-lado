import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const countryCode = request.headers.get("x-vercel-ip-country") ?? "BR";
  return NextResponse.json({ countryCode });
}
