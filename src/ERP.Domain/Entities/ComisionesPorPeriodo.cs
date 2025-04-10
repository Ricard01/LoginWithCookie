namespace ERP.Domain.Entities;

public class ComisionesPorPeriodo
{
    public int Id { get; set; }
    public int IdAgente { get; set; }
    public DateTime Periodo { get; set; }
    public double ComisionPersonal { get; set; }
    public double ComisionCompartida { get; set; }
    public double TotalComisionPagada { get; set; }
}
