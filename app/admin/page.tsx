import { db } from "@/lib/db";
import { products, orders } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export default async function AdminDashboard() {
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 mt-1">Resumen de la tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Productos
          </p>
          <p className="text-4xl font-light mt-2 text-neutral-900">
            {productCount.value}
          </p>
        </div>

        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Pedidos
          </p>
          <p className="text-4xl font-light mt-2 text-neutral-900">
            {orderCount.value}
          </p>
        </div>

        <div className="bg-white p-6 border border-neutral-200">
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Estado
          </p>
          <p className="text-sm mt-2 text-green-600">● En línea</p>
        </div>
      </div>
    </div>
  );
}