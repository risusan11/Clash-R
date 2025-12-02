const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// ==== Static files (Render compatible) ====
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ==== DB ====
const DB_FILE = path.join(__dirname, "decks.json");

function readDB() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ==== API ====
app.get("/decks", (req, res) => {
  res.json(readDB());
});

app.use(express.json());

app.post("/addDeck", (req, res) => {
  const decks = readDB();
  const newDeck = {
    id: Date.now().toString(),
    user: req.body.user,
    title: req.body.title,
    cards: req.body.cards
  };

  decks.push(newDeck);
  writeDB(decks);

  res.json({ success: true });
});

app.delete("/deleteDeck/:id", (req, res) => {
  const decks = readDB();
  const id = req.params.id;

  writeDB(decks.filter(d => d.id !== id));
  res.json({ success: true });
});

// ==== Start ====
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
