using Microsoft.AspNetCore.Components;

namespace Bless.App.Components.Admin.Pages
{
    public partial class ReservasComponent : ComponentBase
    {
        private List<Reserva> todasLasReservas = new();
        private DateTime fechaSeleccionada = DateTime.Today;

        private List<Reserva> reservasFiltradas => todasLasReservas
            .Where(r => r.Fecha.Date == fechaSeleccionada.Date)
            .ToList();

        protected override async Task OnInitializedAsync()
        {
            todasLasReservas = await ObtenerTodasLasReservasAsync();
        }

        private Task<List<Reserva>> ObtenerTodasLasReservasAsync()
        {
            // Simulación con diferentes fechas
            return Task.FromResult(new List<Reserva>
            {
                new() { Cliente = "Carlos Pérez", Servicio = "Corte Básico", Barbero = "Luis", Hora = new TimeSpan(9, 30, 0), Estado = "Confirmada", Fecha = DateTime.Today },
                new() { Cliente = "Ana Torres", Servicio = "Afeitado", Barbero = "Mario", Hora = new TimeSpan(11, 0, 0), Estado = "Pendiente", Fecha = DateTime.Today },
                new() { Cliente = "Jorge Ruiz", Servicio = "Corte", Barbero = "Luis", Hora = new TimeSpan(10, 0, 0), Estado = "Cancelada", Fecha = DateTime.Today.AddDays(1) },
                new() { Cliente = "Lucía Gómez", Servicio = "Barba", Barbero = "Mario", Hora = new TimeSpan(12, 0, 0), Estado = "Confirmada", Fecha = DateTime.Today.AddDays(-1) }
            });
        }

        public class Reserva
        {
            public string Cliente { get; set; } = string.Empty;
            public string Servicio { get; set; } = string.Empty;
            public string Barbero { get; set; } = string.Empty;
            public TimeSpan Hora { get; set; }
            public string Estado { get; set; } = "Pendiente";
            public DateTime Fecha { get; set; } // NUEVO
        }

        private string ObtenerClaseEstado(string? estado)
        {
            return estado?.ToLower() switch
            {
                "pendiente" => "bg-warning text-dark",
                "confirmada" => "bg-success",
                "cancelada" => "bg-danger",
                _ => "bg-secondary"
            };
        }
    }
}
