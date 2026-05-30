import Link from 'next/link';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { CartIcon } from './CartIcon';

export async function Header() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name));

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-medium tracking-[0.2em] text-neutral-900"
        >
          ELIZABETH
        </Link>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-sm text-neutral-700 hover:text-black transition">
              Todos
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="text-sm text-neutral-700 hover:text-black transition"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          <CartIcon />
        </div>
      </div>
    </header>
  );
}