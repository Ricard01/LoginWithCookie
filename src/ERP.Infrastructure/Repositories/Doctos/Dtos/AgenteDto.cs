using AutoMapper;
using ERP.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos;


[AutoMap(typeof(AdmAgentes))]
public class AgenteDto 
{
    [Key]
    public int CIDAGENTE { get; set; }

    public string CNOMBREAGENTE { get; set; }
}
