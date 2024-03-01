using ERP.Domain.Entities;
using ERP.Infrastructure.AuthFeatures;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace ERP.Infrastructure.Data;

public static class ApplicationInitialiser
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();

        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    private const string AdminRole = "Administrator";
    private const string AdminUser = "Admin";


    public ApplicationDbContextInitialiser(
        ApplicationDbContext context, UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            await _context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while initialising the database {Ex}", ex);
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while seeding the database {Ex}", ex);
            throw;
        }
    }

    private Task TrySeedAsync()
    {
        Log.Debug("Seeding Data");

        if (!_roleManager.RoleExistsAsync(AdminRole).Result) CreateAdminRole(_roleManager);


        var admin = _userManager.FindByNameAsync(AdminUser).Result;

        if (admin != null) return Task.CompletedTask;

        CreateAdminUser(_userManager);
        return Task.CompletedTask;
    }


    private static void CreateAdminUser(UserManager<ApplicationUser> userMgr)
    {
        var admin = new ApplicationUser()
        {
            UserName = AdminUser,
            Name = "John Doe",
            Email = "admin@gmail.com",
            ProfilePictureUrl = "https://avatars.githubusercontent.com/u/20118398?v=4"
        };

        var result = userMgr.CreateAsync(admin, "Nolose99!").Result;
        if (!result.Succeeded) throw new Exception(result.Errors.First().Description);

        result = userMgr.AddToRoleAsync(admin, AdminRole).Result;

        if (!result.Succeeded) throw new Exception(result.Errors.First().Description);

        Log.Information("User {Admin} created", admin.UserName);
    }

    private static void CreateAdminRole(RoleManager<ApplicationRole> roleMgr)
    {
        var permissions = Enum.GetValues<Permissions>()
            .Where(p => Enum.GetName(typeof(Permissions), p)!.EndsWith("AllAccess"))
            .ToList();

        var packPermissions = permissions.Aggregate("", (s, permission) => s + (char)permission);

        var role = new ApplicationRole
        {
            Name = AdminRole,
             Description = "Administrator has access to everything",
             Permissions = packPermissions
        };


        var result = roleMgr.CreateAsync(role).Result;
        if (!result.Succeeded) throw new Exception(result.Errors.First().Description);

        Log.Information("Role {Role} created", role);

        CreateSellsRole(roleMgr);
    }

    private static void CreateSellsRole(RoleManager<ApplicationRole> roleMgr)
    {
        var permissions = Enum.GetValues<Permissions>()
            .Where(p => Enum.GetName(typeof(Permissions), p)!.StartsWith("Order"))
            .ToList();

        var packPermissions = permissions.Aggregate("", (s, permission) => s + (char)permission);

        var role = new ApplicationRole
        {
            Name = "Sells",
            Description = "Sell has access to everything related with Orders",
            Permissions = packPermissions
        };


        var result = roleMgr.CreateAsync(role).Result;
        if (!result.Succeeded) throw new Exception(result.Errors.First().Description);

        Log.Information("Role {Role} created", role);
    }
}
