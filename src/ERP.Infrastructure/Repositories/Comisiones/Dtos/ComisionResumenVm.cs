using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Infrastructure.Repositories.Comisiones.Dtos;

public class ResumenComisionVm
{
    public required ComisionPersonalDto Personal { get; set; }

    public required ComisionCompartidaDto Compartida { get; set; }
}

public class ComisionBase
{
    public double Neto { get; set; }
    public double Utilidad { get; set; }
    public double Descuento { get; set; }
    public double Iva { get; set; }
    public double Isr { get; set; }
    public double IvaRet { get; set; }
    public double IsrMensual { get; set; }
    public double IvaAfavor { get; set; }
    public double TotalImpuestos { get; set; }


}

public class ComisionPersonalDto : ComisionBase { }

public class ComisionCompartidaDto : ComisionBase
{
    public double Gastos { get; set; }
}

