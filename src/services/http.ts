import { buildApiUrl } from "../lib/env";
import type { ApiResponse } from "../types/api";
import { getAuthToken } from "./tokenStorage";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAuthToken();

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : undefined;

  if (!response.ok) {
    const message = getResponseMessage(payload) ?? `Error HTTP ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export function unwrapContent<T>(payload: ApiResponse<T> | T): T {
  if (payload && typeof payload === "object") {
    const response = payload as ApiResponse<T>;

    if ("content" in response) {
      return response.content as T;
    }

    if ("Content" in response) {
      return response.Content as T;
    }
  }

  return payload as T;
}

export function unwrapSuccess(payload: ApiResponse<unknown> | boolean) {
  if (typeof payload === "boolean") {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return false;
  }

  return Boolean(
    payload.isSuccess ?? payload.IsSuccess ?? payload.success ?? payload.Success ?? false
  );
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getResponseMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const candidate = payload as ApiResponse<unknown>;
  return candidate.message ?? candidate.Message;
}
