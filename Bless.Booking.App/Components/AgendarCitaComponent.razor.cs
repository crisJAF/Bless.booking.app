using Bless.Models;
using Bless.Proxy;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.ComponentModel.DataAnnotations;

namespace Bless.Booking.App.Components
{
    public partial class AgendarCitaComponent
    {
        [Parameter] public bool Visible { get; set; }
        [Parameter] public EventCallback OnClose { get; set; }

        [Inject]
        private ReservaProxy reservaProxy { get; set; }
        [Inject]
        private BarberoProxy barberoProxy { get; set; } = default!;
        [Inject]
        private ServicioProxy servicioProxy { get; set; } = default!;
        [Inject]
        private IJSRuntime JS { get; set; } = default!;

        private CitaModel cita = new();
        private bool exito = false;
        private bool captchaValidado = false;
        private string horaStr;
        private List<TimeSpan> HorasDisponibles = new();
        private List<Bless.Models.ReservaRequest> reservas = new();
        private List<Bless.Models.Barbero> barberos = new();
        private List<Bless.Models.Servicio> servicios = new();

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

                await Task.Delay(100);
                await RenderizarRecaptcha();
            }
        }

        protected override async Task OnInitializedAsync()
        {
            barberos = await barberoProxy.ObtenerBarberosAsync();
            servicios = await servicioProxy.ObtenerServiciosAsync();
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

        private async Task RenderizarRecaptcha()
        {
            await JS.InvokeVoidAsync("grecaptcha.render", "recaptcha-container", new
            {
                sitekey = "6Legsj0rAAAAAK3IxTu5GwSgfD2gjQ5rlxeEoSCF",
                callback = "onRecaptchaSuccess"
            });
        }

        [JSInvokable]
        public void RecaptchaValidado()
        {
            captchaValidado = true;
            StateHasChanged();
        }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                await JS.InvokeVoidAsync("initRecaptchaCallback", DotNetObjectReference.Create(this));
            }
        }
    }
}
