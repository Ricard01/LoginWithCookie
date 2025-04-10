namespace ERP.Domain.Entities;

public class Depositos
{
    public int Id { get; set; }
    public int IdAgente { get; set; }
    public double Importe { get; set; }
    public DateTime Periodo { get; set; }
    public string? Comentario { get; set; }
}
