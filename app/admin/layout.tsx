import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sin usuario: solo renderiza children (página de login)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-64 bg-neutral-900 text-white flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-lg font-light tracking-[0.2em]">ELIZABETH</h1>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
            Admin
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="block px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/productos"
            className="block px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors"
          >
            Productos
          </Link>
          <Link
            href="/admin/categorias"
            className="block px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors"
          >
            Categorías
          </Link>
          <Link
            href="/admin/pedidos"
            className="block px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors"
          >
            Pedidos
          </Link>
          <div className="border-t border-neutral-800 my-4" />
          <Link
            href="/"
            className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            ← Ver tienda
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-400 mb-2 truncate">{user.email}</p>
          <form>
            <button
              formAction={logout}
              className="text-xs uppercase tracking-widest text-neutral-300 hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}