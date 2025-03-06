
using ERP.Infrastructure.Repositories.Comisiones;
using ERP.Infrastructure.Repositories.Comisiones.Dtos;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public class ComisionesController : ApiControllerBase
{
    private readonly IComisionesRepository _comisionesRepository;

    public ComisionesController(IComisionesRepository comisionesRepository)
    {
        _comisionesRepository = comisionesRepository;
    }



    [HttpGet("{periodo}")]
    public async Task<ActionResult<List<ComisionDto>>> GetComisiones(DateTime periodo)
    {

        return Ok(await _comisionesRepository.GetComisiones(periodo));
    }

    [HttpGet("ricardo/{periodo}")]
    public async Task<ActionResult<Task<List<ComisionRDto>>>> GetComnisionesR(DateTime periodo)
    {
        var comisiones = await _comisionesRepository.GetComisionesR(periodo);

        return Ok(comisiones);
    }

    [HttpGet("angie/{periodo}")]
    public async Task<ActionResult<Task<List<ComisionADto>>>> GetComnisionesA(DateTime periodo)
    {


        var comisiones = await _comisionesRepository.GetComisionesA(periodo);

        return Ok(comisiones);
    }

    [HttpPatch("{IdMovimiento}")]
    public async Task<ActionResult<MovimientoDto>> UpdateMovientoAsync(int IdMovimiento, [FromBody] MovimientoDto Movto)
    {


        var mov = await _comisionesRepository.UpdateMovtoAsync(IdMovimiento, Movto);

        return Ok(mov);
    }
}