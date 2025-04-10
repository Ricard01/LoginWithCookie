using ERP.Infrastructure.Repositories.Dtos;

namespace ERP.Infrastructure.Repositories.Gastos.Dtos;

public class GastosDto
{
    public int Id { get; set; }
    public required string Concepto { get; set; }
    public DateTime Fecha { get; set; }
    public required string Folio { get; set; }
    public required string Proveedor { get; set; }
    public double Neto { get; set; }
    public double IVA { get; set; }
    //public double IvaRetenido { get; set; }
    //public double ISR { get; set; }
    public double Total { get; set; }
    public double Descuento { get; set; }
    public double Pendiente { get; set; }
    public int Cancelado { get; set; }
    public string? Agente { get; set; }
    public int AfectaComisiones { get; set; }
    public virtual required ICollection<MovimientoDto> Movimientos { get; set; }
}


