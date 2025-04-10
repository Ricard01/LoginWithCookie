using AutoMapper;
using AutoMapper.QueryableExtensions;
using ERP.Domain.Entities;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Common.Models;
using ERP.Infrastructure.Repositories.Users.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Repositories.Users;

public class UserRepository : IUserRepository
{

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    private readonly IMapper _mapper;

    public UserRepository(UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager, IMapper mapper)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
    }


    public async Task<UsersVm> Get()
    {
        return new UsersVm
        {
            Users = await _userManager.Users
                .AsNoTracking()
                .OrderBy(u => u.UserName)
                .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .ToListAsync()
        };
    }


    public async Task<UserDto> Get(Guid userId)
    {
        var user = await _userManager.Users
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new NotFoundException(nameof(ApplicationUser), userId);
        }

        return user;
    }


    public async Task<Result> CreateAsync(CreateUser userRequest)
    {
        var roleExists = await _roleManager.RoleExistsAsync(userRequest.RoleName);

        if (!roleExists)
        {
            return IdentityResult.Failed(new IdentityError
            { Description = $"Role {userRequest.RoleName} doesn't exist" })
                .ToApplicationResult();
        }

        var user = new ApplicationUser
        {
            UserName = userRequest.UserName,
            Name = userRequest.Name,
            Email = userRequest.Email,
            //CreatedAt = DateTime.Now
        };

        var result = await _userManager.CreateAsync(user, userRequest.Password);

        if (result.Succeeded)
        {
            // doesn't return error if roleName doesnt exists so i made the first validation roleExists
            await _userManager.AddToRoleAsync(user, userRequest.RoleName);

            return result.ToApplicationResult(user.Id, true);
        }

        // if something when wrong creating the user
        return result.ToApplicationResult();
    }


    public async Task<Result> UpdateAsync(Guid userId, UpdateUser userRequest)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) throw new NotFoundException(nameof(ApplicationUser), userId);

        user.Name = userRequest.Name;
        user.ProfilePictureUrl = userRequest.ProfilePictureUrl;
        user.Email = userRequest.Email;

        var result = await _userManager.UpdateAsync(user);


        if (result.Succeeded)
        {
            var roleResult = await UpdateRoleAsync(user, userRequest.RoleName);
            return roleResult.ToApplicationResult();
        }

        // If something when wrong in the update, return the result indicating failure

        return result.ToApplicationResult();
    }

    private async Task<IdentityResult> UpdateRoleAsync(ApplicationUser user, string userRequestRole)
    {
        // Note: I'm only allowing one role per user. 
        var roleCheckResult = await RoleExists(userRequestRole);

        if (!roleCheckResult.Succeeded) return roleCheckResult;

        var currentRoles = await _userManager.GetRolesAsync(user);
        var currentRole = currentRoles.FirstOrDefault();

        if (currentRole != userRequestRole)
        {
            var removeResult = await _userManager.RemoveFromRoleAsync(user, currentRole);

            if (!removeResult.Succeeded) return removeResult;

            var addResult = await _userManager.AddToRoleAsync(user, userRequestRole);

            if (!addResult.Succeeded) return addResult;
        }

        // Return success if no role change needed or role change was successful
        return IdentityResult.Success;
    }

    private async Task<IdentityResult> RoleExists(string userRequestRole)
    {
        var roleExists = await _roleManager.RoleExistsAsync(userRequestRole);

        if (!roleExists)
            return IdentityResult.Failed(new IdentityError
            { Description = $"Role {userRequestRole} doesn't exist" });

        return IdentityResult.Success;
    }


    public async Task<Result> DeleteAsync(Guid userId)
    {
        // if (new Guid(_currentUserService.UserId) == userId)
        // {
        //     return IdentityResult.Failed(new IdentityError
        //         { Description = $"Can't delete the user that you are currently logged in" }).ToApplicationResult();
        //     ;
        // }

        var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

        if (user == null)
        {
            var result = IdentityResult.Failed(new IdentityError { Description = $"User with id {userId} not Found" });
            return result.ToApplicationResult();
        }

        return await DeleteAsync(user);
    }


    private async Task<Result> DeleteAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);

        return result.ToApplicationResult();
    }
}