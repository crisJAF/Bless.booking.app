using Bless.Extension;
using Bless.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Security.Claims;
using HttpRequest = Bless.Extension.HttpRequest;
using System.IdentityModel.Tokens.Jwt;

namespace Bless.Proxy
{
    public class AuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly Extension.ServiceConfiguration _serviceConfiguration;

        public AuthService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _serviceConfiguration = new Extension.ServiceConfiguration(configuration);
        }

        public async Task<bool> LoginAsync(string username, string password)
        {
            var url = _serviceConfiguration.BaseUri + _serviceConfiguration.Endpoints.Where(x => x.Name == "Login").Select(x => x.Url).FirstOrDefault();

            var json = JsonConvert.SerializeObject(new { nombreUsuario = username, contrasena = password });

            var response = await new HttpRequest()
                .WithMethod(HttpMethod.Post)
                .WithRequestUri(url)
                .WithJsonContent(json)
                .WithHeader("Accept", "application/json")
                .SendAsync();

            if (response == null)
                return false;

            var result = JsonConvert.DeserializeObject<LoginResponse>(response);

            if (!string.IsNullOrEmpty(result.Token))
            {
                var (name, role) = DecodeToken(result.Token);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, name),
                    new Claim(ClaimTypes.Role, role)
                };

                var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                await _httpContextAccessor.HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    principal
                );

                return true;

            }

            return false;
        }

        public async Task LogoutAsync()
        {
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        public (string Name, string Role) DecodeToken(string jwtToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwtToken);

            var name = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var role = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            return (name, role);
        }
    }
}
