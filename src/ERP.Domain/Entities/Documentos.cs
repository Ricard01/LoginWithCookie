namespace ERP.Domain.Entities;

public class Documentos
{
    public int Id { get; set; }
    public int IdComercial { get; set; }
    public int IdDocumentoDe { get; set; }
    public required string Concepto { get; set; }
    public DateTime Fecha { get; set; }
    public string? Serie { get; set; }
    public double Folio { get; set; }
    public required string Cliente { get; set; }
    public double Neto { get; set; }
    public double IVA { get; set; }
    public double ISR { get; set; }
    public double IvaRetenido { get; set; }
    public double Descuento { get; set; }
    public double Total { get; set; }
    public double Pendiente { get; set; }
    public int Cancelado { get; set; }
    public DateTime? FechaCancelacion { get; set; }
    public string? Agente { get; set; }
    public double Utilidad { get; set; }
    public string? FechaPago { get; set; }
    public string? FolioPago { get; set; }
    public DateTime? FechaCreacionPago { get; set; }
    public string? Observaciones { get; set; }
    public int AfectaComisiones { get; set; }
    public virtual ICollection<Movimiento> Movimientos { get; set; }
}
