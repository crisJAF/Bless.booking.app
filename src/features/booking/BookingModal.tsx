import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar, CheckCircle2, Clock, Loader2, X } from "lucide-react";
import { formatTime, timeToApiValue, toApiDate, todayInputValue } from "../../lib/date";
import {
  barberoEspecialidad,
  barberoId,
  barberoNombre,
  servicioId,
  servicioNombre
} from "../../lib/normalizers";
import { createBooking, getAvailableSchedules } from "../../services/bookingService";
import { getBarberos, getServicios } from "../../services/catalogService";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type BookingForm = {
  nombre: string;
  correo: string;
  telefono: string;
  barberoId: string;
  servicioId: string;
  fecha: string;
  hora: string;
};

const emptyForm = (): BookingForm => ({
  nombre: "",
  correo: "",
  telefono: "",
  barberoId: "",
  servicioId: "",
  fecha: todayInputValue(),
  hora: ""
});

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [form, setForm] = useState<BookingForm>(() => emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [successVisible, setSuccessVisible] = useState(false);

  const selectedBarberoId = Number(form.barberoId);
  const canLoadSchedules = isOpen && selectedBarberoId > 0 && Boolean(form.fecha);

  const barberosQuery = useQuery({
    queryKey: ["barberos"],
    queryFn: getBarberos,
    enabled: isOpen,
    staleTime: 1000 * 60 * 5
  });

  const serviciosQuery = useQuery({
    queryKey: ["servicios"],
    queryFn: getServicios,
    enabled: isOpen,
    staleTime: 1000 * 60 * 5
  });

  const schedulesQuery = useQuery({
    queryKey: ["horarios", selectedBarberoId, form.fecha],
    queryFn: () => getAvailableSchedules(selectedBarberoId, form.fecha),
    enabled: canLoadSchedules
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (saved) => {
      if (!saved) {
        setFormError("No se pudo registrar la cita. Intenta otra hora o revisa tus datos.");
        return;
      }

      setForm(emptyForm());
      setFormError(null);
      setSuccessVisible(true);
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : "No se pudo registrar la cita.");
    }
  });
  const { isPending, mutate, reset } = bookingMutation;

  const schedules = useMemo(
    () =>
      (schedulesQuery.data ?? [])
        .map((schedule) => formatTime(schedule.horaDesde ?? schedule.HoraDesde))
        .filter(Boolean),
    [schedulesQuery.data]
  );

  useEffect(() => {
    if (!successVisible) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setSuccessVisible(false);
      onClose();
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [successVisible, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormError(null);
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen && !successVisible) {
    return null;
  }

  const updateForm = (field: keyof BookingForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "barberoId" || field === "fecha" ? { hora: "" } : {})
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!form.nombre.trim() || !form.telefono.trim() || !form.barberoId || !form.servicioId || !form.hora) {
      setFormError("Completa los campos requeridos para reservar tu cita.");
      return;
    }

    mutate({
      Nombre: form.nombre.trim(),
      Correo: form.correo.trim(),
      Telefono: form.telefono.trim(),
      ServicioId: Number(form.servicioId),
      Fecha: toApiDate(form.fecha),
      Hora: timeToApiValue(form.hora),
      BarberoID: Number(form.barberoId)
    });
  };

  return (
    <>
      <div className="modal-backdrop-app" />
      <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <div className="booking-modal">
          <div className="modal-header-app">
            <div>
              <p className="eyebrow mb-1">Reserva en línea</p>
              <h2 id="booking-title">Agenda tu cita</h2>
            </div>
            <button className="icon-button" type="button" aria-label="Cerrar reserva" onClick={onClose}>
              <X aria-hidden="true" />
            </button>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Nombre completo</span>
                <input
                  required
                  value={form.nombre}
                  onChange={(event) => updateForm("nombre", event.target.value)}
                  placeholder="Tu nombre"
                />
              </label>

              <label>
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(event) => updateForm("correo", event.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </label>

              <label>
                <span>Teléfono</span>
                <input
                  required
                  value={form.telefono}
                  onChange={(event) => updateForm("telefono", event.target.value)}
                  placeholder="+505 0000 0000"
                />
              </label>

              <label>
                <span>Barbero</span>
                <select
                  required
                  value={form.barberoId}
                  onChange={(event) => updateForm("barberoId", event.target.value)}
                >
                  <option value="">Seleccione un barbero</option>
                  {(barberosQuery.data ?? []).map((barbero) => (
                    <option key={barberoId(barbero)} value={barberoId(barbero)}>
                      {barberoNombre(barbero)}
                      {barberoEspecialidad(barbero) ? ` - ${barberoEspecialidad(barbero)}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Servicio</span>
                <select
                  required
                  value={form.servicioId}
                  onChange={(event) => updateForm("servicioId", event.target.value)}
                >
                  <option value="">Seleccione un servicio</option>
                  {(serviciosQuery.data ?? []).map((servicio) => (
                    <option key={servicioId(servicio)} value={servicioId(servicio)}>
                      {servicioNombre(servicio)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Fecha</span>
                <input
                  required
                  type="date"
                  min={todayInputValue()}
                  value={form.fecha}
                  onChange={(event) => updateForm("fecha", event.target.value)}
                />
              </label>
            </div>

            <div className="schedule-panel">
              <div className="schedule-title">
                <Clock aria-hidden="true" size={18} />
                <span>Hora disponible</span>
              </div>

              {schedulesQuery.isFetching ? (
                <div className="inline-loading">
                  <Loader2 aria-hidden="true" size={18} />
                  <span>Cargando horarios</span>
                </div>
              ) : schedules.length > 0 ? (
                <div className="schedule-options">
                  {schedules.map((time) => (
                    <button
                      className={`schedule-option ${form.hora === time ? "is-selected" : ""}`}
                      key={time}
                      type="button"
                      onClick={() => updateForm("hora", time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="empty-copy mb-0">
                  {canLoadSchedules
                    ? "No hay horarios disponibles para esa fecha."
                    : "Selecciona barbero y fecha para ver horarios."}
                </p>
              )}
            </div>

            {formError ? <div className="form-error">{formError}</div> : null}

            <button className="btn btn-dark booking-submit" type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 aria-hidden="true" size={18} />
              ) : (
                <Calendar aria-hidden="true" size={18} />
              )}
              <span>{isPending ? "Reservando" : "Reservar cita"}</span>
            </button>
          </form>
        </div>

        {successVisible ? (
          <div className="success-modal" role="status">
            <CheckCircle2 aria-hidden="true" size={42} />
            <h3>Reserva exitosa</h3>
            <p>Tu cita ha sido registrada con éxito. Te esperamos.</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
