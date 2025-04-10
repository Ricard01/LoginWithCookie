using AutoMapper;
using ERP.Domain.Entities;
using ERP.Infrastructure.AuthFeatures;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Common.Models;
using ERP.Infrastructure.Repositories.Roles.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Repositories.Roles;

public class RoleRepository : IRoleRepository
{
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;

    private readonly IMapper _mapper;

    public RoleRepository(RoleManager<ApplicationRole> roleManager, IMapper mapper, UserManager<ApplicationUser> userManager)
    {
        _roleManager = roleManager;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<RolesVm> GetAll()
    {
        var roles = await _roleManager.Roles.ToListAsync();

        return new RolesVm
        {
            Roles = roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Permissions = r.Permissions?.UnpackPermissionsFromString().Select(x => x.ToString())
            }).ToList()
        };
    }

    public Task<List<GroupPermissions>> GetPermissions()
    {
        var dictList = PermissionDisplay.GetPermissionsToDisplay(typeof(Permissions))
            .GroupBy(p => p.GroupName)
            .ToDictionary(p => p.Key, p => p.ToList().ToList());

        var groupPermissions = new List<GroupPermissions>();

        foreach (var dict in dictList)
            groupPermissions.Add(new GroupPermissions { GroupName = dict.Key, Permissions = dict.Value });

        return Task.FromResult(groupPermissions);
    }


    public async Task<RoleDto> GetAsync(Guid roleId)
    {
        var rol = await _roleManager.FindByIdAsync(roleId.ToString());

        if (rol == null) throw new NotFoundException(nameof(ApplicationRole), roleId);

        return new RoleDto
        {
            Id = rol.Id,
            Name = rol.Name,
            Description = rol.Description,
            Permissions = rol.Permissions?.UnpackPermissionsFromString().Select(x => x.ToString()).ToList()
        };
    }


    public async Task<Result> CreateAsync(Role roleRequest)
    {
        // Validar y empaquetar permisos
        var (isValid, packedPermissions, errorMessage) = ValidateAndPackPermissions(roleRequest.Permissions);

        // Manejar el caso de fallo en la validación y empaquetación de permisos
        if (!isValid)
        {
            return Result.Failure(new string[] { errorMessage! });
        }


        var role = new ApplicationRole
        {
            Name = roleRequest.Name,
            Description = roleRequest.Description,
            Permissions = packedPermissions
        };

        var result = await _roleManager.CreateAsync(role);

        if (result.Succeeded)
        {
            return result.ToApplicationResult(role.Id, false);
        }

        return result.ToApplicationResult();
    }


    private static (bool isValid, string? packedPermissions, string? errorMessage) ValidateAndPackPermissions(
        IEnumerable<string> rolePermissions)
    {
        //Un HashSet es una colección que no permite duplicados.
        var validPermissions = new HashSet<Permissions>();

        var invalidPermissions = new List<string>();

        foreach (var permission in rolePermissions)
        {
            // 	Se verifica si la cadena permission es un nombre válido en el enum Permissions usando Enum.IsDefined.
            if (Enum.IsDefined(typeof(Permissions), permission))
            {
                // 	Si la cadena es válida, se convierte a su valor correspondiente en el enum Permissions usando Enum.Parse.
                var parsedPermission = (Permissions)Enum.Parse(typeof(Permissions), permission, true);

                //El valor convertido se agrega al conjunto de permisos válidos
                validPermissions.Add(parsedPermission);
            }
            else
            {
                invalidPermissions.Add(permission);
            }
        }

        // Verificar si hay permisos inválidos
        if (invalidPermissions.Any())
        {
            return (false, null, $"Invalid permissions: {string.Join(", ", invalidPermissions)}");
        }

        // Verificar si hay al menos un permiso válido
        if (!validPermissions.Any())
        {
            return (false, null, "No valid permissions provided. Ensure the permissions match the Enum.");
        }

        var packedPermissions = validPermissions.Aggregate("", (s, permission) => s + (char)permission);
        return (true, packedPermissions, null);
    }

    public async Task<Result> UpdateAsync(Guid roleId, Role roleRequest)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());

        if (role == null) throw new NotFoundException(nameof(ApplicationRole), roleId);


        var (isValid, packedPermissions, errorMessage) = ValidateAndPackPermissions(roleRequest.Permissions);


        if (!isValid)
        {
            return Result.Failure(new string[] { errorMessage! });
        }

        role.Name = roleRequest.Name;
        role.Description = roleRequest.Description;
        role.Permissions = packedPermissions;

        var result = await _roleManager.UpdateAsync(role);

        return result.ToApplicationResult();
    }



    public async Task<Result> DeleteAsync(Guid roleId)
    {
        var role = await _roleManager.FindByIdAsync(roleId.ToString());

        if (role == null)
        {
            var result = IdentityResult.Failed(new IdentityError { Description = $"Role with id {roleId} not Found" });
            return result.ToApplicationResult();
        }

        if (role.Name == "Administrator")
        {
            var result = IdentityResult.Failed(new IdentityError { Description = "The Administrator role cannot be deleted" });
            return result.ToApplicationResult();
        }

        var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
        var roleInAnyUser = usersInRole.Any();

        if (roleInAnyUser)
        {
            var result = IdentityResult.Failed(new IdentityError { Description = $"Role {role.Name} has user(s) assigned so it cannot be deleted" });
            return result.ToApplicationResult();
        }

        return await DeleteAsync(role);
    }


    private async Task<Result> DeleteAsync(ApplicationRole role)
    {
        var result = await _roleManager.DeleteAsync(role);

        return result.ToApplicationResult();
    }
}