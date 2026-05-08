import type { ApiResponse, CitaRequest, HorarioDisponible, Reserva } from "../types/api";
import { apiFetch, unwrapContent, unwrapSuccess } from "./http";

export async function getAvailableSchedules(barberoId: number, fecha: string) {
  const search = new URLSearchParams({
    barberoId: String(barberoId),
    fecha
  });

  const payload = await apiFetch<ApiResponse<HorarioDisponible[]> | HorarioDisponible[]>(
    `/api/Reservas/horarios?${search.toString()}`
  );

  return unwrapContent(payload) ?? [];
}

export async function createBooking(cita: CitaRequest) {
  const payload = await apiFetch<ApiResponse<boolean> | boolean>("/api/Reservas/guardar", {
    method: "POST",
    body: JSON.stringify(cita)
  });

  return unwrapSuccess(payload);
}

export async function getReservations(fecha: string, barberoId?: string) {
  const search = new URLSearchParams({ fecha });

  if (barberoId) {
    search.set("barberoId", barberoId);
  }

  const payload = await apiFetch<ApiResponse<Reserva[]> | Reserva[]>(
    `/api/Reservas/listar?${search.toString()}`
  );

  return unwrapContent(payload) ?? [];
}
