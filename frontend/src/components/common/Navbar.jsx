import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { RealtimeBadge } from "./RealtimeBadge";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getTitleByRole = () => {
    switch (user?.role) {
      case "TRAFFIC_POLICE":
        return "Traffic Police Command Center";
      case "EMERGENCY_RESPONDER":
        return "Emergency Response Dashboard";
      case "USER":
        return "Public Traffic Information";
      default:
        return "Traffic Intelligence Console";
    }
  };

  const getSubtitleByRole = () => {
    switch (user?.role) {
      case "TRAFFIC_POLICE":
        return "Real-time monitoring and system health";
      case "EMERGENCY_RESPONDER":
        return "Emergency corridor activation and routing";
      case "USER":
        return "Live traffic status and incident reporting";
      default:
        return "Smart City Command Layer";
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060b16]/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-slate-400">{getSubtitleByRole()}</p>
          <h2 className="text-lg font-semibold text-white md:text-xl">{getTitleByRole()}</h2>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-semibold text-cyan-200">{user.name || "User"}</p>
            </div>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700"
            >
              Login
            </button>
          )}
          <RealtimeBadge />
        </div>
      </div>
    </header>
  );
}
