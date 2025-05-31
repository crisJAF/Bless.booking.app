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
    public class ReservaProxy
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly Extension.ServiceConfiguration _serviceConfiguration;


        public ReservaProxy(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _serviceConfiguration = new Extension.ServiceConfiguration(configuration);
        }


        public async Task<List<HorarioDisponible>> ObtenerHorariosAsync(string barberoId, string fecha)
        {
            try
            {
                var baseUrl = _serviceConfiguration.BaseUri;
                var endpoint = _serviceConfiguration.Endpoints
                    .FirstOrDefault(x => x.Name == "ReservaHorariosDisponibles")?.Url;

                if (string.IsNullOrEmpty(endpoint))
                    throw new Exception("Endpoint ReservaHorariosDisponibles no configurado.");

                // Construir URL con query params
                var url = $"{baseUrl}{endpoint}?barberoId={barberoId}&fecha={fecha:yyyy-MM-dd}";

                var response = await new HttpRequest()
                    .WithMethod(HttpMethod.Get)
                    .WithRequestUri(url)
                    .WithJsonContent("")
                    .WithHeader("Accept", "application/json")
                    .SendAsync();

                var result = JsonConvert.DeserializeObject<ApiResponse<List<HorarioDisponible>>>(response);

                return result.Content;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener los barberos: {ex.Message}");
                return new List<HorarioDisponible>();
            }
        }

        public async Task<bool> RegistrarReserva(Cita cita)
        {
            try
            {
                var url = _serviceConfiguration.BaseUri + _serviceConfiguration.Endpoints.Where(x => x.Name == "RegistrarReserva").Select(x => x.Url).FirstOrDefault();

                var content = JsonConvert.SerializeObject(cita);

                var response = await new HttpRequest()
                    .WithMethod(HttpMethod.Post)
                    .WithRequestUri(url)
                    .WithJsonContent(content)
                    .WithHeader("Accept", "application/json")
                    .SendAsync();

                var res = JsonConvert.DeserializeObject<ApiResponse<bool>>(response);

                return res.IsSuccess;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener los barberos: {ex.Message}");
                return false;
            }
        }
    }
}
