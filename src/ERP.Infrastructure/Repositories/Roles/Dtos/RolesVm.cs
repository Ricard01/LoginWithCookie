namespace ERP.Infrastructure.Repositories.Roles.Dtos;

public class RolesVm
{
    public IList<RoleDto> Roles { get; set; } = new List<RoleDto>();
}