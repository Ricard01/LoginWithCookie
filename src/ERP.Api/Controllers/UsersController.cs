using System.Text.Json.Serialization;
using ERP.Domain.Entities;
using ERP.Infrastructure.AuthFeatures;
using ERP.Infrastructure.AuthFeatures.Policy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace ERP.Api.Controllers;

public record Response(bool IsSuccess, string Message);

public record User(string Email, string Name, string Password);

public record CreateRequest(string Email, string Password, string ConfirmPassword);


public class UsersController : ApiControllerBase
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

  
    
  
    
 
 
    
    
    // [HttpGet]
    // [Requires(Permissions.UserAllAccess)]
    // public async Task<ActionResult<UsersVm>> Get()
    // {
    //     var users = await _userRepository.Get();
    //
    //     return Ok(users);
    // }
    //
    //
    // // [Requires(PermissionOperator.Or, Permissions.UserAllAccess, Permissions.UserRead)]
    // [HttpGet("{userId}")]
    // public async Task<ActionResult<UserDto>> Get(Guid userId)
    // {
    //     // var id = new Guid(userId);
    //     var user = await _userRepository.Get(userId);
    //
    //     return Ok(user);
    // }


    
    
   


    [HttpPost("[action]")]
    public async Task<IActionResult> Login([FromBody] SignInRequest signInRequest)
    {
        var result = await _signInManager.PasswordSignInAsync(signInRequest.Email, signInRequest.Password, true, false);

        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest(new Response(false, "Invalid credentials."));
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> Create([FromBody] CreateRequest createRequest)
    {
        var user = new ApplicationUser() { UserName = createRequest.Email };
        var result = await _userManager.CreateAsync(user, createRequest.Password);


        if (result.Succeeded)
        {
            return Ok();
        }

        return BadRequest();
    }

    // [HttpPost("login")]
    // public async Task<IActionResult> SignInAsync([FromBody] SignInRequest signInRequest)
    // {
    //     var user = users.FirstOrDefault(x => x.Email == signInRequest.Email &&
    //                                          x.Password == signInRequest.Password);
    //     if (user is null)
    //     {
    //         return BadRequest(new Response(false, "Invalid credentials."));
    //     }
    //
    //     var claims = new List<Claim>
    //     {
    //         new Claim(type: "email", value: signInRequest.Email),
    //         new Claim(type: "username", value: user.Name)
    //     };
    //     var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    //
    //     await HttpContext.SignInAsync(
    //         CookieAuthenticationDefaults.AuthenticationScheme,
    //         new ClaimsPrincipal(identity),
    //         new AuthenticationProperties
    //         {
    //             IsPersistent = true,
    //             AllowRefresh = true,
    //             ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
    //         });
    //
    //     return Ok(new Response(true, "Signed in successfully"));
    // }

  
}