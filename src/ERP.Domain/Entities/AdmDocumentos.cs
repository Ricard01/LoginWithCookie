using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERP.Domain.Entities;

public class AdmDocumentos
{
    [Key]
    public int CIDDOCUMENTO { get; set; }

    public int CIDCONCEPTODOCUMENTO { get; set; }

    public DateTime CFECHA { get; set; }

    public double CFOLIO { get; set; }

    public required string CRAZONSOCIAL { get; set; }

    public double CNETO { get; set; }

    public double CTOTAL { get; set; }

    public double CDESCUENTOMOV { get; set; }

    public double CPENDIENTE { get; set; }  

    public int CCANCELADO { get; set; }


    [ForeignKey("CIDDOCUMENTO")]
    public virtual ICollection<AdmMovimientos> AdmMovimientos { get; set; }



    [ForeignKey("CIDAGENTE")]
    public virtual required AdmAgentes AdmAgentes { get; set; }


}
