using ERP.Domain.Constants;
using ERP.Domain.Entities;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Infrastructure.Repositories.Comisiones.Dtos;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.EntityFrameworkCore;


namespace ERP.Infrastructure.Repositories.Comisiones;

public class ComisionesRepository : IComisionesRepository
{
    private readonly IApplicationDbContext _context;

    public ComisionesRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ComisionDto>> GetComisionesAmbosPorPeriodo(DateTime periodo)
    {

        var comisiones = await _context.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Facturas && f.FechaCreacionPago.HasValue && f.FechaCreacionPago.Value.Month == periodo.Month)
              .Join(
                  _context.Movimientos,
                  f => f.IdComercial,
                  m => m.IdComercial,
                  (f, m) => new { Factura = f, Movimiento = m }
              )
              .Where(x => x.Movimiento.IdAgente == CONTPAQi.IdAgente.Ambos && x.Movimiento.IdProducto != CONTPAQi.IdProducto.Poliza)
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

    public async Task<List<ComisionRicardoDto>> GetComisionesRicardo(DateTime periodo)
    {

        var comisiones = await _context.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Facturas)
              .Join(
                  _context.Movimientos,
                  f => f.IdComercial,
                  m => m.IdComercial,
                  (f, m) => new { Factura = f, Movimiento = m }
              )
              .Where(x => x.Movimiento.IdAgente == CONTPAQi.IdAgente.RicardoChavez || x.Movimiento.IdProducto == CONTPAQi.IdProducto.Poliza)
              .OrderByDescending(x => x.Factura.Serie)
              .ThenByDescending(x => x.Factura.Fecha)
              .Select(x => new ComisionRicardoDto
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

    public async Task<List<ComisionAngelicaDto>> GetComisionesAngie(DateTime periodo)
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
                  .Select(x => new ComisionAngelicaDto
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

    public async Task<ResumenComisionVm> GetResumenComisionesAngie(DateTime periodo)
    {
        return await GetResumenComisionesAgente(CONTPAQi.IdAgente.AngelicaPetul, periodo);
    }

    public async Task<ResumenComisionVm> GetResumenComisionesAgente(int idAgente, DateTime periodo)
    {
        var comisionPersonal = await GetComisionPersonal(idAgente, periodo);
        var comisionCompartida = await GetComisionCompartida(periodo);

        return new ResumenComisionVm
        {
            Personal = new ComisionPersonalDto
            {
                Neto = comisionPersonal.Neto,
                Utilidad = comisionPersonal.Utilidad,
                Descuento = comisionPersonal.Descuento,
                Iva = comisionPersonal.Iva,
                Isr = comisionPersonal.Isr,
                IvaRet = comisionPersonal.IvaRet,
                IsrMensual = comisionPersonal.IsrMensual,
                IvaAfavor = comisionPersonal.IvaAfavor,
                TotalImpuestos = comisionPersonal.TotalImpuestos,
            },
            Compartida = new ComisionCompartidaDto
            {
                Neto = comisionCompartida.Neto,
                Utilidad = comisionCompartida.Utilidad,
                Descuento = comisionCompartida.Descuento,
                Iva = comisionCompartida.Iva,
                Isr = comisionCompartida.Isr,
                IvaRet = comisionCompartida.IvaRet,
                IsrMensual = comisionCompartida.IsrMensual,
                IvaAfavor = comisionCompartida.IvaAfavor,
                TotalImpuestos = comisionCompartida.TotalImpuestos,
                Gastos = comisionCompartida.Gastos
            }
        };
    }

    private async Task<ComisionPersonalDto> GetComisionPersonal(int idAgente, DateTime periodo)
    {

        var query = _context.Documentos
            .Where(f => f.Fecha.Year == periodo.Year &&
                        f.Fecha.Month == periodo.Month &&
                        f.Cancelado == 0 &&
                        f.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Facturas &&
                        f.Pendiente == 0 &&
                        f.FechaCreacionPago.HasValue &&
                        f.FechaCreacionPago.Value.Month == periodo.Month &&
                        f.FechaCreacionPago.Value.Year == periodo.Year)
            .Join(_context.Movimientos,
                  factura => factura.IdComercial,
                  movimiento => movimiento.IdComercial,
                  (factura, movimiento) => new { factura, movimiento })
            .Where(x => x.movimiento.IdAgente == idAgente ||
                        x.movimiento.IdProducto == CONTPAQi.IdProducto.Poliza);

        var movimientos = await query.Select(x => x.movimiento).ToListAsync();

        var dto = new ComisionPersonalDto();

        if (idAgente == CONTPAQi.IdAgente.RicardoChavez)
        {
            dto.Utilidad = movimientos.Sum(m => m.UtilidadRicardo);
            dto.Iva = movimientos.Sum(m => m.IvaRicardo);
            dto.Isr = movimientos.Sum(m => m.IsrRicardo);
        }
        else
        {
            dto.Utilidad = movimientos.Sum(m => m.UtilidadAngie);
            dto.Iva = movimientos.Sum(m => m.IvaAngie);
            dto.Isr = movimientos.Sum(m => m.IsrAngie);
        }

        dto.Descuento = movimientos.Sum(m => m.Descuento);
        dto.IvaRet = movimientos.Sum(m => m.IvaRetenido);
        dto.Neto = dto.Utilidad + dto.Isr;
        dto.IvaAfavor = await GetIvaAfavor(idAgente, periodo);
        dto.IsrMensual = (dto.Neto - dto.Descuento) * 0.02 - dto.Isr;
        dto.TotalImpuestos = (dto.Iva + dto.IsrMensual) - dto.IvaAfavor;

        return dto;
    }

    private async Task<ComisionCompartidaDto> GetComisionCompartida(DateTime periodo)
    {
        var result = await _context.Documentos
            .Where(f => f.Fecha.Year == periodo.Year &&
                        f.Fecha.Month == periodo.Month &&
                        f.Cancelado == 0 &&
                        f.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Facturas &&
                        f.Pendiente == 0 &&
                        f.FechaCreacionPago.HasValue &&
                        f.FechaCreacionPago.Value.Month == periodo.Month &&
                        f.FechaCreacionPago.Value.Year == periodo.Year)
            .Join(_context.Movimientos,
                  factura => factura.IdComercial,
                  movimiento => movimiento.IdComercial,
                  (factura, movimiento) => new { factura, movimiento })
            .Where(x => x.movimiento.IdAgente == CONTPAQi.IdAgente.Ambos &&
                        x.movimiento.IdProducto != CONTPAQi.IdProducto.Poliza)
            .GroupBy(x => 1)
            .Select(g => new ComisionCompartidaDto
            {
                Utilidad = g.Sum(x => x.movimiento.Utilidad),
                Descuento = g.Sum(x => x.movimiento.Descuento),
                Iva = g.Sum(x => x.movimiento.IVA),
                Isr = g.Sum(x => x.movimiento.ISR),
                IvaRet = g.Sum(x => x.movimiento.IvaRetenido),
                Neto = g.Sum(x => x.movimiento.Neto)
            })
            .FirstOrDefaultAsync();


        result ??= new ComisionCompartidaDto();


        result.IvaAfavor = await GetIvaAfavor(CONTPAQi.IdAgente.Ambos, periodo);
        result.IsrMensual = (result.Neto - result.Descuento) * 0.02 - result.Isr;
        result.TotalImpuestos = (result.Iva + result.IsrMensual) - result.IvaAfavor;

        result.Gastos = await GetTotalGastos(periodo);


        return result;
    }

    private async Task<double> GetIvaAfavor(int idAgente, DateTime periodo)
    {
        return await _context.Documentos
            .Where(f => f.Fecha.Year == periodo.Year &&
                        f.Fecha.Month == periodo.Month &&
                        f.Cancelado == 0 &&
                        f.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Gastos)
            .Join(_context.Movimientos,
                  factura => factura.IdComercial,
                  movimiento => movimiento.IdComercial,
                  (factura, movimiento) => new { factura, movimiento })
            .Where(x => x.movimiento.IdAgente == idAgente)
            .SumAsync(x => x.movimiento.IVA);
    }

    private async Task<double> GetTotalGastos(DateTime periodo)
    {
        return await _context.Documentos
            .Where(d => d.Fecha.Year == periodo.Year &&
                            d.Fecha.Month == periodo.Month &&
                            d.Cancelado == 0 &&
                            d.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Gastos)
            .Join(_context.Movimientos,
                  factura => factura.IdComercial,
                  movimiento => movimiento.IdComercial,
                  (factura, movimiento) => new { factura, movimiento })
            .Where(d => d.movimiento.IdAgente == CONTPAQi.IdAgente.Ambos)
            .SumAsync(x => x.movimiento.Total);
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

    /// <summary>
    /// Inserta o actualiza (Upsert) el total de comisiones para el periodo indicado.
    /// </summary>
    /// <param name="dto">total de Comisiones del Periodo a insertar o actualizar.</param>
    /// <returns>Retorna el total de comisiones del periodo ya actualizados/insertados con su Id correspondiente.</returns>
    public async Task<ComisionPeriodoDto> UpsertComisionPeriodo(ComisionPeriodoDto dto)
    {

        if (dto == null)
            throw new ArgumentNullException(nameof(dto));

        ComisionesPorPeriodo? entidad = null;

        if (dto.Id > 0)
        {
            entidad = await _context.ComisionesPorPeriodo.FindAsync(dto.Id);
            if (entidad == null)
                throw new InvalidOperationException($"No se encontró un registro con Id {dto.Id} para actualizar.");
            entidad.IdAgente = dto.IdAgente;
            entidad.Periodo = dto.Periodo;
            entidad.ComisionPersonal = dto.ComisionPersonal;
            entidad.ComisionCompartida = dto.ComisionCompartida;
            entidad.TotalComisionPagada = dto.TotalComisionPagada;

        }
        else
        {
            entidad = new ComisionesPorPeriodo
            {
                IdAgente = dto.IdAgente,
                Periodo = dto.Periodo,
                ComisionPersonal = dto.ComisionPersonal,
                ComisionCompartida = dto.ComisionCompartida,
                TotalComisionPagada = dto.TotalComisionPagada
            };
            _context.ComisionesPorPeriodo.Add(entidad);

        }

        await _context.SaveChangesAsync();

        dto.Id = entidad.Id;

        return dto;

    }

    public async Task<ComisionPeriodoDto?> GetTotalesComisionPorPeriodo(int IdAgente, DateTime periodo)
    {


        return await _context.ComisionesPorPeriodo
            .Where(c => c.IdAgente == IdAgente && c.Periodo == periodo)
            .Select(c => new ComisionPeriodoDto
            {
                Id = c.Id,
                IdAgente = c.IdAgente,
                Periodo = c.Periodo,
                ComisionPersonal = c.ComisionPersonal,
                ComisionCompartida = c.ComisionCompartida,
                TotalComisionPagada = c.TotalComisionPagada
            })
            .FirstOrDefaultAsync();
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