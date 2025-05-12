using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace ERP.Infrastructure.Data.Configurations;

public class ComentariosConfiguration : IEntityTypeConfiguration<Comentarios>
{
    public void Configure(EntityTypeBuilder<Comentarios> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.IdAgente).IsRequired();
        builder.Property(c => c.Periodo).IsRequired().HasColumnType("Date");
    }
}
