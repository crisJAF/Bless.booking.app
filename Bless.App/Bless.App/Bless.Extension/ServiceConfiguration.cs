using Bless.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Extension
{
    public class ServiceConfiguration
    {
        private readonly Service _serviceConfig;

        // Propiedades públicas para acceder a la configuración
        public string BaseUri => _serviceConfig.BaseUri;
        public List<Endpoint> Endpoints => _serviceConfig.Endpoints;
        public List<Credential> Credentials => _serviceConfig.Credentials;

        public ServiceConfiguration(IConfiguration configuration)
        {

            // Obtener la sección de configuración para "BlueMoon.Service"
            var serviceConfigSection = configuration.GetSection("ServiceConfiguration").GetChildren();
            var serviceConfig = serviceConfigSection.FirstOrDefault(x => x["Name"] == "Bless.Service");

            // Si la configuración existe, mapear los valores a la clase Service
            if (serviceConfig != null)
            {
                _serviceConfig = new Service
                {
                    Name = serviceConfig["Name"],
                    BaseUri = serviceConfig["BaseUri"],
                    Credentials = MapCredentials(serviceConfig.GetSection("Credentials")),
                    Endpoints = MapEndpoints(serviceConfig.GetSection("Endpoints"))
                };
            }
            else
            {
                throw new InvalidOperationException("Configuración del servicio no encontrada.");
            }
        }

        private List<Credential> MapCredentials(IConfigurationSection section)
        {
            var credentials = new List<Credential>();
            foreach (var credentialSection in section.GetChildren())
            {
                credentials.Add(new Credential
                {
                    Country = credentialSection["Country"],
                    ClientId = credentialSection["ClientId"],
                    ClientSecret = credentialSection["ClientSecret"],
                    ResourceId = credentialSection["ResourceId"]
                });
            }
            return credentials;
        }

        private List<Endpoint> MapEndpoints(IConfigurationSection section)
        {
            var endpoints = new List<Endpoint>();
            foreach (var endpointSection in section.GetChildren())
            {
                endpoints.Add(new Endpoint
                {
                    Name = endpointSection["Name"],
                    Method = endpointSection["Method"],
                    Url = endpointSection["Url"],
                    TimeOut = endpointSection["TimeOut"]
                });
            }
            return endpoints;
        }
    }
}
