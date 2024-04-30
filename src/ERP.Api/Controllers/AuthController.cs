using ERP.Domain.Entities;
using ERP.Infrastructure.AuthFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public record SignInRequest(string Email, string Password, string ReturnUrl);

public record AuthUser
{
    public string? Id { get; set; }

    public string? Name { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public IEnumerable<string>? Permissions { get; set; }
}

[Authorize]
public class AuthController : ApiControllerBase
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [AllowAnonymous]
    [HttpPost("[action]")]
    // [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(SignInRequest signInRequest)
    {
        if (ModelState.IsValid)
        {
            var result =
                await _signInManager.PasswordSignInAsync(signInRequest.Email, signInRequest.Password, true, false);

            if (result.Succeeded)
            {
                return Ok();
            }
        }

        return BadRequest(new Response(false, "Invalid credentials."));
    }

    [HttpGet("session")]
    public async Task<ActionResult<AuthUser>> GetUserSession()
    {
        var httpconext = HttpContext.User;

        var user = await _userManager.GetUserAsync(HttpContext.User);

        var packedPermissions = HttpContext.User?.Claims
            .SingleOrDefault(x => x.Type == Constants.ClaimTypePermissions);

        var claims = packedPermissions?.Value.UnpackPermissionsFromString().Select(x => x.ToString());


        return new AuthUser
        {
            Id = user?.Id.ToString(),
            Name = user?.Name,
            ProfilePictureUrl = user?.ProfilePictureUrl,
            Permissions = claims
        };
    }


    [HttpGet("[action]")]
    public async Task<IActionResult> LogOut()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }
}