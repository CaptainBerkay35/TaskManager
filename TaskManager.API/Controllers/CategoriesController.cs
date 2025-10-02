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
    public class CategoriesController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public CategoriesController(TaskDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/Categories - Sadece kullanıcının kendi kategorileri
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var userId = GetUserId();
            var categories = await _context.Categories
                // .Include(c => c.Tasks) KALDIRILDI - Artık Tasks navigation property yok
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/Categories/5 - Sadece kendi kategorisi
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var userId = GetUserId();
            var category = await _context.Categories
                // .Include(c => c.Tasks) KALDIRILDI - Artık Tasks navigation property yok
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // POST: api/Categories - UserId otomatik eklenir
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            category.UserId = GetUserId();
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // PUT: api/Categories/5 - Sadece kendi kategorisini güncelleyebilir
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            var userId = GetUserId();
            var existingCategory = await _context.Categories.FindAsync(id);

            if (existingCategory == null || existingCategory.UserId != userId)
            {
                return NotFound();
            }

            category.UserId = userId;
            _context.Entry(existingCategory).State = EntityState.Detached;
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await CategoryExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Categories/5 - Sadece kendi kategorisini silebilir
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var userId = GetUserId();
            var category = await _context.Categories.FindAsync(id);

            if (category == null || category.UserId != userId)
            {
                return NotFound();
            }

            // Önce bu kategoriye bağlı proje var mı kontrol et
            var hasProjects = await _context.ProjectCategories.AnyAsync(pc => pc.CategoryId == id);


            if (hasProjects)
            {
                return BadRequest("Bu kategoriye bağlı projeler var. Önce projeleri silin veya başka kategoriye taşıyın.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> CategoryExists(int id)
        {
            return await _context.Categories.AnyAsync(e => e.Id == id);
        }
    }
}