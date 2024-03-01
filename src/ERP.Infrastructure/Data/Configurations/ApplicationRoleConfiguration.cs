
using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ERP.Infrastructure.Data.Configurations;

public class ApplicationRoleConfiguration : IEntityTypeConfiguration<ApplicationRole>
{
    public void Configure(EntityTypeBuilder<ApplicationRole> builder)
    {
        builder.ToTable("ANY.Roles");

        builder.Property(r => r.Id).HasColumnOrder(0);
        builder.Property(r => r.Name).HasColumnOrder(1);
        builder.Property(r => r.Description).HasColumnOrder(2);
        builder.Property(r => r.Permissions).HasColumnOrder(3);
        builder.Property(r => r.NormalizedName)
            .HasColumnOrder(4); // Si se ignora los campos por default marca error CreateAsync
        builder.Property(r => r.ConcurrencyStamp).HasColumnOrder(5);
    }
}