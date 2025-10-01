using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Models;
using TaskManager.API.Services;

namespace TaskManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TaskDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(TaskDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            // Kullanıcı adı kontrolü
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest("Bu kullanıcı adı zaten kullanılıyor.");
            }

            // Email kontrolü
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("Bu email zaten kullanılıyor.");
            }

            // Yeni kullanıcı oluştur
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                FullName = dto.FullName,
                PasswordHash = _jwtService.HashPassword(dto.Password),
                CreatedDate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Token oluştur
            var token = _jwtService.GenerateToken(user.Id, user.Username, user.Email);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null || !_jwtService.VerifyPassword(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Kullanıcı adı veya şifre hatalı.");
            }

            // Son giriş tarihini güncelle
            user.LastLoginDate = DateTime.Now;
            await _context.SaveChangesAsync();

            // Token oluştur
            var token = _jwtService.GenerateToken(user.Id, user.Username, user.Email);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName
            });
        }
    }
}