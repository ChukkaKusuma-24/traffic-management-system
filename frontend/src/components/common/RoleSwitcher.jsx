import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Development component for testing different user roles
 * Add this to your Navbar or a debug panel
 */
export function RoleSwitcher() {
  const navigate = useNavigate();

  const switchRole = useCallback(
    (role) => {
      const testUsers = {
        TRAFFIC_POLICE: {
          id: "tp-001",
          name: "Officer Kumar",
          role: "TRAFFIC_POLICE",
          email: "officer@traffic.gov",
        },
        EMERGENCY_RESPONDER: {
          id: "er-001",
          name: "Paramedic Sharma",
          role: "EMERGENCY_RESPONDER",
          email: "ambulance@emergency.gov",
        },
        USER: {
          id: "user-001",
          name: "Citizen Singh",
          role: "USER",
          email: "citizen@example.com",
        },
      };

      const user = testUsers[role];
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);

      // Reload to apply changes
      window.location.href = "/";
    },
    []
  );

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900/90 p-3 border border-white/10">
      <p className="mb-2 text-xs font-semibold text-slate-400">DEBUG: Test Roles</p>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => switchRole("TRAFFIC_POLICE")}
          className="rounded px-2 py-1 text-xs bg-blue-600/50 text-blue-200 hover:bg-blue-600 transition"
        >
          🚔 Traffic Police
        </button>
        <button
          onClick={() => switchRole("EMERGENCY_RESPONDER")}
          className="rounded px-2 py-1 text-xs bg-red-600/50 text-red-200 hover:bg-red-600 transition"
        >
          🚑 Ambulance
        </button>
        <button
          onClick={() => switchRole("USER")}
          className="rounded px-2 py-1 text-xs bg-cyan-600/50 text-cyan-200 hover:bg-cyan-600 transition"
        >
          👤 User
        </button>
      </div>
    </div>
  );
}
