using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories.Gastos.Dtos;
using Dapper;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Repositories.Dtos;


namespace ERP.Infrastructure.Repositories.Gastos;

public class GastosRepository : IGastosRepository
{


    private readonly IApplicationDbContext _context;
    private readonly ICompacDbContext _compacContext;
    private readonly IMapper _mapper;

    public GastosRepository(ApplicationDbContext context, ICompacDbContext compacContext, IMapper mapper)
    {
        _context = context;
        _compacContext = compacContext;
        _mapper = mapper;
    }

    public async Task<GastosVm> GetGastos(DateTime periodo)
    {

        var gastos =    await _context.Documentos.TagWith("GASTOS")
          .AsNoTracking()
         .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == 19 )
         .OrderByDescending(d => d.Fecha)
             .ProjectTo<GastosDto>(_mapper.ConfigurationProvider).ToListAsync();

        return new GastosVm
        {
            Gastos = gastos
        };

    }

    public async Task SincronizarGastosAsync(DateTime periodo)
    {
        await GetAndSetGastosCompacAsync(19, periodo);
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

        foreach (var g in gastosCompac)
        {
            if (gastosInDb.TryGetValue(g.IdComercial, out var gastInDb))
            {
                // Solo actualizar si hay cambios en estos campos si el pendiente es diferente por ende los campos de pago cambiaron, si hubo cancelacion no necesariamente cambiaron los otros campos pero puede existir que tambien se hayan actualizado los otros campos y no quiero complicar demasiado la logica
                if (
                    gastInDb.Cancelado != g.Cancelado ||
                    gastInDb.Agente != g.Agente)
                {
                    gastInDb.Pendiente = g.Pendiente;
                    gastInDb.Cancelado = g.Cancelado;
                    gastInDb.Agente = g.Agente;
                    gastInDb.FechaPago = g.FechaPago;
                    gastInDb.FolioPago = g.FolioPago;
                    gastInDb.FechaCreacionPago = g.FechaCreacionPago;
                }
            }
            else
            {
                var newGasto = new Documentos
                {
                    IdComercial = g.IdComercial,
                    IdDocumentoDe = g.IdDocumentoDe,
                    Concepto = g.Concepto.Trim(),
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
                    FechaPago = g.FechaPago,
                    FolioPago = g.FolioPago,
                    FechaCreacionPago = g.FechaCreacionPago
                };

                gastosToAdd.Add(newGasto);

                // Por error de usuario pueden existir gastos sin movimientos por eso hay que checar null antes de intentar agregar
                if (g.Movimientos != null)
                {
                    movtosToAdd.AddRange(g.Movimientos.Select(m => new Movimiento
                    {
                        IdMovimiento = m.IdMovimiento,
                        IdComercial = m.IdComercialMov,
                        IdProducto = m.IdProducto,
                        IdAgente = g.IdAgente,
                        Neto = m.MovNeto,
                        Descuento = m.MovDescto,
                        IVA = m.MovIVA,
                        ISR = m.MovISR,
                        CodigoProducto = m.Codigo,
                        NombreProducto = m.Nombre,
                        Descripcion = m.MovObserva,
                        Comision = m.Comision
                    }));
                }
            }
        }

        if (gastosToAdd.Count > 0 || movtosToAdd.Count > 0)
        {
            _context.Documentos.AddRange(gastosToAdd);
            _context.Movimientos.AddRange(movtosToAdd);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<MovimientoDto> UpdateMovtoGastoAsync(int Id, MovimientoDto movto)
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