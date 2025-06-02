using Bless.Models;
using Bless.Proxy;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace Bless.App.Components.Admin.Pages
{
    public partial class ReservasComponent : ComponentBase
    {
        [Inject] private ReservaProxy ReservaProxy { get; set; } = default!;
        [Inject] private BarberosProxy BarberosProxy { get; set; } = default!;

        private List<Reserva> todasLasReservas = new();
        private List<Barbero> barberos = new();
        private string barberoId = "";
        private DateTime fechaSeleccionada = DateTime.Today;

        private List<Reserva> reservasFiltradas => todasLasReservas
            .Where(r => r.Fecha.Date == fechaSeleccionada.Date)
            .ToList();

        protected override async Task OnInitializedAsync()
        {
            await CargarBarberos();
            await CargarReservas();
        }

        private async Task CargarReservas()
        {
            var fechaStr = fechaSeleccionada.ToString("yyyy-MM-dd");
            todasLasReservas = await ReservaProxy.ListarReservasAsync(fechaStr, barberoId);
        }

        private async Task FechaCambiadaHandler(ChangeEventArgs e)
        {
            if (DateTime.TryParse(e.Value?.ToString(), out var nuevaFecha))
            {
                fechaSeleccionada = nuevaFecha;
                await CargarReservas();
            }
        }

        private async Task BarberoSeleccionadoHandler(ChangeEventArgs e)
        {
            barberoId = e.Value?.ToString() ?? string.Empty;
            await CargarReservas();
        }

        private async Task CargarBarberos()
        {
            barberos = await BarberosProxy.ObtenerBarberosAsync();
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
