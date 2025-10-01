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
    public class SubTasksController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public SubTasksController(TaskDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/SubTasks/ByTask/5 - Sadece kendi görevinin alt görevleri
        [HttpGet("ByTask/{taskId}")]
        public async Task<ActionResult<IEnumerable<SubTask>>> GetSubTasksByTask(int taskId)
        {
            var userId = GetUserId();

            // Önce task'ın kendisine ait olup olmadığını kontrol et
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null || task.UserId != userId)
            {
                return NotFound();
            }

            var subTasks = await _context.SubTasks
                .Where(st => st.TaskId == taskId)
                .OrderBy(st => st.IsCompleted)
                .ThenBy(st => st.CreatedDate)
                .ToListAsync();

            return Ok(subTasks);
        }

        // POST: api/SubTasks
        [HttpPost]
        public async Task<ActionResult<SubTask>> CreateSubTask(SubTask subTask)
        {
            var userId = GetUserId();

            // Task'ın kullanıcıya ait olup olmadığını kontrol et
            var task = await _context.Tasks.FindAsync(subTask.TaskId);
            if (task == null || task.UserId != userId)
            {
                return BadRequest("Bu göreve alt görev ekleyemezsiniz.");
            }

            _context.SubTasks.Add(subTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubTasksByTask), new { taskId = subTask.TaskId }, subTask);
        }

        // PUT: api/SubTasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubTask(int id, SubTask subTask)
        {
            if (id != subTask.Id)
            {
                return BadRequest();
            }

            var userId = GetUserId();
            var existingSubTask = await _context.SubTasks
                .Include(st => st.Task)
                .FirstOrDefaultAsync(st => st.Id == id);

            if (existingSubTask == null || existingSubTask.Task?.UserId != userId)
            {
                return NotFound();
            }

            _context.Entry(existingSubTask).State = EntityState.Detached;
            _context.Entry(subTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await SubTaskExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/SubTasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubTask(int id)
        {
            var userId = GetUserId();
            var subTask = await _context.SubTasks
                .Include(st => st.Task)
                .FirstOrDefaultAsync(st => st.Id == id);

            if (subTask == null || subTask.Task?.UserId != userId)
            {
                return NotFound();
            }

            _context.SubTasks.Remove(subTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> SubTaskExists(int id)
        {
            return await _context.SubTasks.AnyAsync(e => e.Id == id);
        }
    }
}