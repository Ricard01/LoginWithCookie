namespace ERP.Infrastructure.Repositories.Roles.Dtos;


public class RoleDto
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public IEnumerable<string>? Permissions { get; set; }

}