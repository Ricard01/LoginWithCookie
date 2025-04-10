using ERP.Domain.Entities;
using ERP.Infrastructure.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Repositories.Comentario;

public class ComentarioRepository : IComentarioRepository
{
    private readonly IApplicationDbContext _context;

    public ComentarioRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ComentarioDto?> GetComentarioAgentePorPeriodo(int idAgente, DateTime periodo)
    {
        return await _context.Comentarios
            .Where(x => x.IdAgente == idAgente && x.Periodo == periodo)
            .Select(x => new ComentarioDto
            {
                Id = x.Id,
                IdAgente = x.IdAgente,
                Periodo = x.Periodo,
                Comentario = x.Comentario
            })
            .SingleOrDefaultAsync();
    }

    public async Task<ComentarioDto> GuardarOActualizarComentario(ComentarioDto dto)
    {
        

        Comentarios comentario;

        if (dto.Id > 0)
        {
            comentario = await _context.Comentarios.FirstOrDefaultAsync(c => c.Id == dto.Id);

            if (comentario == null)
                throw new InvalidOperationException($"No se encontró un comentario con Id {dto.Id} para actualizar.");

            comentario.IdAgente = dto.IdAgente;
            comentario.Periodo = dto.Periodo;
            comentario.Comentario = dto.Comentario;
        }
        else
        {
            comentario = new Comentarios
            {
                IdAgente = dto.IdAgente,
                Periodo = dto.Periodo,
                Comentario = dto.Comentario
            };

            _context.Comentarios.Add(comentario);
        }

        await _context.SaveChangesAsync();

        dto.Id = comentario.Id;
        return dto;
    }

}
