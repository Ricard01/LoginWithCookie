using ERP.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERP.Api.Controllers;

public record SignInRequest(string Email, string Password);


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
    public async Task<IActionResult> Login(SignInRequest signInRequest)
    {
        var result = await _signInManager.PasswordSignInAsync(signInRequest.Email, signInRequest.Password, true, false);

        if (result.Succeeded)
        { 
            return Ok();
        }

        return BadRequest(new Response(false, "Invalid credentials."));
    }
    
  
    [HttpGet("[action]")]
    public async Task<IActionResult> LogOut()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }
    

    
}