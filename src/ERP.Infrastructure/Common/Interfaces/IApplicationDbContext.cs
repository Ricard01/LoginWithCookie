using ERP.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ERP.Infrastructure.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Documentos> Documentos { get; }

    DbSet<Movimiento> Movimientos { get; }

    DbSet<Agente> Agentes { get; }

    Task<int> SaveChangesAsync();

    EntityEntry Entry(object entity);//para poder modificar el estado de una entidad(campos individuales)
}