using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;

namespace Bless.Proxy
{
    public class BookingHub 
    {
        private HubConnection _hubConnection;
        public event Func<string, Task>? OnNotificacionRecibida;

        public async Task ConectarAsync()
        {
            _hubConnection = new HubConnectionBuilder()
                .WithUrl("https://localhost:7155/hub/notificaciones")
                .WithAutomaticReconnect()
                .ConfigureLogging(logging =>
                {
                    logging.SetMinimumLevel(LogLevel.Debug);
                })
                .Build();

            _hubConnection.On<string>("RecibirNotificacion", async (mensaje) =>
            {
                Console.WriteLine($"Mensaje recibido: {mensaje}");

                if (OnNotificacionRecibida != null)
                    await OnNotificacionRecibida.Invoke(mensaje);
            });

            _hubConnection.Closed += async (error) =>
            {
                Console.WriteLine($"Conexión cerrada con error: {error?.Message}");
                await Task.Delay(3000);
                await _hubConnection.StartAsync();
            };

            try
            {
                await _hubConnection.StartAsync();
                Console.WriteLine("Conectado al Hub SignalR");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al conectar al Hub: {ex.Message}");
            }
        }


    }
}
