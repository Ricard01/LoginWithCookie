namespace ERP.Infrastructure.Repositories.Users.Dtos;

public class UsersVm
{
    public IList<UserDto> Users { get; set; } = new List<UserDto>();
}