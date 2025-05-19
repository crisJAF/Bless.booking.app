using Bless.Models;
using Bless.Proxy;
using Microsoft.AspNetCore.Components;

namespace Bless.Booking.App.Components.Shared
{
    public partial class AgendarCitaComponent
    {
        [Parameter] public bool Visible { get; set; }
        [Parameter] public EventCallback OnClose { get; set; }

        [Inject] private BarberosProxy BarberosProxy { get; set; }
        [Inject] private ServiciosProxy ServiciosProxy { get; set; }
        [Inject] private ReservaProxy ReservaProxy { get; set; }

        private List<Barbero> listBarberos = new();
        private List<Servicio> listServicios = new();
        private List<HorarioDisponible> listHorarioDisponible = new();
        private Cita cita = new();

        private bool exito = false;
        private string horaStr;
        private List<TimeSpan> HorasDisponibles = new();


        protected override async Task OnInitializedAsync()
        {
            var horarios = await ReservaProxy.ObtenerHorariosAsync("1", "2025-05-19");
            listBarberos = await BarberosProxy.ObtenerBarberosAsync();
            listServicios = await ServiciosProxy.ObtenerServiciosAsync();
        }

        private async Task OnFechaChanged(DateTime nuevaFecha)
        {
            cita.Fecha = nuevaFecha;
            int barberoId = cita.BarberoID;

            listHorarioDisponible = await ReservaProxy.ObtenerHorariosAsync(barberoId.ToString(), nuevaFecha.ToString("yyyy-MM-dd"));
        }

        private async Task EnviarFormulario()
        {
            cita.Hora = TimeSpan.Parse(horaStr);
            exito = await ReservaProxy.RegistrarReserva(cita);
            if (exito)
            {
                cita = new();
                horaStr = null;
                await OnClose.InvokeAsync();
            }
        }

        private async Task Cerrar()
        {
            exito = false;
            cita = new();
            horaStr = null;
            await OnClose.InvokeAsync();
        }
    }
}
