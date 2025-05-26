using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Bless.Booking.App.Components.Pages
{
    public partial class Home
    {
        private bool animacionActivada = false;
        private bool mostrarModal = false;
        [Inject] private IJSRuntime JS { get; set; } = default!;

        private void CerrarModal()
        {
            mostrarModal = false;
        }
        protected override void OnAfterRender(bool firstRender)
        {
            if (firstRender)
            {
                animacionActivada = true;
                StateHasChanged(); // fuerza un re-render para aplicar la clase
            }
        }
        private string servicioSeleccionado = "Corte Basico";

        private class ServicioVisual
        {
            public string Nombre { get; set; }
            public string Icono { get; set; }
        }

        private class ServicioDetalle
        {
            public string Titulo { get; set; }
            public string Imagen { get; set; }
            public string Descripcion { get; set; }
        }

        // Tarjetas que se ven como botones
        private Dictionary<string, ServicioVisual> serviciosVisuales = new()
        {
            ["Corte Basico"] = new ServicioVisual { Nombre = "Corte Basico", Icono = "/img/corte-basico.png" },
            ["Corte Moderno"] = new ServicioVisual { Nombre = "Corte Moderno", Icono = "/img/corte-moderno.png" },
            ["Barba"] = new ServicioVisual { Nombre = "Barba", Icono = "/img/corte-barba.png" },
            ["Perfilacion de cejas"] = new ServicioVisual { Nombre = "Perfilacion de cejas", Icono = "/img/perfilacion-cejas.png" },
            ["Skin Care"] = new ServicioVisual { Nombre = "Skin Care", Icono = "/img/skin-care.png" },
        };

        // Información que se muestra debajo
        private Dictionary<string, ServicioDetalle> detalleServicios = new()
        {
            ["Corte Basico"] = new ServicioDetalle
            {
                Titulo = "Corte Básico",
                Imagen = "/img/detalle-corte-basico.jpg",
                Descripcion = "Corte rápido, limpio y clásico para mantener tu estilo."
            },
            ["Corte Moderno"] = new ServicioDetalle
            {
                Titulo = "Corte Moderno",
                Imagen = "/img/detalle-corte-moderno.jpg",
                Descripcion = "Corte actualizado con líneas modernas y estilo urbano."
            },
            ["Barba"] = new ServicioDetalle
            {
                Titulo = "Corte de Barba",
                Imagen = "/img/detalle-barba.jpg",
                Descripcion = "Perfecciona tu barba con un acabado prolijo y elegante."
            },
            ["Perfilacion de cejas"] = new ServicioDetalle
            {
                Titulo = "Perfilación de Cejas",
                Imagen = "/img/detalle-ceja.jpg",
                Descripcion = "Resalta tu mirada con una forma precisa y armoniosa."
            },
            ["Skin Care"] = new ServicioDetalle
            {
                Titulo = "Tratamiento Facial",
                Imagen = "/img/detalle-skin-care.jpg",
                Descripcion = "Revitaliza tu piel con productos especializados y técnicas modernas."
            },
        };

        private void SeleccionarServicio(string nombre)
        {
            servicioSeleccionado = nombre;
        }

        private ServicioDetalle ServicioActual => detalleServicios[servicioSeleccionado];

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                await JS.InvokeVoidAsync("blessNotificaciones.iniciarConexion");
            }
        }
    }
}
