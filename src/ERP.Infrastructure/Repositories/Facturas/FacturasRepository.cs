using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories.Facturas.Dtos;
using System.Data;
using Dapper;


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

        await ImportarDocumentosDeCompac(4, periodo);         // IdDocumentoDe = 4 (Facturas)

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
        return await _context.Documentos
          .AsNoTracking()
         .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == idDocumentoDe && f.Pendiente ==0 )
         .OrderByDescending(d => d.Fecha)
             .ProjectTo<FacturasDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    private async Task<List<FacturasDto>> GetFacturasPendientesAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _context.Documentos
          .AsNoTracking()
         .Where(d => d.Fecha.Year == periodo.Year && d.Fecha.Month == periodo.Month && d.Cancelado == 0 && d.IdDocumentoDe == idDocumentoDe)
         .OrderByDescending(d => d.Fecha)
             .ProjectTo<FacturasDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    private async Task ImportarDocumentosDeCompac(int idDocumentoDe, DateTime periodo)
    {
        // 1. Obtiene todo los documentos de COMPAC del periodo 
        var facturasCompac = await GetFacturasCompacSP(periodo);

        // 2. Obtiene los documentos existentes en mi BD
        var facturasInDb = await GetFacturasAsync(idDocumentoDe, periodo);

        // 3.Sincroniza con mi Bd los cambios y agrega las nuevas facturas. 
        await SincronizarFacturas(facturasCompac, facturasInDb);

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

    private async Task SincronizarFacturas(List<AdmFacturasDto> facturasCompac, Dictionary<int, Documentos> facturasInDb)
    {
        var facturasToAdd = new List<Documentos>();
        var movtosToAdd = new List<Movimiento>();

        foreach (var f in facturasCompac)
        {
            if (facturasInDb.TryGetValue(f.IdComercial, out var facInDb))
            {
                // Solo actualizar si hay cambios en estos campos si el pendiente es diferente por ende los campos de pago cambiaron, si hubo cancelacion no necesariamente cambiaron los otros campos pero puede existir que tambien se hayan actualizado los otros campos y no quiero complicar demasiado la logica
                if (facInDb.Pendiente != f.Pendiente ||
                    facInDb.Cancelado != f.Cancelado ||
                    facInDb.Agente != f.Agente)
                {
                    facInDb.Pendiente = f.Pendiente;
                    facInDb.Cancelado = f.Cancelado;
                    facInDb.Agente = f.Agente;
                    facInDb.FechaPago = f.FechaPago;
                    facInDb.FolioPago = f.FolioPago;
                    facInDb.FechaCreacionPago = f.FechaCreacionPago;
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

                // Por error de usuario pueden existir facturas sin movimientos por eso hay que checar null antes de intentar agregar
                if (f.Movimientos != null)
                {
                    movtosToAdd.AddRange(f.Movimientos.Select(m => new Movimiento
                    {
                        IdMovimiento = m.IdMovimiento,
                        IdComercial = m.IdComercialMov,
                        IdProducto = m.IdProducto,
                        IdAgente = f.IdAgente,
                        Neto = m.MovNeto,
                        Descuento = m.MovDescto,
                        IVA = m.MovIVA,
                        ISR = m.MovISR,
                        codigoProducto = m.Codigo,
                        NombreProducto = m.Nombre,
                        Observaciones = m.MovObserva,
                        Comision = m.Comision
                    }));
                }
            }
        }

        if (facturasToAdd.Count > 0 || movtosToAdd.Count > 0)
        {
            _context.Documentos.AddRange(facturasToAdd);
            _context.Movimientos.AddRange(movtosToAdd);
            await _context.SaveChangesAsync();
        }
    }



}