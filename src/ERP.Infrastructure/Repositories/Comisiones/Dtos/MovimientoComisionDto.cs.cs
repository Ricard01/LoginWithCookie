namespace ERP.Infrastructure.Repositories.Comisiones.Dtos;


public class MovimientoComisionBaseDto
{
    public int IdMovimiento { get; set; }
    public double IvaRetenido { get; set; }
    public string? Observaciones { get; set; }
}

public class MovimientoComisionAngieDto : MovimientoComisionBaseDto
{
    public double UtilidadAngie { get; set; }
    public double IsrAngie { get; set; }
    public double IvaAngie { get; set; }
}

public class MovimientoComisionRicardoDto : MovimientoComisionBaseDto
{
    public double UtilidadRicardo { get; set; }
    public double IsrRicardo { get; set; }
    public double IvaRicardo { get; set; }
}
