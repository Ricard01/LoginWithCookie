
using ERP.Infrastructure.AuthFeatures;
using ERP.Infrastructure.Common.Models;
using ERP.Infrastructure.Repositories.Roles.Dtos;

namespace ERP.Infrastructure.Repositories.Roles;

public interface IRoleRepository
{
    /// <summary>
    ///     List of roles
    /// </summary>
    /// <returns>List of all the roles.</returns>
    Task<RolesVm> GetAll();

    ///<summary> Get a single rol by Id </summary>
    ///<remarks> Gets a single rol by Id with his specific users</remarks>
    ///<returns>Single user with roles</returns>
    Task<RoleDto> GetAsync(Guid roleId);


    //     /// <summary>
    //     ///     Creates the role with claims
    //     /// </summary>
    //     /// <returns>The result from and identityResult operation </returns>
    Task<Result> CreateAsync(Role roleRequest);
    //
    //     /// <summary>
    //     ///     Updates the roles name
    //     /// </summary>
    //     /// <returns>The result from and identityResult operation </returns>
    Task<Result> UpdateAsync(Guid roleId, Role roleRequest);
    //
    //     /// <summary>
    //     ///     Deletes the role by id
    //     /// </summary>
    //     /// <returns>The result from and identityResult operation </returns>
    Task<Result> DeleteAsync(Guid roleId);

    Task<List<GroupPermissions>> GetPermissions();
}