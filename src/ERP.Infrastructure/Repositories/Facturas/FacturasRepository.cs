using Microsoft.EntityFrameworkCore;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories.Facturas.Dtos;
using System.Data;
using Dapper;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Repositories.Dtos;
using System.Linq.Expressions;


namespace ERP.Infrastructure.Repositories.Facturas;

public class FacturasRepository : IFacturasRepository
{
    private const int IdDocumentoDe = 4; 

    private readonly IApplicationDbContext _context;
    private readonly ICompacDbContext _compacContext;

   

    public FacturasRepository(ApplicationDbContext context, ICompacDbContext compacContext)
    {
        _context = context;
        _compacContext = compacContext;

    }
    
    public async Task SincronizarFacturasAsync(DateTime periodo)
    {
        await GetAndSetFacturasCompacAsync(periodo);
    }
    public async Task<FacturasVm> GetFacturasPagadas(DateTime periodo)
    {

        var facturas = await GetFacturasAsync("FACTURAS PAGADAS",
        f => f.Fecha.Year == periodo.Year &&
             f.Fecha.Month == periodo.Month &&
             f.Cancelado == 0 &&
             f.IdDocumentoDe == IdDocumentoDe &&
             f.Pendiente == 0 &&
             f.FechaCreacionPago.HasValue &&
             f.FechaCreacionPago.Value.Month == periodo.Month &&
             f.FechaCreacionPago.Value.Year == periodo.Year);

        return new FacturasVm
        {
            Facturas = facturas
        };

    }

    // TIP-PRO: Este método usa async porque se crea un nuevo objeto con el resultado
    // REF: docs/general/tips-pro.md#async-si-se-necesita-si-hay-logica-despues-del-await

    public async Task<FacturasVm> GetFacturasPendientes(DateTime periodo)
    {

        var facturas = await GetFacturasAsync("FACTURAS PENDIENTES",
            f =>
        (f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == IdDocumentoDe && f.Pendiente > 0)
        ||
       (f.Pendiente == 0 && f.Fecha.Month == periodo.Month && f.FechaCreacionPago.HasValue && f.FechaCreacionPago.Value.Year == periodo.Year && f.FechaCreacionPago.Value.Month != periodo.Month)
     );
        return new FacturasVm
        {
            Facturas = facturas
        };
    }

    public  Task<List<FacturasDto>> GetFacturasCanceladasAsync(DateTime periodo)
    {
        return  GetFacturasAsync("FACTURAS CANCELADAS", f => f.Cancelado == 1 && f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month);
    }

    // TIP-PRO: No usar async/await si solo retorna un Task directo.
    // REF: docs/general/tips-pro.md#async-vs-await-cuando-devolves-una-consulta-directa
    private Task<List<FacturasDto>> GetFacturasAsync(string tag, Expression<Func<Documentos, bool>> whereCondition)
    {
       
        return _context.Documentos
            .TagWith(tag)
            .AsNoTracking()
            .Where(whereCondition)
            .OrderByDescending(d => d.Fecha)
            .Select(d => new FacturasDto
            {
                Id = d.Id,
                Concepto = d.Concepto,
                Fecha = d.Fecha,
                Folio = $"{d.Serie ?? ""}{d.Folio}",
                Cliente = d.Cliente,
                Neto = d.Neto,
                IVA = d.IVA,
                IvaRetenido = d.IvaRetenido,
                ISR = d.ISR,
                Total = d.Total,
                Descuento = d.Descuento,
                Pendiente = d.Pendiente,
                Cancelado = d.Cancelado,
                Agente = d.Agente,
                Utilidad = d.Utilidad,
                FechaPago = d.FechaPago,
                FolioPago = d.FolioPago,
                FechaCreacionPago = d.FechaCreacionPago,
                AfectaComisiones = d.AfectaComisiones,
                Movimientos = d.Movimientos.Select(m => new MovimientoDto
                {
                    IdMovimiento = m.IdMovimiento,
                    IdComercial = m.IdComercial,
                    IdDocumentoDe = m.IdDocumentoDe,
                    IdAgente = m.IdAgente,
                    Neto = m.Neto,
                    Total = m.Total,
                    Descuento = m.Descuento,
                    IVA = m.IVA,
                    ISR = m.ISR,
                    CodigoProducto = m.CodigoProducto,
                    NombreProducto = m.NombreProducto,
                    Descripcion = m.Descripcion,
                    Comision = m.Comision,
                    Utilidad = m.Utilidad,
                    UtilidadRicardo = m.UtilidadRicardo,
                    UtilidadAngie = m.UtilidadAngie,
                    IvaRicardo = m.IvaRicardo,
                    IvaAngie = m.IvaAngie,
                    IsrRicardo = m.IsrRicardo,
                    IsrAngie = m.IsrAngie,
                    Observaciones = m.Observaciones,
                    AfectaComisiones = m.AfectaComisiones
                }).ToList(),
            })
            .ToListAsync();

    }

    private async Task GetAndSetFacturasCompacAsync(DateTime periodo)
    {
        // 1. Obtiene todo los documentos de COMPAC del periodo 
        var facturasCompac = await GetFacturasCompacSP(periodo);

        // 2. Obtiene los documentos existentes en mi BD
        var facturasInDb = await GetFacturasToCompareAsync(periodo);

        // 3.Sincroniza con mi Bd los cambios y agrega las nuevas facturas. 
        await CompareAndSyncChanges(facturasCompac, facturasInDb);

    }

    public async Task<List<AdmFacturasDto>> GetFacturasCompacSP(DateTime periodo)
    {

        using (var connection = (_compacContext as DbContext)?.Database.GetDbConnection())
        {
            await connection.OpenAsync();

            var sql = "EXEC getFacturasConPagosAndMovimientos @Anio, @Mes";

            var facturasDictionary = new Dictionary<int, AdmFacturasDto>();

            var facturas = await connection.QueryAsync<AdmFacturasDto, AdmFacturaMovtos, AdmFacturasDto>(
                sql,
                (factura, movimiento) =>
                {
                    // Si la factura ya existe en el diccionario, solo agregamos el movimiento
                    if (!facturasDictionary.TryGetValue(factura.IdComercial, out var facturaEntry))
                    {
                        facturaEntry = factura;
                        facturaEntry.Movimientos = new List<AdmFacturaMovtos>(); // Inicializar la lista de movimientos
                        facturasDictionary.Add(facturaEntry.IdComercial, facturaEntry);
                    }

                    // Si hay un movimiento, lo agregamos a la factura
                    if (movimiento != null)
                    {
                        facturaEntry.Movimientos.Add(movimiento);
                    }

                    return facturaEntry;
                },
                new { Anio = periodo.Year, Mes = periodo.Month },
                splitOn: "IdMovimiento"
            );

            return facturasDictionary.Values.ToList();
        }


    }

    private async Task<Dictionary<int, Documentos>> GetFacturasToCompareAsync( DateTime periodo)
    {
        return await _context.Documentos
         .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.IdDocumentoDe == IdDocumentoDe)
         .ToDictionaryAsync(f => f.IdComercial);
    }

    private async Task CompareAndSyncChanges(List<AdmFacturasDto> facturasCompac, Dictionary<int, Documentos> facturasInDb)
    {
        var facturasToAdd = new List<Documentos>();
        var movtosToAdd = new List<Movimiento>();
        bool cambiosRealizados = false;

        foreach (var f in facturasCompac)
        {
            if (facturasInDb.TryGetValue(f.IdComercial, out var facInDb))
            {
                // 🔹 Si la factura se canceló, solo actualizar el estado
                if (facInDb.Cancelado != f.Cancelado)
                {
                    facInDb.Cancelado = f.Cancelado;
                    _context.Entry(facInDb).State = EntityState.Modified; // 🔹 Marcar como modificado
                    cambiosRealizados = true;
                }

                // 🔹 Si se pagó o cambió el agente, actualizar datos y recalcular comisiones
                if ((facInDb.Pendiente != f.Pendiente || facInDb.Agente != f.Agente) && facInDb.Cancelado == 0)
                {
                    facInDb.Pendiente = f.Pendiente;
                    facInDb.Agente = f.Agente;
                    facInDb.FechaPago = f.FechaPago;
                    facInDb.FolioPago = f.FolioPago;
                    facInDb.FechaCreacionPago = f.FechaCreacionPago;

                    _context.Entry(facInDb).State = EntityState.Modified; // 🔹 Marcar como modificado
                    cambiosRealizados = true;

                    if (f.Movimientos != null)
                    {
                        var movimientosCalculados = CalcularComisiones(f.Movimientos, f.IdAgente);
                        foreach (var movimiento in movimientosCalculados)
                        {
                            var movExistente = _context.Movimientos.FirstOrDefault(m => m.IdMovimiento == movimiento.IdMovimiento);
                            if (movExistente != null)
                            {
                                movExistente.IdAgente = movimiento.IdAgente;
                                movExistente.Utilidad = movimiento.Utilidad;
                                movExistente.UtilidadRicardo = movimiento.UtilidadRicardo;
                                movExistente.UtilidadAngie = movimiento.UtilidadAngie;
                                movExistente.IvaRicardo = movimiento.IvaRicardo;
                                movExistente.IvaAngie = movimiento.IvaAngie;
                                movExistente.IsrRicardo = movimiento.IsrRicardo;
                                movExistente.IsrAngie = movimiento.IsrRicardo;
                                _context.Entry(movExistente).State = EntityState.Modified; // 🔹 Marcar como modificado
                                cambiosRealizados = true;
                            }
                        }
                    }
                }
            }
            else
            {
                var newFactura = new Documentos
                {
                    IdComercial = f.IdComercial,
                    IdDocumentoDe = f.IdDocumentoDe,
                    Concepto = f.Concepto,
                    Fecha = f.Fecha,
                    Serie = f.Serie,
                    Folio = f.Folio,
                    Cliente = f.Cliente,
                    Neto = f.Neto,
                    IVA = f.IVA,
                    IvaRetenido = f.IvaRetenido,
                    ISR = f.ISR,
                    Descuento = f.Descuento,
                    Total = f.Total,
                    Pendiente = f.Pendiente,
                    Cancelado = f.Cancelado,
                    Agente = f.Agente,
                    FechaPago = f.FechaPago,
                    FolioPago = f.FolioPago,
                    FechaCreacionPago = f.FechaCreacionPago
                };

                facturasToAdd.Add(newFactura);

                if (f.Movimientos != null)
                {
                    var movimientosCalculados = CalcularComisiones(f.Movimientos, f.IdAgente);
                    movtosToAdd.AddRange(movimientosCalculados);
                }
            }
        }

        if (cambiosRealizados)
        {
            await _context.SaveChangesAsync();
        }

        if (facturasToAdd.Count > 0 || movtosToAdd.Count > 0)
        {
            _context.Documentos.AddRange(facturasToAdd);
            _context.Movimientos.AddRange(movtosToAdd);
            await _context.SaveChangesAsync();
        }
    }

    private List<Movimiento> CalcularComisiones(ICollection<AdmFacturaMovtos> movimientos, int idAgente)
    {
        var movimientosCalculados = new List<Movimiento>();

        // 🔹 Si el agente es 0 o 3 y hay más de un movimiento, no calcular comisiones
        if (idAgente == 0 || (idAgente == 3 && movimientos.Count >= 2))
        {
            return movimientos.Select(m => new Movimiento
            {
                IdMovimiento = m.IdMovimiento,
                IdComercial = m.IdComercialMov,
                IdDocumentoDe = m.IdDocumentoDe,
                IdProducto = m.IdProducto,
                IdAgente = idAgente,
                Neto = m.MovNeto,
                Descuento = m.MovDescto,
                IVA = m.MovIVA,
                ISR = m.MovISR,
                Total = m.MovTotal,
                CodigoProducto = m.Codigo,
                NombreProducto = m.Nombre,
                Descripcion = m.MovObserva,
                Comision = m.Comision,
                Utilidad = 0,
                UtilidadRicardo = 0,
                UtilidadAngie = 0,
                IvaRicardo = 0,
                IvaAngie = 0,
                IsrRicardo = 0,
                IsrAngie = 0
            }).ToList();
        }

        // 🔹 Aplicar cálculos de comisión si el agente no es 3 o si hay solo un movimiento
        foreach (var m in movimientos)
        {
            double utilidadBase = ((m.MovNeto - m.MovDescto) * (m.Comision / 100.0)) - m.MovISR;

            var movimientoCalculado = new Movimiento
            {
                IdMovimiento = m.IdMovimiento,
                IdComercial = m.IdComercialMov,
                IdDocumentoDe = m.IdDocumentoDe,
                IdProducto = m.IdProducto,
                IdAgente = idAgente,
                Neto = m.MovNeto,
                Descuento = m.MovDescto,
                IVA = m.MovIVA,
                ISR = m.MovISR,
                Total = m.MovTotal,
                CodigoProducto = m.Codigo,
                NombreProducto = m.Nombre,
                Descripcion = m.MovObserva,
                Comision = m.Comision,
                Utilidad = utilidadBase
            };

            // 🔹 Asignar valores según el agente
            switch (idAgente)
            {
                case 1: // 🔹 Ricardo
                    movimientoCalculado.UtilidadRicardo = utilidadBase;
                    movimientoCalculado.UtilidadAngie = 0;
                    movimientoCalculado.IvaRicardo = m.MovIVA;
                    movimientoCalculado.IvaAngie = 0;
                    movimientoCalculado.IsrRicardo = m.MovISR;
                    movimientoCalculado.IsrAngie = 0;
                    break;
                case 2: // 🔹 Angie
                    movimientoCalculado.UtilidadRicardo = 0;
                    movimientoCalculado.UtilidadAngie = utilidadBase;
                    movimientoCalculado.IvaRicardo = 0;
                    movimientoCalculado.IvaAngie = m.MovIVA;
                    movimientoCalculado.IsrRicardo = 0;
                    movimientoCalculado.IsrAngie = m.MovISR;
                    break;
                case 3: // 🔹 Ambos (50/50)
                    double mitad = utilidadBase / 2;
                    double ivaMitad = m.MovIVA / 2;
                    double isrMitad = m.MovISR / 2;
                    movimientoCalculado.UtilidadRicardo = mitad;
                    movimientoCalculado.UtilidadAngie = mitad;
                    movimientoCalculado.IvaRicardo = ivaMitad;
                    movimientoCalculado.IvaAngie = ivaMitad;
                    movimientoCalculado.IsrRicardo = isrMitad;
                    movimientoCalculado.IsrAngie = isrMitad;
                    break;
            }

            movimientosCalculados.Add(movimientoCalculado);
        }

        return movimientosCalculados;
    }

    public async Task<MovimientoDto> UpdateMovtoFacturaAsync(int Id, MovimientoDto movto)
    {


        var mov = await _context.Movimientos.SingleOrDefaultAsync(m => m.IdMovimiento == Id);
        if (mov == null)
        {
            throw new NotFoundException(nameof(Movimiento), Id);
        }

        mov.IdAgente = movto.IdAgente;
        mov.Comision = movto.Comision;
        mov.Utilidad = movto.Utilidad;
        mov.UtilidadRicardo = movto.UtilidadRicardo;
        mov.UtilidadAngie = movto.UtilidadAngie;
        mov.IsrAngie = movto.IsrAngie;
        mov.IsrRicardo = movto.IsrRicardo;
        mov.IvaRicardo = movto.IvaRicardo;
        mov.IvaAngie = movto.IvaAngie;
        mov.Observaciones = movto.Observaciones;

        var result = await _context.SaveChangesAsync();

        return movto;
    }

}