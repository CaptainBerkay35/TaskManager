namespace TaskManager.API.Services
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string username, string email);
        string HashPassword(string password);
        bool VerifyPassword(string password, string passwordHash);
    }
}