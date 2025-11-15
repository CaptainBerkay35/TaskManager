namespace TaskManager.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Color { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public int? UserId { get; set; }
        public ICollection<ProjectCategory> ProjectCategories { get; set; } = new List<ProjectCategory>();
    }
}