namespace Bless.Booking.App.Components.Pages
{
    public partial class Home
    {
        private bool animacionActivada = false;
        private bool mostrarModal = false;
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

    }
}
