import { NextResponse } from "next/server";
import { getAllProducts } from "@/data/categoryData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const products = getAllProducts().filter((product) => product.name.toLowerCase().includes(query)).slice(0, 8);
  return NextResponse.json(products);
}
