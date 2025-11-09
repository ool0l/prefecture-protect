const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const SECRET = process.env.SECRET_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;

// Liste des bâtiments protégés (tu peux en rajouter)
const keepFlags = {
  "batiment1": { delete: false }
};

app.use(express.json());

// Vérification par le script Roblox
app.get('/check_building', (req, res) => {
  const id = req.query.id;
  if (!id || !keepFlags[id]) {
    return res.status(404).json({ error: "unknown id" });
  }

  if (!keepFlags[id].delete) {
    return res.json({ action: "keep" });
  } else {
    return res.json({ action: "delete" });
  }
});

// Endpoint admin (toi) pour demander la suppression
app.post('/admin/delete', (req, res) => {
  const { id, admin_key } = req.body;

  if (admin_key !== ADMIN_KEY) {
    return res.status(401).json({ error: "non autorisé" });
  }

  if (!keepFlags[id]) {
    return res.status(404).json({ error: "unknown id" });
  }

  keepFlags[id].delete = true;
  return res.json({ ok: true, message: `${id} marqué pour suppression` });
});

// Test de base
app.get('/', (req, res) => {
  res.send('✅ Serveur Render en ligne et fonctionnel.');
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
