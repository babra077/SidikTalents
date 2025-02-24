using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private static List<Note> notes = new();

        [HttpGet]
        public ActionResult<IEnumerable<Note>> GetNotes() => Ok(notes);

        [HttpGet("{id}")]
        public ActionResult<Note> GetNoteById(int id) =>
            notes.FirstOrDefault(n => n.Id == id) is Note note ? Ok(note) : NotFound();

        [HttpPost]
        public ActionResult<Note> CreateNote(Note note)
        {
            note.Id = notes.Count + 1;
            notes.Add(note);
            return CreatedAtAction(nameof(GetNoteById), new { id = note.Id }, note);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateNote(int id, Note updatedNote)
        {
            var note = notes.FirstOrDefault(n => n.Id == id);
            if (note == null) return NotFound();

            note.Title = updatedNote.Title;
            note.Content = updatedNote.Content;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNote(int id)
        {
            var note = notes.FirstOrDefault(n => n.Id == id);
            if (note == null) return NotFound();

            notes.Remove(note);
            return NoContent();
        }
    }

}
