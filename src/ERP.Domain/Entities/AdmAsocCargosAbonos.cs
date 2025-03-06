using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERP.Domain.Entities;

public class AdmAsocCargosAbonos
{


    public int CIDAUTOINCSQL { get; set; }

    [Key, Column(Order = 0)]
    public int CIDDOCUMENTOABONO { get; set; }

    public AdmDocumentos? DocumentoAbono { get; set; }

    [Key, Column(Order = 1)]
    public int CIDDOCUMENTOCARGO { get; set; }

    public AdmDocumentos? DocumentoCargo { get; set; }

    public double CIMPORTEABONO { get; set; }

    public double CIMPORTECARGO { get; set; }

    public DateTime CFECHAABONOCARGO { get; set; }


}
