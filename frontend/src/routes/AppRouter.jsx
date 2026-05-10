import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AnalyticsPredictionPage } from "../pages/AnalyticsPredictionPage";
import { AIRouteExplainerPage } from "../pages/AIRouteExplainerPage";
import { EmergencyCorridorManagementPage } from "../pages/EmergencyCorridorManagementPage";
import { LiveJunctionStatusPage } from "../pages/LiveJunctionStatusPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RoleBasedHomePage } from "../pages/RoleBasedHomePage";
import { SystemHealthAdminPage } from "../pages/SystemHealthAdminPage";
import { UserDashboardPage } from "../pages/UserDashboardPage";
import { EmergencyResponderPage } from "../pages/EmergencyResponderPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { ProfilePage } from "../pages/ProfilePage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <RoleBasedHomePage /> },
      { path: "dashboard", element: <LiveJunctionStatusPage /> },
      { path: "analytics", element: <AnalyticsPredictionPage /> },
      { path: "system-health", element: <SystemHealthAdminPage /> },
      { path: "ai-route-explainer", element: <AIRouteExplainerPage /> },
      { path: "emergency-corridor", element: <EmergencyCorridorManagementPage /> },
      { path: "user-dashboard", element: <UserDashboardPage /> },
      { path: "emergency", element: <EmergencyResponderPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "report", element: <UserDashboardPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
