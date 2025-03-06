using AutoMapper;
using ERP.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ERP.Infrastructure.Repositories.CompacDtos;


[AutoMap(typeof(AdmAgentes))]
public class AdmAgenteDto
{
    [Key]
    public int CIDAGENTE { get; set; }

    public string CNOMBREAGENTE { get; set; }
}
