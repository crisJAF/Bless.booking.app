using Bless.Extension;
using Bless.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Bless.Proxy
{
    public class ReservaProxy
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly Extension.ServiceConfiguration _serviceConfiguration;

        public ReservaProxy(HttpClient httpClient, IConfiguration configuration, Extension.ServiceConfiguration serviceConfiguration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _serviceConfiguration = serviceConfiguration;
        }

        public async Task<List<ReservaRequest>> ObtenerHorariosDisponiblesAsync(int? barberoId, DateTime fecha)
        {
            try
            {
                var baseUrl = _serviceConfiguration.BaseUri +
                              _serviceConfiguration.Endpoints.Where(x => x.Name == "ObtenerHorariosDisponibles")
                                  .Select(x => x.Url)
                                  .FirstOrDefault();

                var url = barberoId.HasValue
                    ? $"{baseUrl}?barberoId={barberoId.Value}&fecha={fecha:yyyy-MM-dd}"
                    : $"{baseUrl}?fecha={fecha:yyyy-MM-dd}";

                var response = await new HttpRequest()
                    .WithMethod(HttpMethod.Get)
                    .WithRequestUri(url)
                    .WithHeader("Accept", "application/json")
                    .SendAsync();

                var responseGeneric = JsonConvert.DeserializeObject<Response<List<ReservaRequest>>>(response);
                return responseGeneric.Content;
            }
            catch (Exception ex) 
            { 
                Console.WriteLine(ex.ToString());
                return new List<ReservaRequest> { new ReservaRequest() };
            }
        }
    }
}
