const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./controle.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco", err);
  } else {
    console.log("Banco SQLite conectado");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS lancamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      conferido INTEGER DEFAULT 0,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
