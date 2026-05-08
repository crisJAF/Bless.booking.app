import { FormEvent, useState } from "react";
import { Loader2, LockKeyhole, Scissors } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = (location.state as LocationState | null)?.from?.pathname ?? "/login/admin";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      await login({ username, password });
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Credenciales incorrectas.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <div className="login-brand">
          <Scissors aria-hidden="true" size={32} />
          <h1>Bless Barber Shop</h1>
        </div>

        <label>
          <span>Correo</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Usuario"
            autoComplete="username"
            required
          />
        </label>

        <label>
          <span>Contraseña</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        {errorMessage ? <div className="form-error">{errorMessage}</div> : null}

        <button className="btn btn-dark login-submit" type="submit" disabled={submitting}>
          {submitting ? <Loader2 aria-hidden="true" size={18} /> : <LockKeyhole aria-hidden="true" size={18} />}
          <span>{submitting ? "Entrando" : "Iniciar sesión"}</span>
        </button>
      </form>
    </main>
  );
}
