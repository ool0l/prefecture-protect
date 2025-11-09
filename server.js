const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const SECRET = process.env.SECRET_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;

const keepFlags = { "batiment1": { delete: false } };

app.use(express.json());

app.get('/check_building', (req, res) => {
  const id = req.query.id;
  if (!id || !keepFlags[id]) return res.status(404).json({ error: "unknown id" });
  if (!keepFlags[id].delete) return res.json({ action: "keep" });
  return res.json({ action: "delete" });
});

app.post('/admin/delete', (req, res) => {
  const { id, admin_key } = req.body;
  if (admin_key !== ADMIN_KEY) return res.status(401).json({ error: "non autorisé" });
  if (!keepFlags[id]) return res.status(404).json({ error: "unknown id" });
  keepFlags[id].delete = true;
  return res.json({ ok: true });
});

app.listen(PORT, () => console.log("Server running on port", PORT));
