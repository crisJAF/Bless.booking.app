import type { ApiResponse, Barbero, Servicio } from "../types/api";
import { apiFetch, unwrapContent } from "./http";

export async function getBarberos() {
  const payload = await apiFetch<ApiResponse<Barbero[]> | Barbero[]>("/api/Barbero/listar");
  return unwrapContent(payload) ?? [];
}

export async function getServicios() {
  const payload = await apiFetch<ApiResponse<Servicio[]> | Servicio[]>("/api/Servicio/listar");
  return unwrapContent(payload) ?? [];
}
