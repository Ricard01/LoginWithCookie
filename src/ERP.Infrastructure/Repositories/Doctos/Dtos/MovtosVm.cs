using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos
{
    public class MovtosVm
    {
        public IList<MovtoDto> Movimientos { get; set; }   = new List<MovtoDto>();
    }
}
