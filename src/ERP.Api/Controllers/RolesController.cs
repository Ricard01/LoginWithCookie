using ERP.Infrastructure.AuthFeatures;
using ERP.Infrastructure.Common.Models;
using ERP.Infrastructure.Repositories.Roles;
using ERP.Infrastructure.Repositories.Roles.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public class RolesController : ApiControllerBase
{
    private readonly IRoleRepository _roleRepository;

    public RolesController(IRoleRepository roleRepository)
    {
        _roleRepository = roleRepository;
    }

    // When a user is created i need to call All the roles so i can asign any... so i need give this permission to the users
    [HttpGet]
    public async Task<ActionResult<RolesVm>> Get()
    {
        var roles = await _roleRepository.GetAll();
        return Ok(roles);
    }


    [HttpGet("{roleId}")]
    public async Task<ActionResult<RoleDto>> Get(Guid roleId)
    {
        var rol = await _roleRepository.GetAsync(roleId);

        return Ok(rol);
    }


    [HttpGet("permissions")]
    public async Task<ActionResult<List<GroupPermissions>>> GetPermissions()
    {
        return await _roleRepository.GetPermissions();
    }


    [HttpPost]
    public async Task<ActionResult> Post([FromBody] Role roleRequest)
    {
        var result = await _roleRepository.CreateAsync(roleRequest);

        return Ok(result);
    }


    [HttpPatch("{roleId}")]
    public async Task<IActionResult> Patch(Guid roleId, [FromBody] Role roleRequest)
    {
        return Ok(await _roleRepository.UpdateAsync(roleId, roleRequest));
    }


    [HttpDelete("{roleId}")]
    public async Task<ActionResult> Delete(Guid roleId)
    {
        var result = await _roleRepository.DeleteAsync(roleId);

        return Ok(result);
    }
}