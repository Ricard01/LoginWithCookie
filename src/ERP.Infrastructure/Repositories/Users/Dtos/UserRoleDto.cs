using AutoMapper;
using ERP.Domain.Entities;


namespace ERP.Infrastructure.Repositories.Users.Dtos;

[AutoMap(typeof(ApplicationUserRole))]
public class UserRoleDto
{

    public string? RoleName { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<ApplicationUserRole, UserRoleDto>()
            .ForMember(dto => dto.RoleName, opt => opt.MapFrom(ur => ur.Role.Name));

    }
}