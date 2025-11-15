using TaskManager.API.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Color { get; set; } = "#6366f1";
    public DateTime? Deadline { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

    // ✅ YENİ - Many-to-Many ilişki
    public ICollection<ProjectCategory> ProjectCategories { get; set; } = new List<ProjectCategory>();
}