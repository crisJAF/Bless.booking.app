using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Bless.Models
{
    public class Reviews
    {
        public string author_name { get; set; }
        public string profile_photo_url { get; set; }
        public int rating { get; set; }
        public string Text { get; set; }

        [JsonPropertyName("time")]  // Asegura que el campo "time" se mapee correctamente
        public long Time { get; set; }

        // Método para convertir el timestamp a DateTime
        public DateTime TimeAsDateTime => DateTimeOffset.FromUnixTimeSeconds(Time).DateTime;
    }

    public class PlaceDetailsResponse
    {
        public Result Result { get; set; }
    }

    public class Result
    {
        public List<Reviews> reviews { get; set; }
    }
}
