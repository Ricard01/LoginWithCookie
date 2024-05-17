using ERP.Infrastructure.AuthFeatures.Policy;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace ERP.Api;

internal static class Extensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder, IConfiguration configuration)
    {
        builder.Services.AddScoped<ErpClaimsFactory>();

        builder.Services
            .AddSingleton<IAuthorizationPolicyProvider,
                AuthorizationPolicyProvider>(); // este orden tiene el ejemplo online
        builder.Services
            .AddScoped<IAuthorizationHandler,
                PermissionHandler>(); // en las primeras pruebas el orden no afecto el funcionamiento (AuthorizacionPolicy)

        builder.Services.AddMyIdentity();

        builder.Services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

        builder.Services.AddMyDbContext(builder.Configuration);

        builder.Services.AddScoped<ApplicationDbContextInitialiser>();

        builder.Services.AddAuthorization();

        builder.Services.AddControllers();


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

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html");

        return app;
    }
}