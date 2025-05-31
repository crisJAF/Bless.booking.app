using Bless.Models;
using Bless.Proxy;
using Microsoft.AspNetCore.Components;

namespace Bless.App.Components.Shared
{
    public partial class AgendarCitaComponent : ComponentBase
    {
        [Parameter] public bool Visible { get; set; }
        [Parameter] public EventCallback OnClose { get; set; }

        [Inject] private BarberosProxy BarberosProxy { get; set; }
        [Inject] private ServiciosProxy ServiciosProxy { get; set; }
        [Inject] private ReservaProxy ReservaProxy { get; set; }

        private List<Barbero> listBarberos = new();
        private List<Servicio> listServicios = new();
        private List<HorarioDisponible> listHorarioDisponible = new();
        private Cita cita = new()
        {
            Fecha = DateTime.Today
        };

        private bool exito = false;
        private string horaStr;
        private List<TimeSpan> HorasDisponibles = new();
        private bool mostrarModalExito = false;

        protected override async Task OnInitializedAsync()
        {
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
            try
            {
                if (string.IsNullOrWhiteSpace(horaStr))
                {
                    exito = false;
                    return;
                }

                if (!TimeSpan.TryParse(horaStr, out var hora))
                {
                    exito = false;
                    return;
                }

                cita.Hora = hora;

                exito = await ReservaProxy.RegistrarReserva(cita);

                if (exito)
                {
                    cita = new();
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

        private async Task Cerrar()
        {
            exito = false;
            cita = new();
            horaStr = null;
            await OnClose.InvokeAsync();
        }

        private async Task CerrarModalExitoAsync()
        {
            await Task.Yield();
            StateHasChanged();

            await Task.Delay(3000);

            mostrarModalExito = false;
            StateHasChanged();

            await OnClose.InvokeAsync();
        }
    }
}
