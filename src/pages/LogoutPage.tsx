import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <main className="not-found-page">
      <p>Saliendo...</p>
    </main>
  );
}
