"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

const VALID_STATUSES = ["pending", "confirmed", "delivered", "cancelled"];

export async function updateOrderStatus(orderId: number, formData: FormData) {
  const status = (formData.get("status") as string)?.trim();

  if (!VALID_STATUSES.includes(status)) {
    redirect(`/admin/pedidos/${orderId}?error=Estado%20inv%C3%A1lido`);
  }

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  redirect(`/admin/pedidos/${orderId}`);
}
