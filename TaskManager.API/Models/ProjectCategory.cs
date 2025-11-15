namespace TaskManager.API.Models
{
    // Ara tablo: Project - Category Many-to-Many ilişkisi için
    public class ProjectCategory
    {
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        // Ek bilgiler (opsiyonel)
        public DateTime AssignedDate { get; set; } = DateTime.Now;
        public bool IsPrimary { get; set; } = false; // Ana kategori mi?
    }
}