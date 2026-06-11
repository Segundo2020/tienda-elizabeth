"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, productVariants } from "@/lib/db/schema";

const VALID_STATUSES = ["pending", "confirmed", "delivered", "cancelled"];
const COMMITTED_STATUSES = ["confirmed", "delivered"];

export async function updateOrderStatus(orderId: number, formData: FormData) {
  const newStatus = (formData.get("status") as string)?.trim();

  if (!VALID_STATUSES.includes(newStatus)) {
    redirect(`/admin/pedidos/${orderId}?error=Estado%20inv%C3%A1lido`);
  }

  let errorMsg: string | null = null;

  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { items: true },
    });

    if (!order) throw new Error("Pedido no encontrado");

    const prevStatus = order.status || "pending";
    const wasCommitted = COMMITTED_STATUSES.includes(prevStatus);
    const isCommitted = COMMITTED_STATUSES.includes(newStatus);

    if (!wasCommitted && isCommitted) {
      // Validar stock antes de descontar
      const variantIds = order.items.map((i) => i.variantId);
      const variants = await db
        .select()
        .from(productVariants)
        .where(inArray(productVariants.id, variantIds));
      const variantMap = new Map(variants.map((v) => [v.id, v]));

      for (const item of order.items) {
        const variant = variantMap.get(item.variantId);
        if (!variant) {
          throw new Error("Una de las variantes del pedido ya no existe.");
        }
        if (variant.stock < item.quantity) {
          const desc =
            [variant.size, variant.color].filter(Boolean).join(" / ") || "variante";
          throw new Error(
            `Stock insuficiente para ${desc}: hay ${variant.stock}, el pedido pide ${item.quantity}.`
          );
        }
      }

      // Descontar
      for (const item of order.items) {
        await db
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
          .where(eq(productVariants.id, item.variantId));
      }
    } else if (wasCommitted && !isCommitted) {
      // Restaurar stock
      for (const item of order.items) {
        await db
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
          .where(eq(productVariants.id, item.variantId));
      }
    }

    await db.update(orders).set({ status: newStatus }).where(eq(orders.id, orderId));
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "Error al actualizar";
  }

  if (errorMsg) {
    redirect(
      `/admin/pedidos/${orderId}?error=${encodeURIComponent(errorMsg)}`
    );
  }

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/productos");
  redirect(`/admin/pedidos/${orderId}`);
}
