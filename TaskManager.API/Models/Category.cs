namespace TaskManager.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Color { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? UserId { get; set; }

      
    }
}