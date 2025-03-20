
namespace ERP.Infrastructure.Repositories.Doctos.Dtos;

public class ComAngelicaDto
{
    public int IdComercial { get; set; }
    public DateTime Fecha { get; set; }
    public required string Folio { get; set; }
    public required string Cliente { get; set; }
    public int IdMovimiento { get; set; }
    public int? IdAgente { get; set; }
    public required string NombreProducto { get; set; }
    public string? Descripcion { get; set; }
    public double Neto { get; set; }
    public double Descuento { get; set; }
    public double Comision { get; set; }
    public double Utilidad { get; set; }
    public double UtilidadAngie { get; set; }
    public double IvaAngie { get; set; }
    public double IsrAngie { get; set; }
    public double IvaRetenido { get; set; }
    public string? Observaciones { get; set; }

}

