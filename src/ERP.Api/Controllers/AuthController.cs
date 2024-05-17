using ERP.Domain.Entities;
using ERP.Infrastructure.AuthFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public record SignInRequest(string Email, string Password);

public record AuthUser(
    string Id,
    string Name,
    string? ProfilePictureUrl,
    string? Role,
    IEnumerable<string>? Permissions);

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
                return Ok(new Response(true, "Signed in successfully"));
            }
        }

        return BadRequest(new Response(false, "Invalid Credentials"));
    }


    [HttpGet("session")]
    public async Task<ActionResult<AuthUser>> GetUserSession()
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);


        if (user != null)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var packedPermissions = HttpContext.User.Claims
                .SingleOrDefault(x => x.Type == Constants.ClaimTypePermissions);

            var claims = packedPermissions?.Value.UnpackPermissionsFromString().Select(x => x.ToString());

            return new AuthUser
            (
                user.Id.ToString(),
                user.Name,
                user.ProfilePictureUrl,
                roles.FirstOrDefault(),
                claims
            );
        }

        return BadRequest("Error al obtener la sesion del usuario ");
    }


    [HttpPost("[action]")]
    // [ValidateAntiForgeryToken]
    public async Task<IActionResult> LogOut()
    {
        // ASP.NET Core Identity. Esto eliminará la cookie de autenticación del navegador del usuario.
        await _signInManager.SignOutAsync(); 
        return Ok(new Response(true, "Signed out successfully"));
    }
}