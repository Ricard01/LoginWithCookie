using ERP.Api.Models;
using ERP.Infrastructure.Repositories.Dtos;
using ERP.Infrastructure.Repositories.Gastos;
using ERP.Infrastructure.Repositories.Gastos.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public class GastosController : ApiControllerBase
{
    private readonly IGastosRepository _gastosRepository;

    public GastosController(IGastosRepository gastosRepository)
    {
        _gastosRepository = gastosRepository;
    }

    [HttpPost("sincronizar")]
    public async Task<IActionResult> SincronizarGastos([FromBody] PeriodoRequest request)
    {
        Console.WriteLine($"Llamada recibida con periodo: {request.Periodo}");
        await _gastosRepository.SincronizarGastosAsync(request.Periodo);
        return Ok();
    }


    [HttpGet]
    public async Task<ActionResult<List<GastosDto>>> GetGastos(DateTime periodo)
    {
        return Ok(await _gastosRepository.GetGastos(periodo));
    }

    [HttpGet("agente/{IdAgente}")]
    public async Task<ActionResult<List<GastosDto>>> GetGastosAgente( int IdAgente, DateTime periodo)
    {
        return Ok(await _gastosRepository.GetGastosAgente( IdAgente, periodo));
    }

    [HttpPatch("{IdMovimiento}")]
    public async Task<ActionResult<MovimientoDto>> UpdateMovientoAsync(int IdMovimiento, [FromBody] MovimientoDto Movto)
    {
        var mov = await _gastosRepository.UpdateMovtoGastoAsync(IdMovimiento, Movto);

        return Ok(mov);
    }
}
