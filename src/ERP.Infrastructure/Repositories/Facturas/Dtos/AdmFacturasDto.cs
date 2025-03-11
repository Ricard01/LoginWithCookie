namespace ERP.Infrastructure.Repositories.Facturas.Dtos;

// Dto Especial para facilitar el mapeo join 
public class AdmFacturasDto 
{
    public int IdComercial { get; set; }
    public int IdDocumentoDe { get; set; }
    public string Concepto { get; set; }
    public DateTime Fecha { get; set; }
    public  string? Serie { get; set; }
    public double Folio { get; set; }
    public required string Cliente { get; set; }
    public int IdAgente { get; set; }
    public string? Agente { get; set; }
    public double Neto { get; set; }
    public double IVA { get; set; }
    public double ISR { get; set; }
    public double Descuento { get; set; }
    public double Total { get; set; }
    public double Pendiente { get; set; }
    public int Cancelado { get; set; }
    public string? FechaPago { get; set; }
    public string? FolioPago { get; set; }
    public DateTime? FechaCreacionPago { get; set; }
    public virtual required ICollection<AdmFacturaMovtos> Movimientos { get; set; }
}

public class AdmFacturaMovtos
{

    public int IdMovimiento { get; set; }
    public int IdComercialMov { get; set; }
    public int IdDocumentoDe { get; set; }
    public int IdProducto { get; set; }
    public double MovNeto { get; set; }
    public double MovDescto { get; set; }
    public double MovIVA { get; set; }
    public double MovISR { get; set; }
    public string Codigo { get; set; }
    public string Nombre { get; set; }
    public string MovObserva { get; set; }
    public double Comision { get; set; }
}