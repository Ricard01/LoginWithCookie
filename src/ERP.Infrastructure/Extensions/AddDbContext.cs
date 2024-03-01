using ERP.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ERP.Infrastructure.Extensions;

public static class AddDbContext
{
    public static IServiceCollection AddMyDbContext(this IServiceCollection services, IConfiguration configuration)
    {    
        var mySqlConnection = configuration.GetConnectionString("MySQL");

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection));
        });
        
        return services;
    }
}