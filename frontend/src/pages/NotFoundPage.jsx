import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060b16] p-6 text-white">
      <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-center">
        <p className="text-2xl font-bold">404</p>
        <p className="mt-2 text-slate-300">The requested route does not exist.</p>
        <Link to="/" className="mt-4 inline-block rounded-md border border-cyan-400/40 px-4 py-2">
          Go to Live Junction Status
        </Link>
      </div>
    </div>
  );
}
