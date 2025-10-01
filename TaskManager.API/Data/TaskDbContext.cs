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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tablo isimlerini belirle
            modelBuilder.Entity<TaskItem>().ToTable("Tasks");
            modelBuilder.Entity<Category>().ToTable("Categories");
            modelBuilder.Entity<SubTask>().ToTable("SubTasks");
            modelBuilder.Entity<User>().ToTable("Users");

            // SubTask ilişkileri
            modelBuilder.Entity<SubTask>()
                .HasOne(st => st.Task)
                .WithMany()
                .HasForeignKey(st => st.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            // TaskItem - Category ilişkisi
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Tasks)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // TaskItem - User ilişkisi
            modelBuilder.Entity<TaskItem>()
                .HasOne<User>()
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Category - User ilişkisi
            modelBuilder.Entity<Category>()
                .HasOne<User>()
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}