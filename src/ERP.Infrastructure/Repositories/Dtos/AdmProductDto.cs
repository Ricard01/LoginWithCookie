using AutoMapper;
using ERP.Domain.Entities;

namespace ERP.Infrastructure.Repositories.Dtos;

[AutoMap(typeof(AdmProductos))]
public class AdmProductDto
{

    public required string CCODIGOPRODUCTO { get; set; }

    public required string CNOMBREPRODUCTO { get; set; }

    public double CIMPORTEEXTRA1 { get; set; }

}
