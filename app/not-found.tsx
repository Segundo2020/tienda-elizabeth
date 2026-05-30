import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-32 text-center">
      <h1 className="text-7xl md:text-8xl font-light mb-6 tracking-tight">
        404
      </h1>
      <p className="text-neutral-600 mb-10">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition"
      >
        Volver al inicio
      </Link>
    </main>
  );
}