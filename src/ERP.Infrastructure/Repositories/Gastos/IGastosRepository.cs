using ERP.Infrastructure.Repositories.Dtos;
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

    Task<MovimientoDto> UpdateMovtoGastoAsync(int Id, MovimientoDto movto);

}