using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace ERP.Infrastructure.Extensions;

public static class AddSwaggerGen
{
    public static IServiceCollection AddSwaggerConfig(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();

        services.AddSwaggerGen(options =>
        {

            options.CustomSchemaIds(type => type.FullName);

            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Mi API",
                Version = "v1",
                Description = "Documentación de mi API con Swagger",
                Contact = new OpenApiContact
                {
                    Name = "Ricardo Chavez",
                    Email = "rickardo.chavez@gmail.com"
                }
            });
        });

        return services;
    }
}