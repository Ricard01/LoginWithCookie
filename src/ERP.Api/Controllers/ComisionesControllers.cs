
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
        var comisiones = await _comisionesRepository.GetComisionesAmbosPorPeriodo(periodo);
        return Ok(comisiones);
    }

 
    [HttpGet("ricardo/{periodo}")]
    public async Task<ActionResult<Task<List<ComisionRicardoDto>>>> GetComisionesRicardo(DateTime periodo)
    {
        var comisiones = await _comisionesRepository.GetComisionesRicardo(periodo);
        return Ok(comisiones);
    }


    [HttpGet("angie/{periodo}")]
    public async Task<ActionResult<List<ComisionAngelicaDto>>> GetComisionesAngelica(DateTime periodo)
    {
        var comisiones = await _comisionesRepository.GetComisionesAngie(periodo);
        return Ok(comisiones);
    }

    [HttpGet("angie/summary/{periodo}")]
    public async Task<ActionResult<ResumenComisionVm>> GetResumenComisionAngelica(DateTime periodo)
    {

        var comisiones = await _comisionesRepository.GetResumenComisionesAngie(periodo);
        return Ok(comisiones);
    }

    [HttpGet("ricardo/summary/{periodo}")]
    public async Task<ActionResult<ResumenComisionVm>> GetResumenComisionesRicardo(DateTime periodo)
    {

        var comisiones = await _comisionesRepository.GetResumenComisionesRicardo(periodo);
        return Ok(comisiones);
    }

    //  api/comisiones/ricardo/123
    [HttpPatch("ricardo/{idMovimiento}")]
    public async Task<ActionResult<MovimientoComisionRicardoDto>> ActualizarMovimientoRicardo(int idMovimiento, [FromBody] MovimientoComisionRicardoDto movimiento)
    {
        var resultado = await _comisionesRepository.UpdateMovtoComisionRicardoAsync(idMovimiento, movimiento);
        return Ok(resultado);
    }

    // api/comisiones/angie/456
    [HttpPatch("angie/{idMovimiento}")]
    public async Task<ActionResult<MovimientoComisionAngieDto>> ActualizarMovimientoAngelica(int idMovimiento, [FromBody] MovimientoComisionAngieDto movimiento)
    {
        var resultado = await _comisionesRepository.UpdateMovtoComisionAngieAsync(idMovimiento, movimiento);
        return Ok(resultado);
    }

    [HttpGet("total/{idAgente}")]
    public async Task<ActionResult<ComisionPeriodoDto>> GetComisionesTotal(int idAgente, [FromQuery]  DateTime periodo)
    {
        return Ok(await _comisionesRepository.GetTotalesComisionPorPeriodo(idAgente, periodo));
    }


    [HttpPost("total")]
    public async Task<ActionResult<ComisionPeriodoDto>> UpsertComisionPeriodo([FromBody] ComisionPeriodoDto dto)
    {
        var result = await _comisionesRepository.UpsertComisionPeriodo(dto);
        return Ok(result);
    }

}