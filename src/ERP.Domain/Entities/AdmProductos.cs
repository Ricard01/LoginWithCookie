using System.ComponentModel.DataAnnotations;

namespace ERP.Domain.Entities;

public class AdmProductos
{
    [Key]
    public int CIDPRODUCTO { get; set; }

    public required string CCODIGOPRODUCTO { get; set; }

    public required string CNOMBREPRODUCTO { get; set; }

    public double CIMPORTEEXTRA1 { get; set; }
}