import type { Review } from "../types/api";
import { apiFetch } from "./http";

export async function getReviews() {
  const payload = await apiFetch<Review[] | { message?: string; Message?: string }>("/api/GooglePlaces/reviews");
  return Array.isArray(payload) ? payload : [];
}
