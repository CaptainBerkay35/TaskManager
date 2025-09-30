namespace TaskManager.API.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; } = false;
        public int Priority { get; set; } = 1; // 1: Düşük, 2: Orta, 3: Yüksek, 4: Acil
        public string Status { get; set; } = "Bekliyor"; // Bekliyor, Devam Ediyor, Tamamlandı
        public int? CategoryId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        // Navigation Property
        public Category? Category { get; set; }
    }
}