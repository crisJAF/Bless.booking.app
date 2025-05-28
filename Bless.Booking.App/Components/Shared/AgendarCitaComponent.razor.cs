using Bless.Models;
using Bless.Proxy;
using Microsoft.AspNetCore.Components;

namespace Bless.Booking.App.Components.Shared
{
    public partial class AgendarCitaComponent
    {
        [Inject] private BarberosProxy BarberosProxy { get; set; } = default!;
        [Inject] private ServiciosProxy ServiciosProxy { get; set; } = default!;
        [Inject] private ReservaProxy ReservaProxy { get; set; } = default!;

        private List<Barbero> listBarberos = new();
        private List<Servicio> listServicios = new();
        private List<HorarioDisponible> listHorarioDisponible = new();

        private Cita cita = new() { Fecha = DateTime.Today };
        private string horaStr;
        private bool exito = false;
        private bool mostrarModalExito = false;
        [Parameter] public EventCallback OnClose { get; set; }

        protected override async Task OnInitializedAsync()
        {
            listBarberos = await BarberosProxy.ObtenerBarberosAsync();
            listServicios = await ServiciosProxy.ObtenerServiciosAsync();

            // Ejemplo: carga horarios iniciales opcionales
            var horarios = await ReservaProxy.ObtenerHorariosAsync("1", cita.Fecha.ToString("yyyy-MM-dd"));
        }

        private async Task OnFechaChanged(DateTime nuevaFecha)
        {
            cita.Fecha = nuevaFecha;

            if (cita.BarberoID != 0)
            {
                listHorarioDisponible = await ReservaProxy.ObtenerHorariosAsync(
                    cita.BarberoID.ToString(),
                    nuevaFecha.ToString("yyyy-MM-dd")
                );
            }
        }

        private async Task EnviarFormulario()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(horaStr) || !TimeSpan.TryParse(horaStr, out var hora))
                {
                    exito = false;
                    return;
                }

                cita.Hora = hora;

                exito = await ReservaProxy.RegistrarReserva(cita);

                if (exito)
                {
                    cita = new() { Fecha = DateTime.Today };
                    horaStr = null;
                    mostrarModalExito = true;

                    _ = CerrarModalExitoAsync();
                }
            }
            catch (Exception ex)
            {
                exito = false;
                Console.Error.WriteLine($"Error al enviar el formulario: {ex.Message}");
            }
        }

        private void Cerrar()
        {
            exito = false;
            cita = new() { Fecha = DateTime.Today };
            horaStr = null;

            if (OnClose.HasDelegate)
            {
                OnClose.InvokeAsync();
            }
        }

        private async Task CerrarModalExitoAsync()
        {
            await Task.Yield(); // Permite renderizar el modal de éxito
            StateHasChanged();

            await Task.Delay(3000); // Espera 3 segundos

            mostrarModalExito = false;
            StateHasChanged();
        }
    }
}
