import { VAPID_PUBLIC_KEY } from "../lib/env";
import { apiFetch } from "./http";

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register("/service-worker.js");
}

export async function requestPermissionAndSubscribe() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("Este navegador no soporta notificaciones push.");
  }

  const registration = await registerServiceWorker();
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Permiso de notificación denegado.");
  }

  const serviceWorkerRegistration = registration ?? (await navigator.serviceWorker.ready);
  const subscription =
    (await serviceWorkerRegistration.pushManager.getSubscription()) ??
    (await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    }));

  const raw = subscription.toJSON();

  await apiFetch("/api/push/subscribe", {
    method: "POST",
    body: JSON.stringify({
      endpoint: raw.endpoint,
      p256dh: raw.keys?.p256dh,
      auth: raw.keys?.auth
    })
  });
}

export async function sendPushNotification() {
  await apiFetch("/api/push/send", {
    method: "POST"
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}
