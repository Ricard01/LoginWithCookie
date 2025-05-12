namespace ERP.Domain.Entities;

public class Comentarios
{
    public int Id { get; set; }
    public int IdAgente { get; set; }
    public DateTime Periodo { get; set; }
    public string? Comentario { get; set; }
}
