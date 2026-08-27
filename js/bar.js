/* Aiko & 17's bar — a short co-op shift, not a restaurant sim. */
const Bar = (() => {
  const T = 16;
  const MAX_GUESTS = 3;
  const SOUVENIR_CAP = 12;
  const BEHIND = { x: 8.6 * T, y: 1.72 * T };
  const PASS = { x: 10.15 * T, y: 2.22 * T };
  const WASH = { x: 1.55 * T, y: 4.35 * T };
  const DOOR = { x: 18.6 * T, y: 4.55 * T };

  const INGS = [
    { id: "strawberry", name: "草莓", icon: "🍓" },
    { id: "lemon", name: "柠檬", icon: "🍋" },
    { id: "honey", name: "蜂蜜", icon: "🍯" },
    { id: "soda", name: "苏打水", icon: "🫧" },
    { id: "coffee", name: "咖啡", icon: "☕" },
    { id: "milk", name: "牛奶", icon: "🥛" },
  ];

  const CUPS = [
    { id: "tall", name: "高杯" },
    { id: "mug", name: "马克杯" },
    { id: "cocktail", name: "鸡尾酒杯" },
  ];

  const DRINKS = [
    { id: "strawberrySoda", name: "草莓汽水", icon: "🍓", cup: "tall", ings: ["strawberry", "soda"], price: 42, tags: ["sweet", "drink"], color: "#f07090" },
    { id: "lemonSoda", name: "柠檬特调", icon: "🍋", cup: "tall", ings: ["lemon", "soda"], price: 40, tags: ["drink"], color: "#e8e070" },
    { id: "honeyLemon", name: "蜂蜜柠檬", icon: "🍋", cup: "tall", ings: ["lemon", "honey", "soda"], price: 48, tags: ["sweet", "drink"], color: "#f0d060" },
    { id: "latte", name: "拿铁", icon: "☕", cup: "mug", ings: ["coffee", "milk"], price: 45, tags: ["coffee", "drink"], color: "#c8a078" },
    { id: "stardew", name: "星露谷特饮", icon: "🍹", cup: "cocktail", ings: ["strawberry", "lemon", "honey"], price: 58, tags: ["sweet", "drink"], color: "#e070a0" },
    { id: "cocoa", name: "热可可", icon: "☕", cup: "mug", ings: ["coffee", "milk", "honey"], price: 50, tags: ["sweet", "coffee", "drink"], color: "#6a3a20", need: "cocoa" },
    { id: "berryMilk", name: "草莓牛奶", icon: "🍓", cup: "tall", ings: ["strawberry", "milk"], price: 46, tags: ["sweet", "drink"], color: "#f4b0c0", need: "berryMilk" },
  ];

  const SNACKS = [
    { id: "fries", name: "薯条", icon: "🍟", type: "snack", price: 28, tags: ["food", "snack"], color: "#e8c050" },
    { id: "chips", name: "黄油薯片", icon: "🧈", type: "snack", price: 26, tags: ["food", "snack"], color: "#f4d018" },
    { id: "cookies", name: "小饼干", icon: "🍪", type: "snack", price: 24, tags: ["food", "snack", "sweet"], color: "#d4a060" },
    { id: "cake", name: "草莓小蛋糕", icon: "🍰", type: "snack", price: 36, tags: ["food", "snack", "sweet"], color: "#f0b0c0", need: "cake" },
  ];

  const TRAITS = [
    { id: "talkative", patience: 36000, w: 1 },
    { id: "easy", patience: 42000, w: 2 },
  ];

  const TALKS = ["今天心情不错。", "你们是一起开的吗？", "再来一杯也行。", "这家店好有生活感。", "老板娘手真巧。", "我跟朋友说了这里。"];

  const SOUVENIRS = [
    { id: "flower", name: "一朵花", icon: "🌼" },
    { id: "note", name: "小纸条", icon: "💌" },
    { id: "coin", name: "金币", icon: "🪙" },
    { id: "ticket", name: "一张票", icon: "🎟" },
    { id: "shell", name: "贝壳", icon: "🐚" },
  ];

  const SPECIALS = [
    { id: "berryPop", text: "本次人气饮品：草莓汽水", drink: "strawberrySoda", gold: 1.2 },
    { id: "sweet", text: "本次客人特别爱甜食。", tag: "sweet", tip: 2 },
    { id: "coffee", text: "今晚大家都想来杯咖啡。", tag: "coffee", gold: 1.2 },
    { id: "snacks", text: "小吃额外受欢迎。", snack: true, gold: 1.2 },
    { id: "chatty", text: "今晚的客人特别爱聊天。", bias: "talkative" },
    { id: "weirdNight", text: "奇怪的客人变多了。", bias: "weird" },
  ];

  const UPGRADES = [
    { id: "glasses", name: "闪亮酒杯", desc: "Perfect 更容易留下小费", cost: 220 },
    { id: "neon", name: "门口霓虹", desc: "客人来得稍快一点", cost: 280 },
    { id: "cabinet", name: "展示柜加一层", desc: "能放下更多小东西", cost: 160 },
    { id: "shaker", name: "更好的摇酒器", desc: "出杯更快", cost: 260 },
    { id: "apron", name: "跑堂围裙", desc: "17 送餐更快", cost: 240 },
    { id: "cocoa", name: "新配方：热可可", desc: "菜单上多一杯热可可", cost: 320 },
    { id: "berryMilk", name: "新配方：草莓牛奶", desc: "菜单上多一杯草莓牛奶", cost: 320 },
    { id: "cake", name: "新小吃：草莓小蛋糕", desc: "菜单上多一块小蛋糕", cost: 300 },
    { id: "lucky", name: "幸运罐", desc: "客人更爱留下小东西", cost: 180 },
    { id: "tipjar", name: "小费罐", desc: "每单多一点点金币", cost: 350 },
  ];

  const SEATS = [
    { id: "bar1", label: "吧一", x: 3.85 * T, y: 4.02 * T, dir: "up" },
    { id: "bar2", label: "吧二", x: 6.35 * T, y: 4.02 * T, dir: "up" },
    { id: "bar3", label: "吧三", x: 8.85 * T, y: 4.02 * T, dir: "up" },
    { id: "t1a", label: "桌一", x: 2.35 * T, y: 7.12 * T, dir: "up" },
    { id: "t1b", label: "桌二", x: 5.05 * T, y: 7.12 * T, dir: "up" },
    { id: "t2a", label: "桌三", x: 11.25 * T, y: 7.12 * T, dir: "up" },
  ];

  const HAIRS = ["#1a1410", "#3a2418", "#6a4030", "#c8c0b8", "#f0c43c", "#4a1828"];
  const SHIRTS = ["#c44858", "#3a5a88", "#d8a050", "#4a7a48", "#6a3a68", "#e8d8c0", "#2a2438"];
  const SKINS = ["#f3c49a", "#e0b090", "#c48a68", "#f0d4c0"];

  let api = null;
  let wallet = 0;
  let open = false;
  let upgrades = {};
  let souvenirs = [];
  let mixes = 0;
  let delivers = 0;
  let guests = [];
  let held = null;
  let pass = null;
  let npcHeld = null;
  let npcJob = { type: "idle" };
  let mix = { cup: null, ings: [] };
  let mixing = false;
  let mixT = 0;
  let mixNeed = 0;
  let dirty = 0;
  let spawnCD = 0;
  let shoutCD = 0;
  let stealT = 0;
  let gid = 1;
  let special = null;
  let session = emptySession();
  let bound = false;
  let showRecipes = false;

  function emptySession() {
    return { gold: 0, tip: 0, guests: 0, perfect: 0, wrong: 0, spawned: 0, rescue: 0, t: 0 };
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function unlocked(list) {
    return list.filter((r) => !r.need || upgrades[r.need]);
  }

  function menuDrinks() {
    return unlocked(DRINKS);
  }

  function menuSnacks() {
    return unlocked(SNACKS);
  }

  function menuAll() {
    return menuDrinks().concat(menuSnacks());
  }

  function sameIngs(a, b) {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((x, i) => x === sb[i]);
  }

  function findDrink(ings) {
    return menuDrinks().find((d) => sameIngs(d.ings, ings)) || null;
  }

  function isWeirdMix(ings) {
    return sameIngs(ings, ["strawberry", "coffee", "lemon"]);
  }

  function mixDuration() {
    const skill = Math.min(420, mixes * 7);
    const gear = upgrades.shaker ? 220 : 0;
    return Math.max(280, 980 - skill - gear);
  }

  function npcSpeed() {
    const skill = Math.min(0.85, delivers * 0.018);
    return 1.42 + skill + (upgrades.apron ? 0.38 : 0);
  }

  function capSouvenirs() {
    return upgrades.cabinet ? 18 : SOUVENIR_CAP;
  }

  function jarLevel() {
    if (wallet >= 5000) return 5;
    if (wallet >= 2000) return 4;
    if (wallet >= 800) return 3;
    if (wallet >= 250) return 2;
    if (wallet >= 50) return 1;
    return 0;
  }

  function toast(text) {
    if (api && api.toast) api.toast(text);
  }

  function say(text) {
    if (api && api.npcToast) api.npcToast(text);
  }

  function save() {
    if (api && api.saveStore) api.saveStore();
  }

  function load(data, gold) {
    wallet = gold || 0;
    const b = data || {};
    upgrades = Object.assign({}, b.upgrades || {});
    souvenirs = Array.isArray(b.souvenirs) ? b.souvenirs.slice() : [];
    mixes = b.mixes || 0;
    delivers = b.delivers || 0;
  }

  function serialize() {
    return { upgrades, souvenirs, mixes, delivers };
  }

  function isOpen() {
    return open;
  }

  function panel(id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("hidden", !show);
  }

  function rulesEl() {
    return document.getElementById("bar-rules-screen");
  }

  function rulesOpen() {
    const el = rulesEl();
    return !!(el && !el.classList.contains("hidden"));
  }

  function hideOpenRules() {
    const el = rulesEl();
    if (el) el.classList.add("hidden");
  }

  function showOpenRules() {
    closePanels();
    const el = rulesEl();
    if (!el) {
      if (!open) startShift();
      return;
    }
    const ok = document.getElementById("bar-rules-ok");
    if (ok) ok.textContent = open ? "返回游戏" : "看完了，开始营业";
    el.classList.remove("hidden");
    const body = el.querySelector(".rules-body");
    if (body) body.scrollTop = 0;
  }

  function confirmOpen() {
    if (open) {
      hideOpenRules();
      return;
    }
    hideOpenRules();
    startShift();
  }

  function confirmRulesKey() {
    if (!rulesOpen()) return false;
    confirmOpen();
    return true;
  }

  function anyPanel() {
    return rulesOpen() || ["mix-panel", "bar-close-panel", "bar-shop-panel", "bar-cabinet-panel"].some((id) => {
      const el = document.getElementById(id);
      return el && !el.classList.contains("hidden");
    });
  }

  function closePanels() {
    panel("mix-panel", false);
    panel("bar-shop-panel", false);
    panel("bar-cabinet-panel", false);
    hideOpenRules();
  }

  function onEsc() {
    if (rulesOpen()) {
      hideOpenRules();
      return true;
    }
    if (document.getElementById("bar-close-panel") && !document.getElementById("bar-close-panel").classList.contains("hidden")) {
      finishClose();
      return true;
    }
    if (anyPanel()) {
      closePanels();
      mixing = false;
      return true;
    }
    return false;
  }

  function refreshHud() {
    const gold = document.getElementById("hud-gold");
    if (gold) gold.textContent = wallet + "G";
    const chip = document.getElementById("hud-bar");
    if (chip) chip.classList.add("hidden");
    const rulesBtn = document.getElementById("bar-rules-btn");
    if (rulesBtn) {
      const room = api && api.getRoom ? api.getRoom() : null;
      rulesBtn.classList.toggle("hidden", !room || room.id !== "bar");
    }
    const exitBtn = document.getElementById("bar-exit-btn");
    if (exitBtn) {
      const room = api && api.getRoom ? api.getRoom() : null;
      exitBtn.classList.toggle("hidden", !open || !room || room.id !== "bar");
    }
  }

  function syncItems(room) {
    if (!room || room.id !== "bar") return;
    for (const it of room.items) {
      if (it.kind === "openSign") it.open = open;
      if (it.kind === "doorLamp") it.on = open;
      if (it.kind === "coinJar") it.level = jarLevel();
      if (it.kind === "souvenirCabinet") it.count = souvenirs.length;
      if (it.kind === "shaker") {
        it.busy = mixing;
        it.t = mixT;
      }
      if (it.kind === "washTub") it.cups = dirty > 0;
    }
  }

  function waiting() {
    return guests.filter((g) => g.state === "wait");
  }

  function freeSeat() {
    const used = new Set(guests.map((g) => g.seat));
    return SEATS.find((s) => !used.has(s.id));
  }

  function pickTrait() {
    let list = TRAITS.slice();
    if (special && special.bias) {
      list = list.map((t) => (t.id === special.bias ? Object.assign({}, t, { w: t.w * 3.2 }) : t));
    }
    const sum = list.reduce((n, t) => n + t.w, 0);
    let r = Math.random() * sum;
    for (const t of list) {
      r -= t.w;
      if (r <= 0) return t;
    }
    return list[0];
  }

  function pickOrder(trait) {
    if (trait.id === "weird") {
      return { id: "weirdMix", name: "草莓、咖啡、柠檬", icon: "🧪", price: 36, tags: ["drink"], ings: ["strawberry", "coffee", "lemon"] };
    }
    return pick(menuAll());
  }

  function spawnGuest() {
    if (!open || guests.length >= MAX_GUESTS) return;
    const seat = freeSeat();
    if (!seat) return;
    const trait = pickTrait();
    const order = pickOrder(trait);
    guests.push({
      id: gid++,
      trait: trait.id,
      patience: trait.patience * (0.88 + Math.random() * 0.22),
      orderId: order.id,
      orderName: order.name,
      orderIcon: order.icon,
      orderPrice: order.price,
      orderTags: order.tags || [],
      x: DOOR.x,
      y: DOOR.y,
      dir: "left",
      moving: true,
      pose: "stand",
      seat: seat.id,
      seatLabel: seat.label,
      tx: seat.x,
      ty: seat.y,
      tdir: seat.dir,
      state: "enter",
      wait: 0,
      mood: "ok",
      changed: false,
      chatT: 0,
      chat: "",
      hair: pick(HAIRS),
      shirt: pick(SHIRTS),
      skin: pick(SKINS),
      sweat: false,
      held: null,
      sipT: 0,
      pay: 0,
      tip: 0,
    });
    session.spawned++;
    if (trait.id === "weird") say("别看我，我也不知道他为什么要喝这个。");
  }

  function nextSpawn() {
    const n = session.spawned;
    let ms = n === 0 ? 700 : 9000;
    if (upgrades.neon) ms *= 0.78;
    return ms;
  }

  function moveTo(ent, x, y, dt, speed) {
    const dx = x - ent.x;
    const dy = y - ent.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 1.7) {
      ent.x = x;
      ent.y = y;
      ent.moving = false;
      return true;
    }
    ent.moving = true;
    const sp = speed * (dt / 16.67);
    ent.x += (dx / dist) * sp;
    ent.y += (dy / dist) * sp;
    if (Math.abs(dx) > Math.abs(dy)) ent.dir = dx > 0 ? "right" : "left";
    else ent.dir = dy > 0 ? "down" : "up";
    return false;
  }

  function waitMood(g) {
    const r = g.wait / g.patience;
    if (r > 0.68) return "mad";
    if (r > 0.38) return "ok";
    return "ok";
  }

  function moodFace(mood) {
    if (mood === "happy") return "😊";
    if (mood === "mad") return "😡";
    return "😐";
  }

  function drinkMatches(g, item) {
    if (!item) return false;
    if (g.trait === "easy") return true;
    if (g.orderId === "weirdMix") return !!item.weird;
    return item.id === g.orderId;
  }

  function gradeOf(item) {
    if (!item) return "wrong";
    if (item.weird) return "perfect";
    if (item.grade) return item.grade;
    return item.type === "snack" ? "perfect" : "ok";
  }

  function applySpecialGold(item, pay) {
    if (!special || !item) return pay;
    if (special.drink && item.id === special.drink) return Math.round(pay * (special.gold || 1));
    if (special.tag && (item.tags || []).includes(special.tag)) return Math.round(pay * (special.gold || 1));
    if (special.snack && item.type === "snack") return Math.round(pay * (special.gold || 1));
    return pay;
  }

  function tipChance(g, item, fast, perfect) {
    let p = 0;
    if (perfect) p += 0.42;
    if (fast) p += 0.28;
    if (upgrades.glasses && perfect) p += 0.22;
    if (special && special.tag && (item.tags || []).includes(special.tag)) p += 0.18;
    if (special && special.tip && (item.tags || []).includes("sweet")) p += 0.12;
    return p;
  }

  function serveGuest(g, item, fromNpc) {
    if (!g || g.state !== "wait" || !item) return false;
    const waitRatio = g.wait / g.patience;
    const fast = waitRatio < 0.38;
    const correct = drinkMatches(g, item);
    const perfect = correct && (g.trait === "easy" || g.orderId === "weirdMix" || gradeOf(item) === "perfect");
    let mood = "ok";
    let pay = 12;
    if (g.trait === "easy") {
      mood = waitRatio > 0.72 ? "ok" : "happy";
      pay = Math.round((item.price || 24) * (correct ? 1 : 0.72));
    } else if (g.trait === "picky") {
      if (perfect && waitRatio < 0.55) {
        mood = "happy";
        pay = item.price || 40;
      } else if (correct) {
        mood = waitRatio > 0.6 ? "mad" : "ok";
        pay = Math.round((item.price || 40) * 0.7);
      } else {
        mood = "mad";
        pay = 8;
      }
    } else if (!correct) {
      mood = "mad";
      pay = 10;
      if (!fromNpc) say("……这不是他点的。");
    } else if (perfect && fast) {
      mood = "happy";
      pay = item.price || 40;
    } else if (waitRatio > 0.7) {
      mood = g.trait === "impatient" ? "mad" : "ok";
      pay = Math.round((item.price || 40) * 0.62);
    } else {
      mood = "ok";
      pay = Math.round((item.price || 40) * (perfect ? 1 : 0.82));
    }

    pay = applySpecialGold(item, pay);
    if (upgrades.tipjar) pay += 4;
    if (item.uneasy && !item.weird) pay = Math.min(pay, 12);

    let tip = 0;
    if (mood !== "mad" && Math.random() < tipChance(g, item, fast, perfect)) {
      tip = 8 + ((Math.random() * 16) | 0);
      if (special && special.tip && (item.tags || []).includes("sweet")) tip = Math.round(tip * 1.5);
    }

    if (perfect) session.perfect++;
    if (!correct || item.uneasy) session.wrong++;
    session.guests++;
    session.gold += pay;
    session.tip += tip;
    wallet += pay + tip;
    if (api && api.onWallet) api.onWallet(wallet);

    g.mood = mood;
    g.held = item;
    g.state = "sip";
    g.sipT = 900;
    g.pay = pay;
    g.tip = tip;
    g.perfect = perfect;
    dirty++;
    if (fromNpc) delivers++;
    if (!correct && item.uneasy) toast("他喝了一口：“……”");
    else if (perfect) sparkleAt(g.x + 8, g.y + 4);
    maybeSouvenir(g, perfect, fast);
    refreshHud();
    save();
    return true;
  }

  function sparkleAt(x, y) {
    if (!api || !api.addParticle) return;
    for (let i = 0; i < 8; i++) {
      api.addParticle({
        x: x + Math.random() * 8,
        y: y + Math.random() * 6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.25,
        life: 28,
        color: pick(["#fff8c8", "#ffe878", "#e8c878"]),
        size: 1,
      });
    }
  }

  function maybeSouvenir(g, perfect, fast) {
    let p = 0.05;
    if (perfect) p += 0.07;
    if (fast) p += 0.03;
    if (upgrades.lucky) p *= 2;
    if (Math.random() > p) return;
    if (souvenirs.length >= capSouvenirs()) {
      toast("展示柜满了");
      return;
    }
    const s = pick(SOUVENIRS);
    souvenirs.push({ id: s.id, name: s.name, icon: s.icon });
    toast("客人留下了" + s.icon + s.name);
  }

  function leaveGuest(g, paid) {
    g.state = "leave";
    g.pose = "stand";
    g.tx = DOOR.x;
    g.ty = DOOR.y;
    g.held = null;
    if (!paid) {
      g.mood = "mad";
      session.wrong++;
    }
  }

  function playerNear(x, y, dist) {
    const p = api && api.getPlayer ? api.getPlayer() : null;
    if (!p) return false;
    return Math.hypot(p.x + 8 - x, p.y + 14 - y) < dist;
  }

  function playerBehindBar() {
    const p = api && api.getPlayer ? api.getPlayer() : null;
    if (!p) return false;
    return p.y < 3.35 * T && p.x > 3 * T && p.x < 15.5 * T;
  }

  function nearestWait(from) {
    let best = null;
    let d = Infinity;
    for (const g of waiting()) {
      const n = Math.hypot((from ? from.x : 0) - g.x, (from ? from.y : 0) - g.y);
      if (n < d) {
        d = n;
        best = g;
      }
    }
    return best;
  }

  function guestWanting(item) {
    return waiting().find((g) => drinkMatches(g, item)) || null;
  }

  function makeCorrect(g) {
    if (g.orderId === "weirdMix") {
      return {
        id: "uneasy",
        name: "一种令人不安的液体。",
        icon: "🧪",
        cup: "tall",
        color: "#6a8850",
        price: 36,
        tags: ["drink"],
        weird: true,
        uneasy: true,
        grade: "perfect",
      };
    }
    const rec = menuAll().find((r) => r.id === g.orderId);
    if (!rec) return null;
    return Object.assign({ grade: "perfect" }, rec);
  }

  function finishMix() {
    mixing = false;
    const ings = mix.ings.slice();
    const cup = mix.cup;
    mix = { cup: null, ings: [] };
    renderMix();
    panel("mix-panel", false);
    mixes++;
    let item = null;
    const rec = findDrink(ings);
    if (isWeirdMix(ings)) {
      toast("一种令人不安的液体。");
      item = {
        id: "uneasy",
        name: "一种令人不安的液体。",
        icon: "🧪",
        cup: cup || "tall",
        color: "#6a8850",
        price: 12,
        tags: ["drink"],
        weird: true,
        uneasy: true,
        grade: "perfect",
      };
    } else if (rec) {
      const perfect = cup === rec.cup;
      toast(perfect ? "✨ Perfect!" : rec.name);
      item = Object.assign({ grade: perfect ? "perfect" : "ok", uneasy: false }, rec);
    } else {
      toast("一种令人不安的液体。");
      item = {
        id: "uneasy",
        name: "一种令人不安的液体。",
        icon: "🧪",
        cup: cup || "tall",
        color: "#7a8a40",
        price: 10,
        tags: ["drink"],
        weird: false,
        uneasy: true,
        grade: "wrong",
      };
    }
    if (held) pass = held;
    held = item;
    stealT = 0;
    refreshHud();
    save();
  }

  function grabSnack(rec) {
    panel("mix-panel", false);
    const item = Object.assign({ grade: "perfect", type: "snack" }, rec);
    if (held) pass = held;
    held = item;
    toast(rec.icon + rec.name);
    refreshHud();
  }

  function quickMake(rec) {
    panel("mix-panel", false);
    const item = Object.assign({ grade: "perfect", uneasy: false }, rec);
    if (held) pass = held;
    held = item;
    mixes++;
    toast("做好了：" + rec.icon + rec.name);
    refreshHud();
    save();
  }

  function shake() {
    if (!open) return;
    if (mixing) return;
    if (!mix.cup) {
      toast("先选杯子");
      return;
    }
    if (!mix.ings.length) {
      toast("里面是空气。");
      return;
    }
    mixing = true;
    mixT = 0;
    mixNeed = mixDuration();
    renderMix();
  }

  function dumpMix() {
    mixing = false;
    mix = { cup: null, ings: [] };
    renderMix();
  }

  function renderMix() {
    const cups = document.getElementById("mix-cups");
    const snacks = document.getElementById("mix-snacks");
    if (!cups) return;
    cups.innerHTML = "";
    menuDrinks().forEach((drink) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = drink.icon + drink.name;
      b.addEventListener("click", () => quickMake(drink));
      cups.appendChild(b);
    });
    snacks.innerHTML = "";
    menuSnacks().forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = s.icon + s.name;
      b.disabled = mixing;
      b.addEventListener("click", () => grabSnack(s));
      snacks.appendChild(b);
    });
  }

  function openMix() {
    if (!open) {
      toast("打烊了，先翻那个牌子。");
      return;
    }
    if (held && !pass) {
      pass = held;
      held = null;
      toast("先放到台上");
      refreshHud();
    }
    mix = { cup: mix.cup, ings: mix.ings.slice() };
    panel("bar-shop-panel", false);
    panel("bar-cabinet-panel", false);
    panel("mix-panel", true);
    renderMix();
  }

  function renderShop() {
    const body = document.getElementById("bar-shop-body");
    if (!body) return;
    const menu = menuAll()
      .map((r) => `<div class="bar-row">${r.icon} ${r.name}　${r.price}G</div>`)
      .join("");
    const ups = UPGRADES.map((u) => {
      const owned = !!upgrades[u.id];
      return `<button type="button" class="bar-buy${owned ? " on" : ""}" data-up="${u.id}" ${owned ? "disabled" : ""}>${owned ? "已有 · " : wallet < u.cost ? "" : ""}${u.name}　${owned ? "✓" : u.cost + "G"}<span class="tiny">${u.desc}</span></button>`;
    }).join("");
    body.innerHTML = `<p class="panel-label">菜单</p>${menu}<p class="panel-label">升级</p><p class="tiny">钱包 ${wallet}G</p><div id="bar-up-list">${ups}</div>`;
    body.querySelectorAll("[data-up]").forEach((btn) => {
      btn.addEventListener("click", () => buyUpgrade(btn.dataset.up));
    });
  }

  function buyUpgrade(id) {
    const u = UPGRADES.find((x) => x.id === id);
    if (!u || upgrades[id]) return;
    if (wallet < u.cost) {
      toast("不够。");
      return;
    }
    wallet -= u.cost;
    upgrades[id] = true;
    if (api && api.onWallet) api.onWallet(wallet);
    toast("买下了" + u.name);
    renderShop();
    refreshHud();
    save();
  }

  function renderCabinet() {
    const grid = document.getElementById("bar-cabinet-grid");
    if (!grid) return;
    if (!souvenirs.length) {
      grid.innerHTML = `<p class="tiny">还是空的。营业久了，客人会留下奇怪的小东西。</p>`;
      return;
    }
    grid.innerHTML = souvenirs.map((s) => `<div class="souv">${s.icon}<div>${s.name}</div></div>`).join("");
  }

  function openShop() {
    closePanels();
    panel("bar-shop-panel", true);
    renderShop();
  }

  function openCabinet() {
    closePanels();
    panel("bar-cabinet-panel", true);
    renderCabinet();
  }

  function startShift() {
    if (open) return;
    closePanels();
    open = true;
    guests = [];
    held = null;
    pass = null;
    npcHeld = null;
    npcJob = { type: "idle" };
    mixing = false;
    dirty = 0;
    stealT = 0;
    shoutCD = 800;
    spawnCD = 400;
    session = emptySession();
    special = pick(SPECIALS);
    const npc = api.getNpc && api.getNpc();
    if (npc) {
      npc.x = BEHIND.x;
      npc.y = BEHIND.y;
      npc.dir = "down";
      npc.pose = "stand";
      npc.moving = false;
    }
    toast("门口的小灯亮了");
    say(special.text);
    refreshHud();
    const room = api.getRoom && api.getRoom();
    syncItems(room);
  }

  function closeLine() {
    if (session.guests === 0) return "……我们开了个寂寞。";
    if (session.wrong >= 5 || session.gold < 40) return "你负责关门，我负责失忆。";
    if (session.wrong >= 3 || session.gold < 120) return "明天我们假装今天没开过。";
    if (session.perfect >= Math.max(3, session.guests * 0.55) && session.wrong === 0) return "今天居然一个杯子都没摔。";
    return "能赚钱就算成功。";
  }

  function endShift() {
    if (!open) return;
    open = false;
    guests = [];
    held = null;
    pass = null;
    npcHeld = null;
    npcJob = { type: "idle" };
    mixing = false;
    closePanels();
    const npc = api.getNpc && api.getNpc();
    const spot = (typeof World !== "undefined" && World.NPC_SPOTS.bar) || { x: 10.4 * T, y: 5.35 * T, dir: "down" };
    if (npc) {
      npc.x = spot.x;
      npc.y = spot.y;
      npc.dir = spot.dir;
      npc.pose = "stand";
      npc.moving = false;
    }
    const stats = document.getElementById("bar-close-stats");
    if (stats) {
      stats.innerHTML = `
        <div>客人：${session.guests}</div>
        <div>Perfect饮料：${session.perfect}</div>
        <div>做错：${session.wrong}</div>
        <div>收入：${session.gold}G</div>
        <div>小费：${session.tip}G</div>`;
    }
    const line = document.getElementById("bar-close-line");
    if (line) line.textContent = closeLine();
    panel("bar-close-panel", true);
    refreshHud();
    const room = api.getRoom && api.getRoom();
    syncItems(room);
    save();
  }

  function finishClose() {
    panel("bar-close-panel", false);
  }

  function toggleSign() {
    if (open) endShift();
    else showOpenRules();
  }

  function tryPickupPass() {
    if (!pass) return false;
    if (held) {
      const tmp = held;
      held = pass;
      pass = tmp;
      toast("换一手");
    } else {
      held = pass;
      pass = null;
      toast("端起来");
    }
    refreshHud();
    return true;
  }

  function tryServe() {
    if (!open || !held) return false;
    const p = api.getPlayer();
    let best = null;
    let d = 34;
    for (const g of waiting()) {
      const n = Math.hypot(p.x + 8 - (g.x + 8), p.y + 14 - (g.y + 12));
      if (n < d) {
        d = n;
        best = g;
      }
    }
    if (!best) return false;
    const item = held;
    held = null;
    serveGuest(best, item, false);
    refreshHud();
    return true;
  }

  function tryClick(wx, wy) {
    if (!open) return false;
    for (const g of guests) {
      if (wx >= g.x && wx <= g.x + 16 && wy >= g.y && wy <= g.y + 22) {
        if (held && g.state === "wait" && playerNear(g.x + 8, g.y + 12, 36)) {
          const item = held;
          held = null;
          serveGuest(g, item, false);
          refreshHud();
          return true;
        }
      }
    }
    if (pass && wx >= PASS.x - 2 && wx <= PASS.x + 14 && wy >= PASS.y - 2 && wy <= PASS.y + 16) {
      if (playerNear(PASS.x, PASS.y, 40)) return tryPickupPass();
    }
    return false;
  }

  function handle(kind, item) {
    if (kind === "barSign") {
      toggleSign();
      return true;
    }
    if (kind === "barMix") {
      if (open && pass && !held && item && item.kind !== "shaker" && playerNear(PASS.x, PASS.y, 26)) {
        return tryPickupPass();
      }
      openMix();
      return true;
    }
    if (kind === "barBoard") {
      openShop();
      return true;
    }
    if (kind === "barCabinet") {
      openCabinet();
      return true;
    }
    if (kind === "barJar") {
      toast(`钱包里有 ${wallet}G`);
      return true;
    }
    if (kind === "barWash") {
      if (!open) toast("杯子是干净的。");
      else if (dirty <= 0) toast("没有脏杯子。");
      else {
        dirty = 0;
        toast("洗干净了");
      }
      return true;
    }
    if (kind === "barBottles") {
      toast(pick(["亮晶晶的。", "不要直接喝瓶里的。", "17 把高的放上面了。"]));
      return true;
    }
    if (kind === "barLamp") {
      toast(open ? "亮着。客人看得到。" : "开店以后它会自己亮。");
      return true;
    }
    if (kind === "barStool" || kind === "barSeat") {
      if (open) {
        toast("那是客人的位子。");
        return true;
      }
      if (api.sit) api.sit(item);
      return true;
    }
    return false;
  }

  function hint() {
    if (!api) return "";
    const room = api.getRoom && api.getRoom();
    if (!room || room.id !== "bar") return "";
    if (open && held) {
      const g = waiting().find((x) => playerNear(x.x + 8, x.y + 12, 28));
      if (g) return "按 E / 点击 上餐";
      return "手中：" + held.name;
    }
    if (open && pass && playerNear(PASS.x, PASS.y, 32)) return "按 E 把杯子端走";
    return "";
  }

  function maybeShout(dt) {
    shoutCD -= dt;
    if (shoutCD > 0) return;
    const waits = waiting();
    if (!waits.length) return;
    const rush = waits.length >= 3;
    const late = waits.filter((g) => g.wait / g.patience > 0.45);
    if (held && held.id === "latte") {
      const want = waits.find((g) => g.orderId !== "latte" && g.orderId !== "cocoa");
      if (want && playerNear(want.x + 8, want.y + 12, 40)) {
        say("你拿的是咖啡！");
        shoutCD = 3200;
        return;
      }
    }
    if ((held || pass) && ((held && held.id === "honeyLemon") || (pass && pass.id === "honeyLemon") || (held && held.id === "lemonSoda") || (pass && pass.id === "lemonSoda"))) {
      if (waits.some((g) => g.orderId === "honeyLemon" || g.orderId === "lemonSoda")) {
        say("那个柠檬好了！");
        shoutCD = 3000;
        return;
      }
    }
    if (late.length) {
      const g = late.sort((a, b) => b.wait - a.wait)[0];
      if (g.x < 7 * T) say("左边那个等半天了！");
      else say(g.seatLabel + "！");
      shoutCD = rush ? 2400 : 3800;
      return;
    }
    if (rush) {
      say(pick(["桌三！", "你负责调，我来端。", "算了我来！"]));
      shoutCD = 2800;
    }
  }

  function startDeliver(item, guest, rescue) {
    npcHeld = item;
    npcJob = { type: "deliver", guestId: guest.id, rescue: !!rescue };
  }

  function maybeSteal(dt, npc, player) {
    if (npcJob.type !== "idle" || npcHeld || !held) {
      stealT = 0;
      return;
    }
    const waits = waiting();
    if (!waits.length) {
      stealT = 0;
      return;
    }
    const atBar = player.y < 5.1 * T && player.x > 2.8 * T && player.x < 16 * T;
    if (!atBar) {
      stealT = 0;
      return;
    }
    const rush = waits.length >= 3;
    const need = rush ? 280 : waits.length >= 2 ? 650 : 1400;
    stealT += dt;
    if (stealT < need) return;
    stealT = 0;
    const item = held;
    held = null;
    const g = guestWanting(item) || nearestWait(npc);
    if (!g) {
      pass = item;
      return;
    }
    if (rush) say("你负责调，我来端。");
    startDeliver(item, g, false);
    refreshHud();
  }

  function maybeRescue(npc) {
    if (npcJob.type !== "idle" || npcHeld || held || pass || mixing) return;
    const waits = waiting();
    if (!waits.length) return;
    const late = waits
      .filter((g) => {
        const r = g.wait / g.patience;
        if (session.rescue >= 3) return r > 0.84;
        return r > 0.58 || g.wait > 9000;
      })
      .sort((a, b) => b.wait - a.wait)[0];
    if (!late) return;
    npcJob = { type: "rescue", guestId: late.id, t: 0 };
    const lines = ["我帮你一次。", "又是我。", "老板到底是谁？", "算了我来！"];
    say(lines[Math.min(session.rescue, lines.length - 1)]);
    session.rescue++;
  }

  function maybeWash(npc) {
    if (npcJob.type !== "idle" || dirty < 3 || waiting().length > 2) return;
    npcJob = { type: "wash", t: 0 };
  }

  function updateNpc(dt) {
    const npc = api.getNpc && api.getNpc();
    if (!npc || !open) return;
    const player = api.getPlayer();
    if (npcJob.type === "idle") {
      moveTo(npc, BEHIND.x, BEHIND.y, dt, npcSpeed() * 0.85);
      npc.dir = "down";
      maybeSteal(dt, npc, player);
      maybeRescue(npc);
      maybeWash(npc);
      maybeShout(dt);
      return;
    }
    if (npcJob.type === "rescue") {
      const g = guests.find((x) => x.id === npcJob.guestId && x.state === "wait");
      if (!g) {
        npcJob = { type: "return" };
        return;
      }
      if (!moveTo(npc, BEHIND.x + 18, BEHIND.y, dt, npcSpeed())) return;
      npcJob.t += dt;
      if (npcJob.t < 520) return;
      const item = makeCorrect(g);
      if (!item) {
        npcJob = { type: "return" };
        return;
      }
      startDeliver(item, g, true);
      return;
    }
    if (npcJob.type === "deliver") {
      const g = guests.find((x) => x.id === npcJob.guestId);
      if (!g || g.state !== "wait") {
        if (npcHeld && !held) held = npcHeld;
        else if (npcHeld) pass = npcHeld;
        npcHeld = null;
        npcJob = { type: "return" };
        refreshHud();
        return;
      }
      if (!moveTo(npc, g.x + 12, g.y + 2, dt, npcSpeed())) return;
      const item = npcHeld;
      npcHeld = null;
      serveGuest(g, item, true);
      npcJob = { type: "return" };
      refreshHud();
      return;
    }
    if (npcJob.type === "wash") {
      if (!moveTo(npc, WASH.x, WASH.y, dt, npcSpeed())) return;
      npcJob.t = (npcJob.t || 0) + dt;
      if (npcJob.t < 700) return;
      dirty = 0;
      npcJob = { type: "return" };
      return;
    }
    if (npcJob.type === "return") {
      if (moveTo(npc, BEHIND.x, BEHIND.y, dt, npcSpeed())) {
        npc.dir = "down";
        npcJob = { type: "idle" };
      }
    }
  }

  function updateGuests(dt) {
    for (let i = guests.length - 1; i >= 0; i--) {
      const g = guests[i];
      if (g.state === "enter") {
        if (moveTo(g, g.tx, g.ty, dt, 1.05)) {
          g.state = "wait";
          g.pose = "sit";
          g.dir = g.tdir || "up";
          g.wait = 0;
          if (g.trait === "indecisive") g.changeAt = 4200 + Math.random() * 1800;
        }
        continue;
      }
      if (g.state === "wait") {
        g.wait += dt;
        g.mood = waitMood(g);
        g.sweat = g.trait === "impatient" && g.wait / g.patience > 0.32;
        if (g.trait === "indecisive" && !g.changed && g.wait > (g.changeAt || 5000)) {
          g.changed = true;
          const next = pick(menuAll().filter((r) => r.id !== g.orderId));
          if (next) {
            g.orderId = next.id;
            g.orderName = next.name;
            g.orderIcon = next.icon;
            g.orderPrice = next.price;
            g.orderTags = next.tags || [];
            say("他又改了。");
          }
        }
        if (g.trait === "talkative") {
          g.chatT -= dt;
          if (g.chatT <= 0) {
            g.chat = pick(TALKS);
            g.chatT = 2800;
          }
        }
        if (g.wait >= g.patience) {
          leaveGuest(g, false);
        }
        continue;
      }
      if (g.state === "sip") {
        g.sipT -= dt;
        if (g.sipT <= 0) leaveGuest(g, true);
        continue;
      }
      if (g.state === "leave") {
        g.pose = "stand";
        if (moveTo(g, DOOR.x, DOOR.y, dt, 1.2)) guests.splice(i, 1);
      }
    }
  }

  function update(dt, room) {
    if (room && room.id === "bar") syncItems(room);
    if (!open) {
      refreshHud();
      return;
    }
    if (document.getElementById("bar-close-panel") && !document.getElementById("bar-close-panel").classList.contains("hidden")) return;
    session.t += dt;
    if (mixing) {
      mixT += dt;
      if (mixT >= mixNeed) finishMix();
    }
    spawnCD -= dt;
    if (spawnCD <= 0) {
      spawnGuest();
      spawnCD = nextSpawn();
    }
    updateGuests(dt);
    updateNpc(dt);
    refreshHud();
  }

  function drawables(v, time) {
    const list = [];
    for (const g of guests) {
      list.push({
        y: g.y + (g.pose === "sit" ? 18 : 22),
        draw() {
          Art.drawGuest(v, g, time);
          if (g.held) {
            if (g.held.type === "snack") Art.snackPlate(v, g.x + 10, g.y + 8, g.held.id);
            else Art.drinkCup(v, g.x + 11, g.y + 7, g.held);
          }
            if (g.state === "wait") {
              Art.orderBubble(v, g.x + 8, g.y, g.orderIcon, moodFace(g.mood));
            }
        },
      });
    }
    if (pass) {
      list.push({
        y: PASS.y + 16,
        draw() {
          if (pass.type === "snack") Art.snackPlate(v, PASS.x, PASS.y, pass.id);
          else Art.drinkCup(v, PASS.x, PASS.y, pass);
        },
      });
    }
    return list;
  }

  function drawHeld(v, who, ent) {
    const item = who === "player" ? held : who === "npc" ? npcHeld : null;
    if (!item) return;
    const x = ent.x + 10;
    const y = ent.y + 8;
    if (item.type === "snack") Art.snackPlate(v, x, y, item.id);
    else Art.drinkCup(v, x, y, item);
  }

  function guestsList() {
    return guests;
  }

  function heldItem() {
    return held;
  }

  function npcHeldItem() {
    return npcHeld;
  }

  function specialText() {
    return special ? special.text : "";
  }

  function bind(fns) {
    api = fns;
    if (bound) return;
    bound = true;
    const shakeBtn = document.getElementById("mix-shake");
    if (shakeBtn) shakeBtn.addEventListener("click", shake);
    const dumpBtn = document.getElementById("mix-dump");
    if (dumpBtn) dumpBtn.addEventListener("click", dumpMix);
    const recBtn = document.getElementById("mix-rec-btn");
    if (recBtn) {
      recBtn.addEventListener("click", () => {
        showRecipes = !showRecipes;
        renderMix();
      });
    }
    const ok = document.getElementById("bar-close-ok");
    if (ok) ok.addEventListener("click", finishClose);
    const rulesOk = document.getElementById("bar-rules-ok");
    if (rulesOk) rulesOk.addEventListener("click", confirmOpen);
    const rulesBtn = document.getElementById("bar-rules-btn");
    if (rulesBtn) rulesBtn.addEventListener("click", showOpenRules);
    const exitBtn = document.getElementById("bar-exit-btn");
    if (exitBtn) exitBtn.addEventListener("click", endShift);
  }

  return {
    load,
    serialize,
    get wallet() {
      return wallet;
    },
    set wallet(v) {
      wallet = v;
    },
    isOpen,
    anyPanel,
    closePanels,
    onEsc,
    update,
    drawables,
    drawHeld,
    handle,
    tryServe,
    tryClick,
    hint,
    bind,
    refreshHud,
    guests: guestsList,
    held: heldItem,
    npcHeld: npcHeldItem,
    specialText,
    startShift,
    endShift,
    confirmRulesKey,
  };
})();
