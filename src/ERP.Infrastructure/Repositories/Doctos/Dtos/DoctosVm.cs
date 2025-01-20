namespace ERP.Infrastructure.Repositories.Doctos.Dtos;

public class DoctosVm
{
    public IList<DoctoDto> Doctos { get; set; } = new List<DoctoDto>();
}