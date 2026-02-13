const express = require("express");
const db = require("./database");

const app = express();
app.use(express.json());

// Criar lançamento
app.post("/lancamentos", (req, res) => {
  const { codigo } = req.body;
  db.run("INSERT INTO lancamentos (codigo) VALUES (?)", [codigo], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ id: this.lastID });
  });
});

// Listar apenas pendentes
app.get("/lancamentos", (req, res) => {
  db.all("SELECT * FROM lancamentos WHERE conferido = 0", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Marcar como conferido
app.put("/lancamentos/:id", (req, res) => {
  db.run("UPDATE lancamentos SET conferido = 1 WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ atualizado: true });
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
