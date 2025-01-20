
using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ERP.Infrastructure.Data.Configurations;

public class AdmDocumentosConfiguration : IEntityTypeConfiguration<AdmDocumentos>
{
    public void Configure(EntityTypeBuilder<AdmDocumentos> builder)
    {
      
    }
}