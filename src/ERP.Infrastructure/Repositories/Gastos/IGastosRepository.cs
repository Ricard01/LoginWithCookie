using ERP.Infrastructure.Repositories.Dtos;
using ERP.Infrastructure.Repositories.Gastos.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Infrastructure.Repositories.Gastos;

public interface IGastosRepository
{
    Task SincronizarGastosAsync(DateTime periodo);
 
    /// <summary>
    /// Lista de Facturas
    /// </summary>
    /// <returns>Obtiene la lista de facturas de mi Bd (primero se extraen de la Bd de Compac) .</returns>
    Task<List<GastosDto>> GetGastos(DateTime periodo);

    Task<double> GetGastosOficina(DateTime periodo);

    Task<List<GastosDto>> GetGastosAgente(int IdAgente, DateTime periodo);

    Task<MovimientoDto> UpdateMovtoGastoAsync(int Id, MovimientoDto movto);
    
}