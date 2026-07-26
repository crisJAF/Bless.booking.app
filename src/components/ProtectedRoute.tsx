import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!getCurrentUser()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
