using ERP.Infrastructure.AuthFeatures.Policy;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Extensions;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace ERP.Api;

internal static class Extensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder, IConfiguration configuration)
    {
        // Servicios específicos de configuración
        builder.Services.AddScoped<ErpClaimsFactory>();

        // Servicios de autorización
        builder.Services.AddSingleton<IAuthorizationPolicyProvider, AuthorizationPolicyProvider>();
        builder.Services.AddScoped<IAuthorizationHandler, PermissionHandler>();

        // Servicios de identidad
        builder.Services.AddMyIdentity();

        // Configuración del contexto de datos
        builder.Services.AddMyDbContext(builder.Configuration);
        builder.Services.AddScoped<ApplicationDbContextInitialiser>();

        // Configuración de autorización
        builder.Services.AddAuthorization();

        // Configuración de controladores y filtros (añadir servicios necesarios)
        builder.Services.AddControllersWithViews(options =>
        {
            options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
        });

        // Configuración del servicio de antifalsificación
        builder.Services.AddAntiforgery(options => options.HeaderName = "ANY-XSRF-TOKEN");

        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment()) app.UseHsts();

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.Use(async (context, next) =>
        {
            if (context.User.Identity != null && context.User.Identity.IsAuthenticated)
            {
                var antiforgery = context.RequestServices.GetService<IAntiforgery>();
                if (antiforgery != null)
                {
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    if (tokens.RequestToken != null)
                    {
                        context.Response.Cookies.Append("ANY-XSRF-TOKEN", tokens.RequestToken,
                            new CookieOptions { HttpOnly = false }); // Necesario para que Angular pueda leer el token
                    }
                }
            }
            Console.WriteLine("Request Headers:");
            foreach (var header in context.Request.Headers)
            {
                Console.WriteLine($"{header.Key}: {header.Value}");
            }

            await next(context);
        });
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html");

        return app;
    }
}