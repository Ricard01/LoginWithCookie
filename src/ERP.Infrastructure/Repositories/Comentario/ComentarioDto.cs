namespace ERP.Infrastructure.Repositories.Comentario;

public class ComentarioDto
{
    public int Id { get; set; }
    public int IdAgente { get; set; }
    public DateTime Periodo { get; set; }
    public required string Comentario { get; set; }
}
