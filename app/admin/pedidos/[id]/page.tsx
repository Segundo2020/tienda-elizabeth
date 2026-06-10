import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { updateOrderStatus } from "../actions";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

  if (isNaN(orderId)) notFound();

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: {
        with: {
          variant: {
            with: { product: true },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const updateAction = updateOrderStatus.bind(null, orderId);

  return (
    <div>
      <div className="mb-10">
        <Link
          href="/admin/pedidos"
          className="text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900 mb-2 inline-block"
        >
          ← Pedidos
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">
          Pedido #{order.id}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString("es-AR")
            : ""}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-5xl">
        <div className="col-span-2">
          <h2 className="text-lg font-light text-neutral-900 mb-4">Productos</h2>
          <div className="bg-white border border-neutral-200">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Producto</th>
                  <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Variante</th>
                  <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Cant.</th>
                  <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">P. unit</th>
                  <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const variantDesc =
                    [item.variant.size, item.variant.color].filter(Boolean).join(" / ") || "—";
                  const subtotal = Number(item.unitPrice) * item.quantity;
                  return (
                    <tr key={item.id} className="border-b border-neutral-100 last:border-b-0">
                      <td className="px-4 py-3 text-sm text-neutral-900">
                        {item.variant.product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{variantDesc}</td>
                      <td className="px-4 py-3 text-sm text-neutral-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 text-right">
                        ${Number(item.unitPrice).toLocaleString("es-AR")}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 text-right">
                        ${subtotal.toLocaleString("es-AR")}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-neutral-50 font-medium">
                  <td colSpan={4} className="px-4 py-3 text-sm text-neutral-900 text-right">
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-900 text-right">
                    ${Number(order.total).toLocaleString("es-AR")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {order.notes && (
            <div className="mt-6 bg-white border border-neutral-200 p-4">
              <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Notas</h3>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">Cliente</h3>
            <p className="text-sm text-neutral-900">{order.customerName || "—"}</p>
            {order.customerPhone && (
              <p className="text-sm text-neutral-600 mt-1">{order.customerPhone}</p>
            )}
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">Estado</h3>
            <form action={updateAction} className="space-y-2">
              <select
                name="status"
                defaultValue={order.status || "pending"}
                className="w-full px-3 py-2 border border-neutral-300 text-sm bg-white focus:outline-none focus:border-neutral-900"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full px-3 py-2 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
              >
                Actualizar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
