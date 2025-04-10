using ERP.Infrastructure.Repositories.Depositos.Dtos;

namespace ERP.Infrastructure.Repositories.Depositos;

public interface IDepositosRepository
{
    Task<List<DepositoDto>> GetDepositos(int IdAgente, DateTime periodo);

    Task<List<DepositoDto>> UpsertDepositosAsync(List<DepositoDto> depositosDtos, int idAgente, DateTime periodo);

    Task<bool> Delete(int id);

}