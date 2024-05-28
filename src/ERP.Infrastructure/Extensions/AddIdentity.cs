using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;

namespace ERP.Infrastructure.Extensions;

public static class AddIdentity
{
    public static IServiceCollection AddMyIdentity(this IServiceCollection services)
    {
        Log.Information("DENTRO DE ADD MY IDENTITY");
        // AddIdentity adds addAuthentication & addCookie
        services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddDefaultTokenProviders()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddClaimsPrincipalFactory<ErpClaimsFactory>();
        
        
        //By default, cookie authentication redirects the user to the login URL if authentication failed. Hence, we’re setting the delegate function options.Events.OnRedirectToLogin with a lambda expression. This expression returns an unauthorized HTTP status code 401.
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {   Log.Information("Inside COOKIE...");
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(1);
                options.SlidingExpiration = true;
                options.Cookie.SameSite = SameSiteMode.Strict;

                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
           
                options.Events.OnValidatePrincipal = async context =>
                {
                    var userPrincipal = context.Principal;
                    
                    Log.Information("OUTSIDE IF: {User}", userPrincipal!.Identity!.Name);
                    
                    if (userPrincipal == null || !userPrincipal.Identity!.IsAuthenticated)
                    {
                        context.RejectPrincipal();
                        await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                    }
                    else
                    {
                        // Log details about the principal
                     
                        //var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                        Log.Information("Validating principal: {User}", userPrincipal.Identity.Name);
                    }
                };
            });

        
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