import type { Barbero, Reserva, Review, Servicio } from "../types/api";

export function barberoId(barbero: Barbero) {
  return barbero.barberoId ?? barbero.BarberoId ?? 0;
}

export function barberoNombre(barbero: Barbero) {
  return barbero.nombre ?? barbero.Nombre ?? "Sin nombre";
}

export function barberoEspecialidad(barbero: Barbero) {
  return barbero.especialidad ?? barbero.Especialidad ?? "";
}

export function servicioId(servicio: Servicio) {
  return servicio.servicioId ?? servicio.ServicioId ?? 0;
}

export function servicioNombre(servicio: Servicio) {
  return servicio.nombre ?? servicio.Nombre ?? "Servicio";
}

export function servicioDescripcion(servicio: Servicio) {
  return servicio.descripcion ?? servicio.Descripcion ?? "";
}

export function reservaId(reserva: Reserva) {
  return reserva.reservaId ?? reserva.ReservaId ?? 0;
}

export function reservaCliente(reserva: Reserva) {
  return reserva.nombreCliente ?? reserva.NombreCliente ?? "Cliente";
}

export function reservaBarbero(reserva: Reserva) {
  return reserva.nombreBarbero ?? reserva.NombreBarbero ?? "Barbero";
}

export function reservaServicio(reserva: Reserva) {
  return reserva.nombreServicio ?? reserva.NombreServicio ?? "Servicio";
}

export function reservaFecha(reserva: Reserva) {
  return reserva.fecha ?? reserva.Fecha ?? "";
}

export function reservaHora(reserva: Reserva) {
  return reserva.hora ?? reserva.Hora ?? "";
}

export function reservaEstado(reserva: Reserva) {
  return reserva.estado ?? reserva.Estado ?? "Pendiente";
}

export function reviewAuthor(review: Review) {
  return review.author_name ?? "Cliente";
}

export function reviewText(review: Review) {
  return review.text ?? review.Text ?? "";
}

export function reviewTime(review: Review) {
  return review.time ?? review.Time ?? null;
}
