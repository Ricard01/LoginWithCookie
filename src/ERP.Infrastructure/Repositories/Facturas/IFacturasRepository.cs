using ERP.Infrastructure.Repositories.Facturas.Dtos;

namespace ERP.Infrastructure.Repositories.Facturas;

public interface IFacturasRepository
{
 
    /// <summary>
    /// Lista de Facturas
    /// </summary>
    /// <returns>Obtiene la lista de facturas de mi Bd (primero se extraen de la Bd de Compac) .</returns>
    Task<FacturasVm> GetFacturasPagadas(DateTime periodo);




    /// <summary>
    /// Lista de Facturas
    /// </summary>
    /// <returns>Obtiene la lista de facturas que no se han pagado o que se pagaron en otro fecha.</returns>
    Task<FacturasVm> GetFacturasPendientes(DateTime periodo);


}