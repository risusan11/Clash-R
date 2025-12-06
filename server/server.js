const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// ▲ Public フォルダ
// ===============================
const PUBLIC = path.join(__dirname, "../public");
app.use(express.static(PUBLIC));

// ===============================
// ▲ Supabase 接続設定（ここだけ自分のキーに差し替え）
// ===============================
const SUPABASE_URL = "https://lffrzvnlmxuepwrclirw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZnJ6dm5sbXh1ZXB3cmNsaXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Njk0MTYsImV4cCI6MjA4MDU0NTQxNn0.XthYSxdG8z3m5PgPozV8PVRxyXysU6qhM9ODLqGhmpc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===============================
// GET /decks  全デッキ取得
// ===============================
app.get("/decks", async (req, res) => {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order("time", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// ===============================
// POST /addDeck  デッキ追加
// ===============================
app.post("/addDeck", async (req, res) => {
  const newDeck = {
    id: crypto.randomUUID(),
    username: req.body.user,   // ← user → username に変換
    title: req.body.title,
    cards: req.body.cards,     // JSONB にそのまま入る
    time: Date.now()
  };

  const { error } = await supabase
    .from("decks")
    .insert([newDeck]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ ok: true });
});

// ===============================
// DELETE /deleteDeck/:id  削除
// ===============================
app.delete("/deleteDeck/:id", async (req, res) => {
  const id = req.params.id;

  const { error } = await supabase
    .from("decks")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ ok: true });
});

// ===============================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

