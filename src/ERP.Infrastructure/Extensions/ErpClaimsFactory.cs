using System.Security.Claims;
using ERP.Domain.Entities;
using ERP.Infrastructure.AuthFeatures;
using ERP.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ERP.Infrastructure.Extensions;

public class ErpClaimsFactory : UserClaimsPrincipalFactory<ApplicationUser>
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ErpClaimsFactory(UserManager<ApplicationUser> userManager,
        IOptions<IdentityOptions> optionsAccessor,
        ApplicationDbContext context)
        : base(userManager, optionsAccessor)
    {
        _context = context;
        _userManager = userManager;
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        
        var roles = await _userManager.GetRolesAsync(user);
        
        
        // I Will only allow one rol per user. Let's imagine the next scenario: 
        // User1 :[Supervisor Mexico ] | Roles : RolMexCityA , RolMexCityB, RolMexCitiC (this will save time if the permissions
        // are exactly what multiple users need's but if a single permissions is no need it then we have to create 3 different roles lets say
        // RoleMexCitaAWithouCancelPermission, B and C  well it will be cleaner just create a single rol that 3 different Roles without X Perm)
        // in my experience is easier to manage single rol per user than same roles with kinda similar permissions quicky gets messy
        
        if (roles.Count > 1)
        {
            throw new InvalidOperationException("Each user should have only one role.");
        }

        // Obtener los permisos asociados a ese rol
        var permissions = await _context.Roles
            .Where(r => r.Name == roles.Single())
            .Select(r => r.Permissions)
            .FirstOrDefaultAsync();

        // Agregar el permiso como un claim si no es nulo
        if (!string.IsNullOrEmpty(permissions))
        {
            identity.AddClaim(new Claim(Constants.ClaimTypePermissions, permissions));
        }
        
        return identity;
    }
}