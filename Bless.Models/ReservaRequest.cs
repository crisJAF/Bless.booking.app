using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Models
{
    public class ReservaRequest
    {
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public int BarberoId { get; set; }
        public int ServicioId { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
    }
}
