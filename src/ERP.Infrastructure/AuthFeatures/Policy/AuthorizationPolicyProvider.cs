using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using static ERP.Infrastructure.AuthFeatures.Policy.RequiresAttribute;

namespace ERP.Infrastructure.AuthFeatures.Policy;

public class AuthorizationPolicyProvider : DefaultAuthorizationPolicyProvider
{
    private readonly AuthorizationOptions _options;

    public AuthorizationPolicyProvider(IOptions<AuthorizationOptions> options) : base(options)
    {
        _options = options.Value;
    }

    public override async Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
    {
        var @operator = GetOperatorFromPolicy(policyName);
        var permissions = GetPermissionsFromPolicy(policyName);

        // extract the info from the policy name and create our requirement
        var requirement = new PermissionRequirement(@operator, permissions);

        //Unit tested shows this is quicker (and safer - see link to issue above) than the original version
        return await base.GetPolicyAsync(policyName)
               ?? new AuthorizationPolicyBuilder()
                   .AddRequirements(requirement)
                   .Build();
    }
}
