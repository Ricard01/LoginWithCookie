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

    [HttpGet]
    public async Task<ActionResult<GastosVm>> GetGastos(DateTime periodo)
    {
        return Ok(await _gastosRepository.GetGastos(periodo));
    }
}
