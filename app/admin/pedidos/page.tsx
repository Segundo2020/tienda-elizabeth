import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { OrdersTable } from "./OrdersTable";

export default async function PedidosPage() {
  const orderList = await db.query.orders.findMany({
    with: { items: true },
    orderBy: [desc(orders.createdAt)],
  });

  const rows = orderList.map((o) => ({
    id: o.id,
    createdAt: o.createdAt ? o.createdAt.toISOString() : null,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    status: o.status || "pending",
    total: o.total,
    itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
  }));

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Pedidos</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {orderList.length} pedido{orderList.length === 1 ? "" : "s"}
        </p>
      </div>

      <OrdersTable orders={rows} />
    </div>
  );
}
