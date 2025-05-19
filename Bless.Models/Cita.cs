using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Models
{
    public class Cita
    {
        //[Required(ErrorMessage = "El nombre es obligatorio")]
        //public string Nombre { get; set; }

        //[Required(ErrorMessage = "El correo es obligatorio")]
        //[EmailAddress(ErrorMessage = "Correo no válido")]
        //public string Email { get; set; }

        //[Required(ErrorMessage = "El teléfono es obligatorio")]
        //public string Telefono { get; set; }

        //[Required(ErrorMessage = "Seleccione un servicio")]
        //public string Servicio { get; set; }

        //[Required(ErrorMessage = "Seleccione una fecha")]
        //public DateTime Fecha { get; set; }

        //[Required(ErrorMessage = "Seleccione una hora")]
        //public TimeSpan? Hora { get; set; }

        //public int BarberoID { get; set; }

        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public int BarberoID { get; set; }
        public int ServicioId { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
    }
}
