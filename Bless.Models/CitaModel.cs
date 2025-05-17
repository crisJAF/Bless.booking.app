using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Models
{
    public class CitaModel
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; }

        [EmailAddress(ErrorMessage = "Correo no válido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio")]
        public string Telefono { get; set; }

        [Required(ErrorMessage = "Seleccione un barbero")]
        public int? Barbero { get; set; }

        [Required(ErrorMessage = "Seleccione un servicio")]
        public string Servicio { get; set; }

        [Required(ErrorMessage = "Seleccione una fecha")]
        public DateTime? Fecha { get; set; }

        [Required(ErrorMessage = "Seleccione una hora")]
        public TimeSpan? Hora { get; set; }
    }
}
