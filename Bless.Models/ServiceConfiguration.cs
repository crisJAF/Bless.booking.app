using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Models
{
    public class ServiceConfiguration
    {
        public List<Service> ServiceConfigurations { get; set; }
    }

    public class Service
    {
        public string Name { get; set; }
        public string BaseUri { get; set; }
        public List<Credential> Credentials { get; set; }
        public List<Endpoint> Endpoints { get; set; }
    }

    public class Credential
    {
        public string Country { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string ResourceId { get; set; }
    }

    public class Endpoint
    {
        public string Name { get; set; }
        public string Method { get; set; }
        public string Url { get; set; }
        public string TimeOut { get; set; }
    }
}
