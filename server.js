const express = require("express");
const app = express();

app.use(express.json());

/* ---------- IN-MEMORY STORAGE ---------- */
let notes = [];
let nextId = 1;

/* ---------- HELPER FUNCTION ---------- */
// Finds a note by id. Note: req.params.id arrives as a string,
// so we convert it to a Number before comparing.
function findNote(id) {
  return notes.find((note) => note.id === Number(id));
}

/* ---------- CREATE:  POST /notes ---------- */
app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const note = {
    id: nextId++,
    title: title,
    content: content || '',
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  res.status(201).json(note);
});

/* ---------- READ ALL:  GET /notes ---------- */
app.get('/notes', (req, res) => {
  res.json(notes);
});

/* ---------- READ ONE:  GET /notes/:id ---------- */
app.get('/notes/:id', (req, res) => {
  const note = findNote(req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

/* ---------- UPDATE:  PUT /notes/:id ---------- */
app.put('/notes/:id', (req, res) => {
  const note = findNote(req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const { title, content } = req.body;
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  note.updatedAt = new Date().toISOString();

  res.json(note);
});

/* ---------- DELETE:  DELETE /notes/:id ---------- */
app.delete('/notes/:id', (req, res) => {
  const index = notes.findIndex((note) => note.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const [deleted] = notes.splice(index, 1);
  res.json({ message: 'Note deleted', note: deleted });
});

/* ---------- CATCH-ALL for unknown URLs ---------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ---------- START THE SERVER ---------- */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Notes API running at http://localhost:${PORT}`);
});