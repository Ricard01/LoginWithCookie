

using AutoMapper;
using ERP.Domain.Entities;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos;


public class ComisionRVm
{
    public IList<ComisionRDto> Comisiones { get; set; } = new List<ComisionRDto>();
}


//[AutoMap(typeof(Factura))]

public class ComisionRDto
{

    public DateTime Fecha { get; set; }

    public string? Serie { get; set; }
    public double Folio { get; set; } // en sql el tipo de datos es float y en otras consultas no tengo problemas con traer este dato. 
    public required string Cliente { get; set; }
    public int IdMovimiento { get; set; }

    public int? IdAgente { get; set; }

    public required string NombreProducto { get; set; }

    public string? Descripcion { get; set; }

    public double Neto { get; set; }

    public double Comision { get; set; }

    public double Utilidad { get; set; }

    public double UtilidadRicardo { get; set; }

    public double IvaRicardo { get; set; }

    public double IsrRicardo { get; set; }

    public string? Observaciones { get; set; }
}


[AutoMap(typeof(Movimiento))]
public class MovimientoRDto
{

    public int IdMovimiento { get; set; }

    public int? IdAgente { get; set; }

    public required string NombreProducto { get; set; }

    public string? Descripcion { get; set; }

    public double Neto { get; set; }

    public double Comision { get; set; }

    public double Utilidad { get; set; }

    public double UtilidadRicardo { get; set; }

    public double IvaRicardo { get; set; }

    public double IsrRicardo { get; set; }

    public string? Observaciones { get; set; }

}
