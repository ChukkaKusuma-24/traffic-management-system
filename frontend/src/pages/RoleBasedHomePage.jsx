import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../context/useAuth";

export function RoleBasedHomePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Redirect based on user role
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    switch (user.role) {
      case "TRAFFIC_POLICE":
        navigate("/dashboard", { replace: true });
        break;
      case "EMERGENCY_RESPONDER":
        navigate("/emergency", { replace: true });
        break;
      case "USER":
      default:
        navigate("/user-dashboard", { replace: true });
        break;
    }
  }, [user, loading, navigate]);

  return <LoadingSpinner label="Loading your dashboard..." />;
}
