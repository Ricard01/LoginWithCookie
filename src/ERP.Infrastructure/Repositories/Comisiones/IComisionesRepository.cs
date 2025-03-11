using ERP.Infrastructure.Repositories.Doctos.Dtos;
using ERP.Infrastructure.Repositories.Dtos;

namespace ERP.Infrastructure.Repositories.Comisiones;

public interface IComisionesRepository
{
 
    


    /// <summary>
    /// Updates the Movto information 
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    Task<MovimientoDto> UpdateMovtoAsync(int MovtoId, MovimientoDto movto);


    /// <summary>
    /// Obtiene la lista de Comisiones de Angelica
    /// </summary>
    /// <returns>Regresa la lista de comisiones de Angelica y Ambos 
    Task<List<ComisionADto>> GetComisionesA(DateTime periodo);


    /// <summary>
    /// Obtiene la lista de Comisiones de Ricardo
    /// </summary>
    /// <returns>Regresa la lista rde comisiones de Ricardo y Ambos 
    Task<List<ComisionRDto>> GetComisionesR(DateTime periodo);



    /// <summary>
    /// Obtiene la lista de Comisiones de Ricardo
    /// </summary>
    /// <returns>Regresa la lista rde comisiones de Ricardo y Ambos 
    Task<List<ComisionDto>> GetComisiones(DateTime periodo);


    /// <summary>
    /// Deletes the Doctos by id
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    //Task<Result> DeleteAsync(Guid DoctosId);

}