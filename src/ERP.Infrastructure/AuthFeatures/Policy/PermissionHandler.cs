using Microsoft.AspNetCore.Authorization;
using Serilog;

namespace ERP.Infrastructure.AuthFeatures.Policy;

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        Log.Warning("HandleRequirement", requirement);
        // https://blog.joaograssi.com/posts/2021/asp-net-core-protecting-api-endpoints-with-dynamic-policies/

        var packedClaims =
            context.User.Claims.SingleOrDefault(c => c.Type == Constants.ClaimTypePermissions);

        // If user doesnt have claims exits
        if (packedClaims == null)
        {
            Log.Error("Current user's doesn't have claims");
            context.Fail();
            return Task.CompletedTask;
        }


        var userClaims = packedClaims.Value.UnpackPermissionsFromString();


        if (userClaims.ComplyWithPermissions(requirement))
        {
            context.Succeed(requirement);
        }
        else
        {
            // identity does not have any of the required permissions
            Log.Warning("Current user's doesn't satisfy the permission authorization requirement ",
                requirement.Permissions);
            context.Fail();
        }

        return Task.CompletedTask;
    }
}
