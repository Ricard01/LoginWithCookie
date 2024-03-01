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

    public ErpClaimsFactory( UserManager<ApplicationUser> userManager,
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

        var userId = identity.Claims.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        
        if (_userManager.SupportsUserRole)
        {
            var roles = await _userManager.GetRolesAsync(user);


            // I Will only allow one rol per user because lets imagine the next scenario: 
            // User : Supervisor Mexico Zona A | Roles : RolMexCityA , RolMexCityB, RolMexCitiC (this will save time if the permissions
            // are exactly what the user needs but if a single permissions is no need it then we have a create a different rol lets say
            // RoleMexCitaAWithouCancelPermission , well it will be cleaner just create a single rol named SupervisorZoneA that 3 different Roles without X Perm)
            // in my experience is easier to manage single rol per user than same roles with kinda similar permissions quicky gets messy


            foreach (var role in roles)
            {
                var permInRole = await _context.Roles.Where(r => r.Name == role)
                    .Select(r => r.Permissions).FirstOrDefaultAsync();


                if (permInRole != null)   identity.AddClaim(new Claim(Constants.ClaimTypePermissions, permInRole));
            }
        }
        
        identity.AddClaim(new Claim("ContactName", "user.ContactName" ));
        

        return identity;
    }
}