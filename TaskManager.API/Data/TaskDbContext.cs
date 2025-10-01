using Microsoft.EntityFrameworkCore;
using TaskManager.API.Models;

namespace TaskManager.API.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubTask> SubTasks { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tablo isimlerini belirle
            modelBuilder.Entity<TaskItem>().ToTable("Tasks");
            modelBuilder.Entity<Category>().ToTable("Categories");
            modelBuilder.Entity<SubTask>().ToTable("SubTasks");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Project>().ToTable("Projects");

            // SubTask ilişkileri
            modelBuilder.Entity<SubTask>()
                .HasOne(st => st.Task)
                .WithMany()
                .HasForeignKey(st => st.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            // TaskItem - Category ilişkisi KALDIRILDI
            // Artık task'ler category'ye değil, sadece project'e bağlı

            // TaskItem - Project ilişkisi (ZORUNLU)
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade)     // ⭐ Project silinirse Task'ler otomatik silinir
                .IsRequired();

            // Category - User ilişkisi
            modelBuilder.Entity<Category>()
                .HasOne<User>()
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Project - Category ilişkisi
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}