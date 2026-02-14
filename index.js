const express = require("express");
const db = require("./database");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Criar lançamento
app.post("/lancamentos", (req, res) => {
  const { codigo } = req.body;
  console.log("📝 Recebido código:", codigo); // LOG
  
  db.run("INSERT INTO lancamentos (codigo) VALUES (?)", [codigo], function (err) {
    if (err) {
      console.error("❌ Erro ao inserir:", err);
      return res.status(500).json(err);
    }
    console.log("✅ Inserido com ID:", this.lastID);
    res.json({ id: this.lastID });
  });
});

// Listar apenas pendentes
app.get("/lancamentos", (req, res) => {
  console.log("📋 Listando pendentes...");
  
  db.all("SELECT * FROM lancamentos WHERE conferido = 0", [], (err, rows) => {
    if (err) {
      console.error("❌ Erro ao listar:", err);
      return res.status(500).json(err);
    }
    console.log(`📊 Encontrados: ${rows.length} pendentes`);
    console.log("Dados:", rows); // Vê os dados reais
    res.json(rows);
  });
});

// Marcar como conferido
app.put("/lancamentos/:id", (req, res) => {
  console.log("✅ Conferindo ID:", req.params.id);
  
  db.run("UPDATE lancamentos SET conferido = 1 WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.error("❌ Erro ao conferir:", err);
      return res.status(500).json(err);
    }
    console.log("✅ ID", req.params.id, "marcado como conferido");
    res.json({ atualizado: true });
  });
});

app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});