import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ROLE_BASED_NAV } from "../../utils/constants";

export function Sidebar() {
  const { user } = useAuth();
  const userRole = user?.role || "USER";
  const navItems = user
    ? [...(ROLE_BASED_NAV[userRole] || ROLE_BASED_NAV.USER), { label: "Profile", to: "/profile" }]
    : [
        { label: "Login", to: "/login" },
        { label: "Sign Up", to: "/signup" },
      ];

  const getRoleBadge = () => {
    if (!user) return "Guest";
    switch (userRole) {
      case "TRAFFIC_POLICE":
        return "🚔 Traffic Police";
      case "EMERGENCY_RESPONDER":
        return "🚑 Emergency";
      case "USER":
        return "👤 Citizen";
      default:
        return "User";
    }
  };

  return (
    <aside className="border-b border-white/10 bg-[#0b1222]/90 p-4 lg:min-h-screen lg:border-b-0 lg:border-r">
      <h1 className="mb-2 text-xl font-semibold text-cyan-300">Smart Traffic Grid</h1>
      <div className="mb-4 inline-block rounded-lg bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-200">
        {getRoleBadge()}
      </div>
      <nav className="flex gap-2 overflow-x-auto lg:flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
