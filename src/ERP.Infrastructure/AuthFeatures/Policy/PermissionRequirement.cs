using Microsoft.AspNetCore.Authorization;

namespace ERP.Infrastructure.AuthFeatures.Policy;

public class PermissionRequirement : IAuthorizationRequirement
{
    // public static string ClaimType => Constants.ClaimType;
    public string[] Permissions { get; }

    public PermissionOperator PermissionOperator { get; }

    public PermissionRequirement(PermissionOperator permissionOperator, string[] permissions)
    {
        PermissionOperator = permissionOperator;
        Permissions = permissions ??
                      throw new ArgumentException("At least one permission is required.", nameof(permissions));
    }
    // public static string ClaimType => AppClaimTypes.Permissions;
    //
    // public PermissionOperator PermissionOperator { get; }
    //
    // public string[] Permissions { get; }

    // public PermissionRequirement(PermissionOperator permissionOperator, string permissionName)
    // {
    //     if (permissions.Length == 0)
    //         throw new ArgumentException("At least one permission is required.", nameof(permissions));
    //
    //     PermissionOperator = permissionOperator;
    //     Permissions = permissions;
    // }
}
