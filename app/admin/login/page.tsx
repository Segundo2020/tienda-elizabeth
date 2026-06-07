import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light tracking-[0.2em] text-neutral-900">
            ELIZABETH
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">
            Panel de administración
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider text-neutral-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider text-neutral-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 text-sm bg-white"
            />
          </div>

          {hasError && (
            <p className="text-sm text-red-600">
              Email o contraseña incorrectos.
            </p>
          )}

          <button
            formAction={login}
            className="w-full bg-neutral-900 text-white py-3 text-xs uppercase tracking-widest hover:bg-neutral-700 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}