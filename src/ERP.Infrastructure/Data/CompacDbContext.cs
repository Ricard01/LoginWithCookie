using ERP.Domain.Entities;
using ERP.Infrastructure.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reflection;
using System.Reflection.Emit;
using System.Xml;

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

    public DbSet<AdmAsocCargosAbonos> AdmAsocCargosAbonos => Set<AdmAsocCargosAbonos>();    

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLoggerFactory(GetLoggerFactory());
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {

        // Excluir todas las entidades de las migraciones
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            entityType.SetIsTableExcludedFromMigrations(true);
        }

        base.OnModelCreating(builder);

    
        builder.Entity<AdmAsocCargosAbonos>()
            .HasKey(a => a.CIDAUTOINCSQL);

        // Relación de DocumentoCargo (Factura que recibe pagos)
        builder.Entity<AdmAsocCargosAbonos>()
            .HasOne(a => a.DocumentoCargo)
            .WithMany(d => d.AdmAsocCargosAbonos)
            .HasForeignKey(a => a.CIDDOCUMENTOCARGO)
            .OnDelete(DeleteBehavior.Restrict); // No eliminar en cascada

        // Relación de DocumentoAbono (Pago realizado)
        builder.Entity<AdmAsocCargosAbonos>()
            .HasOne(a => a.DocumentoAbono)
            .WithMany() // No necesita relación inversa
            .HasForeignKey(a => a.CIDDOCUMENTOABONO)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
