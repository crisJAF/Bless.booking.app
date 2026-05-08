import { useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_BASE_URL, SIGNALR_NOTIFICATIONS_PATH } from "../lib/env";
import { getAuthToken } from "../services/tokenStorage";

type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected";

type Options = {
  enabled?: boolean;
  onMessage?: (message: string) => void;
};

export function useSignalRNotifications({ enabled = true, onMessage }: Options = {}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const hubUrl = useMemo(() => {
    const path = SIGNALR_NOTIFICATIONS_PATH.startsWith("/")
      ? SIGNALR_NOTIFICATIONS_PATH
      : `/${SIGNALR_NOTIFICATIONS_PATH}`;

    return `${API_BASE_URL}${path}`;
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let disposed = false;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getAuthToken() ?? ""
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("RecibirNotificacion", (message: string) => {
      setMessages((current) => [`${message} ${current.length + 1}`, ...current]);
      onMessage?.(message);
    });

    connection.onreconnecting(() => {
      if (!disposed) {
        setStatus("reconnecting");
      }
    });

    connection.onreconnected(() => {
      if (!disposed) {
        setStatus("connected");
      }
    });

    connection.onclose(() => {
      if (!disposed) {
        setStatus("disconnected");
      }
    });

    async function start() {
      try {
        setStatus("connecting");
        await connection.start();
        if (!disposed) {
          setStatus("connected");
        }
      } catch (startError) {
        if (!disposed) {
          setStatus("disconnected");
          setError(startError instanceof Error ? startError.message : "No se pudo conectar al hub.");
        }
      }
    }

    void start();

    return () => {
      disposed = true;
      void connection.stop();
    };
  }, [enabled, hubUrl, onMessage]);

  return {
    messages,
    status,
    error
  };
}
