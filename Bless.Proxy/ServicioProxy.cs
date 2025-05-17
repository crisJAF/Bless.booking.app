using Bless.Extension;
using Bless.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Bless.Proxy
{
    public class ServicioProxy
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly Extension.ServiceConfiguration _serviceConfiguration;

        public ServicioProxy(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _serviceConfiguration = new Extension.ServiceConfiguration(configuration);
        }

        public async Task<List<Servicio>> ObtenerServiciosAsync()
        {
            try
            {
                var url = _serviceConfiguration.BaseUri +
                          _serviceConfiguration.Endpoints.Where(x => x.Name == "ListarServicios")
                              .Select(x => x.Url)
                              .FirstOrDefault();
                var response = await new HttpRequest()
                    .WithMethod(HttpMethod.Get)
                    .WithRequestUri(url)
                    .WithHeader("Accept", "application/json")
                    .SendAsync();
                var responseGeneric = JsonConvert.DeserializeObject<Response<List<Servicio>>>(response);
                return responseGeneric.Content;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new List<Servicio> { new Servicio() };
            }
        }
    }
}
