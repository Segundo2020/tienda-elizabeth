import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-amber-600" },
  confirmed: { label: "Confirmado", color: "text-blue-600" },
  delivered: { label: "Entregado", color: "text-green-600" },
  cancelled: { label: "Cancelado", color: "text-red-600" },
};

export default async function PedidosPage() {
  const orderList = await db.query.orders.findMany({
    with: { items: true },
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Pedidos</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {orderList.length} pedido{orderList.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="bg-white border border-neutral-200">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">#</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Fecha</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Cliente</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Items</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Total</th>
              <th className="text-center text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Estado</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((o) => {
              const status = STATUS_LABELS[o.status || "pending"] || STATUS_LABELS.pending;
              const itemCount = o.items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <tr key={o.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm text-neutral-900 font-mono">#{o.id}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-900">
                    {o.customerName || "—"}
                    {o.customerPhone && (
                      <div className="text-xs text-neutral-500">{o.customerPhone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 text-right">{itemCount}</td>
                  <td className="px-6 py-4 text-sm text-neutral-900 text-right">
                    ${Number(o.total).toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs ${status.color}`}>● {status.label}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/pedidos/${o.id}`}
                      className="text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orderList.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">No hay pedidos todavía.</p>
            <p className="text-xs text-neutral-400 mt-2">
              Cuando alguien envíe un pedido por WhatsApp desde el carrito, aparece acá.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
