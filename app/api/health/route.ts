import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

// No cachear, queremos que cada request golpee la DB
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);

    return NextResponse.json({
      status: "ok",
      products: Number(row.count),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        error: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
