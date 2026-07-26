import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>Página no encontrada</h1>
      <p>La ruta solicitada no existe en el nuevo frontend React.</p>
      <Link className="btn btn-dark" to="/">
        Volver al inicio
      </Link>
    </main>
  );
}
