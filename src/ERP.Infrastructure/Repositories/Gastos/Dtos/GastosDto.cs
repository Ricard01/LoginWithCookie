﻿using AutoMapper;
using ERP.Domain.Entities;
using ERP.Infrastructure.Repositories.Dtos;

namespace ERP.Infrastructure.Repositories.Gastos.Dtos;


public class GastosVm
{
   public IList<GastosDto> Gastos { get; set; } = new List<GastosDto>();
}


[AutoMap(typeof(Documentos))]
public class GastosDto 
{
    public int Id { get; set; }
    public required string Concepto { get; set; }
    public DateTime Fecha { get; set; }
    public string? Serie { get; set; }
    public double Folio { get; set; }
    public required string Cliente { get; set; }
    public double Neto { get; set; }
    public double IVA { get; set; }
    public double Total { get; set; }
    public double Descuento { get; set; }
    public double Pendiente { get; set; }
    public int Cancelado { get; set; }
    public string? Url { get; set; }
    public string? Agente { get; set; }
    public virtual required ICollection<MovimientoDto> Movimientos { get; set; }
}


