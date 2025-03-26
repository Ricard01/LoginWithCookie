
using ERP.Infrastructure.Repositories.Comisiones;
using ERP.Infrastructure.Repositories.Comisiones.Dtos;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using ERP.Infrastructure.Repositories.Dtos;
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
        return Ok(await _comisionesRepository.GetComisionesAmbos(periodo));
    }

    [HttpGet("ricardo/{periodo}")]
    public async Task<ActionResult<Task<List<ComisionRDto>>>> GetComnisionesR(DateTime periodo)
    {
        var comisiones = await _comisionesRepository.GetComisionesRicardo(periodo);
        return Ok(comisiones);
    }

    [HttpGet("angie/{periodo}")]
    public async Task<ActionResult<Task<List<ComAngelicaDto>>>> GetComnisionesA(DateTime periodo)
    {

        var comisiones = await _comisionesRepository.GetComisionesAngie(periodo);
        return Ok(comisiones);
    }

    [HttpPatch("ricardo/{IdMovimiento}")]
    public async Task<ActionResult<MovimientoComisionRicardoDto>> UpdateMovientoRicardoAsync(int IdMovimiento, [FromBody] MovimientoComisionRicardoDto Movto)
    {

        var mov = await _comisionesRepository.UpdateMovtoComisionRicardoAsync(IdMovimiento, Movto);
        return Ok(mov);
    }

    [HttpPatch("angie/{IdMovimiento}")]
    public async Task<ActionResult<MovimientoComisionAngieDto>> UpdateMovientoAngieAsync(int IdMovimiento, [FromBody] MovimientoComisionAngieDto Movto)
    {

        var mov = await _comisionesRepository.UpdateMovtoComisionAngieAsync(IdMovimiento, Movto);
        return Ok(mov);
    }

 
}