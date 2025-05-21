using Bless.Models;
using Bless.Proxy;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Bless.Booking.App.Components.Shared
{
    public partial class AgendarCitaComponent
    {
        [Parameter] public bool Visible { get; set; }
        [Parameter] public EventCallback OnClose { get; set; }

        [Inject] private BarberosProxy BarberosProxy { get; set; }
        [Inject] private ServiciosProxy ServiciosProxy { get; set; }
        [Inject] private ReservaProxy ReservaProxy { get; set; }
        
        [Inject]
        private IJSRuntime JS { get; set; } = default!;

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
        private bool captchaValidado = false;


        protected override async Task OnInitializedAsync()
        {
            var horarios = await ReservaProxy.ObtenerHorariosAsync("1", "2025-05-19");
            listBarberos = await BarberosProxy.ObtenerBarberosAsync();
            listServicios = await ServiciosProxy.ObtenerServiciosAsync();
        }
        protected override async Task OnParametersSetAsync()
        {
            if (Visible)
            {
                await RenderizarRecaptcha();
            }
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
