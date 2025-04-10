using ERP.Infrastructure.Common.Interfaces;
using ERP.Infrastructure.Repositories.Depositos.Dtos;
using Microsoft.EntityFrameworkCore;
using DepositoEntity = ERP.Domain.Entities.Depositos;

namespace ERP.Infrastructure.Repositories.Depositos;

public class DepositosRepository : IDepositosRepository
{
    private readonly IApplicationDbContext _context;

    public DepositosRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<DepositoDto>> GetDepositos(int IdAgente, DateTime periodo)
    {
        return await _context.Depositos
            .Where(c => c.IdAgente == IdAgente && c.Periodo == periodo)
            .Select(c => new DepositoDto
            {
                Id = c.Id,
                IdAgente = c.IdAgente,
                Periodo = c.Periodo,
                Importe = c.Importe,
                Comentario = c.Comentario
            })
            .ToListAsync();
    }

    /// <summary>
    /// Inserta o actualiza (Upsert) una lista de depósitos para el agente y periodo indicados.
    /// </summary>
    /// <param name="depositosDto">Lista de depósitos a insertar o actualizar.</param>
    /// <param name="idAgente">Id del agente al que pertenecen los depósitos.</param>
    /// <param name="periodo">Periodo asociado a los depósitos.</param>
    /// <returns>Retorna la lista de depósitos ya actualizados/insertados con sus Id correspondientes.</returns>
    public async Task<List<DepositoDto>> UpsertDepositosAsync(List<DepositoDto> depositosDto, int idAgente, DateTime periodo)
    {
       
        if (depositosDto == null)
            throw new ArgumentNullException(nameof(depositosDto));
        if (idAgente <= 0)
            throw new ArgumentException("El Id del agente debe ser mayor a 0.", nameof(idAgente));

        foreach (var dto in depositosDto)
        {

            DepositoEntity? depositoEntity;

            if (dto.Id > 0)
            {
              
                depositoEntity = await _context.Depositos.FindAsync(dto.Id);
                if (depositoEntity == null)
                {
                    throw new InvalidOperationException($"No se encontró un depósito con Id {dto.Id} para actualizar.");
                }
                
                depositoEntity.Importe = dto.Importe;
                depositoEntity.Comentario = dto.Comentario;
               
            }
            else
            {
              
                depositoEntity = new DepositoEntity
                {
                    IdAgente = idAgente,
                    Periodo = periodo,
                    Importe = dto.Importe,
                    Comentario = dto.Comentario
                };
               
                await _context.Depositos.AddAsync(depositoEntity);
            }
        }

        await _context.SaveChangesAsync();

        // Devuelvo los depósitos del agente del respectivo periodo
        var depositosActualizados = await _context.Depositos
            .Where(d => d.IdAgente == idAgente && d.Periodo == periodo)
            .Select(d => new DepositoDto
            {
                Id = d.Id,
                IdAgente = d.IdAgente,
                Periodo = d.Periodo,
                Importe = d.Importe,
                Comentario = d.Comentario
               
            })
            .ToListAsync();

        return depositosActualizados;
    }

    public async Task<bool> Delete(int id)
    {
        var entity = await _context.Depositos.FindAsync(id);

        if(entity == null)  return false; 
        
        _context.Depositos.Remove(entity);
        return await _context.SaveChangesAsync() > 0;
       

    }

}