import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/common/GlassCard";
import { useAuth } from "../context/useAuth";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup({ name, email, password, role });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <GlassCard title="Create a new account">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? <p className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200">{error}</p> : null}
          <div>
            <label className="block text-sm font-medium text-slate-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-slate-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="USER">User</option>
              <option value="EMERGENCY_RESPONDER">Ambulance / Fire Truck</option>
              <option value="TRAFFIC_POLICE">Traffic Police</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account? <Link className="text-cyan-300 hover:text-cyan-200" to="/login">Login</Link>
        </p>
      </GlassCard>
    </div>
  );
}
