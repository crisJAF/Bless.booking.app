import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

type ToastProps = {
  tone?: ToastTone;
  title: string;
  message?: string;
  onClose?: () => void;
};

const icons = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info
};

export function Toast({ tone = "info", title, message, onClose }: ToastProps) {
  const Icon = icons[tone];

  return (
    <div className={`toast-inline toast-${tone}`} role="status">
      <Icon aria-hidden="true" size={20} />
      <div>
        <strong>{title}</strong>
        {message ? <p>{message}</p> : null}
      </div>
      {onClose ? (
        <button className="icon-button toast-close" type="button" aria-label="Cerrar mensaje" onClick={onClose}>
          <X aria-hidden="true" size={16} />
        </button>
      ) : null}
    </div>
  );
}
