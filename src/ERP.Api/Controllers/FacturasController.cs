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


}
