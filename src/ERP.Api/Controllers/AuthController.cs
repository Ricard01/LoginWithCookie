using ERP.Domain.Entities;
using ERP.Infrastructure.AuthFeatures;
using Microsoft.AspNetCore.Antiforgery;
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
    private readonly IAntiforgery _antiforgery;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager,
        IAntiforgery antiforgery)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _antiforgery = antiforgery;
    }

    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [HttpPost("[action]")]
    public async Task<IActionResult> Login(SignInRequest signInRequest)
    {
        if (ModelState.IsValid)
        {
            var result =
                await _signInManager.PasswordSignInAsync(signInRequest.Email, signInRequest.Password, true, false);

            if (result.Succeeded)
            {
                // var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
                // HttpContext.Response.Headers.Add("ANY-CSRF-TOKEN", tokens.RequestToken);

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
    // [ValidateAntiForgeryToken] Sirve para MVC asi que aqui NO tiene caso
    public async Task<IActionResult> LogOut()
    {
        await _signInManager
            .SignOutAsync(); // ASP.NET Core Identity. Esto eliminará la cookie de autenticación (ERP.Cookie).

        // Eliminar la cookie de antifalsificación
        var cookies = HttpContext.Request.Cookies;
        foreach (var cookie in cookies)
        {
            if (cookie.Key.StartsWith(".AspNetCore.Antiforgery.") || cookie.Key == "ANY-XSRF-TOKEN")
            {
                HttpContext.Response.Cookies.Delete(cookie.Key);
            }
        }

        return Ok(new Response(true, "Signed out successfully"));
    }

    [HttpGet("[action]")]
    [Authorize]
    public IActionResult Protected()
    {
        var protectedData = new { Message = "This is protected data" };
        return Ok(protectedData);
    }

    [HttpGet("[action]")]
    [AllowAnonymous]
    public IActionResult UnProtected()
    {
        var unprotectedData = new { Message = "This is unProtected data" };
        return Ok(unprotectedData);
    }
}