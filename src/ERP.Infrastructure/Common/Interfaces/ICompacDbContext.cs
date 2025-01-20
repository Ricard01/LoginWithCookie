using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Common.Interfaces;

public interface ICompacDbContext
{
    DbSet<AdmDocumentos> AdmDocumentos { get; }

    DbSet<AdmMovimientos> AdmMovimientos { get; }

    DbSet<AdmProductos> AdmProductos { get; }

}