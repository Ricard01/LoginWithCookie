//using AutoMapper;
//using ERP.Domain.Entities;

//namespace ERP.Infrastructure.Repositories.Dtos;

//public class MovtosVm
//{
//    public IList<AdmMovimientosDto> Movimientos { get; set; } = new List<AdmMovimientosDto>();
//}

//[AutoMap(typeof(AdmMovimientos))]
//public class AdmMovimientosDto
//{

//    public int CIDMOVIMIENTO { get; set; }

//    public int CIDDOCUMENTO { get; set; }

//    public int CIDDOCUMENTODE { get; set; }

//    public int CIDPRODUCTO { get; set; }

//    public double CNETO { get; set; }

//    public double CDESCUENTO1 { get; set; }

//    public double CIMPUESTO1 { get; set; }

//    public double CRETENCION1 { get; set; }

//    public string? COBSERVAMOV { get; set; }

//    public required AdmProductos AdmProductos { get; set; }


//}
