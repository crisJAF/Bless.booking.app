using Bless.Models;
using Microsoft.AspNetCore.Components;

namespace Bless.Booking.App.Components.Shared
{
    public partial class AgendarCitaComponent
    {
        [Parameter] public bool Visible { get; set; }
        [Parameter] public EventCallback OnClose { get; set; }

        private Cita cita = new();
        private bool exito = false;
        private string horaStr;
        private List<TimeSpan> HorasDisponibles = new();

        private async Task Cerrar()
        {
            exito = false;
            cita = new();
            horaStr = null;
            await OnClose.InvokeAsync();
        }

        private void EnviarFormulario()
        {
            if (TimeSpan.TryParse(horaStr, out var hora))
            {
                cita.Hora = hora;
                exito = true;
            }
        }

        protected override Task OnParametersSetAsync()
        {
            if (Visible)
            {
                HorasDisponibles = new List<TimeSpan>
            {
                new TimeSpan(9, 0, 0),
                new TimeSpan(9, 30, 0),
                new TimeSpan(10, 0, 0),
                new TimeSpan(10, 30, 0),
                new TimeSpan(11, 0, 0),
                new TimeSpan(11, 30, 0),
                new TimeSpan(14, 0, 0),
                new TimeSpan(14, 30, 0),
                new TimeSpan(15, 0, 0)
            };

                cita = new();
                exito = false;
                horaStr = null;
            }

            return base.OnParametersSetAsync();
        }
    }
}
