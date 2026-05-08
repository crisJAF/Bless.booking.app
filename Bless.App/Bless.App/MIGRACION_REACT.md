# Migración de Blazor a React

Se agregó `Bless.React` como frontend nuevo y separado del proyecto Blazor actual. La idea es que puedas validar React sin romper la app existente.

## Qué se migró

- Home pública con hero, nosotros, contacto, horarios, testimonios y servicios.
- Modal de agenda de cita.
- Consumo de barberos, servicios, horarios disponibles y creación de reserva.
- Login administrativo usando `api/Auth/login`.
- Logout administrativo compatible con `/logout`.
- Panel de reservas con filtro por fecha y barbero.
- SignalR para `hub/notificaciones` usando `@microsoft/signalr`.
- Suscripción a push notifications usando el service worker existente.
- Assets de `wwwroot/img`, `favicon.png`, `service-worker.js` y Bootstrap CSS local.

## Carpeta nueva

```txt
Bless.React/
  public/
  src/
    components/
    features/
    hooks/
    lib/
    pages/
    services/
    styles/
    types/
```

## Siguiente ajuste recomendado en .NET

Agrega CORS en el backend API para permitir el frontend React en desarrollo:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

app.UseCors("ReactDev");
```

Si decides usar token JWT desde React para proteger endpoints administrativos, asegúrate de que el backend acepte `Authorization: Bearer <token>` en esos endpoints.
