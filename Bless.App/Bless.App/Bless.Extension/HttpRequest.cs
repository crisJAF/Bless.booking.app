using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Extension
{
    public class HttpRequest
    {
        private readonly HttpRequestMessage _request;
        private readonly HttpClient _httpClient;

        public HttpRequest()
        {
            _request = new HttpRequestMessage();
            _httpClient = new HttpClient(); // Instancia de HttpClient
        }

        public HttpRequest WithMethod(HttpMethod method)
        {
            _request.Method = method;
            return this;
        }

        public HttpRequest WithRequestUri(string uri)
        {
            _request.RequestUri = new Uri(uri);
            return this;
        }

        public HttpRequest WithHeader(string name, string value)
        {
            _request.Headers.Add(name, value);
            return this;
        }

        public HttpRequest WithJsonContent(string jsonBody)
        {
            _request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
            return this;
        }

        public async Task<string> SendAsync()
        {
            try
            {
                HttpResponseMessage response = await _httpClient.SendAsync(_request);
                response.EnsureSuccessStatusCode(); // Lanza excepción si no es exitoso
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }
    }
}
