import { useCallback, useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  FileSearch,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReservationsTable } from "../features/admin/ReservationsTable";
import {
  reservaCliente,
  reservaEstado,
  reservaServicio,
  servicioNombre,
  servicioPrecio
} from "../lib/normalizers";
import { useSignalRNotifications } from "../hooks/useSignalRNotifications";
import { getCurrentUser, logout } from "../services/authService";
import { getReservations } from "../services/bookingService";
import { getBarberos, getServicios } from "../services/catalogService";
import { requestPermissionAndSubscribe, sendPushNotification } from "../services/pushNotifications";
import type { Reserva } from "../types/api";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
  const [showNotificationButton, setShowNotificationButton] = useState(true);
  const [activeSection, setActiveSection] = useState("panel-control");
  const [openGroups, setOpenGroups] = useState({
    servicios: true,
    paginas: false,
    citas: true,
    reportes: true
  });
  const currentUser = getCurrentUser();
  const today = dateByOffset(0);
  const yesterday = dateByOffset(-1);

  const handleRealtimeMessage = useCallback(() => {
    void sendPushNotification().catch(() => undefined);
  }, []);

  const { messages, status, error } = useSignalRNotifications({
    onMessage: handleRealtimeMessage
  });

  const barberosQuery = useQuery({
    queryKey: ["admin", "barberos"],
    queryFn: getBarberos,
    staleTime: 1000 * 60 * 5
  });

  const serviciosQuery = useQuery({
    queryKey: ["admin", "servicios"],
    queryFn: getServicios,
    staleTime: 1000 * 60 * 5
  });

  const [reservasHoyQuery, reservasAyerQuery, reservasSemanaQuery] = useQueries({
    queries: [
      {
        queryKey: ["admin", "reservas", today],
        queryFn: () => getReservations(today),
        staleTime: 1000 * 30
      },
      {
        queryKey: ["admin", "reservas", yesterday],
        queryFn: () => getReservations(yesterday),
        staleTime: 1000 * 30
      },
      {
        queryKey: ["admin", "reservas", "7dias", today],
        queryFn: () => getReservationsWindow(7),
        staleTime: 1000 * 30
      }
    ]
  });

  const reservasHoy = reservasHoyQuery.data ?? [];
  const reservasAyer = reservasAyerQuery.data ?? [];
  const reservasSemana = reservasSemanaQuery.data ?? [];
  const servicios = serviciosQuery.data ?? [];
  const barberos = barberosQuery.data ?? [];

  const preciosPorServicio = useMemo(() => {
    const map = new Map<string, number>();

    servicios.forEach((servicio) => {
      map.set(servicioNombre(servicio).trim().toLowerCase(), servicioPrecio(servicio));
    });

    return map;
  }, [servicios]);

  const ventasHoy = useMemo(
    () => calcularVentas(reservasHoy, preciosPorServicio),
    [preciosPorServicio, reservasHoy]
  );
  const ventasAyer = useMemo(
    () => calcularVentas(reservasAyer, preciosPorServicio),
    [preciosPorServicio, reservasAyer]
  );
  const ventasUltimosSieteDias = useMemo(
    () => calcularVentas(reservasSemana, preciosPorServicio),
    [preciosPorServicio, reservasSemana]
  );

  const resumen = useMemo(() => {
    const accepted = reservasHoy.filter((reserva) => esEstadoAceptado(reservaEstado(reserva))).length;
    const rejected = reservasHoy.filter((reserva) => esEstadoRechazado(reservaEstado(reserva))).length;
    const clientes = new Set(
      reservasSemana
        .map((reserva) => reservaCliente(reserva).trim())
        .filter((nombre) => nombre.length > 0)
    );

    return {
      totalClientes: clientes.size,
      totalCitas: reservasHoy.length,
      totalCitasAceptadas: accepted,
      totalCitasRechazadas: rejected,
      totalServicios: servicios.length,
      totalBarberos: barberos.length,
      ventasHoy,
      ventasAyer,
      ventasUltimosSieteDias,
      ventasTotales: ventasHoy + ventasAyer + ventasUltimosSieteDias
    };
  }, [
    barberos.length,
    reservasHoy,
    reservasSemana,
    servicios.length,
    ventasAyer,
    ventasHoy,
    ventasUltimosSieteDias
  ]);

  const topServicios = useMemo(() => agruparPorServicio(reservasSemana), [reservasSemana]);
  const clientesRecientes = useMemo(() => agruparClientes(reservasSemana), [reservasSemana]);
  const cargandoKpis =
    reservasHoyQuery.isLoading ||
    reservasAyerQuery.isLoading ||
    reservasSemanaQuery.isLoading ||
    serviciosQuery.isLoading ||
    barberosQuery.isLoading;

  const toggleGroup = (key: "servicios" | "paginas" | "citas" | "reportes") => {
    setOpenGroups((state) => ({
      ...state,
      [key]: !state[key]
    }));
  };

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
    <main className="admin-page py-3 py-lg-4">
      <div className="container-fluid px-3 px-lg-4">
        <div className="row g-3 g-xl-4">
          <aside className="col-12 col-xl-3">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-dark text-white py-3">
                <h2 className="h6 mb-1">Panel Administrativo</h2>
                <p className="mb-0 small text-white-50">{currentUser?.name ?? "Administrador"}</p>
              </div>

              <div className="list-group list-group-flush">
                <button
                  type="button"
                  className={sideItemClass(activeSection === "panel-control")}
                  onClick={() => setActiveSection("panel-control")}
                >
                  <LayoutDashboard size={16} aria-hidden="true" />
                  <span>Panel de Control</span>
                </button>

                <div className="list-group-item p-0">
                  <button
                    type="button"
                    className="btn btn-light w-100 rounded-0 border-0 d-flex justify-content-between align-items-center px-3 py-2"
                    onClick={() => toggleGroup("servicios")}
                  >
                    <span className="d-inline-flex align-items-center gap-2">
                      <Settings size={16} aria-hidden="true" />
                      Servicios
                    </span>
                    <ChevronDown size={14} aria-hidden="true" className={openGroups.servicios ? "rotate-180" : ""} />
                  </button>
                  {openGroups.servicios ? (
                    <div className="list-group list-group-flush">
                      <button
                        type="button"
                        className={sideSubItemClass(activeSection === "servicios")}
                        onClick={() => setActiveSection("servicios")}
                      >
                        Agregar Servicio
                      </button>
                      <button
                        type="button"
                        className={sideSubItemClass(activeSection === "servicios")}
                        onClick={() => setActiveSection("servicios")}
                      >
                        Administrar Servicio
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="list-group-item p-0">
                  <button
                    type="button"
                    className="btn btn-light w-100 rounded-0 border-0 d-flex justify-content-between align-items-center px-3 py-2"
                    onClick={() => toggleGroup("paginas")}
                  >
                    <span className="d-inline-flex align-items-center gap-2">
                      <FileText size={16} aria-hidden="true" />
                      Paginas
                    </span>
                    <ChevronDown size={14} aria-hidden="true" className={openGroups.paginas ? "rotate-180" : ""} />
                  </button>
                  {openGroups.paginas ? (
                    <div className="list-group list-group-flush">
                      <button type="button" className="list-group-item list-group-item-action disabled ps-5">
                        Acerca de
                      </button>
                      <button type="button" className="list-group-item list-group-item-action disabled ps-5">
                        Contacto
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="list-group-item p-0">
                  <button
                    type="button"
                    className="btn btn-light w-100 rounded-0 border-0 d-flex justify-content-between align-items-center px-3 py-2"
                    onClick={() => toggleGroup("citas")}
                  >
                    <span className="d-inline-flex align-items-center gap-2">
                      <CalendarCheck size={16} aria-hidden="true" />
                      Citas
                    </span>
                    <ChevronDown size={14} aria-hidden="true" className={openGroups.citas ? "rotate-180" : ""} />
                  </button>
                  {openGroups.citas ? (
                    <div className="list-group list-group-flush">
                      <button
                        type="button"
                        className={sideSubItemClass(activeSection === "citas")}
                        onClick={() => setActiveSection("citas")}
                      >
                        Todas las Citas
                      </button>
                      <button type="button" className="list-group-item list-group-item-action disabled ps-5">
                        Citas Aceptadas
                      </button>
                      <button type="button" className="list-group-item list-group-item-action disabled ps-5">
                        Citas Rechazadas
                      </button>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  className={sideItemClass(activeSection === "clientes")}
                  onClick={() => setActiveSection("clientes")}
                >
                  <Users size={16} aria-hidden="true" />
                  <span>Lista de Clientes</span>
                </button>

                <div className="list-group-item p-0">
                  <button
                    type="button"
                    className="btn btn-light w-100 rounded-0 border-0 d-flex justify-content-between align-items-center px-3 py-2"
                    onClick={() => toggleGroup("reportes")}
                  >
                    <span className="d-inline-flex align-items-center gap-2">
                      <CircleDollarSign size={16} aria-hidden="true" />
                      Reportes
                    </span>
                    <ChevronDown size={14} aria-hidden="true" className={openGroups.reportes ? "rotate-180" : ""} />
                  </button>
                  {openGroups.reportes ? (
                    <div className="list-group list-group-flush">
                      <button
                        type="button"
                        className={sideSubItemClass(activeSection === "reportes")}
                        onClick={() => setActiveSection("reportes")}
                      >
                        Facturas por Fecha
                      </button>
                      <button
                        type="button"
                        className={sideSubItemClass(activeSection === "reportes")}
                        onClick={() => setActiveSection("reportes")}
                      >
                        Reporte de Ventas
                      </button>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  className={sideItemClass(activeSection === "busqueda")}
                  onClick={() => setActiveSection("busqueda")}
                >
                  <Search size={16} aria-hidden="true" />
                  <span>Buscar Citas</span>
                </button>
              </div>

              <div className="card-footer bg-white">
                <button className="btn btn-danger w-100" type="button" onClick={handleLogout}>
                  <LogOut aria-hidden="true" size={18} />
                  <span>Salir</span>
                </button>
              </div>
            </div>
          </aside>

          <section className="col-12 col-xl-9">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                <div>
                  <p className="text-uppercase small fw-bold text-muted mb-1">Panel de control</p>
                  <h1 className="h3 mb-1">Dashboard del Administrador</h1>
                  <p className="mb-0 text-muted">
                    Bienvenido{currentUser?.name ? `, ${currentUser.name}` : ""}. Estado SignalR: {status}.
                  </p>
                  {error ? <p className="text-danger mb-0 mt-1 small">{error}</p> : null}
                </div>

                <button className="btn btn-dark position-relative rounded-circle p-0 admin-notification-btn" type="button">
                  <Bell size={20} aria-hidden="true" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {messages.length}
                  </span>
                </button>
              </div>
            </div>

            {showNotificationButton ? (
              <div className="mb-2">
                <button className="btn btn-success" type="button" onClick={enableNotifications}>
                  <Bell aria-hidden="true" size={18} />
                  <span>Activar notificaciones</span>
                </button>
              </div>
            ) : null}

            {permissionMessage ? (
              <div className="alert alert-success py-2 d-inline-flex align-items-center gap-2" role="status">
                <ShieldCheck aria-hidden="true" size={18} />
                <span>{permissionMessage}</span>
              </div>
            ) : null}

            <section className="card shadow-sm border-0 mb-3" id="panel-control">
              <div className="card-header bg-white py-3">
                <h2 className="h5 mb-0 text-uppercase text-muted">Panel de Control</h2>
              </div>
              <div className="card-body">
                {cargandoKpis ? <p className="text-muted mb-3">Cargando indicadores...</p> : null}
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard title="Total" label="Clientes" value={resumen.totalClientes} tone="primary" />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard title="Total" label="Citas" value={resumen.totalCitas} tone="secondary" />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard
                      title="Total"
                      label="Citas Aceptadas"
                      value={resumen.totalCitasAceptadas}
                      tone="success"
                    />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard
                      title="Total"
                      label="Citas Rechazadas"
                      value={resumen.totalCitasRechazadas}
                      tone="danger"
                    />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard title="Total" label="Servicios" value={resumen.totalServicios} tone="dark" />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard title="Total" label="Barberos" value={resumen.totalBarberos} tone="info" />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard title="Hoy" label="Ventas" value={moneyValue(resumen.ventasHoy)} tone="warning" />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard
                      title="Ultimos 7 dias"
                      label="Ventas"
                      value={moneyValue(resumen.ventasUltimosSieteDias)}
                      tone="primary"
                    />
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                    <KpiCard title="Total" label="Ventas" value={moneyValue(resumen.ventasTotales)} tone="success" />
                  </div>
                </div>
              </div>
            </section>

            <section className="card shadow-sm border-0 mb-3" id="citas">
              <div className="card-header bg-white py-3">
                <h2 className="h5 mb-0 text-uppercase text-muted">Todas las Citas</h2>
              </div>
              <div className="card-body">
                <ReservationsTable />
              </div>
            </section>

            <div className="row g-3 mb-3">
              <section className="col-12 col-lg-6">
                <div className="card h-100 shadow-sm border-0" id="servicios">
                  <div className="card-header bg-white py-3">
                    <h2 className="h6 mb-0 text-uppercase text-muted">Servicios</h2>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Servicio</th>
                          <th>Costo</th>
                          <th>Uso (7 dias)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topServicios.length > 0 ? (
                          topServicios.map((item) => (
                            <tr key={item.nombre}>
                              <td>{item.nombre}</td>
                              <td>{moneyValue(preciosPorServicio.get(item.nombre.toLowerCase()) ?? 0)}</td>
                              <td>{item.cantidad}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-muted">
                              Sin actividad de servicios en los ultimos 7 dias.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="col-12 col-lg-6">
                <div className="card h-100 shadow-sm border-0" id="clientes">
                  <div className="card-header bg-white py-3">
                    <h2 className="h6 mb-0 text-uppercase text-muted">Lista de Clientes (Recientes)</h2>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Cliente</th>
                          <th>Total Citas</th>
                          <th>Ultimo Servicio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientesRecientes.length > 0 ? (
                          clientesRecientes.map((cliente) => (
                            <tr key={cliente.nombre}>
                              <td>{cliente.nombre}</td>
                              <td>{cliente.citas}</td>
                              <td>{cliente.ultimoServicio}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-muted">
                              Sin clientes registrados en los ultimos 7 dias.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

            <div className="row g-3">
              <section className="col-12 col-lg-6">
                <div className="card h-100 shadow-sm border-0" id="reportes">
                  <div className="card-header bg-white py-3">
                    <h2 className="h6 mb-0 text-uppercase text-muted">Reportes</h2>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      <li className="list-group-item d-flex gap-2">
                        <ClipboardList size={18} aria-hidden="true" className="mt-1 text-muted" />
                        <div>
                          <strong>Facturas por Fecha</strong>
                          <p className="mb-0 text-muted small">
                            Disponible para implementacion con endpoint de facturacion.
                          </p>
                        </div>
                      </li>
                      <li className="list-group-item d-flex gap-2">
                        <CircleDollarSign size={18} aria-hidden="true" className="mt-1 text-muted" />
                        <div>
                          <strong>Reporte de Ventas</strong>
                          <p className="mb-0 text-muted small">
                            Hoy: <b>{moneyValue(resumen.ventasHoy)}</b> | Ayer: <b>{moneyValue(resumen.ventasAyer)}</b> |
                            7 dias: <b>{moneyValue(resumen.ventasUltimosSieteDias)}</b>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="col-12 col-lg-6">
                <div className="card h-100 shadow-sm border-0" id="busqueda">
                  <div className="card-header bg-white py-3">
                    <h2 className="h6 mb-0 text-uppercase text-muted">Buscar Citas</h2>
                  </div>
                  <div className="card-body">
                    <div className="alert alert-info mb-0 d-flex gap-2 align-items-start">
                      <FileSearch size={18} aria-hidden="true" className="mt-1" />
                      <p className="mb-0">
                        Usa la tabla de <b>Todas las Citas</b> para filtrar por fecha y barbero. El siguiente paso es
                        agregar busqueda por numero de cita y telefono.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type KpiTone = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark";

type KpiCardProps = {
  title: string;
  label: string;
  value: number | string;
  tone: KpiTone;
};

function KpiCard({ title, label, value, tone }: KpiCardProps) {
  return (
    <article className={`card text-bg-${tone} h-100 shadow-sm border-0`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="small text-uppercase mb-1 opacity-75">{title}</p>
          <h3 className="h6 mb-0">{label}</h3>
        </div>
        <strong className="fs-5">{value}</strong>
      </div>
    </article>
  );
}

function sideItemClass(isActive: boolean) {
  const classes = ["list-group-item", "list-group-item-action", "d-flex", "align-items-center", "gap-2"];

  if (isActive) {
    classes.push("active");
  }

  return classes.join(" ");
}

function sideSubItemClass(isActive: boolean) {
  const classes = ["list-group-item", "list-group-item-action", "ps-5", "small"];

  if (isActive) {
    classes.push("active");
  }

  return classes.join(" ");
}

function agruparPorServicio(reservas: Reserva[]) {
  const map = new Map<string, number>();

  reservas.forEach((reserva) => {
    const nombre = reservaServicio(reserva).trim();
    if (!nombre) {
      return;
    }

    map.set(nombre, (map.get(nombre) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 6);
}

function agruparClientes(reservas: Reserva[]) {
  const map = new Map<string, { citas: number; ultimoServicio: string }>();

  reservas.forEach((reserva) => {
    const nombre = reservaCliente(reserva).trim();
    if (!nombre) {
      return;
    }

    const servicio = reservaServicio(reserva).trim() || "Sin servicio";
    const current = map.get(nombre);

    if (!current) {
      map.set(nombre, { citas: 1, ultimoServicio: servicio });
      return;
    }

    map.set(nombre, {
      citas: current.citas + 1,
      ultimoServicio: servicio
    });
  });

  return Array.from(map.entries())
    .map(([nombre, data]) => ({
      nombre,
      citas: data.citas,
      ultimoServicio: data.ultimoServicio
    }))
    .sort((a, b) => b.citas - a.citas)
    .slice(0, 8);
}

function calcularVentas(reservas: Reserva[], precios: Map<string, number>) {
  return reservas.reduce((total, reserva) => {
    if (esEstadoRechazado(reservaEstado(reserva))) {
      return total;
    }

    const servicio = reservaServicio(reserva).trim().toLowerCase();
    return total + (precios.get(servicio) ?? 0);
  }, 0);
}

function esEstadoAceptado(estado: string) {
  const value = estado.trim().toLowerCase();
  return value.includes("acept") || value.includes("confirm") || value.includes("atendid");
}

function esEstadoRechazado(estado: string) {
  const value = estado.trim().toLowerCase();
  return value.includes("rechaz") || value.includes("cancel");
}

function moneyValue(value: number) {
  return new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

async function getReservationsWindow(days: number) {
  const dates = Array.from({ length: days }, (_, index) => dateByOffset(-index));
  const batches = await Promise.all(dates.map((date) => getReservations(date)));
  return batches.flat();
}

function dateByOffset(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )}`;
}
