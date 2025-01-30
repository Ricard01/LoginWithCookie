using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Factura> Facturas { get; }

    DbSet<Movimiento> Movimientos { get; }

    DbSet<Agente> Agentes { get; }

    Task<int> SaveChangesAsync();
}