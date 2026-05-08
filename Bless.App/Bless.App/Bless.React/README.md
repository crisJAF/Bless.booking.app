# Bless.React

Frontend React para Bless Barber Shop. Este proyecto reemplaza la UI Blazor, pero sigue consumiendo el backend .NET existente.

## Stack

- React + Vite + TypeScript
- React Router para rutas
- TanStack Query para datos de API
- SignalR con `@microsoft/signalr`
- Assets públicos reutilizados desde `../Bless.App/wwwroot`

## Configuración

Copia `.env.example` a `.env` si necesitas cambiar la URL del backend.

```bash
VITE_API_BASE_URL=https://localhost:7289
VITE_SIGNALR_NOTIFICATIONS_PATH=/hub/notificaciones
```

## Ejecutar

```bash
npm install
npm run dev
```

La app quedará normalmente en `http://localhost:5173`.

Vite sirve las imágenes, Bootstrap, favicon y service worker desde `../Bless.App/wwwroot`,
así no se duplican los assets binarios del proyecto Blazor.

## Rutas migradas

- `/`: página pública, servicios, testimonios y modal de reserva.
- `/login`: login administrativo.
- `/logout`: cierre de sesión administrativo.
- `/login/admin`: panel administrativo protegido por token.
- `/admin/reservas`: alias al panel de reservas.

## Contratos usados del backend

- `GET /api/GooglePlaces/reviews`
- `GET /api/Barbero/listar`
- `GET /api/Servicio/listar`
- `GET /api/Reservas/horarios?barberoId={id}&fecha={yyyy-MM-dd}`
- `POST /api/Reservas/guardar`
- `GET /api/Reservas/listar?fecha={yyyy-MM-dd}&barberoId={id?}`
- `POST /api/Auth/login`
- `POST /api/push/subscribe`
- `POST /api/push/send`
- SignalR: `/hub/notificaciones`, evento `RecibirNotificacion`

## Nota de backend

Como React corre en otro origen durante desarrollo (`localhost:5173`) y el backend en `localhost:7289`, el backend .NET debe permitir CORS para el origen del frontend. Para producción puedes servir el `dist` de React como archivos estáticos desde .NET o desplegarlo aparte.
