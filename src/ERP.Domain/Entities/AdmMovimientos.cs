using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ERP.Domain.Entities;

public class AdmMovimientos
{
    [Key]
    public int CIDMOVIMIENTO { get; set; }
    public int CIDDOCUMENTO { get; set; }

    public int CIDPRODUCTO { get; set; }

    public double CNETO { get; set; }

    public double CDESCUENTO1 { get; set; }

    public double CIMPUESTO1 { get; set; }

    public double CRETENCION1 { get; set; }

    public string COBSERVAMOV { get; set; }

    [ForeignKey("CIDPRODUCTO")]
    public virtual required AdmProductos AdmProductos { get; set; }

}
