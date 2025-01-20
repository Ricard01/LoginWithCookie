using AutoMapper;
using ERP.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Infrastructure.Repositories.Doctos.Dtos;

[AutoMap(typeof(AdmMovimientos))]
public class MovtoDto
{
    public double CNETO { get; set; }

    public double CDESCUENTO1 { get; set; }

    public double CIMPUESTO1 { get; set; }

    public double CRETENCION1 { get; set; }

    public required AdmProductos AdmProductos { get; set; }


}
