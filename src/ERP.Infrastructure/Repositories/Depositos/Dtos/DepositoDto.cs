namespace ERP.Infrastructure.Repositories.Depositos.Dtos;

public class DepositoDto
{
    public int Id { get; set; }
    public int IdAgente { get; set; }
    public double Importe { get; set; }
    public DateTime Periodo { get; set; }
    public string? Comentario { get; set; }
}

