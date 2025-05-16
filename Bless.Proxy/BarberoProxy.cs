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
    public class BarberoProxy
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly Extension.ServiceConfiguration _serviceConfiguration;

        public BarberoProxy(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _serviceConfiguration = new Extension.ServiceConfiguration(configuration);
        }

        public async Task<List<Barbero>> ObtenerBarberosAsync()
        {
            try
            {
                var url = _serviceConfiguration.BaseUri +
                              _serviceConfiguration.Endpoints.Where(x => x.Name == "ListarBarberos")
                                  .Select(x => x.Url)
                                  .FirstOrDefault();

                var response = await new HttpRequest()
                    .WithMethod(HttpMethod.Get)
                    .WithRequestUri(url)
                    .WithHeader("Accept", "application/json")
                    .SendAsync();

                var responseGeneric = JsonConvert.DeserializeObject<Response<List<Barbero>>>(response);
                return responseGeneric.Content;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new List<Barbero> { new Barbero() };
            }
        }
    }
}
