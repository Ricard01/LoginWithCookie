namespace ERP.Infrastructure.Common.Models;

/// <summary>
///  Represents a User with parameters required for creation and update within the system.
/// </summary>
public class CreateUser
{

    public string UserName { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? ProfilePictureUrl { get; set; }

    public string? Email { get; set; }

    public string Password { get; set; } = null!;

    /// <summary>
    /// Gets or sets the role name assigned to the user.
    /// This defines the user's permissions and access levels within the system. It can only have one 
    /// </summary>
    public string RoleName { get; set; } = null!;
}

/// <summary>
///  Represents a User model for updating a user.
/// </summary>
public class UpdateUser
{

    public string Name { get; set; } = null!;

    public string? ProfilePictureUrl { get; set; }

    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the role name assigned to the user.
    /// This defines the user's permissions and access levels within the system. It can only have one 
    /// </summary>
    public string RoleName { get; set; } = null!;
}

/// <summary>
/// Represents a Role model.
/// </summary>
public class Role
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public IEnumerable<string> Permissions { get; set; } = null!;
}