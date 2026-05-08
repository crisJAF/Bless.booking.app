import type { Review } from "../types/api";
import { apiFetch } from "./http";

export async function getReviews() {
  return apiFetch<Review[]>("/api/GooglePlaces/reviews");
}
