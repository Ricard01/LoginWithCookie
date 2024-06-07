using Microsoft.AspNetCore.Identity;

namespace ERP.Domain.Entities;

public class ApplicationRole : IdentityRole<Guid>
{
    /// <summary>
    ///     A human-friendly description of what the Role does
    /// </summary>
    public string? Description { get; set; }

    public string? Permissions { get; set; }


    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
}