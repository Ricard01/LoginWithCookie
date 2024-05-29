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
        // AddIdentity adds addAuthentication & addCookie
        services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddDefaultTokenProviders()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddClaimsPrincipalFactory<ErpClaimsFactory>();


        //By default, cookie authentication redirects the user to the login URL if authentication failed. Hence, we’re setting the delegate function options.Events.OnRedirectToLogin with a lambda expression. This expression returns an unauthorized HTTP status code 401.
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                // options.Cookie.HttpOnly = true;
                // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                // options.ExpireTimeSpan = TimeSpan.FromSeconds(10);
                // options.SlidingExpiration = true;
                options.Cookie.SameSite = SameSiteMode.Strict;


                // options.Events.OnRedirectToLogin = context =>
                // {
                //     Log.Information("Context", context);
                //     if (context.Request.Path.StartsWithSegments("/api"))
                //     {
                //         context.Response.StatusCode = 401; // Para API, responde con 401
                //     }
                //     else
                //     {
                //         context.Response.Redirect(context.RedirectUri); // Para no-API, redirige al login
                //     }
                //     return Task.CompletedTask;
                // };
                //
                // options.Events.OnRedirectToAccessDenied = context =>
                // {
                //     if (context.Request.Path.StartsWithSegments("/api"))
                //     {
                //         context.Response.StatusCode = 403; // Para API, responde con 403
                //     }
                //     else
                //     {
                //         context.Response.Redirect(context.RedirectUri); // Para no-API, redirige a acceso denegado
                //     }
                //     return Task.CompletedTask;
                // };
            });

        services.ConfigureApplicationCookie(options =>
        {
            
            options.Cookie.HttpOnly = true;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            options.SlidingExpiration = true;
            options.Cookie.SameSite = SameSiteMode.Strict;
            
            options.ExpireTimeSpan = TimeSpan.FromSeconds(30);
            options.LoginPath = "/login";

            options.Events.OnRedirectToLogin = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = 401; // Para API, responde con 401
                }
                else
                {
                    context.Response.Redirect(context.RedirectUri); // Para no-API, redirige al login
                }

                return Task.CompletedTask;
            };
            Log.Information("Hey");
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