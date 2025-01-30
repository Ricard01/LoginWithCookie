using AutoMapper;
using ERP.Domain.Entities;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos;


public class FacturasVm
{
   public IList<FacturaDto> Facturas { get; set; } = new List<FacturaDto>();
}


[AutoMap(typeof(Factura))]

public class FacturaDto 
{

    public int Id { get; set; }

    public int Concepto { get; set; }

    public DateTime Fecha { get; set; }


    public  string? Serie { get; set; }

    public double Folio { get; set; }

    public required string Cliente { get; set; }

    public double Neto { get; set; }

    public double Total { get; set; }

    public double Descuento { get; set; }

    public double Pendiente { get; set; }

    public int Cancelado { get; set; }

    public string? Url { get; set; }

    //public DateTime? FechaCancelacion { get; set; }

    public string? Agente { get; set; }

    public double Utilidad { get; set; }


    public virtual required ICollection<MovimientoDto> Movimientos { get; set; }
}


[AutoMap(typeof(Movimiento))]
public class MovimientoDto
{
    public int Id { get; set; }

    public int IdMovimiento { get; set; }

    public int? IdAgente { get; set; }

    public double Neto { get; set; }

    public double Descuento { get; set; }

    public double Impuesto { get; set; }

    public double Retencion { get; set; }

    public required string CodigoProducto { get; set; }

    public required string NombreProducto { get; set; }

    public string? Descripcion { get; set; }

    public double Comision { get; set; }

    public double Utilidad { get; set; }

    public double UtilidadRicardo { get; set; }

    public double UtilidadAngie { get; set; }

    public double IvaRicardo { get; set; }

    public double IvaAngie { get; set; }

    public double IsrRicardo { get; set; }

    public double IsrAngie { get; set; }

    public string? Observaciones { get; set; }

}
