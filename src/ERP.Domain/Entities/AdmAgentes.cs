using System.ComponentModel.DataAnnotations;

namespace ERP.Domain.Entities;

public class AdmAgentes
{

    [Key]
    public int CIDAGENTE { get; set; }

    public string CNOMBREAGENTE { get; set; }
}
