using Bless.Extension;
using Bless.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Bless.Proxy
{
    public class ReviewsProxy
    {

        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly Extension.ServiceConfiguration _serviceConfiguration;


        public ReviewsProxy(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _serviceConfiguration = new Extension.ServiceConfiguration(configuration);
        }


        public async Task<List<Reviews>> ObtenerReviewsAsync()
        {
            try
            {
                var url = _serviceConfiguration.BaseUri + _serviceConfiguration.Endpoints.Where(x => x.Name == "ObtenerReviews").Select(x => x.Url).FirstOrDefault();

                var response = await new HttpRequest()
                    .WithMethod(HttpMethod.Get)
                    .WithRequestUri(url)
                    .WithHeader("Accept", "application/json")
                    .SendAsync();

                // Aquí cambiamos a deserializar directamente en una lista de Reviews
                var reviews = JsonConvert.DeserializeObject<List<Reviews>>(response);
                if (reviews != null && reviews.Any())
                {
                    foreach (var review in reviews)
                    {
                        Console.WriteLine($"Author: {review.author_name}");
                        Console.WriteLine($"Text: {review.Text}");
                        Console.WriteLine($"Time: {review.TimeAsDateTime.ToString("dd/MM/yyyy HH:mm:ss")}");
                        Console.WriteLine("-----");
                    }
                }
                else
                {
                    Console.WriteLine("No hay reseñas disponibles.");
                }

                return reviews;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener los reviews: {ex.Message}");
                return new List<Reviews>();
            }
        }
    }
}
