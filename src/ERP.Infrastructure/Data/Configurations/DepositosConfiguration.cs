using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ERP.Infrastructure.Data.Configurations;

public class DepositosConfiguration : IEntityTypeConfiguration<Depositos>
{
    public void Configure(EntityTypeBuilder<Depositos> builder)
    {
        builder.HasKey(d => d.Id);
        builder.Property(d => d.IdAgente).IsRequired();
        builder.Property(d => d.Periodo).IsRequired().HasColumnType("Date");

    }
}
