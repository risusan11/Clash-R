const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ▲ Public フォルダ
const PUBLIC = path.join(__dirname, "../public");
console.log("STATIC PATH =", PUBLIC);
app.use(express.static(PUBLIC));

// ▲ DB ファイル
const DB_FILE = path.join(__dirname, "decks.json");
console.log("DB FILE =", DB_FILE);

// ===============================
// DB 読み書き関数（←これが必要）
// ===============================
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "[]", "utf8");
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}


// ===============================
// GET /decks
// ===============================
app.get("/decks", (req, res) => {
  const decks = readDB();
  res.json(decks);
});


// ===============================
// POST /addDeck
// ===============================
app.post("/addDeck", (req, res) => {
  const list = readDB();

  const newDeck = {
    id: crypto.randomUUID(),
    user: req.body.user,
    title: req.body.title,
    cards: req.body.cards,
    time: Date.now()
  };

  list.push(newDeck);
  writeDB(list);

  res.json({ ok: true });
});


// ===============================
// DELETE /deleteDeck/:id
// ===============================
app.delete("/deleteDeck/:id", (req, res) => {
  const id = req.params.id;
  const decks = readDB();

  const newDecks = decks.filter(d => d.id !== id);

  writeDB(newDecks);
  console.log("DELETED:", id);

  res.json({ ok: true });
});


// ===============================
app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
