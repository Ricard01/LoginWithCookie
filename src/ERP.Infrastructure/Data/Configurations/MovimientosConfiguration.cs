
using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;
using System.Reflection.Metadata;

namespace ERP.Infrastructure.Data.Configurations;

public class MovimientoConfiguration : IEntityTypeConfiguration<Movimiento>
{
    public void Configure(EntityTypeBuilder<Movimiento> builder)
    {


     //   builder.Property(r => r.Id).HasColumnOrder(0);
     //   builder
     //   .HasOne(e => e.Agentes)
     //.WithOne(e => e.Movimiento)
     //.HasForeignKey<Agente>("Id")
     //.IsRequired(false);

    }
}