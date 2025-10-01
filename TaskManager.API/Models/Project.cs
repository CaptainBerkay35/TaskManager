using TaskManager.API.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string Color { get; set; } = "#6366f1";
    public DateTime? Deadline { get; set; }
    public int? CategoryId { get; set; }  // ← EKLENEN
    public int UserId { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Category? Category { get; set; }  // ← EKLENEN
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}