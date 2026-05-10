import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/common/GlassCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../context/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/profile", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Checking authentication..." />;

  return (
    <div className="mx-auto max-w-md">
      <GlassCard title="Login to your account">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? <p className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200">{error}</p> : null}
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Don’t have an account? <Link className="text-cyan-300 hover:text-cyan-200" to="/signup">Sign up</Link>
        </p>
      </GlassCard>
    </div>
  );
}
