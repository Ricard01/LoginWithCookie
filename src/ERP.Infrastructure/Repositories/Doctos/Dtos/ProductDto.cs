using AutoMapper;
using ERP.Domain.Entities;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos;

[AutoMap(typeof(AdmProductos))]
public class ProductDto
{

    public required string CCODIGOPRODUCTO { get; set; }

    public required string CNOMBREPRODUCTO { get; set; }

    public double CIMPORTEEXTRA1 { get; set; }
}
