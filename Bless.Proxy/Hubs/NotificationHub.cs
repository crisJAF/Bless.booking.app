using Microsoft.AspNetCore.SignalR;

namespace Bless.Proxy.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task EnviarNotificacion(string mensaje)
        {
            await Clients.All.SendAsync("RecibirNotificacion", mensaje);
        }
    }
}
