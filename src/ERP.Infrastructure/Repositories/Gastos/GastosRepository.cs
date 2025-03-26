using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories.Gastos.Dtos;
using Dapper;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Repositories.Dtos;
using System.Linq.Expressions;
using ERP.Domain.Constants;


namespace ERP.Infrastructure.Repositories.Gastos;

public class GastosRepository : IGastosRepository
{

    private readonly IApplicationDbContext _context;
    private readonly ICompacDbContext _compacContext;


    public GastosRepository(ApplicationDbContext context, ICompacDbContext compacContext)
    {
        _context = context;
        _compacContext = compacContext;
    }

    public  Task<List<GastosDto>> GetGastos(DateTime periodo)
    {
        return GetGastosQuery("GASTOS", g => g.Fecha.Year == periodo.Year && g.Fecha.Month == periodo.Month && g.Cancelado == 0 && g.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Gastos);
    }

    public  Task<List<GastosDto>> GetGastosAgente(int idAgente, DateTime periodo)
    {
        return GetGastosQuery("GASTOS X AGENTE",g => g.Fecha.Year == periodo.Year && g.Fecha.Month == periodo.Month && g.Cancelado == 0 && g.IdDocumentoDe == CONTPAQi.IdDocumentoDe.Gastos && g.Movimientos.Any(m => m.IdAgente == idAgente));
    }

    public  Task<List<GastosDto>> GetGastosQuery(string? tag,Expression<Func<Documentos, bool>> whereCondition)
    {
        return _context.Documentos
            .AsNoTracking()
            .Where(whereCondition)
            .OrderByDescending(d => d.Fecha)
            .Select(d => new GastosDto
            {
                Id = d.Id,
                Concepto = d.Concepto,
                Fecha = d.Fecha,
                Folio = $"{d.Serie ?? ""}{d.Folio}",
                Proveedor = d.Cliente,
                Neto = d.Neto,
                IVA = d.IVA,
                Total = d.Total,
                Descuento = d.Descuento,
                Pendiente = d.Pendiente,
                Cancelado = d.Cancelado,
                Agente = d.Agente,
                AfectaComisiones = d.AfectaComisiones,
                Movimientos = d.Movimientos.Select(m => new MovimientoDto
                {
                    IdMovimiento = m.IdMovimiento,
                    IdComercial = m.IdComercial,
                    IdDocumentoDe = m.IdDocumentoDe,
                    IdAgente = m.IdAgente,
                    Neto = m.Neto,
                    Descuento = m.Descuento,
                    IVA = m.IVA,
                    ISR = m.ISR,
                    Total = m.Total,
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

            }).ToListAsync();
    }

    // TIP-PRO: No uses async/await si solo reenviás el Task y no procesás el resultado
    // REF: docs/general/tips-pro.md#async-vs-await-cuando-solo-redirigis-la-tarea
    public Task SincronizarGastosAsync(DateTime periodo)
    {
       return  GetAndSetGastosCompacAsync(CONTPAQi.IdDocumentoDe.Gastos, periodo);
    }

    private async Task GetAndSetGastosCompacAsync(int idDocumentoDe, DateTime periodo)
    {
        // 1. Obtiene todo los gastos de COMPAC del periodo 
        var gastosCompac = await GetGastosCompacSP(periodo);

        // 2. Obtiene los gastos existentes en mi BD
        var gastosInDb = await GetGastosAsync(idDocumentoDe, periodo);

        // 3.Sincroniza con mi Bd los cambios y agrega las nuevas gastos. 
        await CompareAndSyncChanges(gastosCompac, gastosInDb);

    }

    public async Task<List<AdmGastosDto>> GetGastosCompacSP(DateTime periodo)
    {

        using (var connection = (_compacContext as DbContext)?.Database.GetDbConnection())
        {
            await connection.OpenAsync();

            var sql = "EXEC getGastosAndMovimientos @Anio, @Mes";

            var facturasDictionary = new Dictionary<int, AdmGastosDto>();

            var facturas = await connection.QueryAsync<AdmGastosDto, AdmGastoMovtos, AdmGastosDto>(
                sql,
                (factura, movimiento) =>
                {
                    // Si la factura ya existe en el diccionario, solo agregamos el movimiento
                    if (!facturasDictionary.TryGetValue(factura.IdComercial, out var facturaEntry))
                    {
                        facturaEntry = factura;
                        facturaEntry.Movimientos = new List<AdmGastoMovtos>(); // Inicializar la lista de movimientos
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

    private async Task<Dictionary<int, Documentos>> GetGastosAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _context.Documentos
         .Where(g => g.Fecha.Year == periodo.Year && g.Fecha.Month == periodo.Month && g.IdDocumentoDe == idDocumentoDe)
         .ToDictionaryAsync(g => g.IdComercial);
    }

    private async Task CompareAndSyncChanges(List<AdmGastosDto> gastosCompac, Dictionary<int, Documentos> gastosInDb)
    {
        var gastosToAdd = new List<Documentos>();
        var movtosToAdd = new List<Movimiento>();
        bool cambiosRealizados = false;

        foreach (var g in gastosCompac)      
        {

           
            if (gastosInDb.TryGetValue(g.IdComercial, out var gastnDb))
            {
                // 🔹 Si la factura se canceló, solo actualizar el estado
                if (gastnDb.Cancelado != g.Cancelado)
                {
                    gastnDb.Cancelado = g.Cancelado;
                    _context.Entry(gastnDb).State = EntityState.Modified; // 🔹 Marcar como modificado
                    cambiosRealizados = true;
                }
                // TODOS ESTOS CAMBIOS NO SE ESTAN GUARDANDO PORQUE??

                // 🔹 Si se pagó o cambió el agente, actualizar datos y recalcular comisiones
                if ((gastnDb.Pendiente != g.Pendiente || gastnDb.Agente != g.Agente) && gastnDb.Cancelado == 0)
                {
                    gastnDb.Pendiente = g.Pendiente;
                    gastnDb.Agente = g.Agente;

                    _context.Entry(gastnDb).State = EntityState.Modified; // 🔹 Marcar como modificado
                    cambiosRealizados = true;

                    if (g.Movimientos != null)
                    {
                        var movimientosCalculados = CalcularImpuestos(g.Movimientos, g.IdAgente, g.IdDocumentoDe);
                        foreach (var movimiento in movimientosCalculados)
                        {
                            var movExistente = _context.Movimientos.FirstOrDefault(m => m.IdMovimiento == movimiento.IdMovimiento);
                            if (movExistente != null)
                            {
                                movExistente.IdAgente = movimiento.IdAgente;                         
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
                var newGasto = new Documentos
                {
                    IdComercial = g.IdComercial,
                    IdDocumentoDe = g.IdDocumentoDe,
                    Concepto = g.Concepto,
                    Fecha = g.Fecha,
                    Serie = g.Serie,
                    Folio = g.Folio,
                    Cliente = g.Cliente,
                    Neto = g.Neto,
                    IVA = g.IVA,
                    ISR = g.ISR,
                    Descuento = g.Descuento,
                    Total = g.Total,
                    Pendiente = g.Pendiente,
                    Cancelado = g.Cancelado,
                    Agente = g.Agente,
              
                };

                gastosToAdd.Add(newGasto);

                if (g.Movimientos != null)
                {
                    var movimientosCalculados = CalcularImpuestos(g.Movimientos, g.IdAgente, g.IdDocumentoDe);
                    movtosToAdd.AddRange(movimientosCalculados);
                }
            }
        }

        if (cambiosRealizados)
        {
            await _context.SaveChangesAsync();
        }

        if (gastosToAdd.Count > 0 || movtosToAdd.Count > 0)
        {
            _context.Documentos.AddRange(gastosToAdd);
            _context.Movimientos.AddRange(movtosToAdd);
            await _context.SaveChangesAsync();
        }
    }

    private List<Movimiento> CalcularImpuestos(ICollection<AdmGastoMovtos> movimientos, int idAgente, int IdDocumentoDe)
    {
        var movimientosCalculados = new List<Movimiento>();



        // 🔹 Si el agente es mayor a 3 hay algun error porque no existe ese agente asi que dejar en ceros 
        if (idAgente > 3 )
        {
            return movimientos.Select(m => new Movimiento
            {
             
                IdAgente = idAgente,
                IdDocumentoDe = IdDocumentoDe,
                Neto = m.MovNeto,
                Descuento = m.MovDescto,
                IVA = m.MovIVA,
                ISR = m.MovISR,
                Total = m.MovTotal,
                CodigoProducto = m.Codigo,
                NombreProducto = m.Nombre,
                Descripcion = m.MovObserva,                     
                IvaRicardo = 0,
                IvaAngie = 0,
                IsrRicardo = 0,
                IsrAngie = 0
            }).ToList();


        }

        // 🔹 Aplicar cálculos de comisión si el agente no es 3 o si hay solo un movimiento
        foreach (var m in movimientos)
        {


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
                Total= m.MovTotal,
                CodigoProducto = m.Codigo,
                NombreProducto = m.Nombre,
                Descripcion = m.MovObserva,
    
              
            };

            // 🔹 Asignar valores según el agente
            switch (idAgente)
            {           
                case 1: // 🔹 Ricardo
                 
                    movimientoCalculado.IvaRicardo = m.MovIVA;
                    movimientoCalculado.IvaAngie = 0;
                    movimientoCalculado.IsrRicardo = m.MovISR;
                    movimientoCalculado.IsrAngie = 0;
                    break;
                case 2: // 🔹 Angie
             
                    movimientoCalculado.IvaRicardo = 0;
                    movimientoCalculado.IvaAngie = m.MovIVA;
                    movimientoCalculado.IsrRicardo = 0;
                    movimientoCalculado.IsrAngie = m.MovISR;
                    break;
                case 3: // 🔹 Ambos (50/50)
              
                    double ivaMitad = m.MovIVA / 2;
                    double isrMitad = m.MovISR / 2;              
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

    public async Task<MovimientoDto> UpdateMovtoGastoAsync(int Id, MovimientoDto movto)
    {
        // Aqui no modificamos el agente, se debe modificar desde comercial para actualizar la informacion 

        var movBd = await _context.Movimientos.SingleOrDefaultAsync(m => m.IdMovimiento == Id);
        if (movBd == null)
        {
            throw new NotFoundException(nameof(Movimiento), Id);
        }
     
        movBd.AfectaComisiones = movto.AfectaComisiones;
        movBd.IsrAngie = movto.IsrAngie;
        movBd.IsrRicardo = movto.IsrRicardo;
        movBd.IvaRicardo = movto.IvaRicardo;
        movBd.IvaAngie = movto.IvaAngie;
        movBd.Observaciones = movto.Observaciones;

        var result = await _context.SaveChangesAsync();

        return movto;
    }


}