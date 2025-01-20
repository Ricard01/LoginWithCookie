
using ERP.Infrastructure.Common.Models;
using ERP.Infrastructure.Repositories.Doctos.Dtos;

namespace ERP.Infrastructure.Repositories.Doctos;

public interface IDoctosRepository
{
 
    /// <summary>
    /// List of Doctos with roles
    /// </summary>
    /// <returns>List of all the Doctos with roles.</returns>
    Task<DoctosVm> Get();

    
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
    /// Updates the Doctos information with role
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    //Task<Result> UpdateAsync(Guid DoctosId, UpdateDoctos DoctosRequest);

    
    /// <summary>
    /// Deletes the Doctos by id
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    //Task<Result> DeleteAsync(Guid DoctosId);
    
}