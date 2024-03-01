using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace ERP.Infrastructure.Extensions;

public static class AddIdentity
{
    public static IServiceCollection AddMyIdentity(this IServiceCollection services)
    {
        // AddIdentity adds addAuthentication & addCookie
        // builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        // .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);

        services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddDefaultTokenProviders()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddClaimsPrincipalFactory<ErpClaimsFactory>();

        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireDigit = false;
        });

        services.ConfigureApplicationCookie(config => { config.Cookie.Name = "ERP.Cookie"; });
        return services;
    }
}