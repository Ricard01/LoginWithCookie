using ERP.Api.Models;
using ERP.Infrastructure.Repositories.Dtos;
using ERP.Infrastructure.Repositories.Facturas;
using ERP.Infrastructure.Repositories.Facturas.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public class FacturasController: ApiControllerBase
{
    private readonly IFacturasRepository _facRepository;
 
    public FacturasController(IFacturasRepository facRepository)
    {
        _facRepository = facRepository;
    }

    [HttpPost("sincronizar")]
    public async Task<IActionResult> SincronizarFacturas([FromBody] PeriodoRequest request)
    {
        await _facRepository.SincronizarFacturasAsync(request.Periodo);
        return Ok();
    }

    [HttpGet("pagadas")]
    public async Task<ActionResult<FacturasVm>> GetFacturasPagadas(DateTime periodo)
    {
        return Ok(await _facRepository.GetFacturasPagadas(periodo));
    }

    [HttpGet("pendientes")]
    public async Task<ActionResult<FacturasVm>> GetFacturasPendientes(DateTime periodo)
    {
        return Ok(await _facRepository.GetFacturasPendientes(periodo));
    }

    [HttpPatch("{IdMovimiento}")]
    public async Task<ActionResult<MovimientoDto>> UpdateMovientoAsync(int IdMovimiento, [FromBody] MovimientoDto Movto)
    {
        var mov = await _facRepository.UpdateMovtoFacturaAsync(IdMovimiento, Movto);

        return Ok(mov);
    }


}
