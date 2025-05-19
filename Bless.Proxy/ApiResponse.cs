using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bless.Proxy
{
    public class ApiResponse<T>
    {
        public T Content { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
    }

}
