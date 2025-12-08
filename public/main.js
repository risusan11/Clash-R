const API_BASE = "https://board-0zkf.onrender.com";
/* ============================================
   ▼ ログイン処理（main.js から呼ばれる）
============================================ */
function loginUser(name) {
  currentUser = name;
  localStorage.setItem("currentUser", currentUser);
  renderUserStatus(); // ← 右上の “Logged in as ○○”
}
// モード: "my" = My Deck, "request" = Request Review
let currentMode = "my";


/* =========================================================
   ▼ 通常カード ↔ 進化カード の完全ペア表
========================================================= */
const evoPairs = {
  "Archers": "Evo_Archers",
  "Evo_Archers": "Archers",

  "BabyD": "Evo_BabyD",
  "Evo_BabyD": "BabyD",

  "Barbs": "Evo_Barbs",
  "Evo_Barbs": "Barbs",

  "Barrel": "Evo_Barrel",
  "Evo_Barrel": "Barrel",

  "Bats": "Evo_Bats",
  "Evo_Bats": "Bats",

  "Bomber": "Evo_Bomber",
  "Evo_Bomber": "Bomber",

  "Cannon": "Evo_Cannon",
  "Evo_Cannon": "Cannon",

  "DartGob": "Evo_DartGob",
  "Evo_DartGob": "DartGob",

  "eDragon": "Evo_eDragon",
  "Evo_eDragon": "eDragon",

  "Exe": "Evo_Exe",
  "Evo_Exe": "Exe",

  "Firecracker": "Evo_Firecracker",
  "Evo_Firecracker": "Firecracker",

  "Furnace": "Evo_Furnace",
  "Evo_Furnace": "Furnace",

  "Ghost": "Evo_Ghost",
  "Evo_Ghost": "Ghost",

  "GobGiant": "Evo_GobGiant",
  "Evo_GobGiant": "GobGiant",

  "GoblinCage": "Evo_GoblinCage",
  "Evo_GoblinCage": "GoblinCage",

  "GoblinDrill": "Evo_GoblinDrill",
  "Evo_GoblinDrill": "GoblinDrill",

  "Hunter": "Evo_Hunter",
  "Evo_Hunter": "Hunter",

  "IceSpirit": "Evo_IceSpirit",
  "Evo_IceSpirit": "IceSpirit",

  "InfernoD": "Evo_InfernoD",
  "Evo_InfernoD": "InfernoD",

  "Knight": "Evo_Knight",
  "Evo_Knight": "Knight",

  "Lumber": "Evo_Lumber",
  "Evo_Lumber": "Lumber",

  "MegaKnight": "Evo_MegaKnight",
  "Evo_MegaKnight": "MegaKnight",

  "Mortar": "Evo_Mortar",
  "Evo_Mortar": "Mortar",

  "Musk": "Evo_Musk",
  "Evo_Musk": "Musk",

  "PEKKA": "Evo_PEKKA",
  "Evo_PEKKA": "PEKKA",

  "Ram": "Evo_Ram",
  "Evo_Ram": "Ram",

  "RG": "Evo_RG",
  "Evo_RG": "RG",

  "RoyalHogs": "Evo_RoyalHogs",
  "Evo_RoyalHogs": "RoyalHogs",

  "RoyalRecruits": "Evo_RoyalRecruits",
  "Evo_RoyalRecruits": "RoyalRecruits",

  "Skarmy": "Evo_Skarmy",
  "Evo_Skarmy": "Skarmy",

  "Skellies": "Evo_Skellies",
  "Evo_Skellies": "Skellies",

  "SkellyBarrel": "Evo_SkellyBarrel",
  "Evo_SkellyBarrel": "SkellyBarrel",

  "Snowball": "Evo_Snowball",
  "Evo_Snowball": "Snowball",

  "Tesla": "Evo_Tesla",
  "Evo_Tesla": "Tesla",

  "Valk": "Evo_Valk",
  "Evo_Valk": "Valk",

  "WallBreakers": "Evo_WallBreakers",
  "Evo_WallBreakers": "WallBreakers",

  "Witch": "Evo_Witch",
  "Evo_Witch": "Witch",

  "Wiz": "Evo_Wiz",
  "Evo_Wiz": "Wiz",

  "Zap": "Evo_Zap",
  "Evo_Zap": "Zap"
};

/* =========================================================
   ▼ データ管理
========================================================= */
const defaultDecks = [
  {
    title: "Miner Balloon",
    video: "https://youtube.com/shorts/ZWvUpjRKUJ4",
    cards: ["Evo_Musk","Evo_Skellies","Miner","Balloon","IceGolem","BombTower","Barrel","Snowball"]
  },
  {
    title: "The Sparky Women Deck",
    video: "https://www.youtube.com/shorts/8xYpgDEJ5L0",
    cards: ["Evo_Skellies","Evo_Musk","SkeletonKing","Sparky","MotherWitch","RoyalDelivery","ElectroSpirit","IceSpirit"]
  },
  {
    title: "MK Poison",
    video: "https://youtube.com/shorts/177lddk0Ov8",
    cards: ["MegaKnight","eDragon","SkellyBarrel","Poison","Log","Bats","GobGang","IceSpirit"]
  },
  {
    title: "Hog Ram",
    video: "https://youtube.com/shorts/nOCAar9niAA",
    cards: ["Evo_Cannon","Evo_Bomber","Hog","Ram","Musk","Arrows","Barrel","MP"]
  },
  {
    title: "EGiant deck",
    video: "https://youtube.com/shorts/-PvPUvb0bf0",
    cards: ["Evo_Firecracker","Evo_Skellies","Witch","Vines","Log","Cannon","Bats","ElectroGiant"]
  },
    {
    title: "GiantSkellyBalloon",
    video: "https://www.youtube.com/shorts/A_dSv3gwjJs",
    cards: ["Evo_Witch","Evo_Hunter","Balloon","GiantSkelly","GoblinCage","Guards","Fireball","Log"]
  },
    {
    title: "MKMiner",
    video: "https://www.youtube.com/shorts/h0RWI2BVB6E",
    cards: ["GobGang","MegaKnight","SkellyBarrel","Miner","Cannon","Bats","InfernoD","Log"]
  },
    {
    title: "GoldenKnightSparky",
    video: "https://www.youtube.com/shorts/AGULAnfNbZg",
    cards: ["Evo_Witch","Sparky","GoldenKnight","MP","DartGob","Arrows","Skarmy","Vines"]
  },
    {
    title: "Out in 1 days.",
    video: "coming soon.",
    cards: ["Evo_Archers","Evo_Cannon","SkeletonKing","Prince","MegaKnight","Arrows","IceSpirit","Barrel"]

  },
   {
    title: "Out in 2 days.",
    video: "coming soon.",
    cards: ["Evo_eDragon","ElectroGiant","Knight_Hero","Tombstone","Earthquake","Log","GobGang","MP"]      
   },
   {
    title: "Out in 3 days.",
    video: "coming soon.",
    cards: ["Evo_SkellyBarrel","Evo_Barrel","MegaKnight","Balloon","GobGang","GoblinCage","Zap","DartGob"]  
   },
      {
    title: "Out in 4 days.",
    video: "coming soon.",
    cards: ["Barrel","IceSpirit","Knight_Hero","Inferno","Rocket","GobGang","Log","Princess"]
      }
async function getAllDecks() {
  const res = await fetch(`${API_BASE}/decks`);
  const decks = await res.json();
  return [...defaultDecks, ...decks];
}




/* =========================================================
   ▼ エリクサー計算
========================================================= */
const elixirCost = {
  "3M":9,"ArcherQueen":5,"Archers":3,"Arrows":3,"BabyD":4,"Balloon":5,"Bandit":3,"BarbBarrel":2,
  "BarbHut":5,"Barbs":5,"Barrel":3,"Bats":2,"BattleHealer":4,"Berserker":4,"Bomber":2,
  "BombTower":4,"BossBandit":3,"Bowler":5,"Cannon":3,"CannonCart":5,"Clone":3,"DarkPrince":4,
  "DartGob":3,"Earthquake":3,"eBarbs":6,"eDragon":5,"ElectroGiant":7,"ElectroSpirit":1,
  "elixir":2,"ElixirGolem":3,"Evo_Archers":3,"Evo_BabyD":4,"Evo_Barbs":5,"Evo_Barrel":3,"Evo_Bats":2,
  "Evo_Bomber":2,"Evo_Cannon":3,"Evo_DartGob":3,"Evo_eDragon":5,"Evo_Exe":5,"Evo_Firecracker":3,
  "Evo_Furnace":4,"Evo_Ghost":3,"Evo_GobGiant":6,"Evo_GoblinCage":4,"Evo_GoblinDrill":3,
  "Evo_Hunter":4,"Evo_IceSpirit":1,"Evo_InfernoD":3,"Evo_Knight":3,"Evo_Lumber":4,
  "Evo_MegaKnight":7,"Evo_Mortar":4,"Evo_Musk":4,"Evo_PEKKA":7,"Evo_Ram":4,
  "Evo_RG":6,"Evo_RoyalHogs":5,"Evo_RoyalRecruits":7,"Evo_Skarmy":3,"Evo_Skellies":1,
  "Evo_SkellyBarrel":3,"Evo_Snowball":2,"Evo_Tesla":4,"Evo_Valk":4,"Evo_WallBreakers":2,
  "Evo_Witch":5,"Evo_Wiz":5,"Evo_Zap":2,"eWiz":4,"Exe":5,"Fireball":4,"Firecracker":3,"FireSpirit":1,
  "Fisherman":3,"FlyingMachine":4,"Freeze":4,"Furnace":4,"Ghost":3,"Giant":5,"GiantSkelly":6,
  "GobGang":3,"GobGiant":6,"GobHut":5,"GoblinCage":4,"GoblinCurse":3,"GoblinDemolisher":4,
  "GoblinDrill":3,"GoblinMachine":4,"Goblinstein":4,"Gobs":2,"GoldenKnight":4,"Golem":8,
  "Graveyard":5,"Guards":3,"HealSpirit":1,"Hog":4,"Horde":5,"Hunter":4,"IceGolem":2,"IceSpirit":1,
  "IceWiz":3,"Inferno":5,"InfernoD":3,"Knight":3,"Lava":7,"Lightning":6,"LittlePrince":3,"Log":2,
  "Lumber":4,"MagicArcher":4,"MegaKnight":7,"MightyMiner":4,"Miner":3,"Minions":3,"Mirror":1,"MM":4,
  "Monk":5,"Mortar":4,"MotherWitch":4,"MP":4,"Musk":4,"NightWitch":4,"PEKKA":7,"Phoenix":4,
  "Poison":4,"Prince":5,"Princess":3,"Pump":6,"Rage":2,"Ram":4,"RamRider":5,"Rascals":5,
  "RG":6,"Rocket":6,"RoyalDelivery":3,"RoyalHogs":5,"RoyalRecruits":7,"RuneGiant":6,"Skarmy":3,
  "SkeletonDragons":4,"SkeletonKing":4,"Skellies":1,"SkellyBarrel":3,"Snowball":2,"Sparky":6,
  "SpearGobs":2,"SpiritEmpress":4,"SuspiciousBush":3,"Tesla":4,"Tombstone":3,"Tornado":3,
  "Valk":4,"Vines":3,"Void":4,"WallBreakers":2,"Witch":5,"Wiz":5,"XBow":6,"Zap":2,"Zappies":4,
  "MP_Hero":4,"Knight_Hero":3,"Musk_Hero":4,"Giant_Hero":5
};

function calcAvgElixir(cards) {
  let sum = 0;
  let count = 0;

  cards.forEach(id => {
    if (!id) return;
    sum += elixirCost[id] ?? 3;
    count++;
  });

  if (!count) return "-";
  return (sum / count).toFixed(1);
}

/* =========================================================
   ▼ レア度 & ソート関連
========================================================= */
const rarityOrder = ["Common","Rare","Epic","Legendary","Champion","Evo"];
const rarityRank = {};
rarityOrder.forEach((r, i) => rarityRank[r] = i);

const rarityMap = {

  /* =========================================================
     Common
  ========================================================= */
  "Skellies":"Common",
  "ElectroSpirit":"Common",
  "FireSpirit":"Common",
  "IceSpirit":"Common",
  "Gobs":"Common",
  "SpearGobs":"Common",
  "Bomber":"Common",
  "Bats":"Common",
  "Zap":"Common",
  "Snowball":"Common",
  "Berserker":"Common",
  "Archers":"Common",
  "Arrows":"Common",
  "Knight":"Common",
  "Minions":"Common",
  "Cannon":"Common",
  "GobGang":"Common",
  "SkellyBarrel":"Common",
  "Firecracker":"Common",
  "RoyalDelivery":"Common",
  "SkeletonDragons":"Common",
  "Mortar":"Common",
  "Tesla":"Common",
  "Barbs":"Common",
  "Horde":"Common",
  "Rascals":"Common",
  "RG":"Common",
  "eBarbs":"Common",
  "RoyalRecruits":"Common",
  

  /* =========================================================
     Rare
  ========================================================= */
  "HealSpirit":"Rare",
  "IceGolem":"Rare",
  "SuspiciousBush":"Rare",
  "Tombstone":"Rare",
  "MM":"Rare",
  "DartGob":"Rare",
  "Earthquake":"Rare",
  "ElixirGolem":"Rare",
  "Fireball":"Rare",
  "MP":"Rare",
  "Musk":"Rare",
  "GoblinCage":"Rare",
  "GobHut":"Rare",
  "Valk":"Rare",
  "Ram":"Rare",
  "BombTower":"Rare",
  "FlyingMachine":"Rare",
  "Hog":"Rare",
  "BattleHealer":"Rare",
  "Furnace":"Rare",              
  "Zappies":"Rare",
  "GoblinDemolisher":"Rare",
  "Giant":"Rare",
  "Inferno":"Rare",
  "Wiz":"Rare",
  "RoyalHogs":"Rare",
  "Rocket":"Rare",
  "BarbHut":"Rare",
  "Pump":"Rare",
  "3M":"Rare",

  /* =========================================================
     Epic
  ========================================================= */
  
  "Mirror":"Epic",
  "BarbBarrel":"Epic",
  "WallBreakers":"Epic",
  "GoblinCurse":"Epic",
  "Rage":"Epic",
  "Barrel":"Epic",
  "Guards":"Epic",
  "Skarmy":"Epic",
  "Vines":"Epic",
  "Clone":"Epic",
  "Tornado":"Epic",
  "Void":"Epic",
  "BabyD":"Epic",
  "DarkPrince":"Epic",
  "Freeze":"Epic",
  "Poison":"Epic",
  "RuneGiant":"Epic",
  "Hunter":"Epic",
  "GoblinDrill":"Epic",
  "Witch":"Epic",
  "Balloon":"Epic",
  "Prince":"Epic",
  "eDragon":"Epic",
  "Bowler":"Epic",
  "Exe":"Epic",
  "CannonCart":"Epic",
  "GiantSkelly":"Epic",
  "Lightning":"Epic",
  "GobGiant":"Epic",
  "XBow":"Epic",
  "PEKKA":"Epic",
  "ElectroGiant":"Epic",
  "Golem":"Epic",
  /* 最新追加 Epic */
  
  
  

  /* =========================================================
     Legendary
  ========================================================= */
  "Log":"Legendary",
  "Miner":"Legendary", 
  "Princess":"Legendary", 
  "IceWiz":"Legendary",
  "Ghost":"Legendary",
  "Bandit":"Legendary",
  "Fisherman":"Legendary",
  "eWiz":"Legendary",
  "InfernoD":"Legendary",
  "Phoenix":"Legendary",
  "MagicArcher":"Legendary",
  "Lumber":"Legendary",
  "NightWitch":"Legendary",
  "MotherWitch":"Legendary",
  "RamRider":"Legendary",
  "Graveyard":"Legendary",
  "GoblinMachine":"Legendary",
  "Sparky":"Legendary",
  "SpiritEmpress":"Legendary",
  "MegaKnight":"Legendary",
  "Lava":"Legendary",
  
  /* =========================================================
     Champion（Hero / BossBandit）
  ========================================================= */
  "LittlePrince":"Champion",
  "GoldenKnight":"Champion",
  "SkeletonKing":"Champion",
  "MightyMiner":"Champion",
  "ArcherQueen":"Champion",
  "Goblinstein":"Champion",
  "Monk":"Champion",
  "BossBandit":"Champion",
  "Knight_Hero":"Champion",
  "Giant_Hero":"Champion",
  "Musk_Hero":"Champion",
  "MP_Hero":"Champion",

  /* =========================================================
     Evo（最強レア扱い）
  ========================================================= */
  "Evo_Archers":"Evo",
  "Evo_BabyD":"Evo",
  "Evo_Barbs":"Evo",
  "Evo_Barrel":"Evo",
  "Evo_Bats":"Evo",
  "Evo_Bomber":"Evo",
  "Evo_Cannon":"Evo",
  "Evo_DartGob":"Evo",
  "Evo_eDragon":"Evo",
  "Evo_Exe":"Evo",
  "Evo_Firecracker":"Evo",
  "Evo_Furnace":"Evo",
  "Evo_Ghost":"Evo",
  "Evo_GobGiant":"Evo",
  "Evo_GoblinCage":"Evo",
  "Evo_GoblinDrill":"Evo",
  "Evo_Hunter":"Evo",
  "Evo_IceSpirit":"Evo",
  "Evo_InfernoD":"Evo",
  "Evo_Knight":"Evo",
  "Evo_Lumber":"Evo",
  "Evo_MegaKnight":"Evo",
  "Evo_Mortar":"Evo",
  "Evo_Musk":"Evo",
  "Evo_PEKKA":"Evo",
  "Evo_Ram":"Evo",
  "Evo_RG":"Evo",
  "Evo_RoyalHogs":"Evo",
  "Evo_RoyalRecruits":"Evo",
  "Evo_Skarmy":"Evo",
  "Evo_Skellies":"Evo",
  "Evo_SkellyBarrel":"Evo",
  "Evo_Snowball":"Evo",
  "Evo_Tesla":"Evo",
  "Evo_Valk":"Evo",
  "Evo_WallBreakers":"Evo",
  "Evo_Witch":"Evo",
  "Evo_Wiz":"Evo",
  "Evo_Zap":"Evo"
};



function getRarity(id) {
  return rarityMap[id] || "Common";
}

/* =========================================================
   ▼ 画像
========================================================= */
function cardImg(id) {
  return `cards/${id}.png`;
}

/* =========================================================
   ▼ YouTube プレビュー
========================================================= */
function createYTPreview(url) {
  let videoId = "";

  if (url.includes("shorts/")) {
    videoId = url.split("shorts/")[1];
  } else if (url.includes("v=")) {
    videoId = url.split("v=")[1];
  } else {
    return "";
  }

  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return `
    <div class="yt-preview" onclick="window.open('${url}', '_blank')">
      <img class="yt-thumb" src="${thumb}">
      <div class="yt-info">
        <div class="yt-title">Watch Video</div>
        <div class="yt-site">youtube.com</div>
      </div>
    </div>
  `;
}

/* =========================================================
   ▼ デッキ一覧描画
========================================================= */
/* =========================================================
   ▼ デッキ一覧描画（デフォルト + ログインユーザーのデッキ）
========================================================= */
async function renderDecks() {
  const deckList = document.getElementById("deckList");
  deckList.innerHTML = "";

  const decks = await getAllDecks(); // default + サーバー

  // ★ ここで「Request from ～」を除外
  const filtered = decks.filter(d => !d.title.startsWith("Request from"));

  filtered.forEach((d) => {
    const top = d.cards.slice(0,4).map(id => `<img src="${cardImg(id)}">`).join("");
    const bottom = d.cards.slice(4,8).map(id => `<img src="${cardImg(id)}">`).join("");

    const avg = calcAvgElixir(d.cards);
    const yt = d.video ? createYTPreview(d.video) : "";

    deckList.innerHTML += `
      <div class="deck-card">
        <div class="deck-title">
          <span>${d.title}</span>
          <span class="avg-elixir">
            <img src="cards/elixir.png"> ${avg}
          </span>
        </div>
        <div class="cards">
          <div class="row">${top}</div>
          <div class="row">${bottom}</div>
        </div>
        ${yt}
      </div>
    `;
  });
}




renderDecks();

/* =========================================================
   ▼ Deck Builder
========================================================= */
let cardIDs = [
  "3M","Archers","Arrows","BabyD","Balloon","Bandit","BarbBarrel","BarbHut","Barbs","Barrel","Bats",
  "BattleHealer","Berserker","Bomber","BombTower","Bowler","Cannon","CannonCart","Clone","DarkPrince",
  "DartGob","Earthquake","eBarbs","eDragon","ElectroGiant","ElectroSpirit","ElixirGolem",
  "Evo_Archers","Evo_BabyD","Evo_Barbs","Evo_Barrel","Evo_Bats","Evo_Bomber","Evo_Cannon","Evo_DartGob",
  "Evo_eDragon","Evo_Exe","Evo_Firecracker","Evo_Furnace","Evo_Ghost","Evo_GobGiant","Evo_GoblinCage",
  "Evo_GoblinDrill","Evo_Hunter","Evo_IceSpirit","Evo_InfernoD","Evo_Knight","Evo_Lumber",
  "Evo_MegaKnight","Evo_Mortar","Evo_Musk","Evo_PEKKA","Evo_Ram","Evo_RG","Evo_RoyalHogs",
  "Evo_RoyalRecruits","Evo_Skarmy","Evo_Skellies","Evo_SkellyBarrel","Evo_Snowball","Evo_Tesla",
  "Evo_Valk","Evo_WallBreakers","Evo_Witch","Evo_Wiz","Evo_Zap","eWiz","Exe","Fireball","Firecracker",
  "FireSpirit","Fisherman","FlyingMachine","Freeze","Furnace","Ghost","Giant","GiantSkelly","GobGang",
  "GobGiant","GobHut","GoblinCage","GoblinCurse","GoblinDemolisher","GoblinDrill","GoblinMachine",
  "Gobs","Golem","Graveyard","Guards","HealSpirit","Hog","Horde","Hunter","IceGolem","IceSpirit",
  "IceWiz","Inferno","InfernoD","Knight","Lava","Lightning","Log","Lumber","MagicArcher",
  "MegaKnight","Miner","Minions","Mirror","MM","Mortar","MotherWitch","MP","Musk","NightWitch",
  "PEKKA","Phoenix","Poison","Prince","Princess","Pump","Rage","Ram","RamRider","Rascals",
  "RG","Rocket","RoyalDelivery","RoyalHogs","RoyalRecruits","RuneGiant","Skarmy","SkeletonDragons",
  "Skellies","SkellyBarrel","Snowball","Sparky","SpearGobs","SpiritEmpress","SuspiciousBush",
  "Tesla","Tombstone","Tornado","Valk","Vines","Void","WallBreakers","Witch","Wiz","XBow","Zap","Zappies"
];

// ヒーロー / チャンピオン
const heroCards = [
  "ArcherQueen",
  "BossBandit",
  "Goblinstein",
  "GoldenKnight",
  "SkeletonKing",
  "MightyMiner",
  "Monk",
  "LittlePrince",
  "Knight_Hero",
  "Giant_Hero",
  "Musk_Hero",
  "MP_Hero"
];

cardIDs.push(...heroCards);

function isHero(id) {
  return heroCards.includes(id);
}

// Hero ↔ 通常 ↔ Evo ペア表
const fullPairs = {
  "Knight_Hero": ["Knight", "Evo_Knight"],
  "Knight": ["Knight_Hero", "Evo_Knight"],
  "Evo_Knight": ["Knight", "Knight_Hero"],

  "Giant_Hero": ["Giant", "Evo_Giant"],
  "Giant": ["Giant_Hero", "Evo_Giant"],
  "Evo_Giant": ["Giant", "Giant_Hero"],

  "Musk_Hero": ["Musk", "Evo_Musk"],
  "Musk": ["Musk_Hero", "Evo_Musk"],
  "Evo_Musk": ["Musk", "Musk_Hero"],

  "MP_Hero": ["MP", "Evo_MP"],
  "MP": ["MP_Hero", "Evo_MP"],
  "Evo_MP": ["MP", "MP_Hero"]
};

let deck = ["","","","","","","",""];
let selectedSlot = null;
const heroSlots = [2, 3];

/* =========================================================
   ▼ ソート状態 & ソートボタン
========================================================= */
let sortMode = localStorage.getItem("sortMode") || "name";

function applySortButtonState() {
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.sort === sortMode);
  });
}

function getSortedAvailableCardIDs() {
  const used = new Set(deck.filter(c => c));
  used.forEach(id => {
    if (fullPairs[id]) fullPairs[id].forEach(p => used.add(p));
    if (evoPairs[id]) used.add(evoPairs[id]);
  });

  const available = cardIDs.filter(id => !used.has(id));
  const sorted = [...available];

  if (sortMode === "name") {
    sorted.sort((a, b) => a.localeCompare(b));
  } else if (sortMode === "elixir") {
    sorted.sort((a, b) => {
      const ca = elixirCost[a] ?? 3;
      const cb = elixirCost[b] ?? 3;
      if (ca !== cb) return ca - cb;
      return a.localeCompare(b);
    });
  } else if (sortMode === "rarity") {
    sorted.sort((a, b) => {
      const ra = rarityRank[getRarity(a)] ?? 0;
      const rb = rarityRank[getRarity(b)] ?? 0;
      if (ra !== rb) return ra - rb;
      const ca = elixirCost[a] ?? 3;
      const cb = elixirCost[b] ?? 3;
      if (ca !== cb) return ca - cb;
      return a.localeCompare(b);
    });
  }

  return sorted;
}

/* =========================================================
   ▼ カード一覧描画（ソート反映）
========================================================= */
function renderCardList() {
  const area = document.getElementById("cardList");
  const sorted = getSortedAvailableCardIDs();

  area.innerHTML = sorted
    .map(id => `<img src="${cardImg(id)}" data-id="${id}">`)
    .join("");
}

renderCardList();
applySortButtonState();

/* Sortボタンイベント */
document.querySelectorAll(".sort-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.sort;
    if (mode === sortMode) return;
    sortMode = mode;
    localStorage.setItem("sortMode", sortMode);
    applySortButtonState();
    renderCardList();
  });
});

/* =========================================================
   ▼ Builder 平均 & スロット
========================================================= */
function updateBuilderAvg() {
  const avg = calcAvgElixir(deck);
  const span = document.getElementById("builderAvg");
  if (span) span.textContent = avg;
}

function updateSlots() {
  document.querySelectorAll(".slot").forEach((slot, idx) => {
    slot.classList.toggle("active", Number(slot.dataset.index) === selectedSlot);
    slot.innerHTML = deck[idx] ? `<img src="${cardImg(deck[idx])}">` : "";
  });
  updateBuilderAvg();
}
updateSlots();

document.querySelectorAll(".slot").forEach(slot => {
  slot.onclick = () => {
    selectedSlot = Number(slot.dataset.index);
    updateSlots();
  };
});

function isEvo(id) {
  return id.startsWith("Evo_");
}

function rejectSlot(idx) {
  const slotEl = document.querySelector(`.slot[data-index="${idx}"]`);
  if (!slotEl) return;
  slotEl.classList.add("reject");
  setTimeout(() => slotEl.classList.remove("reject"), 300);
}

/* カード選択 */
document.getElementById("cardList").onclick = e => {
  if (selectedSlot === null) return;
  if (e.target.tagName !== "IMG") return;

  const id = e.target.dataset.id;
  const idx = Number(selectedSlot);

  // Hero 制限
  if (isHero(id)) {
    if (!heroSlots.includes(idx)) {
      rejectSlot(idx);
      return;
    }
    const currentHeroCount = deck.filter(c => isHero(c)).length;
    const isReplacingHero = deck[idx] && isHero(deck[idx]);
    if (currentHeroCount >= 2 && !isReplacingHero) {
      rejectSlot(idx);
      return;
    }
  }

  // Evo 制限
  if (isEvo(id) && idx > 1) {
    rejectSlot(idx);
    return;
  }

  deck[idx] = id;
  updateSlots();
  renderCardList();
};

async function sendDeckRequestToAdmin(req) {
  await fetch(`${API_BASE}/addDeck`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: req.user,
      title: req.title,
      cards: req.cards
    })
  });
}




/* =========================================================
   ▼ デッキ送信
========================================================= */
document.getElementById("addDeck").onclick = () => {
  if (!currentUser) return alert("Please login first!");
  if (deck.some(c => !c)) return alert("There are still empty slots!");

  const name = document.getElementById("playerName").value.trim() || currentUser;

  if (currentMode === "my") {
    addDeckToUser(`My Deck by ${name}`, deck);
    renderDecks();
    renderMyDecks();
    alert("Saved to My Decks!");

  } else if (currentMode === "request") {
    sendDeckRequestToAdmin({
      user: currentUser,
      title: `Request from ${name}`,
      cards: [...deck]
    });
    alert("Request sent!");
  }

  // 後片付け
  deck = ["","","","","","","",""];
  selectedSlot = null;
  document.getElementById("playerName").value = "";
  updateSlots();
  renderCardList();
  playTrophyAnim();
  showDeckToast();
};



/* =========================================================
   ▼ Admin Viewer（リクエスト＋全デッキ）
========================================================= */
async function renderAdmin() {
  const area = document.getElementById("adminDecks");
  if (!area) return;

  area.innerHTML = "";

  // ▼ ★サーバーの decks.json からデッキを取得
  const decks = await getAllDecks();

  // ▼ Review Requests（＝ユーザーから送られたデッキ）だけ抽出
  const requests = decks.filter(d => d.username !== undefined); // defaultDeck を除外

  area.innerHTML += `<h2 style="margin-top:10px;">Review Requests</h2>`;

  if (requests.length === 0) {
    area.innerHTML += `<p>No pending requests.</p>`;
  } else {
requests.forEach(r => {
  const top = r.cards.slice(0,4).map(id => `<img src="${cardImg(id)}">`).join("");
  const bottom = r.cards.slice(4,8).map(id => `<img src="${cardImg(id)}">`).join("");

  area.innerHTML += `
    <div class="deck-card">
      <h3>${r.title} <span style="font-size:12px;">(${r.username})</span></h3>
      <div class="row">${top}</div>
      <div class="row">${bottom}</div>

      <div style="margin-top:10px;">
        <button onclick="deleteServerDeck('${r.id}')" class="del-btn-red">
          Delete
        </button>
      </div>
    </div>
  `;
});

  }

  area.innerHTML += `<hr>`;

  // ▼ 全デッキ一覧
  decks.forEach((d, i) => {
    const top = d.cards.slice(0, 4).map(id => `<img src="${cardImg(id)}">`).join("");
    const bottom = d.cards.slice(4, 8).map(id => `<img src="${cardImg(id)}">`).join("");
    const avg = calcAvgElixir(d.cards);

area.innerHTML += `
  <div class="deck-card">
    <h3>${i+1}. ${d.title} <span>(${d.user || "?"})</span></h3>
    <div class="row">${top}</div>
    <div class="row">${bottom}</div>

    <p>Avg: ${avg}</p>
  </div>
`;
});
}

async function deleteServerDeck(id) {
  if (!confirm("Delete this deck?")) return;

  await fetch(`${API_BASE}/deleteDeck/${id}`, {
    method: "DELETE"
  });

  alert("Deleted!");

  // 管理画面を更新
  renderAdmin();
}



function markRequestAsRead(id) {
  const key = "deckRequests";
  const list = JSON.parse(localStorage.getItem(key) || "[]");

  const idx = list.findIndex(r => r.id === id);
  if (idx !== -1) {
    list[idx].status = "read";
    localStorage.setItem(key, JSON.stringify(list));
  }

  renderAdmin();
  updateRequestBadge();
}


function deleteDeck(index) {
  if (index < defaultDecks.length) {
    alert("デフォルトデッキは削除できません！");
    return;
  }

  if (!confirm("本当に削除しますか？")) return;

  const userIndex = index - defaultDecks.length;
  userDecks.splice(userIndex, 1);

  localStorage.setItem("userDecks", JSON.stringify(userDecks));

  renderDecks();
  renderAdmin();
}





/* Admin Close */
document.getElementById("closeAdmin").onclick = () => {
  document.getElementById("adminModal").style.display = "none";
};

/* =========================================================
   ▼ テーマ切り替え
========================================================= */
function applyTheme(name) {
  document.body.className = "";
  document.body.classList.add("theme-" + name);
  localStorage.setItem("deckTheme", name);
}

const savedTheme = localStorage.getItem("deckTheme") || "classic";
applyTheme(savedTheme);

document.getElementById("themeSelect").value = savedTheme;

document.getElementById("themeSelect").onchange = e => {
  applyTheme(e.target.value);
};

/* =========================================================
   ▼ カード一覧サイズ調整（CSS変数制御）
========================================================= */

// 保存されたサイズを読み込み
let cardScale = Number(localStorage.getItem("cardScale") || 1);

// スライダー初期セット
document.getElementById("cardSizeSlider").value = cardScale;
document.getElementById("cardSizeValue").textContent = cardScale.toFixed(1) + "x";

// 初期反映
document.documentElement.style.setProperty(
  "--card-size",
  (62 * cardScale) + "px"
);

// スライダー変更で反映
document.getElementById("cardSizeSlider").addEventListener("input", (e) => {
  const scale = Number(e.target.value);
  const base = 62; // もともとのカード幅
  const size = base * scale;

  document.documentElement.style.setProperty("--card-size", size + "px");
  document.getElementById("cardSizeValue").textContent = scale.toFixed(1) + "x";

  localStorage.setItem("cardScale", scale);
});
function playTrophyAnim() {
  const el = document.getElementById("trophyAnim");

  el.classList.remove("show", "fade"); // 状態リセット

  // 少し遅延してアニメ開始（reflow対策）
  setTimeout(() => {
    el.classList.add("show");

    // 表示 → 少ししてフェードアウト
    setTimeout(() => {
      el.classList.add("fade");
    }, 750);

  }, 30);
}

// userManager.js が必要前提
// loginName → ユーザー名欄
// loginBtn  → Enterボタン

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = () => {
    const name = document.getElementById("loginName").value.trim();
    if (!name) return alert("Enter your name!");

    loginUser(name);

    const box = document.getElementById("loginBox");
    if (box) box.remove();
  };
}


/* =========================================================
   ▼ モード切り替え（My Deck / Request Review）
========================================================= */
/* =========================================================
   ▼ モード切り替え（My Deck / Request Review）
========================================================= */
function applyModeUI() {
  const title = document.querySelector(".builder-title");
  const nameLabel = document.querySelector("#playerNameLabel");
  const nameInput = document.getElementById("playerName");
  const submitBtn = document.getElementById("addDeck");

  if (!title || !nameLabel || !nameInput || !submitBtn) return;

  if (currentMode === "my") {
    // ▼ My Deck モード
    title.textContent = "Add your decks";

    nameLabel.style.display = "block";
    nameLabel.textContent = `User: ${currentUser}`;

    // 入力欄は隠す
    nameInput.style.display = "none";

    submitBtn.textContent = "Add to your list";

  } else {
    // ▼ Request Review モード
    title.textContent = "Get Your Deck Reviewed";

    nameLabel.style.display = "block";
    nameLabel.textContent = "Your Name";

    // 入力欄を表示
    nameInput.style.display = "block";

    submitBtn.textContent = "Submit";
  }
}



const btnMy = document.getElementById("modeMy");
const btnReq = document.getElementById("modeRequest");

if (btnMy) {
  btnMy.addEventListener("click", () => {
    currentMode = "my";
    btnMy.classList.add("active");
    btnReq?.classList.remove("active");
    applyModeUI();
  });
}

if (btnReq) {
  btnReq.addEventListener("click", () => {
    currentMode = "request";
    btnReq.classList.add("active");
    btnMy?.classList.remove("active");
    applyModeUI();
  });
}

// 初期反映
applyModeUI();


const loginNameInput = document.getElementById("loginName");
if (loginNameInput) {
  loginNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") document.getElementById("loginBtn")?.click();
  });
}


document.getElementById("openMyDecks").onclick = () => {
  renderMyDecks();
  document.getElementById("myDecksModal").style.display = "flex";
};

document.getElementById("closeMyDecks").onclick = () => {
  document.getElementById("myDecksModal").style.display = "none";
};
/* =========================================================
   ▼ Deck Submitted Toast 表示
========================================================= */
function showDeckToast() {
  const toast = document.getElementById("deckToast");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function deleteUserDeck(i) {
  const list = loadUserDecks();
  list.splice(i, 1);
  saveUserDecks(list);

  renderDecks();
  renderMyDecks();
}

document.getElementById("pasteDeck").onclick = async () => {
  try {
    // クリップボードの内容を読み取る
    const text = await navigator.clipboard.readText();

    // ["Hog","Knight", ...] を配列としてパース
    const arr = JSON.parse(text);

    // 配列チェック（8枚なきゃ使えない）
    if (!Array.isArray(arr) || arr.length !== 8) {
      alert("Deck format invalid!");
      return;
    }

    // スロットにカードを全部流し込む
    for (let i = 0; i < 8; i++) {
      deck[i] = arr[i] || "";
    }

    // UI 更新
    selectedSlot = null;
    updateSlots();
    renderCardList();

    alert("Deck loaded!");

  } catch (e) {
    alert("Could not paste deck!");
    console.error(e);
  }
};


function updateRequestBadge() {
  const key = "deckRequests";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  const unread = list.filter(r => r.status === "unread").length;

  const badge = document.getElementById("requestBadge");
  if (!badge) return;

  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}
const ADMIN_PASSWORD = "shogo_only_2025";  // ← 好きな強パスワードに変更可

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
    e.preventDefault();

    const modal = document.getElementById("adminPassModal");
    const input = document.getElementById("adminPassInput");
    const error = document.getElementById("adminPassError");

    error.style.display = "none";
    input.value = "";

    modal.style.display = "flex";
    input.focus();
  }
});

// OK
document.getElementById("adminPassOk").onclick = async () => {
  const input = document.getElementById("adminPassInput");
  const error = document.getElementById("adminPassError");

  if (input.value === ADMIN_PASSWORD) {
    document.getElementById("adminPassModal").style.display = "none";

    await renderAdmin();
    document.getElementById("adminModal").style.display = "block";
  } else {
    error.style.display = "block";
  }
};

// Cancel
document.getElementById("adminPassCancel").onclick = () => {
  document.getElementById("adminPassModal").style.display = "none";
};

// Enterキーでも確定
document.getElementById("adminPassInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("adminPassOk").click();
  }
});


document.getElementById("copyDeck").onclick = () => {
  const text = JSON.stringify(deck);
  navigator.clipboard.writeText(text);

  // === ① スロット全体をフラッシュ ===
  document.querySelectorAll(".slot").forEach(s => {
    s.classList.add("copy-flash");
    setTimeout(() => s.classList.remove("copy-flash"), 450);
  });

  // === ② トーストを出す ===
  const toast = document.getElementById("copyToast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
};
