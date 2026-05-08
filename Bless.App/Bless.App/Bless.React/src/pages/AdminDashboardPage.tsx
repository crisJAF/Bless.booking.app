import { useCallback, useState } from "react";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReservationsTable } from "../features/admin/ReservationsTable";
import { useSignalRNotifications } from "../hooks/useSignalRNotifications";
import { getCurrentUser, logout } from "../services/authService";
import { requestPermissionAndSubscribe, sendPushNotification } from "../services/pushNotifications";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
  const [showNotificationButton, setShowNotificationButton] = useState(true);
  const currentUser = getCurrentUser();

  const handleRealtimeMessage = useCallback(() => {
    void sendPushNotification().catch(() => undefined);
  }, []);

  const { messages, status, error } = useSignalRNotifications({
    onMessage: handleRealtimeMessage
  });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const enableNotifications = async () => {
    setPermissionMessage(null);

    try {
      await requestPermissionAndSubscribe();
      setPermissionMessage("Notificaciones activadas.");
      setShowNotificationButton(false);
    } catch (permissionError) {
      setPermissionMessage(
        permissionError instanceof Error
          ? permissionError.message
          : "No se pudieron activar las notificaciones."
      );
    }
  };

  return (
    <main className="admin-page">
      <div className="notification-bell" aria-label={`${messages.length} notificaciones`}>
        <Bell aria-hidden="true" size={24} />
        <span>{messages.length}</span>
      </div>

      <section className="admin-shell">
        <div className="admin-header">
          <div>
            <p className="eyebrow mb-1">Panel administrativo</p>
            <h1>Reservas del día</h1>
            <p className="mb-0 text-muted">
              Bienvenido{currentUser?.name ? `, ${currentUser.name}` : ""}. Estado SignalR: {status}.
            </p>
            {error ? <p className="text-danger mb-0">{error}</p> : null}
          </div>

          <button className="btn btn-danger logout-button" type="button" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={18} />
            <span>Salir</span>
          </button>
        </div>

        {showNotificationButton ? (
          <button className="notification-button" type="button" onClick={enableNotifications}>
            <Bell aria-hidden="true" size={18} />
            <span>Activar notificaciones</span>
          </button>
        ) : null}

        {permissionMessage ? (
          <div className="permission-message">
            <ShieldCheck aria-hidden="true" size={18} />
            <span>{permissionMessage}</span>
          </div>
        ) : null}

        <ReservationsTable />
      </section>
    </main>
  );
}
