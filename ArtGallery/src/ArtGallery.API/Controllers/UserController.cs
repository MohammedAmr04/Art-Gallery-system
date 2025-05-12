using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ArtGallery.Application.DTOs;
using ArtGallery.Application.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ArtGallery.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _auth;

        public UserController(IAuthService auth) => _auth = auth;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                var user = await _auth.RegisterAsync(dto);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var token = await _auth.LoginAsync(dto);
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public ActionResult Me()
        {
            var userId = User.FindFirstValue("userId");

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User ID is missing in the token" });
            }

            return Ok(new { userId });
        }
    }
}