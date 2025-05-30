﻿using ERP.Infrastructure.Repositories.Dtos;

namespace ERP.Infrastructure.Repositories.Facturas.Dtos;

public class FacturasVm
{
    public IList<FacturasDto> Facturas { get; set; } = new List<FacturasDto>();
}


public class FacturasDto
{

    public int Id { get; set; }
    public required string Concepto { get; set; }
    public DateTime Fecha { get; set; }

    public string Folio { get; set; }
    public required string Cliente { get; set; }
    public double Neto { get; set; }
    public double IVA { get; set; }
    public double IvaRetenido { get; set; }
    public double ISR { get; set; }
    public double Total { get; set; }
    public double Descuento { get; set; }
    public double Pendiente { get; set; }
    public int Cancelado { get; set; }
    //public string? Url { get; set; }
    public string? Agente { get; set; }
    public double Utilidad { get; set; }
    public string? FechaPago { get; set; }
    public string? FolioPago { get; set; }
    public DateTime? FechaCreacionPago { get; set; }
    public int AfectaComisiones { get; set; }
    public virtual required ICollection<MovimientoDto> Movimientos { get; set; }

}


