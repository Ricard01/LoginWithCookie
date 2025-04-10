using ERP.Infrastructure.AuthFeatures.Policy;
using System.ComponentModel;

namespace ERP.Infrastructure.AuthFeatures;

public static class PermissionChecker
{
    /// <summary>
    ///     Determines whether the user permission satisfy the requirement(s).
    /// </summary>
    /// <param name="usersPermissions"> An IEnumerable&lt;Permissions&gt; contains user permissions. </param>
    /// <param name="requirement">PermissionRequirement</param>
    /// <returns>True if permission(s) are valid; otherwise, false.</returns>
    public static bool ComplyWithPermissions(this IEnumerable<AuthFeatures.Permissions> usersPermissions,
        PermissionRequirement requirement)
    {
        // And Operator: true if all requirements are valid 
        if (requirement.PermissionOperator == PermissionOperator.And)
            return requirement.Permissions.All(req => usersPermissions.Contains(EnumPermission(req)));

        // Or Operator: true if one requirement are valid 
        return requirement.Permissions.Any(req => usersPermissions.Contains(EnumPermission(req)));
    }


    private static AuthFeatures.Permissions EnumPermission(string permission)
    {
        // True if the permissionName (attributeName in Controller)  was converted successfully;
        if (!Enum.TryParse(permission, true, out AuthFeatures.Permissions permissionToCheck))
            throw new InvalidEnumArgumentException($"{permission} could not be converted to a {nameof(AuthFeatures.Permissions)}.");

        return permissionToCheck;
    }

    #region MetodoAnteriorEliminarPronto

    // public static bool ThisPermissionIsAllowed(this string packedPermissions, string[] permissionsFromRequirement,
    //     PermissionOperator permissionOperator)
    // {
    //     // reverses the process (Aggregate char) and returns a list based on the enum permissions
    //     var usersPermissions = packedPermissions.UnpackPermissionsFromString().ToArray();
    //
    //
    //     if (permissionOperator == PermissionOperator.And)
    //     {
    //         foreach (var permission in permissionsFromRequirement)
    //         {
    //             if (!usersPermissions.Contains(EnumPermission(permission)))
    //                 return false;
    //         }
    //
    //         return true;
    //     }
    //
    //
    //     foreach (var permission in permissionsFromRequirement)
    //     {
    //         if (usersPermissions.Contains(EnumPermission(permission)))
    //             return true;
    //     }
    //
    //
    //     return false;
    // }
    //
    // /// <summary>
    // /// This is the main checker of whether a user permissions allows them to access something with the given permission
    // /// </summary>
    // /// <param name="usersPermissions"></param>
    // /// <param name="permissionToCheck"></param>
    // /// <returns></returns>
    // public static bool UserHasThisPermission(this Permissions[] usersPermissions, Permissions permissionToCheck)
    // {
    //     // Validates if permission exists in the userPermission or if has AccessAll
    //     return usersPermissions.Contains(permissionToCheck) || usersPermissions.Contains(Permissions.AccessAll);
    // }

    #endregion
}
