using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Repositories.Gastos.Dtos;
using ERP.Infrastructure.Repositories.CompacDtos;


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

        // IdDocumentoDe = 4 (Facturas)
        await ImportarDocumentosDeCompac(4, periodo);

        var gastos = await GetDocumentosAsync(4, periodo);

        return new GastosVm
        {
            Gastos = gastos
        };

    }

 
    private async Task<List<GastosDto>> GetDocumentosAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _context.Documentos
          .AsNoTracking()
         .Where(d => d.Fecha.Year == periodo.Year && d.Fecha.Month == periodo.Month && d.Cancelado == 0 && d.IdDocumentoDe == idDocumentoDe)
         .OrderByDescending(d => d.Fecha)
             .ProjectTo<GastosDto>(_mapper.ConfigurationProvider).ToListAsync();
    }


    private async Task ImportarDocumentosDeCompac(int idDocumentoDe, DateTime periodo)
    {
        // 1. Obtener todo los documentos de COMPAC del periodo (No cancelados) 
        var documentosCompac = await GetDocumentosCompacAsync(idDocumentoDe, periodo);

        // 2. Obtener los documentos existentes en mi BD
        var documentosExistentes = await GetDocumentosExistentesAsync(idDocumentoDe, periodo);

        // 3. Determinar los nuevos documentos y los documentos cancelados
        var nuevosDoctos = DeterminarNuevosDocumentos(documentosCompac, documentosExistentes);

        var documentosCancelados = DeterminarDocumentosCancelados(documentosCompac, documentosExistentes);

        await GuardarCambios(nuevosDoctos, documentosCancelados);

    }

    private async Task<List<AdmDocumentosDto>> GetDocumentosCompacAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _compacContext.AdmDocumentos
            .AsNoTracking()
            .Where(d => d.CFECHA.Year == periodo.Year && d.CFECHA.Month == periodo.Month && d.CCANCELADO == 0 && d.CIDDOCUMENTODE == idDocumentoDe)
            .OrderBy(d => d.CFECHA)
             .ProjectTo<AdmDocumentosDto>(_mapper.ConfigurationProvider).ToListAsync();
    }


    private async Task<Dictionary<int, Documentos>> GetDocumentosExistentesAsync(int idDocumentoDe, DateTime periodo)
    {
        return await _context.Documentos
         .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.IdDocumentoDe == idDocumentoDe)
         .ToDictionaryAsync(f => f.IdComercial);
    }


    private List<Documentos> DeterminarNuevosDocumentos(List<AdmDocumentosDto> doctosCompac, Dictionary<int, Documentos> doctosExistentes)
    {
        // Excluye los documentos que ya existen en la BD y mapea los documentos de COMPAC a Documentos
        return doctosCompac
    .Where(c => !doctosExistentes.ContainsKey(c.CIDDOCUMENTO))
    .Select(c => new Documentos
    {
        IdComercial = c.CIDDOCUMENTO,
        IdDocumentoDe = c.CIDDOCUMENTODE,
        Concepto = c.CIDCONCEPTODOCUMENTO,
        Fecha = c.CFECHA,
        Serie = c.CSERIEDOCUMENTO,
        Folio = c.CFOLIO,
        Cliente = c.CRAZONSOCIAL,
        Neto = c.CNETO,
        Descuento = c.CDESCUENTOMOV,
        Total = c.CTOTAL,
        Pendiente = c.CPENDIENTE,
        Cancelado = c.CCANCELADO,
        Agente = c.AdmAgentes.CNOMBREAGENTE,

        Movimientos = c.AdmMovimientos.Select(movto => new Movimiento
        {
            IdMovimiento = movto.CIDMOVIMIENTO,
            IdComercial = movto.CIDDOCUMENTO,
            IdProducto = movto.CIDPRODUCTO,
            Neto = movto.CNETO,
            Descuento = movto.CDESCUENTO1,
            Impuesto = movto.CIMPUESTO1,
            Retencion = movto.CRETENCION1,
            codigoProducto = movto.AdmProductos.CCODIGOPRODUCTO,
            NombreProducto = movto.AdmProductos.CNOMBREPRODUCTO
        }).ToList()
    }).ToList();

    }


    private List<Documentos> DeterminarDocumentosCancelados(List<AdmDocumentosDto> doctosCompac, Dictionary<int, Documentos> documentosExistentes)
    {
        return doctosCompac
        //            c.CCANCELADO == 1 → Solo considera documentos cancelados en COMPAC.
        //documentosExistentes.TryGetValue(c.CIDDOCUMENTO, out var docBd)
        //Busca si el documento existe en el diccionario documentosExistentes.
        //Si lo encuentra, lo almacena en la variable docBd y devuelve true.
        //Si no lo encuentra, devuelve false y lo descarta del filtrado.
        //docBd.Cancelado == 0 → Solo selecciona documentos que aún no han sido cancelados en la base de datos.
        .Where(c => c.CCANCELADO == 1 && documentosExistentes.TryGetValue(c.CIDDOCUMENTO, out var docBd) && docBd.Cancelado == 0)
        .Select(c =>
        {
            documentosExistentes[c.CIDDOCUMENTO].Cancelado = 1; // Marcar como cancelado en BD
            return documentosExistentes[c.CIDDOCUMENTO]; // Retornar el documento actualizado
        })
        .ToList();
    }


    private async Task GuardarCambios(List<Documentos> nuevosDocumentos, List<Documentos> documentosCancelados)
    {

        if (nuevosDocumentos.Count == 0 && documentosCancelados.Count == 0)
            return; // No hay cambios, evitamos llamadas innecesarias a la BD

        _context.Documentos.AddRange(nuevosDocumentos);
        _context.Documentos.UpdateRange(documentosCancelados);

        await _context.SaveChangesAsync();

    }


}