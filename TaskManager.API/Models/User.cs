namespace TaskManager.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? LastLoginDate { get; set; }

        // Navigation Properties
        public ICollection<TaskItem>? Tasks { get; set; }
        public ICollection<Category>? Categories { get; set; }
    }
}