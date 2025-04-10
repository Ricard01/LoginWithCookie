using ERP.Infrastructure.Repositories.Depositos;
using ERP.Infrastructure.Repositories.Depositos.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;
public class DepositosRequestDto
{
    public int IdAgente { get; set; }
    public DateTime Periodo { get; set; }
    public List<DepositoDto> Depositos { get; set; }
}

public class DepositosController : ApiControllerBase
{
    private readonly IDepositosRepository _depositosRepository;

    public DepositosController(IDepositosRepository depositosRepository)
    {
        _depositosRepository = depositosRepository;
    }


    [HttpGet]
    public async Task<ActionResult<List<DepositoDto>>> GetComisiones([FromQuery] int idAgente, [FromQuery] DateTime periodo)
    {
        return Ok(await _depositosRepository.GetDepositos(idAgente, periodo));
    }

    [HttpPost]
    public async Task<ActionResult<List<DepositoDto>>> UpsertComisionPeriodo(DepositosRequestDto request)
    {
        var result = await _depositosRepository.UpsertDepositosAsync(request.Depositos,request.IdAgente, request.Periodo);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _depositosRepository.Delete(id);

        if (!result)
        {
            return NotFound(); 
        }

        return NoContent();
    }


}
