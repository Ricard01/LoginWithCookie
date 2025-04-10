using Microsoft.AspNetCore.Identity;

namespace ERP.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string Name { get; set; } = null!;

    public string? ProfilePictureUrl { get; set; }

    public virtual ICollection<ApplicationUserRole>? UserRoles { get; set; }
}