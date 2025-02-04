using System.ComponentModel.DataAnnotations;

namespace ERP.Domain.Entities;

public class Documentos
{

    [Key]
    public int Id { get; set; }

    public int IdComercial { get; set; }

    public int IdDocumentoDe { get; set; }

    public int Concepto  { get; set; }

    public DateTime Fecha { get; set; }

    public string? Serie {  get; set; }

    public double Folio { get; set; }

    public required string Cliente { get; set; }

    public double Neto { get; set; }

    public double Total { get; set; }

    public double Descuento { get; set; }

    public double Pendiente { get; set; }

    public int Cancelado { get; set; }

    public DateTime? FechaCancelacion { get; set; }

    public string?  Agente  { get; set; }

    public double Utilidad { get; set; }


    public virtual ICollection<Movimiento> Movimientos { get; set; }


}
