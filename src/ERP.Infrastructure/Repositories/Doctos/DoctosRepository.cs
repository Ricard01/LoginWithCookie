using AutoMapper;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Common.Exceptions;


namespace ERP.Infrastructure.Repositories.Doctos;

public class DoctosRepository : IDoctosRepository
{

    private readonly IApplicationDbContext _appContext;
    private readonly ICompacDbContext _context;
    private readonly IMapper _mapper;

    public DoctosRepository(ApplicationDbContext appContext, ICompacDbContext context, IMapper mapper)
    {
        _appContext = appContext;
        _context = context;
        _mapper = mapper;
    }

    public ApplicationDbContext AppContext { get; }


    public async Task<FacturasVm> GetFacturas(DateTime periodo)
    {


        // 1.- Obtengo los registros de Compac, Copio  registros nuevos y actualizo estatus de cancelacion. 

        await SincronizarFacturas( periodo);

     
        // 2.- Obtengo los registros :) 
        var facturas = await _appContext.Documentos
            .AsNoTracking()
            .Where(d => d.Fecha.Year == periodo.Year && d.Fecha.Month == periodo.Month && d.Cancelado == 0 && d.IdDocumentoDe == 4)
            .OrderByDescending(d => d.Fecha)
             .ProjectTo<DocumentosDto>(_mapper.ConfigurationProvider).ToListAsync();

        return new FacturasVm
        {
            Facturas = facturas
        };

    }


    public async Task<ComprasVm> GetCompras(DateTime periodo)
    {


        // 1.- Obtengo los registros de Compac, Copio  registros nuevos y actualizo estatus de cancelacion. 

        await SincronizarFacturas(periodo);


        // 2.- Obtengo los registros :) 
        var compras = await _appContext.Documentos
            .AsNoTracking()
            .Where(d => d.Fecha.Year == periodo.Year && d.Fecha.Month == periodo.Month && d.Cancelado == 0 && d.IdDocumentoDe == 19)
            .OrderByDescending(d => d.Fecha)
             .ProjectTo<DocumentosDto>(_mapper.ConfigurationProvider).ToListAsync();

        return new ComprasVm
        {
            Compras = compras
        };

    }


    public async Task<List<ComisionDto>> GetComisiones(DateTime periodo)
    {

        var comisiones = await _appContext.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == 4)
              .Join(
                  _appContext.Movimientos,
                  f => f.IdComercial,
                  m => m.IdComercial,
                  (f, m) => new { Factura = f, Movimiento = m }
              )
              .OrderByDescending(x => x.Factura.Fecha)
              .Select(x => new ComisionDto
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
                  Comision = x.Movimiento.Comision, // Asumiendo que Comision es Utilidad
                  Utilidad = x.Movimiento.Utilidad,
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


    public async Task<List<ComisionRDto>> GetComisionesR(DateTime periodo)
    {

        var comisiones = await _appContext.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe==4)
              .Join(
                  _appContext.Movimientos,
                  f => f.IdComercial,
                  m => m.IdComercial,
                  (f, m) => new { Factura = f, Movimiento = m }
              )
              .Where(x => x.Movimiento.IdAgente != 2)
              .OrderByDescending(x => x.Factura.Fecha)
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
                  Comision = x.Movimiento.Comision, // Asumiendo que Comision es Utilidad
                  Utilidad = x.Movimiento.Utilidad,
                  UtilidadRicardo = x.Movimiento.UtilidadRicardo,
                  IvaRicardo = x.Movimiento.IvaRicardo,
                  IsrRicardo = x.Movimiento.IsrRicardo,
                  Observaciones = x.Movimiento.Observaciones
              })
              .ToListAsync();

        return comisiones;

    }
  
    
    public async Task<List<ComisionADto>> GetComisionesA(DateTime periodo)
    {

        var comisiones = await _appContext.Documentos
                  .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == 4)
                  .Join(
                      _appContext.Movimientos,
                      f => f.IdComercial,
                      m => m.IdComercial,
                      (f, m) => new { Factura = f, Movimiento = m }
                  )
                  .Where(x => x.Movimiento.IdAgente != 1)
                  .OrderByDescending(x => x.Factura.Fecha)
                  .Select(x => new ComisionADto
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
                      Comision = x.Movimiento.Comision, // Asumiendo que Comision es Utilidad
                      Utilidad = x.Movimiento.Utilidad,
                      UtilidadAngie = x.Movimiento.UtilidadAngie,
                      IvaAngie = x.Movimiento.IvaAngie,
                      IsrAngie = x.Movimiento.IsrAngie,
                      Observaciones = x.Movimiento.Observaciones
                  })
                  .ToListAsync();

        return comisiones;

    }


    private async Task SincronizarCompras(DateTime periodo)
    {
        // 1. Obtengo todas las facturas de COMPAC del periodo incluso las canceladas por que en caso de que se cancelen se debe ajustar en la otra BD
        var doctos = await _context.AdmDocumentos
                  .AsNoTracking()
                  .Where(d => d.CFECHA.Year == periodo.Year && d.CFECHA.Month == periodo.Month && d.CIDDOCUMENTODE == 19)
                   .OrderBy(d => d.CFECHA)
                  .ProjectTo<AdmDocumentosDto>(_mapper.ConfigurationProvider).ToListAsync();

        // 2. Obtengo los IdComercial de las facturas que tengo en Bd
        var currentsIds = await _appContext.Documentos
            .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.IdDocumentoDe == 19)
            .Select(f => f.IdComercial)
            .ToListAsync();

        // 3. Excluyo las facturas que ya existen en mi Bd
        var newFacturas = doctos.Where(d => !currentsIds.Contains(d.CIDDOCUMENTO)).ToList();


        // 4. Agrego las facturas nuevas. 
        foreach (var fac in newFacturas)
        {
            var factura = new Documentos
            {
                IdComercial = fac.CIDDOCUMENTO,
                IdDocumentoDe = fac.CIDDOCUMENTODE,
                Concepto = fac.CIDCONCEPTODOCUMENTO,
                Fecha = fac.CFECHA,
                Serie = fac.CSERIEDOCUMENTO,
                Folio = fac.CFOLIO,
                Cliente = fac.CRAZONSOCIAL,
                Neto = fac.CNETO,
                Descuento = fac.CDESCUENTOMOV,
                Total = fac.CTOTAL,
                Pendiente = fac.CPENDIENTE,
                Cancelado = fac.CCANCELADO,
                Agente = fac.AdmAgentes.CNOMBREAGENTE

            };

            _appContext.Documentos.Add(factura);

            foreach (var movto in fac.AdmMovimientos)
            {
                var movimiento = new Movimiento
                {
                    IdMovimiento = movto.CIDMOVIMIENTO,
                    IdComercial = movto.CIDDOCUMENTO,
                    IdProducto = movto.CIDPRODUCTO,
                    Neto = movto.CNETO,
                    Descuento = movto.CDESCUENTO1,
                    Impuesto = movto.CIMPUESTO1,
                    Retencion = movto.CRETENCION1,
                    codigoProducto = movto.AdmProductos.CCODIGOPRODUCTO,
                    NombreProducto = movto.AdmProductos.CNOMBREPRODUCTO,
                };

                _appContext.Movimientos.Add(movimiento);

            }

        }
        // 5. Obtengo las facturas del periodo de mi Bd.
        var comprasInDb = await _appContext.Documentos
            .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.IdDocumentoDe == 19)
            .ToListAsync();

        // 6. Comparo y actualiza las compras canceladas
        foreach (var docto in doctos)
        {
            var facturaExistente = comprasInDb
                .FirstOrDefault(f => f.IdComercial == docto.CIDDOCUMENTO);

            if (facturaExistente != null)
            {
                // Si la factura está cancelada en COMPAC pero no en BD, actualiza
                if (docto.CCANCELADO == 1 && facturaExistente.Cancelado == 0)
                {
                    facturaExistente.Cancelado = 1;
                    _appContext.Documentos.Update(facturaExistente);
                }
            }
        }


        await _appContext.SaveChangesAsync();
    }


    private async Task SincronizarFacturas(DateTime periodo)
    {
        // 1. Obtengo todas las facturas de COMPAC del periodo incluso las canceladas por que en caso de que se cancelen se debe ajustar en la otra BD
        var doctos = await _context.AdmDocumentos
                  .AsNoTracking()
                  .Where(d => d.CFECHA.Year == periodo.Year && d.CFECHA.Month == periodo.Month && d.CIDDOCUMENTODE == 4)
                   .OrderBy(d => d.CFECHA)
                  .ProjectTo<AdmDocumentosDto>(_mapper.ConfigurationProvider).ToListAsync();

        // 2. Obtengo los IdComercial de las facturas que tengo en Bd
        var currentsIds = await _appContext.Documentos
            .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.IdDocumentoDe==4)
            .Select(f => f.IdComercial)
            .ToListAsync();

        // 3. Excluyo las facturas que ya existen en mi Bd
        var newFacturas = doctos.Where(d => !currentsIds.Contains(d.CIDDOCUMENTO)).ToList();


        // 4. Agrego las facturas nuevas. 
        foreach (var fac in newFacturas)
        {
            var factura = new Documentos
            {
                IdComercial = fac.CIDDOCUMENTO,
                IdDocumentoDe = fac.CIDDOCUMENTODE,
                Concepto = fac.CIDCONCEPTODOCUMENTO,
                Fecha = fac.CFECHA,
                Serie = fac.CSERIEDOCUMENTO,
                Folio = fac.CFOLIO,
                Cliente = fac.CRAZONSOCIAL,
                Neto = fac.CNETO,
                Descuento = fac.CDESCUENTOMOV,
                Total = fac.CTOTAL,
                Pendiente = fac.CPENDIENTE,
                Cancelado = fac.CCANCELADO,
                Agente = fac.AdmAgentes.CNOMBREAGENTE

            };

            _appContext.Documentos.Add(factura);

            foreach (var movto in fac.AdmMovimientos)
            {
                var movimiento = new Movimiento
                {
                    IdMovimiento = movto.CIDMOVIMIENTO,
                    IdComercial = movto.CIDDOCUMENTO,
                    IdProducto = movto.CIDPRODUCTO,
                    Neto = movto.CNETO,
                    Descuento = movto.CDESCUENTO1,
                    Impuesto = movto.CIMPUESTO1,
                    Retencion = movto.CRETENCION1,
                    codigoProducto = movto.AdmProductos.CCODIGOPRODUCTO,
                    NombreProducto = movto.AdmProductos.CNOMBREPRODUCTO,
                    Descripcion = movto.COBSERVAMOV,
                    Comision = movto.AdmProductos.CIMPORTEEXTRA1
                


                };

                _appContext.Movimientos.Add(movimiento);

            }

        }

        // 5. Obtengo las facturas del periodo de mi Bd.
        var facturasInDb = await _appContext.Documentos
            .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.IdDocumentoDe ==4)
            .ToListAsync();

        // 6. Comparo y actualiza las facturas canceladas
        foreach (var docto in doctos)
        {
            var facturaExistente = facturasInDb
                .FirstOrDefault(f => f.IdComercial == docto.CIDDOCUMENTO);

            if (facturaExistente != null)
            {
                // Si la factura está cancelada en COMPAC pero no en BD, actualiza
                if (docto.CCANCELADO == 1 && facturaExistente.Cancelado == 0)
                {
                    facturaExistente.Cancelado = 1;
                    _appContext.Documentos.Update(facturaExistente);
                }
            }
        }


        await _appContext.SaveChangesAsync();
    }


    public async Task<MovimientoDto> UpdateMovtoAsync(int Id, MovimientoDto movto )
    {


        var mov = await _appContext.Movimientos.SingleOrDefaultAsync(m => m.IdMovimiento == Id);
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
        mov.IvaRicardo  = movto.IvaRicardo;
        mov.IvaAngie = movto.IvaAngie;
        mov.Observaciones = movto.Observaciones;

        var result = await _appContext.SaveChangesAsync();

        return movto;
    }




}