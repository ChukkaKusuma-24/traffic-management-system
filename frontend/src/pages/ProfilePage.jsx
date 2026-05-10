import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/common/GlassCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../context/useAuth";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, logout, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, loading, navigate]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setMessage("Name and email cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <GlassCard title="Your Profile">
        <div className="space-y-4 text-sm text-slate-300">
          <p>
            <span className="font-semibold text-white">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold text-white">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold text-white">Role:</span> {user.role.replace("_", " ")}
          </p>
          <p>
            <span className="font-semibold text-white">User ID:</span> {user.id}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
          >
            Logout
          </button>
          <Link
            to="/"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-cyan-200 hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>
      </GlassCard>

      <GlassCard title="Update Profile">
        {message ? <p className="rounded-lg bg-cyan-500/10 p-3 text-sm text-cyan-200">{message}</p> : null}
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
