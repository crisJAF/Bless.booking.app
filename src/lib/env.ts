const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

const azureApiBaseUrl =
  "https://bless-booking-api-cris-gubjazgucqh0f7bk.westus3-01.azurewebsites.net";

export const API_BASE_URL = configuredApiBaseUrl || azureApiBaseUrl;

export const SIGNALR_NOTIFICATIONS_PATH =
  import.meta.env.VITE_SIGNALR_NOTIFICATIONS_PATH ?? "/hub/notificaciones";

export const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ??
  "BMb5-bS79iIDKxcJ8cz7ievxQhItjl_VnO2yK7dUJxP0spvW4gvfiSEGqZ2cNqlX2CbSbPjIIN7jBWWM2f4YnnQ";

export function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
