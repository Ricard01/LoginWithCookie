using AutoMapper;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;


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

    public async Task<DoctosVm> Get()
    {

        var fecha = DateTime.Now;

        var query = _context.AdmDocumentos
                  .AsNoTracking()
                  .Where(d => d.CFECHA.Year == fecha.Year && d.CFECHA.Month == fecha.Month && d.CCANCELADO == 0 && d.CIDCONCEPTODOCUMENTO == 5)
                  //.OrderByDescending(d => d.CFOLIO)
                  .ProjectTo<DoctoDto>(_mapper.ConfigurationProvider);


        var sql = query.ToQueryString();
        Console.WriteLine(sql);


        var doctos = await query.ToListAsync();

        await CopiarFacturasToDb(doctos, fecha);

        return new DoctosVm
        {
            Doctos = doctos
        };

    }

    private async Task CopiarFacturasToDb(IList<DoctoDto> doctos, DateTime fecha )
    {

      var facturasinDb = await   _appContext.Facturas.Where( f => f.Fecha.Year == fecha.Year && f.Fecha.Month == fecha.Month).ToListAsync();

        var facturasToAdd = doctos.Where( d => facturasinDb.All(doc => doc.IdComercial != d.CIDDOCUMENTO)).ToList();




        foreach (var fac in facturasToAdd)
        {
            var factura = new Factura
            {
                IdComercial = fac.CIDDOCUMENTO,
                Concepto = fac.CIDCONCEPTODOCUMENTO,
                Fecha = fac.CFECHA,
                Folio = fac.CFOLIO,
                Cliente = fac.CRAZONSOCIAL,
                Neto = fac.CNETO,
                Descuento = fac.CDESCUENTOMOV,
                Total = fac.CTOTAL,
                Pendiente = fac.CPENDIENTE,
                Cancelado = fac.CCANCELADO,
                Agente = fac.AdmAgentes.CNOMBREAGENTE

            };

            _appContext.Facturas.Add(factura);

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
                    Descripcion = movto.COBSERVAMOV
                   

                };

                _appContext.Movimientos.Add(movimiento);

            }

        }

        await _appContext.SaveChangesAsync();
    }


    //public async Task<DoctosDto> Get(Guid DoctosId)
    //{
    //    var Doctos = await _DoctosManager.Doctos
    //        .ProjectTo<DoctosDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(u => u.Id == DoctosId);

    //    if (Doctos == null)
    //    {
    //        throw new NotFoundException(nameof(ApplicationDoctos), DoctosId);
    //    }

    //    return Doctos;
    //}



}