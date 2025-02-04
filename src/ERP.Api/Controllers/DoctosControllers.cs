
using ERP.Domain.Entities;
using ERP.Infrastructure.Repositories.Doctos;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public class DoctosController : ApiControllerBase
{
    private readonly IDoctosRepository _doctosRepository;

    public DoctosController(IDoctosRepository doctosRepository)
    {
        _doctosRepository = doctosRepository;
    }



    [HttpGet("{periodo}")]
    public async Task<ActionResult<FacturasVm>> Get(DateTime periodo)
    {

        return Ok(await _doctosRepository.Get(periodo));
    }

    [HttpGet("ricardo/{periodo}")]
    // [Requires(Permissions.DoctosAllAccess)]>
    public async Task<ActionResult<Task<List<ComisionRDto>>>> GetComnisionesR(DateTime periodo)
    {


        var comisiones = await _doctosRepository.GetComisionesR(periodo);

        return Ok(comisiones);
    }

    [HttpGet("angie/{periodo}")]
    // [Requires(Permissions.DoctosAllAccess)]>
    public async Task<ActionResult<Task<List<ComisionADto>>>> GetComnisionesA(DateTime periodo)
    {


        var comisiones = await _doctosRepository.GetComisionesA(periodo);

        return Ok(comisiones);
    }

    [HttpPatch("{IdMovimiento}")]
    // [Requires(Permissions.DoctosAllAccess)]>
    public async Task<ActionResult<MovimientoDto>> UpdateMovientoAsync(int IdMovimiento, [FromBody] MovimientoDto Movto)
    {


        var mov = await _doctosRepository.UpdateMovtoAsync(IdMovimiento, Movto);

        return Ok(mov);
    }

    //    // [Requires(PermissionOperator.Or, Permissions.DoctosAllAccess, Permissions.DoctosRead)]
    //    [HttpGet("{DoctosId}")]
    //    public async Task<ActionResult<DoctosDto>> Get(Guid DoctosId)
    //    {
    //        // var id = new Guid(DoctosId);
    //        var Doctos = await _DoctosRepository.Get(DoctosId);

    //        return Ok(Doctos);
    //    }

    //    [HttpPost]
    //    // [Requires(PermissionOperator.And, Permissions.DoctosAllAccess, Permissions.OrderAllAccess)]
    //    public async Task<ActionResult> Post([FromBody] CreateDoctos DoctosRequest)
    //    {
    //        var result = await _DoctosRepository.CreateAsync(DoctosRequest);


    //        return Ok(result);
    //    }

    //// Nota: Si no se envian todos las propiedades el sistema las toma por null asi que es neceario enviarlas en el request. 
    //    [HttpPatch("{DoctosId}")]
    //    // [Requires(Permissions.DoctosAllAccess)]
    //    public async Task<IActionResult> Patch(Guid DoctosId, [FromBody] UpdateDoctos DoctosRequest)
    //    {
    //        var result = await _DoctosRepository.UpdateAsync(DoctosId, DoctosRequest);

    //        return Ok(result);
    //    }


    //[HttpDelete("{DoctosId}")]
    //public async Task<ActionResult> Delete(Guid DoctosId)
    //{
    //    var result = await _DoctosRepository.DeleteAsync(DoctosId);

    //    return Ok(result);
    //}
}