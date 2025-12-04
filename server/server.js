const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// ▲ Public フォルダ
// ===============================
const PUBLIC = path.join(__dirname, "../public");
console.log("STATIC PATH =", PUBLIC);
app.use(express.static(PUBLIC));

// ===============================
// ▲ SQLite DB
// ===============================
const db = new Database("data.db");

// テーブル作成（初回のみ実行される）
db.prepare(`
  CREATE TABLE IF NOT EXISTS decks (
    id TEXT PRIMARY KEY,
    user TEXT,
    title TEXT,
    cards TEXT,
    time INTEGER
  )
`).run();


// ===============================
// GET /decks
// ===============================
app.get("/decks", (req, res) => {
  const decks = db.prepare(`
    SELECT * FROM decks ORDER BY time DESC
  `).all();

  const parsed = decks.map(d => ({
    ...d,
    cards: JSON.parse(d.cards)
  }));

  res.json(parsed);
});


// ===============================
// POST /addDeck
// ===============================
app.post("/addDeck", (req, res) => {
  const newDeck = {
    id: crypto.randomUUID(),
    user: req.body.user,
    title: req.body.title,
    cards: JSON.stringify(req.body.cards),
    time: Date.now()
  };

  db.prepare(`
    INSERT INTO decks (id, user, title, cards, time)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    newDeck.id,
    newDeck.user,
    newDeck.title,
    newDeck.cards,
    newDeck.time
  );

  res.json({ ok: true });
});


// ===============================
// DELETE /deleteDeck/:id
// ===============================
app.delete("/deleteDeck/:id", (req, res) => {
  const id = req.params.id;

  db.prepare(`
    DELETE FROM decks WHERE id = ?
  `).run(id);

  console.log("DELETED:", id);
  res.json({ ok: true });
});


// ===============================
app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);

