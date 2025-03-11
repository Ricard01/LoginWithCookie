using AutoMapper;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.EntityFrameworkCore;
using ERP.Infrastructure.Common.Interfaces;
using ERP.Domain.Entities;
using ERP.Infrastructure.Data;
using ERP.Infrastructure.Common.Exceptions;
using ERP.Infrastructure.Repositories.Dtos;



namespace ERP.Infrastructure.Repositories.Comisiones;

public class ComisionesRepository : IComisionesRepository
{

    private readonly IApplicationDbContext _context;
    private readonly ICompacDbContext _compacContext;
    private readonly IMapper _mapper;

    public ComisionesRepository(ApplicationDbContext context, ICompacDbContext compacContext, IMapper mapper)
    {
        _context = context;
        _compacContext = compacContext;
        _mapper = mapper;
    }

    public async Task<List<ComisionDto>> GetComisiones(DateTime periodo)
    {

        var comisiones = await _context.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == 4)
              .Join(
                  _context.Movimientos,
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

        var comisiones = await _context.Documentos
              .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == 4)
              .Join(
                  _context.Movimientos,
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

        var comisiones = await _context.Documentos
                  .Where(f => f.Fecha.Year == periodo.Year && f.Fecha.Month == periodo.Month && f.Cancelado == 0 && f.IdDocumentoDe == 4)
                  .Join(
                      _context.Movimientos,
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

    public async Task<MovimientoDto> UpdateMovtoAsync(int Id, MovimientoDto movto)
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