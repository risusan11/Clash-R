const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto"); // ← UUID用

const app = express();

app.use(cors());
app.use(express.json());

// ======================================================
// ★ Render / ローカル どちらでも public を正しく配信
// ======================================================
app.use(express.static(path.join(__dirname, "../public")));

// ======================================================
// データベースファイル（Render では読み書きOK）
// ======================================================
const DB_FILE = path.join(__dirname, "decks.json");

// DB読み込み
function readDB() {
  try {
    const text = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(text);
  } catch (e) {
    console.error("DB read error:", e);
    return [];
  }
}

// DB書き込み
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("DB write error:", e);
  }
}

// ======================================================
// GET /decks  → デッキ一覧を返す
// ======================================================
app.get("/decks", (req, res) => {
  const data = readDB();
  res.json(data);
});

// ======================================================
// POST /addDeck  → 新しいデッキを追加する
// ======================================================
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

// ======================================================
// DELETE /deleteDeck/:id  → デッキ削除（必要なら）
// ======================================================
app.delete("/deleteDeck/:id", (req, res) => {
  const id = req.params.id;

  let list = readDB();
  list = list.filter(item => item.id !== id);

  writeDB(list);
  res.json({ ok: true });
});

// ======================================================
// Render の本番用ポート / ローカル fallback
// ======================================================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log("STATIC PATH = ", path.join(__dirname, "../public"));
  console.log("DB FILE = ", DB_FILE);
});
