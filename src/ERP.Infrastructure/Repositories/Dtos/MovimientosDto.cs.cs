﻿using AutoMapper;
using ERP.Domain.Entities;


namespace ERP.Infrastructure.Repositories.Dtos;


[AutoMap(typeof(Movimiento))]
public class MovimientoDto
{
    public int Id { get; set; }
    public int IdComercial { get; set; }
    public int IdMovimiento { get; set; }
    public int IdDocumentoDe { get; set; }
    public int? IdAgente { get; set; }
    public double Neto { get; set; }
    public double Descuento { get; set; }
    public double IVA { get; set; }
    public double IvaRetenido { get; set; }
    public double ISR { get; set; }
    public double Total { get; set; }
    public required string CodigoProducto { get; set; }
    public required string NombreProducto { get; set; }
    public string? Descripcion { get; set; }
    public double Comision { get; set; }
    public double Utilidad { get; set; }
    public double UtilidadRicardo { get; set; }
    public double UtilidadAngie { get; set; }
    public double IvaRicardo { get; set; }
    public double IvaAngie { get; set; }
    public double IsrRicardo { get; set; }
    public double IsrAngie { get; set; }
    public string? Observaciones { get; set; }
    public int AfectaComisiones { get; set; }
}
