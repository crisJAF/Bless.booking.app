namespace Bless.Booking.App.Components.Pages
{
    public partial class Home
    {
        private bool animacionActivada = false;

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
