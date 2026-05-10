export const NAV_ITEMS = [
  { label: "Live Junction Status", to: "/" },
  { label: "Analytics & AI Prediction", to: "/analytics" },
  { label: "System Health Admin", to: "/system-health" },
  { label: "AI Route Explainer", to: "/ai-route-explainer" },
  { label: "Emergency Corridor", to: "/emergency-corridor" },
];

export const ROLE_BASED_NAV = {
  TRAFFIC_POLICE: [
    { label: "Live Junction Status", to: "/dashboard" },
    { label: "Analytics & AI Prediction", to: "/analytics" },
    { label: "System Health Admin", to: "/system-health" },
    { label: "AI Route Explainer", to: "/ai-route-explainer" },
    { label: "Emergency Corridor", to: "/emergency-corridor" },
  ],
  EMERGENCY_RESPONDER: [
    { label: "Emergency Dashboard", to: "/emergency" },
    { label: "Emergency Corridor", to: "/emergency-corridor" },
    { label: "Route Planning", to: "/analytics" },
  ],
  USER: [
    { label: "Traffic Status", to: "/user-dashboard" },
    { label: "Report Issue", to: "/report" },
  ],
};

export const USER_ROLES = {
  TRAFFIC_POLICE: "TRAFFIC_POLICE",
  EMERGENCY_RESPONDER: "EMERGENCY_RESPONDER",
  USER: "USER",
};

export const GLASS =
  "rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_10px_45px_rgba(2,8,23,0.45)]";
