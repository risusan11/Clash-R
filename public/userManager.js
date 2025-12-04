/* =========================================================
   User Manager – ユーザーごとにデッキ保存領域を完全分離する
========================================================= */

/* ---------------------------------
   ▼ 現在ログインしているユーザー名
--------------------------------- */
let currentUser = localStorage.getItem("currentUser") || null;

/* ---------------------------------
   ▼ loginUser（main.js から呼ばれる）
--------------------------------- */
function loginUser(name) {
  currentUser = name;
  localStorage.setItem("currentUser", currentUser);
  renderUserStatus();
}

/* ---------------------------------
   ▼ 上部に「Logged in as: ○○」を表示
--------------------------------- */
function renderUserStatus() {
  const old = document.getElementById("userStatus");
  if (old) old.remove();

  const bar = document.createElement("div");
  bar.id = "userStatus";
  bar.style = `
    position: fixed;
    top: 12px;
    right: 12px;

    /* 見た目 */
    background: rgba(0,0,0,0.55);
    padding: 6px 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-family: sans-serif;

    /* 他UIより上に */
    z-index: 99999;

    /* 影で浮かせる */
    backdrop-filter: blur(4px);
  `;
  bar.textContent = `Logged in as: ${currentUser}`;

  document.body.appendChild(bar);
}


/* ---------------------------------
   ▼ ユーザーごとのキー
--------------------------------- */
function getUserDeckKey() {
  return `deckData_${currentUser}`;
}

/* ---------------------------------
   ▼ 読み取り & 書き込み
--------------------------------- */
function loadUserDecks() {
  return JSON.parse(localStorage.getItem(getUserDeckKey()) || "[]");
}

function saveUserDecks(data) {
  localStorage.setItem(getUserDeckKey(), JSON.stringify(data));
}

/* ---------------------------------
   ▼ デッキ追加
--------------------------------- */
function addDeckToUser(title, cards) {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const decks = loadUserDecks();
  decks.push({ title, cards: [...cards] });
  saveUserDecks(decks);
}

/* ---------------------------------
   ▼ ページ初回ロード時
--------------------------------- */
/* ---------------------------------
   ▼ ページ初回ロード時
--------------------------------- */
if (currentUser) {
  const box = document.getElementById("loginBox");
  if (box) box.remove();   // ← 完全に削除（超重要）

  renderUserStatus();
}


/* ---------------------------------
   ▼ MyDecks 表示/削除
--------------------------------- */
function renderMyDecks() {
  const area = document.getElementById("myDecksArea");
  area.innerHTML = "";

  const decks = loadUserDecks();

  decks.forEach((d, i) => {
    const top = d.cards.slice(0, 4).map(id => `<img src="${cardImg(id)}">`).join("");
    const bottom = d.cards.slice(4, 8).map(id => `<img src="${cardImg(id)}">`).join("");

    area.innerHTML += `
      <div class="deck-frame">
        <div class="deck-header">
          <span>${d.title}</span>
        </div>

        <div class="row">${top}</div>
        <div class="row">${bottom}</div>

        <div class="deck-actions">
          <button class="copy-btn" onclick="shareMyDeck(${i})">Copy</button>
          <button class="del-btn" onclick="deleteMyDeck(${i})">Delete</button>
        </div>
      </div>
    `;
  });
}


function deleteMyDeck(i) {
  const d = loadUserDecks();
  d.splice(i, 1);
  saveUserDecks(d);

  renderMyDecks();   // モーダル更新
  renderDecks();     // メイン画面更新
}

function sendDeckRequestToAdmin(data) {
  const adminKey = "adminRequests";
  const list = JSON.parse(localStorage.getItem(adminKey) || "[]");

  list.push(data);

  localStorage.setItem(adminKey, JSON.stringify(list));
}

function shareMyDeck(index) {
  const list = loadUserDecks();
  const deck = list[index];
  if (!deck) return;

  const text = JSON.stringify(deck.cards);
  navigator.clipboard.writeText(text);

  // コピー表示（要素が無くても落ちない安全版）
  const toast = document.getElementById("copyToast");
  if (toast) {
    toast.textContent = "Deck copied!";
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1400);
  }

  // スロット光らせる（あってもなくても動く）
  document.querySelectorAll(".slot").forEach(s => {
    s.classList.add("copy-flash");
    setTimeout(() => s.classList.remove("copy-flash"), 450);
  });
}




function showShareToast() {
  const el = document.getElementById("shareToast");
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}
