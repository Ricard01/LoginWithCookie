using System.Reflection;
using ERP.Infrastructure.AuthFeatures.Policy;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Extensions;
using ERP.Infrastructure.Repositories.Doctos;
using ERP.Infrastructure.Repositories.Roles;
using ERP.Infrastructure.Repositories.Users;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        builder.Services.AddMainDbContext(builder.Configuration);
        builder.Services.AddCompacDbContext(builder.Configuration);

        builder.Services.AddScoped<ICompacDbContext, CompacDbContext>();

        builder.Services.AddScoped<ApplicationDbContextInitialiser>();

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IRoleRepository, RoleRepository>();
        builder.Services.AddScoped<IDoctosRepository, DoctosRepository>();

        builder.Services.AddAuthorization();


        builder.Services.AddControllersWithViews(options =>
        {
            //  Se aplica automáticamente a todas las acciones de los controladores que manejan solicitudes HTTP que modifican datos (como POST, PUT, DELETE) Y
            // valida automáticamente los antiforgery tokens en las solicitudes entrantes para asegurarse de que la solicitud se originó desde la propia aplicación
            // y no desde un sitio externo malicioso.
            options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
        });

        // Configuración del servicio de antifalsificación
        builder.Services.AddAntiforgery(options => options.HeaderName = "ANY-XSRF-TOKEN");


        builder.Services.AddAutoMapper(Assembly.GetAssembly(typeof(ApplicationDbContext)));

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


        // Si el usuario está autenticado, obtiene un token antiforgery y lo almacena en una cookie con nombre ANY-XSRF-TOKEN, que Angular puede leer.
        app.Use(async (context, next) =>
        {
            // Console.WriteLine($"Request Path: {context.Request.Path}, Authenticated: {context.User.Identity.IsAuthenticated}");

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

            await next(context);
        });


        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html");


        return app;
    }
}