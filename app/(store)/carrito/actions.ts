"use server";

import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";

type CartItem = {
  variantId: number;
  productName: string;
  productSlug: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
};

export type CreateOrderState = {
  whatsappUrl: string | null;
  error: string | null;
};

const WHATSAPP_NUMBER = "5492974145259";

export async function createOrder(
  _prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  try {
    const customerName = (formData.get("customerName") as string)?.trim() || null;
    const customerPhone = (formData.get("customerPhone") as string)?.trim() || null;
    const notes = (formData.get("notes") as string)?.trim() || null;
    const itemsJson = formData.get("items") as string;

    if (!itemsJson) {
      return { whatsappUrl: null, error: "Carrito vacío" };
    }

    const items: CartItem[] = JSON.parse(itemsJson);
    if (!items.length) {
      return { whatsappUrl: null, error: "Carrito vacío" };
    }

    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    const [order] = await db
      .insert(orders)
      .values({
        customerName,
        customerPhone,
        total: total.toFixed(2),
        status: "pending",
        notes,
      })
      .returning({ id: orders.id });

    await db.insert(orderItems).values(
      items.map((item) => ({
        orderId: order.id,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price.toFixed(2),
      }))
    );

    const lines: string[] = [`*Pedido #${order.id}*`, ""];
    if (customerName) lines.push(`Cliente: ${customerName}`);
    if (customerPhone) lines.push(`Teléfono: ${customerPhone}`);
    if (customerName || customerPhone) lines.push("");

    for (const item of items) {
      const variant =
        [item.size && `Talle ${item.size}`, item.color]
          .filter(Boolean)
          .join(" - ");
      const variantStr = variant ? ` - ${variant}` : "";
      const subtotal = (item.price * item.quantity).toLocaleString("es-AR");
      lines.push(
        `• ${item.quantity}x ${item.productName}${variantStr} → $${subtotal}`
      );
    }
    lines.push("");
    lines.push(`Total: $${total.toLocaleString("es-AR")}`);
    if (notes) {
      lines.push("");
      lines.push(`Notas: ${notes}`);
    }

    const message = encodeURIComponent(lines.join("\n"));
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    return { whatsappUrl, error: null };
  } catch (err) {
    return {
      whatsappUrl: null,
      error: err instanceof Error ? err.message : "Error al procesar el pedido",
    };
  }
}
