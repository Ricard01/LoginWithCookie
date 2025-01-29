using ERP.Domain.Entities;
using ERP.Infrastructure.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace ERP.Infrastructure.Data;

public class CompacDbContext : DbContext, ICompacDbContext
{
    private ILoggerFactory GetLoggerFactory()
    {
        IServiceCollection serviceCollection = new ServiceCollection();
        serviceCollection.AddLogging(builder =>
        builder.AddConsole()
        .AddFilter(DbLoggerCategory.Database.Command.Name,
        LogLevel.Information));
        return serviceCollection.BuildServiceProvider()
        .GetService<ILoggerFactory>();
    }


    public CompacDbContext(DbContextOptions<CompacDbContext> options) : base(options) { }

    public DbSet<AdmDocumentos> AdmDocumentos => Set<AdmDocumentos>();

    public DbSet<AdmMovimientos> AdmMovimientos => Set<AdmMovimientos>();

    public DbSet<AdmProductos> AdmProductos => Set<AdmProductos>();

    public DbSet<AdmAgentes> AdmAgentes => Set<AdmAgentes>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLoggerFactory(GetLoggerFactory());
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(CompacDbContext).Assembly);
     
    }
}
