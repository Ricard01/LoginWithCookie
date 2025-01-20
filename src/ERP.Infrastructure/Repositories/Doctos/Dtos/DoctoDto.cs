using ERP.Domain.Entities;
using AutoMapper;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos;

[AutoMap(typeof(AdmDocumentos))]
public class DoctoDto
{

    public DoctoDto()
    {
        AdmMovimientos = new List<MovtoDto>();
    }
    public int CIDDOCUMENTO { get; set; }

    public DateTime CFECHA { get; set; }

    public double CFOLIO { get; set; }

    public required string CRAZONSOCIAL { get; set; }

    public double CNETO { get; set; }

    public double CTOTAL { get; set; }

    public double CDESCUENTOMOV { get; set; }

    public double CPENDIENTE { get; set; }

    public int CCANCELADO { get; set; }

    public List<MovtoDto> AdmMovimientos { get; set; } = new List<MovtoDto>();


    //public void Mapping(Profile profile)
    //{
    //    profile.CreateMap<ApplicationDoctosRole, DoctosDto>()
    //        .ForMember(dto => dto.Id, opt => opt.MapFrom(ur => _DoctosId ));
    //}
}