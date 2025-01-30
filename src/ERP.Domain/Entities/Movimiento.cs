using System.ComponentModel.DataAnnotations.Schema;

namespace ERP.Domain.Entities;

public class Movimiento
{

    public int Id { get; set; }

    public int IdComercial { get; set; }

    public int IdMovimiento { get; set; }

    public int IdProducto { get; set; }

    public int? IdAgente { get; set; }
    public double Neto { get; set; }

    public double Descuento { get; set; }

    public double Impuesto { get; set; }

    public double Retencion { get; set; }

     public required string codigoProducto { get; set; }

    public required string NombreProducto { get; set; }

    public  string? Descripcion { get; set; }

    public double Comision { get; set; }

    public double Utilidad { get; set; }


    public double UtilidadRicardo { get; set; }

    public double UtilidadAngie { get; set; }

    public double  IvaRicardo { get; set; }

    public double IvaAngie { get; set; }

    public double IsrRicardo { get; set; }

    public double IsrAngie { get; set; }

    public string? Observaciones { get; set; }


    public virtual Factura Factura { get; set; } // Relación con Factura
    public virtual Agente Agente { get; set; } // Relación opcional con Agente




}
