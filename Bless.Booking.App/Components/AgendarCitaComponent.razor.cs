using Bless.Proxy;
using Microsoft.AspNetCore.Components;
using System.ComponentModel.DataAnnotations;

namespace Bless.Booking.App.Components
{
    public partial class AgendarCitaComponent
    {
        [Parameter] public bool Visible { get; set; }
        [Parameter] public EventCallback OnClose { get; set; }

        [Inject]
        private ReservaProxy reservaProxy { get; set; }

        private CitaModel cita = new();
        private bool exito = false;
        private string horaStr;
        private List<TimeSpan> HorasDisponibles = new();
        private List<Bless.Models.ReservaRequest> reservas = new();

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

        protected override async Task OnParametersSetAsync()
        {
            if (Visible)
            {
                if (cita.Fecha.HasValue && cita.Hora.HasValue)
                {
                    var fechaConHora = cita.Fecha.Value.Date + cita.Hora.Value;
                    reservas = await reservaProxy.ObtenerHorariosDisponiblesAsync(1, fechaConHora);
                    HorasDisponibles = reservas.Select(r => r.Hora).ToList();
                }

                cita = new();
                exito = false;
                horaStr = null;
            }
        }

        protected override async Task OnInitializedAsync()
        {

        }
        public class CitaModel
        {
            [Required(ErrorMessage = "El nombre es obligatorio")]
            public string Nombre { get; set; }

            [EmailAddress(ErrorMessage = "Correo no válido")]
            public string Email { get; set; }

            [Required(ErrorMessage = "El teléfono es obligatorio")]
            public string Telefono { get; set; }

            [Required(ErrorMessage = "Seleccione un servicio")]
            public string Servicio { get; set; }

            [Required(ErrorMessage = "Seleccione una fecha")]
            public DateTime? Fecha { get; set; }

            [Required(ErrorMessage = "Seleccione una hora")]
            public TimeSpan? Hora { get; set; }
        }
        private async Task OnFechaChanged(ChangeEventArgs e)
        {
            if (DateTime.TryParse(e.Value?.ToString(), out var fechaSeleccionada))
            {
                cita.Fecha = fechaSeleccionada;

                // Limpia hora previa y horas disponibles
                cita.Hora = null;
                horaStr = null;
                HorasDisponibles.Clear();

                var fechaConHora = fechaSeleccionada.Date; // Por ahora sin hora
                reservas = await reservaProxy.ObtenerHorariosDisponiblesAsync(1, fechaConHora);
                HorasDisponibles = reservas.Select(r => r.Hora).ToList();

                StateHasChanged(); // Forzar renderizado para que se actualice el combo de horas
            }
        }

    }

}
