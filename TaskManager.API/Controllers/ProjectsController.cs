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
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var userId = GetUserId();
            var projects = await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Category)
                .Where(p => p.UserId == userId && p.IsActive)
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var userId = GetUserId();
            var project = await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            project.UserId = GetUserId();
            project.CreatedDate = DateTime.Now;

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project project)
        {
            if (id != project.Id)
            {
                return BadRequest();
            }

            var userId = GetUserId();
            var existingProject = await _context.Projects.FindAsync(id);

            if (existingProject == null || existingProject.UserId != userId)
            {
                return NotFound();
            }

            project.UserId = userId;
            _context.Entry(existingProject).State = EntityState.Detached;
            _context.Entry(project).State = EntityState.Modified;

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

        // ✅ YENİ KOD (ProjectsController.cs içinde):
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = GetUserId();

            // Projeyi ve task sayısını yükle
            var project = await _context.Projects
                .Include(p => p.Tasks)  // 👈 Task'leri de yükle
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            // Bilgilendirme için task sayısını al
            var taskCount = project.Tasks?.Count ?? 0;

            // ✅ HARD DELETE - Gerçekten sil (CASCADE ile task'ler de silinir)
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            // Başarı mesajı ile birlikte silinen task sayısını dön
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
}