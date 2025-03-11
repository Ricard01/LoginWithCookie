//using ERP.Domain.Entities;
//using AutoMapper;

//namespace ERP.Infrastructure.Repositories.Dtos;

//public class DoctosVm
//{
//    public IList<AdmDocumentosDto> Doctos { get; set; } = new List<AdmDocumentosDto>();
//}


//[AutoMap(typeof(AdmDocumentos))]
//public class AdmDocumentosDto
//{

//    public AdmDocumentosDto()
//    {
//        AdmMovimientos = Array.Empty<AdmMovimientosDto>();
//    }

//    public int CIDDOCUMENTO { get; set; }

//    public int CIDCONCEPTODOCUMENTO { get; set; }


//    // Id 4:Facturas | Id 19: Compras
//    public int CIDDOCUMENTODE { get; set; }

//    public DateTime CFECHA { get; set; }

//    public string? CSERIEDOCUMENTO { get; set; }

//    public double CFOLIO { get; set; }

//    public required string CRAZONSOCIAL { get; set; }

//    public double CNETO { get; set; }

//    public double CTOTAL { get; set; }

//    public double CDESCUENTOMOV { get; set; }

//    public double CPENDIENTE { get; set; }

//    public int CCANCELADO { get; set; }

//    public string? CTIMESTAMP { get; set; }

//    public DateTime? FECHAPAGO { get; set; }

//    public string? FOLIOPAGO { get; set; }

//    public IReadOnlyCollection<AdmMovimientosDto> AdmMovimientos { get; init; } = Array.Empty<AdmMovimientosDto>();

//    public virtual ICollection<AdmAsocCargosAbonosDto>? AdmAsocCargosAbonos { get; set; }

//    public AdmAgenteDto AdmAgentes { get; set; }


//}