const express = require("express");
const db = require("./database");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ========== ROTAS PRINCIPAIS ==========

// Criar lançamento
app.post("/lancamentos", (req, res) => {
  const { codigo } = req.body;
  console.log("📝 Adicionando:", codigo);
  
  db.run("INSERT INTO lancamentos (codigo) VALUES (?)", [codigo], function(err) {
    if (err) {
      console.error("❌ Erro:", err);
      return res.status(500).json({ erro: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Listar pendentes
app.get("/lancamentos", (req, res) => {
  db.all("SELECT * FROM lancamentos WHERE conferido = 0 ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error("❌ Erro:", err);
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Listar conferidas
app.get("/lancamentos/conferidas", (req, res) => {
  db.all("SELECT * FROM lancamentos WHERE conferido = 1 ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error("❌ Erro:", err);
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// ========== PESQUISAR ==========
app.get("/lancamentos/pesquisar/:termo", (req, res) => {
  const termo = `%${req.params.termo}%`;
  console.log("🔍 Pesquisando:", req.params.termo);
  
  db.all(
    "SELECT * FROM lancamentos WHERE codigo LIKE ? ORDER BY conferido, id DESC",
    [termo],
    (err, rows) => {
      if (err) {
        console.error("❌ Erro pesquisa:", err);
        return res.status(500).json({ erro: err.message });
      }
      console.log(`✅ Encontrados: ${rows.length}`);
      res.json(rows);
    }
  );
});

// ========== ATUALIZAR ==========

// Marcar como conferido
app.put("/lancamentos/:id", (req, res) => {
  const id = req.params.id;
  console.log("✅ Conferindo ID:", id);
  
  db.run("UPDATE lancamentos SET conferido = 1 WHERE id = ?", [id], function(err) {
    if (err) {
      console.error("❌ Erro:", err);
      return res.status(500).json({ erro: err.message });
    }
    res.json({ atualizado: true });
  });
});

// Desmarcar conferido
app.put("/lancamentos/desfazer/:id", (req, res) => {
  const id = req.params.id;
  console.log("↩ Desfazendo ID:", id);
  
  db.run("UPDATE lancamentos SET conferido = 0 WHERE id = ?", [id], function(err) {
    if (err) {
      console.error("❌ Erro:", err);
      return res.status(500).json({ erro: err.message });
    }
    res.json({ atualizado: true });
  });
});

// ========== EXCLUIR ==========

// Excluir um lançamento
app.delete("/lancamentos/:id", (req, res) => {
  const id = req.params.id;
  console.log("🗑️ Excluindo ID:", id);
  
  db.run("DELETE FROM lancamentos WHERE id = ?", [id], function(err) {
    if (err) {
      console.error("❌ Erro ao excluir:", err);
      return res.status(500).json({ erro: err.message });
    }
    console.log(`✅ ID ${id} excluído`);
    res.json({ excluido: true, changes: this.changes });
  });
});

// Excluir todos os conferidos
app.delete("/lancamentos/conferidos/limpar", (req, res) => {
  console.log("🗑️ Limpando conferidos...");
  
  db.run("DELETE FROM lancamentos WHERE conferido = 1", [], function(err) {
    if (err) {
      console.error("❌ Erro ao limpar:", err);
      return res.status(500).json({ erro: err.message });
    }
    console.log(`✅ ${this.changes} conferidos excluídos`);
    res.json({ excluidos: this.changes });
  });
});

app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});