using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManager.API.Data;
using TaskManager.API.Models;

namespace TaskManager.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public ProjectsController(TaskDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProjects()
        {
            var userId = GetUserId();
            var projects = await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.ProjectCategories)
                    .ThenInclude(pc => pc.Category)
                .Where(p => p.UserId == userId && p.IsActive)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Color,
                    p.Deadline,
                    p.UserId,
                    p.CreatedDate,
                    p.IsActive,
                    Tasks = p.Tasks,
                    Categories = p.ProjectCategories.Select(pc => pc.Category).ToList()
                })
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProject(int id)
        {
            var userId = GetUserId();
            var project = await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.ProjectCategories)
                    .ThenInclude(pc => pc.Category)
                .Where(p => p.Id == id && p.UserId == userId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Color,
                    p.Deadline,
                    p.UserId,
                    p.CreatedDate,
                    p.IsActive,
                    Tasks = p.Tasks,
                    Categories = p.ProjectCategories.Select(pc => pc.Category).ToList()
                })
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(ProjectCreateDto dto)
        {
            var userId = GetUserId();

            // En az 1 kategori zorunlu
            if (dto.CategoryIds == null || dto.CategoryIds.Count == 0)
            {
                return BadRequest("Proje için en az 1 kategori seçilmelidir.");
            }

            // Kategorilerin kullanıcıya ait olduğunu kontrol et
            var categories = await _context.Categories
                .Where(c => dto.CategoryIds.Contains(c.Id) && c.UserId == userId)
                .ToListAsync();

            if (categories.Count != dto.CategoryIds.Count)
            {
                return BadRequest("Geçersiz kategori seçimi.");
            }

            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                Color = dto.Color ?? "#6366f1",
                Deadline = dto.Deadline,
                UserId = userId,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Kategorileri ekle
            foreach (var categoryId in dto.CategoryIds)
            {
                var projectCategory = new ProjectCategory
                {
                    ProjectId = project.Id,
                    CategoryId = categoryId,
                    AssignedDate = DateTime.Now,
                    IsPrimary = categoryId == dto.CategoryIds.First() // İlk kategori primary
                };
                _context.ProjectCategories.Add(projectCategory);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectUpdateDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            var userId = GetUserId();
            var existingProject = await _context.Projects
                .Include(p => p.ProjectCategories)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (existingProject == null)
            {
                return NotFound();
            }

            // Proje bilgilerini güncelle
            existingProject.Name = dto.Name;
            existingProject.Description = dto.Description;
            existingProject.Color = dto.Color ?? "#6366f1";
            existingProject.Deadline = dto.Deadline;

            // Kategorileri güncelle
            if (dto.CategoryIds != null && dto.CategoryIds.Count > 0)
            {
                // Eski kategorileri sil
                _context.ProjectCategories.RemoveRange(existingProject.ProjectCategories);

                // Yeni kategorileri ekle
                foreach (var categoryId in dto.CategoryIds)
                {
                    var projectCategory = new ProjectCategory
                    {
                        ProjectId = existingProject.Id,
                        CategoryId = categoryId,
                        AssignedDate = DateTime.Now,
                        IsPrimary = categoryId == dto.CategoryIds.First()
                    };
                    _context.ProjectCategories.Add(projectCategory);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ProjectExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Projects/5 - HARD DELETE (Cascade ile task'ler de silinir)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = GetUserId();

            var project = await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.ProjectCategories)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            var taskCount = project.Tasks?.Count ?? 0;

            // Proje silinince ProjectCategories ara tablosu da otomatik silinir (CASCADE)
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Proje başarıyla silindi.",
                deletedTasksCount = taskCount,
                projectName = project.Name
            });
        }

        private async Task<bool> ProjectExists(int id)
        {
            return await _context.Projects.AnyAsync(e => e.Id == id);
        }
    }

    // DTO'lar
    public class ProjectCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Color { get; set; }
        public DateTime? Deadline { get; set; }
        public List<int> CategoryIds { get; set; } = new(); // En az 1 tane olmalı
    }

    public class ProjectUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Color { get; set; }
        public DateTime? Deadline { get; set; }
        public List<int> CategoryIds { get; set; } = new();
    }
}