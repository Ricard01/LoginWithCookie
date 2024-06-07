using ERP.Domain.Entities;
using AutoMapper;
using AutoMapper.Configuration.Annotations;

namespace ERP.Infrastructure.Repositories.Users.Dtos;

[AutoMap(typeof(ApplicationUser))]
public class UserDto
{
    [Ignore] private Guid? _userId;
    public Guid Id { get; set; }
    
    public string? UserName { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? ProfilePictureUrl { get; init; }

    public IList<UserRoleDto> UserRoles { get; set; }
    
    public void Mapping(Profile profile)
    {
        profile.CreateMap<ApplicationUserRole, UserDto>()
            .ForMember(dto => dto.Id, opt => opt.MapFrom(ur => _userId ));

    }
}