import type { LoginResponse } from "../types/api";
import { apiFetch } from "./http";
import { clearAuthToken, getAuthToken, setAuthToken } from "./tokenStorage";

type LoginCredentials = {
  username: string;
  password: string;
};

type JwtPayload = {
  name?: string;
  role?: string;
  unique_name?: string;
  exp?: number;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
};

export async function login({ username, password }: LoginCredentials) {
  const payload = await apiFetch<LoginResponse>("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify({
      nombreUsuario: username,
      contrasena: password
    })
  });

  const token = payload.token ?? payload.Token;

  if (!token) {
    throw new Error("Credenciales incorrectas.");
  }

  setAuthToken(token);
  return getCurrentUser();
}

export function logout() {
  clearAuthToken();
}

export function getCurrentUser() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  const payload = decodeJwt(token);

  if (!payload) {
    return null;
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    clearAuthToken();
    return null;
  }

  return {
    name:
      payload.name ??
      payload.unique_name ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
      "Administrador",
    role:
      payload.role ??
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      "Admin"
  };
}

function decodeJwt(token: string): JwtPayload | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}
