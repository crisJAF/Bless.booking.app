using Bless.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Bless.Booking.App.Components.Admin
{
    public partial class LoginAdmin : ComponentBase
    {
        
        private Login loginModel = new(); // Y Login debe tener las anotaciones [Required]

        [Inject]
        private IJSRuntime JS { get; set; } = default!;

        [Inject]
        private HttpClient Http { get; set; } = default!;

        [Inject]
        private NavigationManager Navigation { get; set; } = default!;

        private async Task HandleLogin()
        {
                try
                {
                var response = await Http.PostAsJsonAsync("https://localhost:7289/api/Auth/login", loginModel);

                // Debug: inspecciona status code
                Console.WriteLine(response.StatusCode);

                if (response.IsSuccessStatusCode)
                {
                    Navigation.NavigateTo("/test/reservas");
                }
                else
                {
                    var body = await response.Content.ReadAsStringAsync();
                    await JS.InvokeVoidAsync("alert", $"Error: {response.StatusCode}, Detalle: {body}");
                }

            }
            catch (Exception ex)
                {
                    await JS.InvokeVoidAsync("alert", $"Error al conectarse al servidor: {ex.Message}");
                }
            }
        }
}
