using AutoMapper;
using ERP.Infrastructure.Repositories.Doctos.Dtos;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using ERP.Infrastructure.Common.Interfaces;


namespace ERP.Infrastructure.Repositories.Doctos;

public class DoctosRepository : IDoctosRepository
{

    private readonly ICompacDbContext _context;
    private readonly IMapper _mapper;

    public DoctosRepository(ICompacDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<DoctosVm> Get()
    {

        var fecha = DateTime.Now;

        var query = _context.AdmDocumentos
                  .AsNoTracking()
                  .Where(d => d.CFECHA.Year == fecha.Year && d.CFECHA.Month == fecha.Month && d.CCANCELADO == 0 && d.CIDCONCEPTODOCUMENTO == 5)
                  .OrderByDescending(d => d.CFOLIO)
                  .ProjectTo<DoctoDto>(_mapper.ConfigurationProvider);
       
        
        var sql = query.ToQueryString();
        Console.WriteLine(sql);


        var doctos = await query.ToListAsync();

        return new DoctosVm
        {
            Doctos = doctos
        };

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