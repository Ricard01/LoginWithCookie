using ERP.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ERP.Infrastructure.Extensions;

public static class AddDbContexts
{
    public static IServiceCollection AddMainDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
       options.UseSqlServer(configuration.GetConnectionString("Sql"),
           b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        return services;
    }

    public static IServiceCollection AddCompacDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CompacDbContext>(options =>
              options.UseSqlServer(configuration.GetConnectionString("SqlCONTPAQ"),
                  b => b.MigrationsAssembly(typeof(CompacDbContext).Assembly.FullName)));

        return services;
    }
}