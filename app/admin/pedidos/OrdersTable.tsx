"use client";

import { useState } from "react";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-amber-600" },
  confirmed: { label: "Confirmado", color: "text-blue-600" },
  delivered: { label: "Entregado", color: "text-green-600" },
  cancelled: { label: "Cancelado", color: "text-red-600" },
};

type OrderRow = {
  id: number;
  createdAt: string | null;
  customerName: string | null;
  customerPhone: string | null;
  status: string;
  total: string;
  itemCount: number;
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const status = STATUS_LABELS[o.status]?.label || "";
    return (
      String(o.id).includes(q) ||
      (o.customerName?.toLowerCase().includes(q) ?? false) ||
      (o.customerPhone?.toLowerCase().includes(q) ?? false) ||
      status.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Buscar por ID, cliente, teléfono o estado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 text-sm bg-white focus:outline-none focus:border-neutral-900"
        />
      </div>

      <div className="bg-white border border-neutral-200">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">ID</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Fecha</th>
              <th className="text-left text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Cliente</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Items</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Total</th>
              <th className="text-center text-xs uppercase tracking-wider text-neutral-500 px-6 py-3">Estado</th>
              <th className="text-right text-xs uppercase tracking-wider text-neutral-500 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const status = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
              return (
                <tr key={o.id} className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm text-neutral-600 font-mono">#{o.id}</td>
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
                  <td className="px-6 py-4 text-sm text-neutral-600 text-right">{o.itemCount}</td>
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

        {filtered.length === 0 && search && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">
              No se encontraron pedidos para &quot;{search}&quot;.
            </p>
          </div>
        )}

        {orders.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-neutral-500">No hay pedidos todavía.</p>
            <p className="text-xs text-neutral-400 mt-2">
              Cuando alguien envíe un pedido por WhatsApp desde el carrito, aparece acá.
            </p>
          </div>
        )}
      </div>

      {search && filtered.length !== orders.length && (
        <p className="mt-3 text-xs text-neutral-500">
          Mostrando {filtered.length} de {orders.length} pedidos
        </p>
      )}
    </>
  );
}
