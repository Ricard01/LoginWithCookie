
using ERP.Infrastructure.Common.Models;
using ERP.Infrastructure.Repositories.Users.Dtos;

namespace ERP.Infrastructure.Repositories.Users;

public interface IUserRepository
{

    /// <summary>
    /// List of users with roles
    /// </summary>
    /// <returns>List of all the users with roles.</returns>
    Task<UsersVm> Get();


    ///<summary> Get a single user by Id </summary>
    ///<remarks> Gets a single user by Id with his specific role</remarks>
    ///<returns>Single user with role</returns>
    Task<UserDto> Get(Guid userId);


    /// <summary>
    /// Creates the user with role
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    Task<Result> CreateAsync(CreateUser userRequest);


    /// <summary>
    /// Updates the user information with role
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    Task<Result> UpdateAsync(Guid userId, UpdateUser userRequest);


    /// <summary>
    /// Deletes the user by id
    /// </summary>
    /// <returns>The result from and identityResult operation </returns>
    Task<Result> DeleteAsync(Guid userId);

}