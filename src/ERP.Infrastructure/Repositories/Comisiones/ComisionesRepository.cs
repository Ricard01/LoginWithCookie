using AutoMapper;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.EntityFrameworkCore;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Repositories.Dtos;
using ERP.Domain.Constants;
using ERP.Infrastructure.Repositories.Comisiones.Dtos;


namespace ERP.Infrastructure.Repositories.Comisiones;

public class ComisionesRepository : IComisionesRepository
{
    private readonly IApplicationDbContext _context;
   
    public ComisionesRepository(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task<List<ComisionDto>> GetComisionesAmbos(DateTime periodo)
    {

        var comisiones = await _context.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Facturas && f.FechaCreacionPago.HasValue && f.FechaCreacionPago.Value.Month == periodo.Month)
              .Join(
                  _context.Movimientos,
                  f => f.IdComercial,
                  m => m.IdComercial,
                  (f, m) => new { Factura = f, Movimiento = m }
              )
              .Where(x => x.Movimiento.IdAgente ==CONTPAQi.IdAgente.Ambos && x.Movimiento.IdProducto != CONTPAQi.IdProducto.Poliza)
              .OrderByDescending(x => x.Factura.Serie)
              .ThenByDescending(x => x.Factura.Fecha)
              .Select(x => new ComisionDto
              {
                  Fecha = x.Factura.Fecha,                  
                  Folio = $"{x.Factura.Serie ?? ""}{x.Factura.Folio}",
                  Cliente = x.Factura.Cliente,
                  IdMovimiento = x.Movimiento.IdMovimiento,
                  IdAgente = x.Movimiento.IdAgente,
                  NombreProducto = x.Movimiento.NombreProducto,
                  Descripcion = x.Movimiento.Descripcion,
                  Neto = x.Movimiento.Neto,
                  Comision = x.Movimiento.Comision, // Probablemente no los necesito
                  Utilidad = x.Movimiento.Utilidad, // Probablemente no los necesito
                  UtilidadRicardo = x.Movimiento.UtilidadRicardo,
                  IvaRicardo = x.Movimiento.IvaRicardo,
                  IsrRicardo = x.Movimiento.IsrRicardo,
                  UtilidadAngie = x.Movimiento.UtilidadAngie,
                  IvaAngie = x.Movimiento.IvaAngie,
                  IsrAngie = x.Movimiento.IsrAngie,
                  Observaciones = x.Movimiento.Observaciones
              })
              .ToListAsync();

        return comisiones;

    }

    public async Task<List<ComisionRDto>> GetComisionesRicardo(DateTime periodo)
    {

        var comisiones = await _context.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe== CONTPAQi.IdDocumentoDe.Facturas)
              .Join(
                  _context.Movimientos,
                  f => f.IdComercial,
                  m => m.IdComercial,
                  (f, m) => new { Factura = f, Movimiento = m }
              )
              .Where(x => x.Movimiento.IdAgente == CONTPAQi.IdAgente.RicardoChavez || x.Movimiento.IdProducto == CONTPAQi.IdProducto.Poliza)
              .OrderByDescending(x => x.Factura.Serie)
              .ThenByDescending(x => x.Factura.Fecha)
              .Select(x => new ComisionRDto
              {
                  Fecha = x.Factura.Fecha,
                  Serie = (x.Factura.Serie ?? ""),
                  Folio = x.Factura.Folio,
                  Cliente = x.Factura.Cliente,
                  IdMovimiento = x.Movimiento.IdMovimiento,
                  IdAgente = x.Movimiento.IdAgente,
                  NombreProducto = x.Movimiento.NombreProducto,
                  Descripcion = x.Movimiento.Descripcion,
                  Neto = x.Movimiento.Neto,
                  //Comision = x.Movimiento.Comision, // Probablemente no los necesito
                  //Utilidad = x.Movimiento.Utilidad, // Probablemente no los necesito
                  UtilidadRicardo = x.Movimiento.UtilidadRicardo,
                  IvaRicardo = x.Movimiento.IvaRicardo,
                  IsrRicardo = x.Movimiento.IsrRicardo,
                  Observaciones = x.Movimiento.Observaciones
              })
              .ToListAsync();

        return comisiones;

    }

    public async Task<List<ComAngelicaDto>> GetComisionesAngie(DateTime periodo)
    {

        var comisiones = await _context.Documentos
                  .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == 4)
                  .Join(
                      _context.Movimientos,
                      f => f.IdComercial,
                      m => m.IdComercial,
                      (f, m) => new { Factura = f, Movimiento = m }
                  )
                   .Where(x => x.Movimiento.IdAgente == CONTPAQi.IdAgente.AngelicaPetul || x.Movimiento.IdProducto == CONTPAQi.IdProducto.Poliza)
              .OrderByDescending(x => x.Factura.Serie)
              .ThenByDescending(x => x.Factura.Fecha)
                  .Select(x => new ComAngelicaDto
                  {
                      IdComercial = x.Factura.IdComercial,
                      Fecha = x.Factura.Fecha,
                      Folio = $"{x.Factura.Serie ?? ""}{x.Factura.Folio}",
                      Cliente = x.Factura.Cliente,
                      IdMovimiento = x.Movimiento.IdMovimiento,
                      IdAgente = x.Movimiento.IdAgente,
                      NombreProducto = x.Movimiento.NombreProducto,
                      Descripcion = x.Movimiento.Descripcion,
                      Neto = x.Movimiento.Neto,
                      Descuento = x.Movimiento.Descuento,
                      Comision = x.Movimiento.Comision, // Probablemente no los necesito
                      Utilidad = x.Movimiento.Utilidad, // Probablemente no los necesito
                      IvaAngie = x.Movimiento.IvaAngie,
                      IsrAngie = x.Movimiento.IsrAngie,
                      IvaRetenido = x.Movimiento.IvaRetenido,
                      UtilidadAngie = x.Movimiento.UtilidadAngie,
                    
                      Observaciones = x.Movimiento.Observaciones
                  })
                  .ToListAsync();

        return comisiones;

    }

    public async Task<MovimientoComisionAngieDto> UpdateMovtoComisionAngieAsync(int Id, MovimientoComisionAngieDto movto)
    {


        var mov = await _context.Movimientos.SingleOrDefaultAsync(m => m.IdMovimiento == Id);
        if (mov == null)
        {
            throw new NotFoundException(nameof(Movimiento), Id);
        }
       
        mov.UtilidadAngie = movto.UtilidadAngie;
        mov.IsrAngie = movto.IsrAngie;
        mov.IvaAngie = movto.IvaAngie;
        mov.IvaRetenido = movto.IvaRetenido;
        mov.Observaciones = movto.Observaciones;

        var result = await _context.SaveChangesAsync();

        return movto;
    }

    public async Task<MovimientoComisionRicardoDto> UpdateMovtoComisionRicardoAsync(int Id, MovimientoComisionRicardoDto movto)
    {


        var mov = await _context.Movimientos.SingleOrDefaultAsync(m => m.IdMovimiento == Id);
        if (mov == null)
        {
            throw new NotFoundException(nameof(Movimiento), Id);
        }

        mov.UtilidadRicardo = movto.UtilidadRicardo;
        mov.IsrRicardo = movto.IsrRicardo;
        mov.IvaRicardo = movto.IvaRicardo;
        mov.IvaRetenido = movto.IvaRetenido;
        mov.Observaciones = movto.Observaciones;

        var result = await _context.SaveChangesAsync();

        return movto;
    }

}