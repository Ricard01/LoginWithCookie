using AutoMapper;
using ERP.Domain.Entities;
using ERP.Infrastructure.Repositories.Users.Dtos;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos;

[AutoMap(typeof(AdmMovimientos))]
public class MovtoDto
{

    public int CIDMOVIMIENTO { get; set; }

    public int CIDDOCUMENTO { get; set; }

    public int CIDPRODUCTO { get; set; }

    public double CNETO { get; set; }

    public double CDESCUENTO1 { get; set; }

    public double CIMPUESTO1 { get; set; }

    public double CRETENCION1 { get; set; }

    public string COBSERVAMOV { get; set; }

    public required AdmProductos AdmProductos { get; set; }



}
