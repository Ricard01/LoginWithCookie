namespace ERP.Infrastructure.AuthFeatures;

public static class PermissionPackers
{
    public static string PackPermissionsIntoString(this IEnumerable<AuthFeatures.Permissions> permissions)
    {
        return permissions.Aggregate("", (s, permission) => s + (char)permission);
    }

    public static string PackPermissions(this IEnumerable<AuthFeatures.Permissions> permissions)
    {
        return permissions.Aggregate("", (s, permission) => s + (char)permission);
    }

    public static IEnumerable<AuthFeatures.Permissions> UnpackPermissionsFromString(this string packedPermissions)
    {
        if (packedPermissions == null)
            throw new ArgumentNullException(nameof(packedPermissions));
        foreach (var character in packedPermissions) yield return (AuthFeatures.Permissions)character;
    }

    public static AuthFeatures.Permissions? FindPermissionViaName(this string permissionName)
    {
        return Enum.TryParse(permissionName, out AuthFeatures.Permissions permission)
            ? permission
            : null;
    }
}
