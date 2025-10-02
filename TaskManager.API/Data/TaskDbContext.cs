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
        public DbSet<ProjectCategory> ProjectCategories { get; set; } // YENİ ara tablo

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tablo isimlerini belirle
            modelBuilder.Entity<TaskItem>().ToTable("Tasks");
            modelBuilder.Entity<Category>().ToTable("Categories");
            modelBuilder.Entity<SubTask>().ToTable("SubTasks");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Project>().ToTable("Projects");
            modelBuilder.Entity<ProjectCategory>().ToTable("ProjectCategories"); // YENİ ara tablo

            // ProjectCategory composite key (Ara tablo için)
            modelBuilder.Entity<ProjectCategory>()
                .HasKey(pc => new { pc.ProjectId, pc.CategoryId });

            // ProjectCategory - Project ilişkisi
            modelBuilder.Entity<ProjectCategory>()
                .HasOne(pc => pc.Project)
                .WithMany(p => p.ProjectCategories)
                .HasForeignKey(pc => pc.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProjectCategory - Category ilişkisi
            modelBuilder.Entity<ProjectCategory>()
                .HasOne(pc => pc.Category)
                .WithMany(c => c.ProjectCategories)
                .HasForeignKey(pc => pc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // SubTask ilişkileri - Task silinirse SubTask'ler de silinsin
            modelBuilder.Entity<SubTask>()
                .HasOne(st => st.Task)
                .WithMany()
                .HasForeignKey(st => st.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            // TaskItem - Project ilişkisi (CASCADE DELETE ve ZORUNLU)
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            // Category - User ilişkisi
            modelBuilder.Entity<Category>()
                .HasOne<User>()
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}