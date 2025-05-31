using Bless.Extension;
using Bless.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Proxy
{
    public class BarberosProxy
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly Extension.ServiceConfiguration _serviceConfiguration;


        public BarberosProxy(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _serviceConfiguration = new Extension.ServiceConfiguration(configuration);
        }


        public async Task<List<Barbero>> ObtenerBarberosAsync()
        {
            try
            {
                var url = _serviceConfiguration.BaseUri + _serviceConfiguration.Endpoints.Where(x => x.Name == "ObtenerBarberos").Select(x => x.Url).FirstOrDefault();

                var response = await new HttpRequest()
                    .WithMethod(HttpMethod.Get)
                    .WithRequestUri(url)
                    .WithHeader("Accept", "application/json")
                    .SendAsync();
                var result = JsonConvert.DeserializeObject<ApiResponse<List<Barbero>>>(response);
                List<Barbero> barberos = result.Content;

                return barberos;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener los barberos: {ex.Message}");
                return new List<Barbero>();
            }
        }
    }
}
