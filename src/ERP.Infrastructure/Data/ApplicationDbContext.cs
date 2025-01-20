using System.Reflection;
using System.Reflection.Emit;
using ERP.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid,
    IdentityUserClaim<Guid>, ApplicationUserRole, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>,
    IdentityUserToken<Guid>>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {

        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

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