import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Loader2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { formatLongDate, formatTime, todayInputValue } from "../../lib/date";
import {
  barberoId,
  barberoNombre,
  reservaBarbero,
  reservaCliente,
  reservaEstado,
  reservaHora,
  reservaId,
  reservaServicio
} from "../../lib/normalizers";
import { getReservations } from "../../services/bookingService";
import { getBarberos } from "../../services/catalogService";

export function ReservationsTable() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(todayInputValue());
  const [selectedBarberoId, setSelectedBarberoId] = useState("");

  const barberosQuery = useQuery({
    queryKey: ["barberos"],
    queryFn: getBarberos,
    staleTime: 1000 * 60 * 5
  });

  const reservasQuery = useQuery({
    queryKey: ["reservas", fechaSeleccionada, selectedBarberoId],
    queryFn: () => getReservations(fechaSeleccionada, selectedBarberoId)
  });

  const reservas = reservasQuery.data ?? [];

  return (
    <section className="reservas-wrapper">
      <div className="reservas-toolbar">
        <div className="toolbar-date">
          <CalendarDays aria-hidden="true" size={20} />
          <span>Reservas para el</span>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(event) => setFechaSeleccionada(event.target.value)}
          />
        </div>

        <select
          value={selectedBarberoId}
          onChange={(event) => setSelectedBarberoId(event.target.value)}
          aria-label="Filtrar por barbero"
        >
          <option value="">Todos los barberos</option>
          {(barberosQuery.data ?? []).map((barbero) => (
            <option key={barberoId(barbero)} value={barberoId(barbero)}>
              {barberoNombre(barbero)}
            </option>
          ))}
        </select>
      </div>

      {reservasQuery.isFetching ? (
        <div className="admin-loading">
          <Loader2 aria-hidden="true" size={20} />
          <span>Cargando reservas</span>
        </div>
      ) : reservas.length > 0 ? (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table table-borderless align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Barbero</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th className="text-end">Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva, index) => (
                  <tr key={reservaId(reserva) || index}>
                    <td className="text-muted">#{index + 1}</td>
                    <td>{reservaCliente(reserva)}</td>
                    <td>{reservaServicio(reserva)}</td>
                    <td>{reservaBarbero(reserva)}</td>
                    <td>{formatTime(reservaHora(reserva))}</td>
                    <td>
                      <span className={`status-badge ${estadoClass(reservaEstado(reserva))}`}>
                        {reservaEstado(reserva)}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="icon-button icon-button-light" type="button" aria-label="Más acciones">
                        <MoreVertical aria-hidden="true" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="reservas-mobile d-md-none">
            {reservas.map((reserva, index) => (
              <article className="reserva-card" key={reservaId(reserva) || index}>
                <div className="reserva-card-head">
                  <span className="text-muted">#{index + 1}</span>
                  <button className="icon-button icon-button-light" type="button" aria-label="Más acciones">
                    <MoreVertical aria-hidden="true" size={18} />
                  </button>
                </div>
                <strong>{reservaCliente(reserva)}</strong>
                <dl>
                  <div>
                    <dt>Servicio</dt>
                    <dd>{reservaServicio(reserva)}</dd>
                  </div>
                  <div>
                    <dt>Barbero</dt>
                    <dd>{reservaBarbero(reserva)}</dd>
                  </div>
                  <div>
                    <dt>Hora</dt>
                    <dd>{formatTime(reservaHora(reserva))}</dd>
                  </div>
                </dl>
                <span className={`status-badge ${estadoClass(reservaEstado(reserva))}`}>
                  {reservaEstado(reserva)}
                </span>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          No hay reservas registradas para {formatLongDate(fechaSeleccionada)}.
        </div>
      )}
    </section>
  );
}

function estadoClass(estado?: string) {
  switch (estado?.toLowerCase()) {
    case "pendiente":
      return "status-warning";
    case "confirmada":
      return "status-success";
    case "cancelada":
      return "status-danger";
    default:
      return "status-neutral";
  }
}
