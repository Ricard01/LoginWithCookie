using ERP.Infrastructure.Repositories.Gastos.Dtos;

namespace ERP.Infrastructure.Repositories.Gastos;

public interface IGastosRepository
{
    Task SincronizarGastosAsync(DateTime periodo);
 
    /// <summary>
    /// Lista de Facturas
    /// </summary>
    /// <returns>Obtiene la lista de facturas de mi Bd (primero se extraen de la Bd de Compac) .</returns>
    Task<GastosVm> GetGastos(DateTime periodo);

    /// <summary>
    /// Lista de Facturas
    /// </summary>
    /// <returns>Obtiene la lista de facturas que no se han pagado o que se pagaron en otro fecha.</returns>
    //Task<FacturasVm> GetFacturasPendientes(DateTime periodo);

}