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

                cita = new();
                exito = false;
                horaStr = null;
            }
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
        private async Task OnFechaChanged(DateTime? nuevaFecha)
        {
            if (nuevaFecha.HasValue)
            {
                horaStr = null;
                HorasDisponibles.Clear();

                try
                {
                    reservas = await reservaProxy.ObtenerHorariosDisponiblesAsync(1, nuevaFecha.Value.Date);
                    HorasDisponibles = reservas.Select(r => r.Hora).ToList();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al obtener horarios: " + ex.Message);
                }

                StateHasChanged();
            }
        }


        private DateTime? fechaSeleccionada
        {
            get => cita.Fecha;
            set
            {
                if (cita.Fecha != value)
                {
                    cita.Fecha = value;
                    _ = OnFechaChanged(value);
                }
            }
        }

    }

}
