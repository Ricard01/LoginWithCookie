using ERP.Infrastructure.AuthFeatures;
using ERP.Infrastructure.AuthFeatures.Policy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Security.Claims;
using System.Text.Json.Serialization;


namespace ERP.Api.Controllers;


public record UserClaim(string Type, string Value);


[Authorize]
public class TestController : ApiControllerBase
{
    public class UserInfo
    {
        [JsonPropertyName("id")] public string? Id { get; set; }

        [JsonPropertyName("claims")] public IEnumerable<string>? Claims { get; set; }
    }


    [Requires(Permissions.UserAllAccess)]
    [HttpGet("GetPermissions")]
    public UserInfo GetPermissions()
    {
        var ienumClaims = User.Claims.Select(c => new { c.Type, c.Value });

        Log.Information("claims: {Claims}", ienumClaims);

        var packedPermissions = HttpContext.User?.Claims
            .SingleOrDefault(x => x.Type == Constants.ClaimTypePermissions);
        var claims = packedPermissions?.Value.UnpackPermissionsFromString().Select(x => x.ToString());

        return new UserInfo()
        {
            Id = "1",
            Claims = claims
        };
    }


    [HttpGet("getClaims")]
    public IActionResult GetClaims()
    {
        var userClaims = User.Claims.Select(x => new UserClaim(x.Type, x.Value)).ToList();

        return Ok(userClaims);
    }


    [HttpGet("getName")]
    public IActionResult GetClaimsV2()
    {
        var userName = HttpContext.User.Claims
            .Where(x => x.Type == ClaimTypes.Name)
            .Select(x => x.Value)
            .FirstOrDefault();
        return Content($"<p>Hello to Code Maze {userName}</p>");
    }

}