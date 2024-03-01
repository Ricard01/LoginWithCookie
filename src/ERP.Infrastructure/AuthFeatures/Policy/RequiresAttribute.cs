using Microsoft.AspNetCore.Authorization;

namespace ERP.Infrastructure.AuthFeatures.Policy;

public enum PermissionOperator
{
    And = 1,
    Or = 2
}

public class RequiresAttribute : AuthorizeAttribute
{
    /// <summary>
    ///     Initializes the attribute with multiple permissions
    /// </summary>
    /// <param name="permissionOperator">The operator to use when verifying the permissions provided</param>
    /// <param name="permissions">The list of permissions</param>
    public RequiresAttribute(PermissionOperator permissionOperator, params Permissions[] permissions) : base(
        permissions.ToString() ?? string.Empty)
    {
        // E.g: PERMISSION_1_permission.Order.Orders_permission.Order.Purchases.
        Policy = $"{PolicyPrefix}{(int)permissionOperator}{Separator}{string.Join(Separator, permissions)}";
    }

    private const string PolicyPrefix = "PERMISSION_";
    private const string Separator = "_";

    /// <summary>
    ///     Initializes the attribute with a single permission
    /// </summary>
    /// <param name="permission">The permission</param>
    public RequiresAttribute(Permissions permission)
    {
        // E.g: PERMISSION_1_Permission.Order.Orders..
        Policy = $"{PolicyPrefix}{(int)PermissionOperator.And}{Separator}{permission}";
    }

    public static PermissionOperator GetOperatorFromPolicy(string policyName)
    {
        var @operator = int.Parse(policyName.AsSpan(PolicyPrefix.Length, 1));
        return (PermissionOperator)@operator;
    }

    public static string[] GetPermissionsFromPolicy(string policyName)
    {
        return policyName.Substring(PolicyPrefix.Length + 2)
            .Split(new[] { Separator }, StringSplitOptions.RemoveEmptyEntries);
    }
}
