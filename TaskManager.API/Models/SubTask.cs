namespace TaskManager.API.Models
{
    public class SubTask
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
        public int Priority { get; set; } = 1;
        public DateTime? DueDate { get; set; }
        public int TaskId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Navigation Property
        public TaskItem? Task { get; set; }
    }
}