namespace ERP.Domain.Entities;

public class Agente
{
    public int Id { get; set; }
    public string Nombre { get; set; }

    public virtual ICollection<Movimiento> Movimientos { get; set; } = new List<Movimiento>();
}
