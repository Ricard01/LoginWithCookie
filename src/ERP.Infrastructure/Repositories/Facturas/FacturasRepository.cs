using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories.Facturas.Dtos;
using System.Data;
using Dapper;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Repositories.Dtos;
using System.Diagnostics.Eventing.Reader;


namespace ERP.Infrastructure.Repositories.Facturas;

public class FacturasRepository : IFacturasRepository
{

    private readonly IApplicationDbContext _context;
    private readonly ICompacDbContext _compacContext;
    private readonly IMapper _mapper;

    public FacturasRepository(ApplicationDbContext context, ICompacDbContext compacContext, IMapper mapper)
    {
        _context = context;
        _compacContext = compacContext;
        _mapper = mapper;
    }
 
    public async Task<FacturasVm> GetFacturasPagadas(DateTime periodo)
    {

        var facturas = await GeFacturasPagadasAsync(4, periodo);

        return new FacturasVm
        {
            Facturas = facturas
        };

    }

    public async Task<FacturasVm> GetFacturasPendientes(DateTime periodo)
    {

        var facturas = await GetFacturasPendientesAsync(4, periodo);
        return new FacturasVm
        {
            Facturas = facturas
        };
    }

    private async Task<List<FacturasDto>> GeFacturasPagadasAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _context.Documentos.TagWith("FACT PAGADAS")
          .AsNoTracking()
         .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == idDocumentoDe && f.Pendiente == 0 && f.FechaCreacionPago.HasValue  && f.FechaCreacionPago.Value.Month == periodo.Month && f.FechaCreacionPago.HasValue && f.FechaCreacionPago.Value.Year == periodo.Year)
         .OrderByDescending(d => d.Fecha)
             .ProjectTo<FacturasDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    private async Task<List<FacturasDto>> GetFacturasPendientesAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _context.Documentos.TagWith("FACT PENDIENTES")
     .AsNoTracking()
     .Where(f =>
        (f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == idDocumentoDe && f.Pendiente > 0)
        ||
       (f.Pendiente == 0 && f.Fecha.Month == periodo.Month && f.FechaCreacionPago.HasValue && f.FechaCreacionPago.Value.Year == periodo.Year && f.FechaCreacionPago.Value.Month != periodo.Month)
     )
     .OrderByDescending(d => d.Fecha)
     .ProjectTo<FacturasDto>(_mapper.ConfigurationProvider)
     .ToListAsync();
    }

    public async Task SincronizarFacturasAsync(DateTime periodo)
    {
        await GetAndSetFacturasCompacAsync(4, periodo);
    }

    private async Task GetAndSetFacturasCompacAsync(int idDocumentoDe, DateTime periodo)
    {
        // 1. Obtiene todo los documentos de COMPAC del periodo 
        var facturasCompac = await GetFacturasCompacSP(periodo);

        // 2. Obtiene los documentos existentes en mi BD
        var facturasInDb = await GetFacturasAsync(idDocumentoDe, periodo);

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

    private async Task<Dictionary<int, Documentos>> GetFacturasAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _context.Documentos
         .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.IdDocumentoDe == idDocumentoDe)
         .ToDictionaryAsync(f => f.IdComercial);
    }

    //private async Task CompareAndSyncChanges(List<AdmFacturasDto> facturasCompac, Dictionary<int, Documentos> facturasInDb)
    //{
    //    var facturasToAdd = new List<Documentos>();
    //    var movtosToAdd = new List<Movimiento>();

    //    foreach (var f in facturasCompac)
    //    {
    //        if (facturasInDb.TryGetValue(f.IdComercial, out var facInDb))
    //        {
    //            //si se cancelo la factura no se necesita actualizar el movimiento pero si cambiar el estatus 

    //            if(facInDb.Cancelado != f.Cancelado)
    //            {
    //                facInDb.Cancelado = f.Cancelado;
    //            }
    //            // si el pendiente es diferente quiere decir que ya pagaron la factura y necesita actualizarse la informacion de los movimientos 
    //            // si el agente cambio las comisiones serian para otro agente y por lo tanto el movto tambien debe cambiar. 
    //            if (facInDb.Pendiente != f.Pendiente || facInDb.Agente != f.Agente && facInDb.Cancelado==0)
    //            {
    //                facInDb.Pendiente = f.Pendiente;                 
    //                facInDb.Agente = f.Agente;
    //                facInDb.FechaPago = f.FechaPago;
    //                facInDb.FolioPago = f.FolioPago;
    //                facInDb.FechaCreacionPago = f.FechaCreacionPago;

    //                if (f.Movimientos != null)
    //                {

    //                  movtosToAdd =   CalcularComisiones(f.Movimientos, f.IdAgente);

    //                }

    //            }
    //        }
    //        else
    //        {
    //            var newFactura = new Documentos
    //            {
    //                IdComercial = f.IdComercial,
    //                IdDocumentoDe = f.IdDocumentoDe,
    //                Concepto = f.Concepto,
    //                Fecha = f.Fecha,
    //                Serie = f.Serie,
    //                Folio = f.Folio,
    //                Cliente = f.Cliente,
    //                Neto = f.Neto,
    //                IVA =   f.IVA,
    //                ISR = f.ISR,
    //                Descuento = f.Descuento,
    //                Total = f.Total,
    //                Pendiente = f.Pendiente,
    //                Cancelado = f.Cancelado,
    //                Agente = f.Agente,
    //                FechaPago = f.FechaPago,
    //                FolioPago = f.FolioPago,
    //                FechaCreacionPago =f.FechaCreacionPago
    //            };

    //            facturasToAdd.Add(newFactura);

    //            // Por error de usuario pueden existir facturas sin movimientos por eso hay que checar null antes de intentar agregar
    //            if (f.Movimientos != null)
    //            {
    //                movtosToAdd.AddRange(f.Movimientos.Select(m => new Movimiento
    //                {
    //                    IdMovimiento = m.IdMovimiento,
    //                    IdComercial = m.IdComercialMov,
    //                    IdProducto = m.IdProducto,
    //                    IdAgente = f.IdAgente,
    //                    Neto = m.MovNeto,
    //                    Descuento = m.MovDescto,
    //                    IVA = m.MovIVA,
    //                    ISR = m.MovISR,
    //                    CodigoProducto = m.Codigo,
    //                    NombreProducto = m.Nombre,
    //                    Descripcion = m.MovObserva,               
    //                    Comision = m.Comision
    //                }));
    //            }
    //        }
    //    }

    //    if (facturasToAdd.Count > 0 || movtosToAdd.Count > 0)
    //    {
    //        _context.Documentos.AddRange(facturasToAdd);
    //        _context.Movimientos.AddRange(movtosToAdd);
    //        await _context.SaveChangesAsync();
    //    }
    //}

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
            throw new NotFoundException(nameof(ApplicationUser), Id);
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