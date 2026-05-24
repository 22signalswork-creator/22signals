/**
 * ProtectedRoute — gates admin pages behind authentication.
 *
 * If the user isn't logged in, they're redirected to /admin/login.
 * While the session is being restored, shows a loading state.
 */
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <div className="text-white/60 text-sm tracking-widest uppercase">
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
