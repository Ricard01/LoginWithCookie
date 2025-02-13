using ERP.Infrastructure.Repositories.Doctos.Dtos;

namespace ERP.Infrastructure.Repositories.Doctos;

public interface IDoctosRepository
{
 
    /// <summary>
    /// Lista de Facturas
    /// </summary>
    /// <returns>Obtiene la lista de facturas de mi Bd (primero se extraen de la Bd de Compac) .</returns>
    Task<FacturasVm> GetFacturas(DateTime periodo);


    /// <summary>
    /// Lista de compras
    /// </summary>
    /// <returns>Obtiene la lista de facturas(gastos) de mi Bd (primero se extraen de la Bd de Compac) .</returns>
    Task<ComprasVm> GetCompras(DateTime periodo);



    ///<summary> Get a single Doctos by Id </summary>
    ///<remarks> Gets a single Doctos by Id with his specific role</remarks>
    ///<returns>Single Doctos with role</returns>
    //Task<DoctosDto> Get(Guid DoctosId);


    /// <summary>
    /// Creates the Doctos with role
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    //Task<Result> CreateAsync(CreateDoctos DoctosRequest);


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