using Bless.Models;
using Bless.Proxy;
using Microsoft.AspNetCore.Components;

namespace Bless.App.Components.Admin.Pages
{
    public partial class LoginAdmin
    {
        [Inject] AuthService AuthService { get; set; }
        [Inject] NavigationManager Navigation { get; set; } 

        private User loginModel = new();
        private string errorMessage;

        protected override void OnInitialized()
        {
            var uri = Navigation.ToAbsoluteUri(Navigation.Uri);
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);

            if (query.TryGetValue("error", out var errorCode) && errorCode == "1")
            {
                errorMessage = "Credenciales incorrectas.";
            }
        }

        private async Task HandleLogin()
        {
            Navigation.NavigateTo($"/login-redirect?username={loginModel.Username}&password={loginModel.Password}", forceLoad: true);
        }
    }
}
