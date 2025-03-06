using AutoMapper;
using ERP.Domain.Entities;

namespace ERP.Infrastructure.Repositories.Facturas.Dtos;


public class FacturasVm
{
   public IList<FacturasDto> Facturas { get; set; } = new List<FacturasDto>();
}



[AutoMap(typeof(Documentos))]
public class FacturasDto 
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

    public DateTime FechaPago { get; set; }

    public string? FolioPago { get; set; }


    public virtual required ICollection<MovimientoDto> Movimientos { get; set; }
}


