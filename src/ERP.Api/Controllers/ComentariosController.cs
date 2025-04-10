using ERP.Infrastructure.Repositories.Comentario;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;


public class ComentariosController : ApiControllerBase
{
    private readonly IComentarioRepository _comentarioRepository;

    public ComentariosController(IComentarioRepository comentarioRepository)
    {
        _comentarioRepository = comentarioRepository;
    }


    [HttpGet("agente/{idAgente}")]
    public async Task<IActionResult> GetComentarioAgentePorPeriodo(int idAgente, [FromQuery] DateTime periodo)
    {
        var comentarios = await _comentarioRepository.GetComentarioAgentePorPeriodo(idAgente, periodo);

        if(comentarios == null )
        {
            return NotFound("RICARDO");
        }

        return Ok(comentarios);
    }


    [HttpPost]
    public async Task<IActionResult> GuardarComentario([FromBody] ComentarioDto dto)
    {
        var comentario = await _comentarioRepository.GuardarOActualizarComentario(dto);
        return Ok(comentario);
    }
}
