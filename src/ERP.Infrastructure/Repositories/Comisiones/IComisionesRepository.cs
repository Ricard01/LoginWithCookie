using ERP.Infrastructure.Repositories.Comisiones.Dtos;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using ERP.Infrastructure.Repositories.Dtos;

namespace ERP.Infrastructure.Repositories.Comisiones;

public interface IComisionesRepository
{

    /// <summary>
    /// Updates the Movto information for Ricardo
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    Task<MovimientoComisionRicardoDto> UpdateMovtoComisionRicardoAsync(int MovtoId, MovimientoComisionRicardoDto movto);

    /// <summary>
    /// Updates the Movto information for Angie
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    Task<MovimientoComisionAngieDto> UpdateMovtoComisionAngieAsync(int MovtoId, MovimientoComisionAngieDto movto);

    /// <summary>
    /// Obtiene la lista de Comisiones de Angelica
    /// </summary>
    /// <returns>Regresa la lista de comisiones de Angelica y Ambos 
    Task<List<ComAngelicaDto>> GetComisionesAngie(DateTime periodo);

    Task<ResumenComisionVm> GetResumenComisionesAngie(DateTime periodo);


    /// <summary>
    /// Obtiene la lista de Comisiones de Ricardo
    /// </summary>
    /// <returns>Regresa la lista rde comisiones de Ricardo y Ambos 
    Task<List<ComisionRDto>> GetComisionesRicardo(DateTime periodo);



    /// <summary>
    /// Obtiene la lista de Comisiones de Ricardo
    /// </summary>
    /// <returns>Regresa la lista rde comisiones de Ricardo y Ambos 
    Task<List<ComisionDto>> GetComisionesAmbos(DateTime periodo);



}