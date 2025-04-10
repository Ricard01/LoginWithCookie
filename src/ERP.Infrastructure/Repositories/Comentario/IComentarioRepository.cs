namespace ERP.Infrastructure.Repositories.Comentario;

public interface IComentarioRepository
{
    Task<ComentarioDto?> GetComentarioAgentePorPeriodo(int idAgente, DateTime periodo);

    Task<ComentarioDto> GuardarOActualizarComentario(ComentarioDto dto);
}

