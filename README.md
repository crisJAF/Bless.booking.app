# Bless Booking React

Frontend React para Bless Barber Shop. Este repo queda como aplicacion frontend independiente y consume el backend .NET existente por HTTP y SignalR.

## Stack

- React + Vite + TypeScript
- React Router para rutas
- TanStack Query para datos de API
- SignalR con `@microsoft/signalr`
- Assets publicos propios en `public`

## Configuracion

Copia `.env.example` a `.env` y ajusta la URL del backend que levantes desde Visual Studio.

```bash
VITE_API_BASE_URL=https://localhost:7228
VITE_SIGNALR_NOTIFICATIONS_PATH=/hub/notificaciones
VITE_VAPID_PUBLIC_KEY=tu_clave_publica_vapid
```

## Ejecutar

```bash
npm install
npm run dev
```

La app queda normalmente en `http://localhost:5173`.

## Rutas migradas

- `/`: pagina publica, servicios, testimonios y modal de reserva.
- `/login`: login administrativo.
- `/logout`: cierre de sesion administrativo.
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

Como React corre en otro origen durante desarrollo (`localhost:5173`), el backend .NET debe permitir CORS para el origen del frontend. Para produccion puedes servir el `dist` de React como archivos estaticos desde .NET o desplegarlo aparte.
