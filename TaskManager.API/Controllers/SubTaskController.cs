using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Models;

namespace TaskManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubTasksController : ControllerBase
    {
        private readonly TaskDbContext _context;

        public SubTasksController(TaskDbContext context)
        {
            _context = context;
        }

        // GET: api/SubTasks/ByTask/5
        [HttpGet("ByTask/{taskId}")]
        public async Task<ActionResult<IEnumerable<SubTask>>> GetSubTasksByTask(int taskId)
        {
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
            var subTask = await _context.SubTasks.FindAsync(id);
            if (subTask == null)
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