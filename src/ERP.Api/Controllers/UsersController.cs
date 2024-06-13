using ERP.Infrastructure.Common.Models;
using ERP.Infrastructure.Repositories.Users;
using ERP.Infrastructure.Repositories.Users.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public class UsersController : ApiControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }


    [HttpGet]
    // [Requires(Permissions.UserAllAccess)]
    public async Task<ActionResult<UsersVm>> Get()
    {
        var users = await _userRepository.Get();
        
        return Ok(users);
    }

    // [Requires(PermissionOperator.Or, Permissions.UserAllAccess, Permissions.UserRead)]
    [HttpGet("{userId}")]
    public async Task<ActionResult<UserDto>> Get(Guid userId)
    {
        // var id = new Guid(userId);
        var user = await _userRepository.Get(userId);

        return Ok(user);
    }

    [HttpPost]
    // [Requires(PermissionOperator.And, Permissions.UserAllAccess, Permissions.OrderAllAccess)]
    public async Task<ActionResult> Post([FromBody] CreateUser userRequest)
    {
        var result = await _userRepository.CreateAsync(userRequest);


        return Ok(result);
    }

// Nota: Si no se envian todos las propiedades el sistema las toma por null asi que es neceario enviarlas en el request. 
    [HttpPatch("{userId}")]
    // [Requires(Permissions.UserAllAccess)]
    public async Task<IActionResult> Patch(Guid userId, [FromBody] UpdateUser userRequest)
    {
        var result = await _userRepository.UpdateAsync(userId, userRequest);

        return Ok(result);
    }


    [HttpDelete("{userId}")]
    public async Task<ActionResult> Delete(Guid userId)
    {
        var result = await _userRepository.DeleteAsync(userId);

        return Ok(result);
    }
}