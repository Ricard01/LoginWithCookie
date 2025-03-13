using ERP.Domain.Entities;
using ERP.Infrastructure.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace ERP.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid,
    IdentityUserClaim<Guid>, ApplicationUserRole, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>,
    IdentityUserToken<Guid>>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Documentos> Documentos => Set<Documentos>();

    public DbSet<Movimiento> Movimientos => Set<Movimiento>();

    public DbSet<Agente> Agentes => Set<Agente>();

    public Task<int> SaveChangesAsync()
    {
        return base.SaveChangesAsync();
    }

    public EntityEntry Entry(object entity) => base.Entry(entity);
    protected override void OnModelCreating(ModelBuilder builder)
    {

        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        builder.Entity<Agente>()
        .Property(x => x.Id)
        .UseIdentityColumn(seed: 0, increment: 1);

        // Configuración de la relación entre Factura y Movimiento
        builder.Entity<Documentos>()
            .HasMany(f => f.Movimientos) // Una Factura tiene muchos Movimientos
            .WithOne(m => m.Factura) // Un Movimiento pertenece a una Factura
            .HasForeignKey(m => m.IdComercial) // Clave foránea en Movimiento que apunta a IdComercial en Factura
            .HasPrincipalKey(f => f.IdComercial);


        builder.Entity<Movimiento>()
    .HasOne(m => m.Agente) // Un Movimiento puede tener un Agente
    .WithMany(a => a.Movimientos) // Un Agente puede estar en muchos Movimientos
    .HasForeignKey(m => m.IdAgente); // Clave foránea en Movimiento que apunta a Id en Agente


        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("ANY.Users");
        });

        // Configuración personalizada para otras tablas de Identity si es necesario
        builder.Entity<ApplicationRole>(entity =>
        {
            entity.ToTable("ANY.Roles");
        });

        builder.Entity<ApplicationUserRole>(entity =>
        {
            entity.ToTable("ANY.UserRoles");
            entity.HasKey(ur => new { ur.UserId, ur.RoleId });
        });
        // builder.Ignore<IdentityUserToken<Guid>>();
        // builder.Ignore<IdentityUserLogin<Guid>>();
        // builder.Ignore<IdentityUserClaim<Guid>>(); // Needed by Ef
        // builder.Ignore<IdentityRoleClaim<Guid>>();


        builder.Entity<ApplicationUser>(b =>
        {
            b.HasMany(u => u.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
        });

        builder.Entity<ApplicationRole>(b =>
        {
            b.HasMany(r => r.UserRoles)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();
        });
        builder.Entity<ApplicationRole>(b =>
        {
            // Each Role can have many entries in the UserRole join table
            b.HasMany(e => e.UserRoles)
                .WithOne(e => e.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();


        });

        //builder.Entity<ApplicationUserRole>(b =>
        //{
        //    b.HasKey(ur => new { ur.UserId, ur.RoleId });
        //});

        //builder.Ignore<ApplicationUserRole>();
        //builder.Entity<ApplicationUserRole>().HasNoKey();

    }

}