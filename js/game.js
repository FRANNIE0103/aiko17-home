/* Aiko&17的家 */
(() => {
  const GIFT = { npcName: "17", playerName: "Aiko" };
  const TILE = Art.TILE;
  const VIEW_W = 320;
  const VIEW_H = 180;
  const PER_PAGE = 3;
  const STORE = "hujin-home-v1";
  const TABLE = { x: 8.35 * TILE, y: 4.55 * TILE };

  const canvas = document.getElementById("game");
  const aikoCharacter = document.getElementById("aiko-character");
  const seventeenCharacter = document.getElementById("seventeen-character");
  const husbandCharacter = document.getElementById("husband-character");
  const petCharacter = document.getElementById("pet-character");
  const bgm = document.getElementById("bgm");
  const gameControls = document.getElementById("game-controls");
  const pauseBtn = document.getElementById("pause-btn");
  const pauseOverlay = document.getElementById("pause-overlay");
  const volumeBtn = document.getElementById("volume-btn");
  const volumePanel = document.getElementById("volume-panel");
  const muteBtn = document.getElementById("mute-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const screenshotBtn = document.getElementById("screenshot-btn");
  const banquetExitBtn = document.getElementById("banquet-exit-btn");
  const doorGuides = document.getElementById("door-guides");
  const ctx = canvas.getContext("2d");
  const view = Art.makeCanvas(VIEW_W, VIEW_H);
  const v = view.ctx;

  const hudRoom = document.getElementById("hud-room");
  const banner = document.getElementById("room-banner");
  const bannerText = document.getElementById("room-banner-text");
  const titleScreen = document.getElementById("title-screen");
  const rulesScreen = document.getElementById("rules-screen");
  const startBtn = document.getElementById("start-btn");
  const rulesOk = document.getElementById("rules-ok");
  const interactHint = document.getElementById("interact-hint");
  const talkBox = document.getElementById("talk-box");
  const talkName = document.getElementById("talk-name");
  const talkText = document.getElementById("talk-text");
  const profileBtn = document.getElementById("profile-btn");
  const mapBtn = document.getElementById("map-btn");
  const areaGuideBtn = document.getElementById("area-guide-btn");
  const profilePanel = document.getElementById("profile-panel");
  const mapPanel = document.getElementById("map-panel");
  const areaGuidePanel = document.getElementById("area-guide-panel");
  const areaGuideTitle = document.getElementById("area-guide-title");
  const areaGuideList = document.getElementById("area-guide-list");
  const bookPanel = document.getElementById("book-panel");
  const tvPanel = document.getElementById("tv-panel");
  const menuPanel = document.getElementById("menu-panel");
  const fridgePanel = document.getElementById("fridge-panel");
  const chipsPanel = document.getElementById("chips-panel");
  const choicePanel = document.getElementById("choice-panel");
  const arcadeOverlay = document.getElementById("arcade-overlay");
  const arcadeCanvas = document.getElementById("arcade-canvas");
  const arcadeHud = document.getElementById("arcade-hud");
  const arcadeCtx = arcadeCanvas ? arcadeCanvas.getContext("2d") : null;
  const chipLabel = document.getElementById("chip-label");
  const marshLabel = document.getElementById("marsh-label");
  const actionToast = document.getElementById("action-toast");
  const npcToastEl = document.getElementById("npc-toast");
  const npcToastText = document.getElementById("npc-toast-text");
  const roomTip = document.getElementById("room-tip");
  const banquetCaption = document.getElementById("banquet-caption");
  const wishOverlay = document.getElementById("wish-overlay");
  const wishCount = document.getElementById("wish-count");
  const wishTab = document.getElementById("wish-tab");
  const bdaySong = document.getElementById("bday-song");
  const bookPages = document.getElementById("book-pages");
  const bookInd = document.getElementById("book-page-ind");
  const bookInput = document.getElementById("book-input");
  const husbandFollowEl = document.getElementById("husband-follow");
  const petFollowEl = document.getElementById("pet-follow");

  const keys = new Set();
  const player = {
    x: 10.4 * TILE,
    y: 8.6 * TILE,
    w: 16,
    h: 22,
    dir: "down",
    moving: false,
    pose: "stand",
    hx: 3,
    hy: 16,
    hw: 10,
    hh: 5,
  };

  const cam = { x: 0, y: 0 };
  let room = World.rooms.garden;

  const AREA_INTERACTIONS = {
    garden: ["雕像与喷泉", "花丛与蒲公英", "浇水壶与菜圃", "秋千、吊床和长椅", "野餐篮与工具箱", "宠物窝与草地午睡"],
    living: ["壁炉、窗帘与灯", "沙发和抱枕", "茶几上的零食与杯子", "电视和留言簿", "书架、相框与植物", "柜子和垃圾桶"],
    upperHall: ["下楼回到客房", "Aiko 的卧室", "17 的卧室", "宠物房", "墙上的合照与走廊灯"],
    herBed: ["床铺", "梳妆台上的 iPad", "房间里的摆设"],
    myBed: ["床铺", "房间里的摆设"],
    bath: ["门锁、浴缸与橡皮鸭", "镜子、洗手池与牙刷杯", "马桶、盖子与卫生纸", "喷雾、毛巾和洗衣篮", "体重秤与浴室柜"],
    guest: ["房间下方的上楼入口", "门牌与墙上钥匙", "床、枕头和拖鞋", "床头柜、台灯与杯子", "镜子和衣柜", "书桌与留言簿", "零食篮和小冰箱"],
    movie: ["投影屏、遥控器与 DVD 架", "窗帘与电影灯", "沙发、懒人椅和抱枕", "两只杯子", "爆米花机与零食柜"],
    game: ["街机与双人街机", "扭蛋机和抓娃娃机", "沙袋与拳击机", "投篮机与跳舞毯", "豆袋沙发、零食架和小冰箱"],
    kitchen: ["冰箱与冰箱便签", "生日宴餐桌", "幸福黄油薯片"],
    pet: ["棉花、糖糖和 Marshmallow", "黑板：开始抢玩具", "沙发、猫爬架与玩具篮", "纸箱、隧道与宠物窝"],
    bar: ["营业牌：营业或打烊", "调酒台：制作饮品和小吃", "黑板：菜单与升级", "展示柜与钱罐", "洗杯池、酒瓶与门灯", "座椅；营业时也可给客人上餐"],
  };
  let mode = "title";
  let fade = 0;
  let fadeDir = 0;
  let doorReady = true;
  let pendingRoom = null;
  let pendingSpawn = null;
  let time = 0;
  let paused = false;
  let gameMuted = false;
  let gameVolume = 0.32;
  let pausedBgmWasPlaying = false;
  let pausedBirthdayWasPlaying = false;
  let last = 0;
  let blinkT = 0;
  let talking = false;
  let talkLines = [];
  let talkI = 0;
  let bookPage = 0;
  const particles = [];
  const trail = [];

  const PINNED = {
    author: "17",
    text: "Aiko，该续火花啦",
    ts: Date.parse("2026-08-23T21:17:00"),
    pinned: true,
  };

  const saved = loadStore();
  const profile = Object.assign(
    {
      hair: "black",
      outfit: "blackDress",
      husband: "jk",
      husbandFollow: false,
      pet: "cotton",
      petFollow: false,
    },
    saved.profile || {}
  );
  if (profile.characterArt !== "signature-v2") {
    profile.hair = "black";
    profile.outfit = "blackDress";
    profile.characterArt = "signature-v2";
  }
  let notes = saved.notes && saved.notes.length ? saved.notes : [PINNED];
  if (!notes.some((n) => n.pinned)) notes = [PINNED, ...notes];
  notes.forEach((n) => {
    if (n.pinned) n.text = n.text.replace(/kyk/g, GIFT.playerName);
    if (n.author === "kyk") n.author = GIFT.playerName;
  });
  Bar.load(saved.bar, saved.wallet || 0);

  const husband = { x: 0, y: 0, dir: "down", moving: false, pose: "stand" };
  const followPet = { x: 0, y: 0, dir: "down", moving: false };
  let banquet = null;
  let talkThen = null;
  const ducks = [];
  let sofaJoinT = 0;
  let sofaTalked = false;
  let fireComfortCD = 0;
  let plantYank = 0;
  let lampFlips = 0;
  let lampFlipAge = 0;
  let toastT = 0;
  let npcToastT = 0;
  let pillow = { mode: "idle", t: 0, x: 0, y: 0, vx: 0, vy: 0, held: null, color: "#e8a0b0", smash: false, hitNpc: false };
  let bathLocked = false;
  let lockToastCD = 0;
  let bathFog = 0;
  let flushCount = 0;
  let lidFlips = 0;
  let lidFlipAge = 0;
  let duckSpam = 0;
  let duckSpamAge = 0;
  let remoteAnnoy = 0;
  let movieLightFlips = 0;
  let movieLightAge = 0;
  let shadePulls = 0;
  let shadePullAge = 0;
  let scaleAnim = null;
  let sfxCtx = null;
  let arcade = null;
  let npcWalk = null;
  let gardenPet = null;
  let guestBedUses = 0;
  let hoopMiss = 0;

  Art.rebuildPlayer(profile.hair, profile.outfit);

  const NPC_LINES = {
    garden: [{ name: "17", text: "你来啦" }],
    herBed: [{ name: "Aiko", text: "请问这位朋友，你在我房间干什么呢" }, { name: "17", text: "哦吼～" }],
    living: [{ name: "17", text: "四处看看吧" }],
    upperHall: [{ name: "17", text: "左边是 Aiko 的房间，右边是我的" }],
    movie: [{ name: "17", text: "我要看恐怖片" }, { name: "Aiko", text: "不要，我害怕" }],
    bath: [{ name: "Aiko", text: "这些小黄鸭是怎么回事呢" }, { name: "17", text: "哦吼～" }],
    kitchen: [{ name: "17", text: "喜欢我的合唱团吗" }],
    game: [{ name: "17", text: "今天先玩哪个呢" }],
    pet: [{ name: "17", text: "来比个赛吧～" }],
    bar: [{ name: "17", text: "赚钱养家了" }],
    guest: [{ name: "17", text: "这间房间先给谁住呢" }],
    myBed: [{ name: "17", text: "你来我的房间干嘛" }],
    later: [{ name: "17", text: "四处看看吧" }],
  };

  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "{}");
    } catch {
      return {};
    }
  }

  function saveStore() {
    localStorage.setItem(STORE, JSON.stringify({ profile, notes, wallet: Bar.wallet, bar: Bar.serialize() }));
  }

  function busy() {
    return talking || uiOpen() || fadeDir !== 0 || !!banquet || PetPlay.isBusy();
  }

  function uiOpen() {
    return (
      !profilePanel.classList.contains("hidden") ||
      !bookPanel.classList.contains("hidden") ||
      !tvPanel.classList.contains("hidden") ||
      !mapPanel.classList.contains("hidden") ||
      !menuPanel.classList.contains("hidden") ||
      !fridgePanel.classList.contains("hidden") ||
      !chipsPanel.classList.contains("hidden") ||
      !choicePanel.classList.contains("hidden") ||
      (arcadeOverlay && !arcadeOverlay.classList.contains("hidden")) ||
      Bar.anyPanel() ||
      (document.getElementById("bar-close-panel") && !document.getElementById("bar-close-panel").classList.contains("hidden"))
    );
  }

  function closePanels() {
    profilePanel.classList.add("hidden");
    bookPanel.classList.add("hidden");
    tvPanel.classList.add("hidden");
    mapPanel.classList.add("hidden");
    areaGuidePanel.classList.add("hidden");
    menuPanel.classList.add("hidden");
    fridgePanel.classList.add("hidden");
    chipsPanel.classList.add("hidden");
    choicePanel.classList.add("hidden");
    Bar.closePanels();
  }

  function showBanner(name) {
    bannerText.textContent = name;
    banner.classList.remove("hidden");
    banner.style.animation = "none";
    void banner.offsetWidth;
    banner.style.animation = "";
    setTimeout(() => banner.classList.add("hidden"), 2800);
  }

  function renderAreaGuide() {
    const entries = AREA_INTERACTIONS[room.id] || ["这个区域暂时没有特别的互动点"];
    areaGuideTitle.textContent = hudRoom.textContent + " · 可互动位置";
    areaGuideList.innerHTML = entries.map((text) => `<div class="area-guide-item">${text}</div>`).join("");
  }

  function openAreaGuide() {
    if (!areaGuidePanel.classList.contains("hidden")) {
      areaGuidePanel.classList.add("hidden");
      return;
    }
    closePanels();
    renderAreaGuide();
    areaGuidePanel.classList.remove("hidden");
  }

  function bindAreaGuideDrag() {
    const handle = areaGuidePanel.querySelector(".panel-head");
    if (!handle) return;
    let drag = null;

    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".panel-close")) return;
      const parent = areaGuidePanel.offsetParent;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      drag = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        left: areaGuidePanel.offsetLeft,
        top: areaGuidePanel.offsetTop,
        scaleX: parentRect.width / parent.clientWidth || 1,
        scaleY: parentRect.height / parent.clientHeight || 1,
      };
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    handle.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const parent = areaGuidePanel.offsetParent;
      if (!parent) return;
      const nextLeft = drag.left + (e.clientX - drag.x) / drag.scaleX;
      const nextTop = drag.top + (e.clientY - drag.y) / drag.scaleY;
      const maxLeft = Math.max(8, parent.clientWidth - areaGuidePanel.offsetWidth - 8);
      const maxTop = Math.max(8, parent.clientHeight - areaGuidePanel.offsetHeight - 8);
      areaGuidePanel.style.left = Math.max(8, Math.min(maxLeft, nextLeft)) + "px";
      areaGuidePanel.style.top = Math.max(8, Math.min(maxTop, nextTop)) + "px";
      areaGuidePanel.style.transform = "none";
    });

    const finish = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
    };
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
  }

  bindAreaGuideDrag();

  function spawnPollen() {
    if (room.id !== "garden") return;
    const dc = Art.dayCycle(time);
    if (dc.night > 0.5) {
      if (Math.random() > 0.45) return;
      particles.push({
        x: cam.x + Math.random() * VIEW_W,
        y: cam.y + 30 + Math.random() * VIEW_H,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -0.04 - Math.random() * 0.07,
        life: 220,
        color: Math.random() > 0.5 ? "rgba(210,255,140,0.9)" : "rgba(255,230,120,0.75)",
        size: 1,
      });
      return;
    }
    if (Math.random() > 0.35) return;
    particles.push({
      x: cam.x + Math.random() * VIEW_W,
      y: cam.y + Math.random() * VIEW_H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.08 - Math.random() * 0.08,
      life: 180,
      color: Math.random() > 0.5 ? "rgba(255,240,180,0.7)" : "rgba(255,200,220,0.55)",
      size: 1,
    });
  }

  function spawnFire() {
    if (room.id !== "living" || Math.random() > 0.5) return;
    const fp = room.items.find((i) => i.kind === "fireplace");
    const boost = fp && fp.fire && fp.fire.boost > 0;
    if (!boost && Math.random() > 0.5) return;
    particles.push({
      x: 1.2 * TILE + 10 + Math.random() * 10,
      y: 1.15 * TILE + 22,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.25 - Math.random() * 0.2,
      life: 40,
      color: Math.random() > 0.4 ? "#ffb040" : "#ffee88",
      size: 1,
    });
  }

  function updateParticles() {
    spawnPollen();
    spawnFire();
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].x += particles[i].vx;
      particles[i].y += particles[i].vy;
      particles[i].life--;
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    if (particles.length > 80) particles.splice(0, particles.length - 80);
  }

  function hitbox(ent) {
    return { x: ent.x + ent.hx, y: ent.y + ent.hy, w: ent.hw, h: ent.hh };
  }

  function bodyBlocked(x, y) {
    return World.rectBlocked(room, x + player.hx, y + player.hy, player.hw, player.hh);
  }

  function rememberSitFrom() {
    if (player.pose === "stand") player.sitFrom = { x: player.x, y: player.y };
  }

  function unstickPlayer() {
    if (!bodyBlocked(player.x, player.y)) {
      player.sitFrom = null;
      return;
    }
    const from = player.sitFrom;
    player.sitFrom = null;
    if (from && !bodyBlocked(from.x, from.y)) {
      player.x = from.x;
      player.y = from.y;
      return;
    }
    for (let r = 2; r <= 48; r += 2) {
      const pts = [
        [0, r],
        [0, -r],
        [r, 0],
        [-r, 0],
        [r, r],
        [-r, r],
        [r, -r],
        [-r, -r],
      ];
      for (const [ox, oy] of pts) {
        const nx = player.x + ox;
        const ny = player.y + oy;
        if (!bodyBlocked(nx, ny)) {
          player.x = nx;
          player.y = ny;
          return;
        }
      }
    }
  }

  function tryMove(dx, dy) {
    if (bodyBlocked(player.x, player.y)) unstickPlayer();
    const hb = hitbox(player);
    if (dx !== 0 && !World.rectBlocked(room, hb.x + dx, hb.y, hb.w, hb.h)) player.x += dx;
    if (dy !== 0 && !World.rectBlocked(room, hb.x, hb.y + dy, hb.w, hb.h)) player.y += dy;
  }

  function overlapping(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function easyDoorTrigger(d) {
    const side = 30;
    const reach = 48;
    // The garden villa is decorative art placed over the tile map, so its
    // visible front door sits to the right of the hidden door tiles. Trigger
    // from the front steps to match what the player actually sees.
    if (room.id === "garden" && d.to === "living") {
      return { x: 176, y: 88, w: 64, h: 52 };
    }
    if (room.id === "guest" && d.to === "upperHall") {
      return { x: 128, y: 124, w: 96, h: 68 };
    }
    if (d.edge === "north" || d.edge === "south") {
      return { x: d.x - side, y: d.y - reach, w: d.w + side * 2, h: d.h + reach * 2 };
    }
    if (d.edge === "west" || d.edge === "east") {
      return { x: d.x - reach, y: d.y - side, w: d.w + reach * 2, h: d.h + side * 2 };
    }
    return { x: d.x - side, y: d.y - side, w: d.w + side * 2, h: d.h + side * 2 };
  }

  let doorGuideRoom = "";
  let doorGuideEls = [];

  function doorGuideInfo(d) {
      let x = d.x + d.w / 2;
      let y = d.y + d.h / 2;
      let arrow = "↓";
      if (d.edge === "north") { y = 30; arrow = "↑"; }
      if (d.edge === "south") { y = room.pxH - 30; arrow = "↓"; }
      if (d.edge === "west") { x = 36; arrow = "←"; }
      if (d.edge === "east") { x = room.pxW - 36; arrow = "→"; }
      if (room.id === "garden" && d.to === "living") { x = 208; y = 112; arrow = "↑"; }
      if (room.id === "guest" && d.to === "upperHall") { x = 176; y = room.pxH - 34; arrow = "↓"; }
      const destination = room.id === "guest" && d.to === "upperHall"
        ? "进入二楼"
        : room.id === "upperHall" && d.to === "guest"
          ? "下到一楼"
          : (World.NAMES[d.to] || "出口");
      return { x, y, label: arrow + " " + destination };
  }

  function updateDoorGuides() {
    if (!doorGuides) return;
    const hidden = mode !== "play" || fadeDir !== 0 || banquet || PetPlay.isPlaying();
    doorGuides.classList.toggle("hidden", hidden);
    if (hidden) return;
    if (doorGuideRoom !== room.id) {
      doorGuideRoom = room.id;
      doorGuides.innerHTML = "";
      doorGuideEls = room.connections.map((d) => {
        const el = document.createElement("div");
        el.className = "door-guide";
        el.textContent = doorGuideInfo(d).label;
        doorGuides.appendChild(el);
        return el;
      });
    }
    const rect = canvas.getBoundingClientRect();
    room.connections.forEach((d, i) => {
      const info = doorGuideInfo(d);
      doorGuideEls[i].style.left = `${((info.x - cam.x) / VIEW_W) * rect.width}px`;
      doorGuideEls[i].style.top = `${((info.y - cam.y) / VIEW_H) * rect.height}px`;
    });
  }

  function placeCharacter(el, ent, show, opts) {
    if (!el) return;
    const pose = ent && ent.pose ? ent.pose : "stand";
    const hd = !!(opts && opts.hd);
    const useOverlay = show && ent && (hd || pose === "stand");
    el.classList.toggle("visible", useOverlay);
    if (!useOverlay) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((ent.x + 8 - cam.x) / VIEW_W) * rect.width;
    const seatDrop = pose === "sit" ? rect.height * 0.04 : pose === "lie" ? rect.height * 0.06 : 0;
    const y = ((ent.y + 22 - cam.y) / VIEW_H) * rect.height + seatDrop;
    const flip = ent.dir === "left" ? -1 : 1;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `translate(-50%, -100%) scaleX(${flip})`;
    el.classList.toggle("moving", !!ent.moving && pose === "stand");
    el.classList.toggle("seated", pose === "sit");
    el.classList.toggle("lying", pose === "lie");
  }

  function setOverlayPortrait(el, id, kind) {
    if (!el || !id) return;
    if (el.getAttribute("data-id") === id) return;
    const file = id === "marsh" ? "marshmallow" : id;
    el.src = `assets/${file}-character.png?v=5`;
    el.setAttribute("data-id", id);
  }

  function updateCharacterOverlays() {
    const show = mode === "play" && fadeDir === 0 && !PetPlay.hidesFollowers();
    placeCharacter(aikoCharacter, player, show);
    placeCharacter(seventeenCharacter, room.npc, show && !!room.npc && !room.npcOut);

    const barBusy = room.id === "bar" && Bar.isOpen();
    const showHusband = show && !barBusy && profile.husbandFollow && profile.husband;
    setOverlayPortrait(husbandCharacter, profile.husband, "husband");
    placeCharacter(husbandCharacter, husband, showHusband, { hd: true });

    const showPet = show && !barBusy && profile.petFollow && profile.pet;
    setOverlayPortrait(petCharacter, profile.pet, "pet");
    placeCharacter(petCharacter, followPet, showPet, { hd: true });
  }

  function checkDoors() {
    if (fadeDir !== 0 || mode !== "play" || uiOpen()) return;
    const hb = hitbox(player);
    let touchingDoor = false;
    for (const d of room.connections) {
      if (overlapping(hb, easyDoorTrigger(d))) {
        touchingDoor = true;
        if (!doorReady) continue;
        if (room.id === "bath" && bathLocked) {
          if (lockToastCD <= 0) {
            toast("门锁着");
            lockToastCD = 1400;
          }
          return;
        }
        if (room.id === "bar" && Bar.isOpen()) {
          if (lockToastCD <= 0) {
            toast("先打烊才能离开");
            lockToastCD = 1400;
          }
          return;
        }
        pendingRoom = World.rooms[d.to];
        pendingSpawn = d.spawn;
        doorReady = false;
        fadeDir = 1;
        break;
      }
    }
    if (!touchingDoor) doorReady = true;
  }

  function snapFollowers() {
    syncHusbandBeside();
    followPet.x = player.x + 14;
    followPet.y = player.y + 8;
    trail.length = 0;
  }

  function husbandHandOffset(dir, pose) {
    if (pose === "lie") return { x: 0, y: 10 };
    if (pose === "sit") return { x: 12, y: 0 };
    if (dir === "left") return { x: 11, y: 1 };
    if (dir === "right") return { x: -11, y: 1 };
    return { x: -11, y: 1 };
  }

  function syncHusbandBeside() {
    if (!profile.husbandFollow || !profile.husband) return;
    const pose = player.pose || "stand";
    const dir = player.dir || "down";
    const off = husbandHandOffset(dir, pose);
    husband.x = player.x + off.x;
    husband.y = player.y + off.y;
    husband.dir = dir;
    husband.moving = pose === "stand" && !!player.moving;
    husband.pose = pose;
  }

  function enterRoom(next, spawn) {
    const previousFloor = ["upperHall", "herBed", "myBed", "bath", "pet"].includes(room.id) ? 2 : 1;
    const nextFloor = ["upperHall", "herBed", "myBed", "bath", "pet"].includes(next.id) ? 2 : 1;
    dropPillow(true);
    if (room) room.npcOut = false;
    bathLocked = false;
    const lock = World.rooms.bath && World.rooms.bath.items.find((i) => i.interact === "bathLock");
    if (lock) lock.locked = false;
    flushCount = 0;
    lidFlips = 0;
    duckSpam = 0;
    remoteAnnoy = 0;
    movieLightFlips = 0;
    shadePulls = 0;
    scaleAnim = null;
    npcWalk = null;
    gardenPet = null;
    if (arcade) endArcade(null);
    PetPlay.leaveRoom();
    player.slippers = false;
    player.slipperTold = false;
    player.stuck = false;
    player.struggle = 0;
    player.dance = 0;
    player.onSwing = false;
    player.swingHigh = false;
    player.onHammock = false;
    player.sitFrom = null;
    room = next;
    doorReady = false;
    player.x = spawn.x;
    player.y = spawn.y;
    player.pose = "stand";
    player.moving = false;
    resetNpc(next.id);
    hudRoom.textContent = room.name;
    if (!areaGuidePanel.classList.contains("hidden")) renderAreaGuide();
    showBanner(room.name);
    particles.length = 0;
    snapFollowers();
    setupDucks();
    sofaJoinT = 0;
    sofaTalked = false;
    fireComfortCD = 0;
    plantYank = 0;
    lampFlips = 0;
    updateRoomTip();
    if (previousFloor !== nextFloor) {
      toast(nextFloor === 2 ? "你来到二楼啦" : "你来到一楼啦");
    }
  }

  function resetNpc(id) {
    const spot = World.NPC_SPOTS[id];
    if (!room.npc || !spot) return;
    room.npcOut = false;
    room.npc.x = spot.x;
    room.npc.y = spot.y;
    room.npc.dir = spot.dir;
    room.npc.pose = "stand";
  }

  function setupDucks() {
    ducks.length = 0;
    if (room.id !== "bath") return;
    trail.length = 0;
    for (let i = 0; i < 48; i++) {
      trail.push({ x: player.x - i * 1.5, y: player.y + 2, dir: "right", moving: false });
    }
    for (let i = 0; i < 7; i++) {
      ducks.push({
        x: player.x - 8 - i * 11,
        y: player.y + 8 + (i % 2) * 2,
        bounce: 0,
      });
    }
  }

  function updateRoomTip() {
    if (mode !== "play" || talking || uiOpen() || banquet || PetPlay.isPlaying()) {
      roomTip.classList.add("hidden");
      roomTip.classList.remove("clickable");
      return;
    }
    if (room.id === "living") {
      roomTip.textContent = "桌上打开留言簿";
      roomTip.classList.remove("clickable", "hidden");
      return;
    }
    if (room.id === "guest") {
      roomTip.textContent = "↓ 点击这个门进入二楼";
      roomTip.classList.add("clickable");
      roomTip.classList.remove("hidden");
      return;
    }
    if (room.id === "kitchen") {
      roomTip.textContent = "点击进入生日宴";
      roomTip.classList.add("clickable");
      roomTip.classList.remove("hidden");
      return;
    }
    if (room.id === "pet") {
      roomTip.textContent = "点击开始接零食";
      roomTip.classList.add("clickable");
      roomTip.classList.remove("hidden");
      return;
    }
    if (room.id === "bar") {
      if (Bar.isOpen()) {
        const waitN = Bar.guests().filter((g) => g.state === "wait").length;
        const held = Bar.held();
        roomTip.textContent = (Bar.specialText() || "营业中") + (waitN ? " · " + waitN + "人在等" : "") + (held ? " · " + held.name : "");
        roomTip.classList.remove("clickable");
      } else {
        roomTip.textContent = "翻牌子就可以开店";
        roomTip.classList.add("clickable");
      }
      roomTip.classList.remove("hidden");
      return;
    }
    roomTip.classList.add("hidden");
    roomTip.classList.remove("clickable");
  }

  function npcNear() {
    if (!room.npc || room.npcOut) return false;
    const dx = player.x - room.npc.x;
    const dy = player.y - room.npc.y;
    return dx * dx + dy * dy < 26 * 26;
  }

  function interactBox(it) {
    if (it.hit) return it.hit;
    if (it.kind === "tv") return { w: 32, h: 30 };
    if (it.kind === "diningTable") return { w: 44, h: 24 };
    if (it.kind === "ipad") return { w: 18, h: 14 };
    if (it.kind === "screen") return { w: 56, h: 28 };
    if (it.kind === "tub") return { w: 36, h: 24 };
    return { w: 18, h: 16 };
  }

  function interactReach(it) {
    if (it.kind === "diningTable") return 42;
    if (it.kind === "fridge" || it.kind === "chipStack") return 52;
    if (it.kind === "fridgeNote") return 46;
    if (it.kind === "screen" || it.kind === "tub") return 52;
    if (it.kind === "arcade" || it.kind === "dualArcade" || it.kind === "clawMachine" || it.kind === "punchMachine") return 52;
    if (it.interact === "barMix" || it.interact === "barSign" || it.interact === "barBoard" || it.interact === "barCabinet") return 56;
    if (it.interact === "sofa" || it.interact === "seat" || it.interact === "lazy" || it.interact === "bean" || it.interact === "guestBed" || it.interact === "fire") return 48;
    if (it.interact === "shelf" || it.interact === "cabinet" || it.interact === "bathCab" || it.interact === "dvd" || it.interact === "snackBar") return 40;
    if (it.interact === "snack" || it.interact === "mug" || it.interact === "herCup" || it.interact === "myCup") return 20;
    if (it.interact === "pillow" || it.interact === "remote" || it.interact === "duck") return 22;
    return 30;
  }

  function hotspotNear() {
    let best = null;
    let bestD = Infinity;
    for (const it of room.items) {
      if (!it.interact || it.interact === "rug") continue;
      if (it.hidden && it.interact !== "pillow") continue;
      const b = interactBox(it);
      const cx = it.x + b.w / 2;
      const cy = it.y + b.h / 2;
      const d = Math.hypot(player.x + 8 - cx, player.y + 14 - cy);
      if (d < interactReach(it) && d < bestD) {
        best = it;
        bestD = d;
      }
    }
    return best;
  }

  function faceNpc() {
    if (!room.npc || room.npcOut || banquet || PetPlay.isPlaying()) return;
    if (room.id === "bar" && Bar.isOpen()) return;
    if (room.npc.pose && room.npc.pose !== "stand") return;
    const dx = player.x - room.npc.x;
    const dy = player.y - room.npc.y;
    if (Math.abs(dx) > Math.abs(dy)) room.npc.dir = dx > 0 ? "right" : "left";
    else room.npc.dir = dy > 0 ? "down" : "up";
  }

  function standUp() {
    player.pose = "stand";
    if (room.npc && room.npc.pose && room.npc.pose !== "stand") {
      const spot = World.NPC_SPOTS[room.id];
      room.npc.pose = "stand";
      if (spot && room.id === "living") {
        room.npc.x = 10.2 * TILE;
        room.npc.y = 4.4 * TILE;
        room.npc.dir = "down";
      }
    }
    sofaJoinT = 0;
    sofaTalked = false;
    player.stuck = false;
    player.onSwing = false;
    player.swingHigh = false;
    player.onHammock = false;
    unstickPlayer();
  }

  function updatePlayer(dt) {
    if (mode !== "play") {
      player.moving = false;
      return;
    }
    if (PetPlay.isPlaying()) {
      player.moving = false;
      return;
    }
    let dx = 0;
    let dy = 0;
    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;
    const wantMove = dx !== 0 || dy !== 0;
    if (player.pose !== "stand" && wantMove && !banquet) {
      if (talking) hideTalk();
      if (player.stuck) {
        startStruggle();
        player.moving = false;
        return;
      }
      standUp();
    }
    if (busy()) {
      player.moving = false;
      return;
    }
    if (player.pose !== "stand") {
      player.moving = false;
      return;
    }
    player.moving = dx !== 0 || dy !== 0;
    if (player.moving) {
      if (Math.abs(dx) > Math.abs(dy)) player.dir = dx < 0 ? "left" : "right";
      else player.dir = dy < 0 ? "up" : "down";
      const len = Math.hypot(dx, dy) || 1;
      const sp = 1.15 * (dt / 16.67);
      tryMove((dx / len) * sp, (dy / len) * sp);
    }
    checkDoors();
    if (player.slippers && player.moving && !player.slipperTold && room.id === "guest") {
      const sl = room.items.find((i) => i.interact === "slippers");
      if (sl && Math.hypot(player.x - sl.x, player.y - sl.y) > 40) {
        player.slipperTold = true;
        say17("这是给客人的！");
      }
    }
    if (!trail[0] || Math.hypot(player.x - trail[0].x, player.y - trail[0].y) > 1.6) {
      trail.unshift({ x: player.x, y: player.y, dir: player.dir, moving: player.moving });
      if (trail.length > 48) trail.pop();
    }
    if (!banquet) {
      if (profile.husbandFollow) syncHusbandBeside();
      followFromTrail(followPet, 26);
    } else if (banquet.husband && banquet.husbandId) {
      husband.x = banquet.husband.x;
      husband.y = banquet.husband.y;
      husband.dir = banquet.husband.dir || "up";
      husband.pose = "sit";
      husband.moving = false;
    }
    updateDucks();
  }

  function updateDucks() {
    if (room.id !== "bath") {
      ducks.length = 0;
      return;
    }
    if (!ducks.length) setupDucks();
    for (let i = 0; i < ducks.length; i++) {
      const node = trail[Math.min(8 + i * 6, trail.length - 1)];
      if (!node) continue;
      const d = ducks[i];
      d.x += (node.x - 8 - i * 2 - d.x) * 0.18;
      d.y += (node.y + 6 + (i % 2) * 3 - d.y) * 0.18;
      if (d.bounce > 0) d.bounce = Math.max(0, d.bounce - 16);
    }
  }

  function followFromTrail(ent, lag) {
    const node = trail[Math.min(lag, trail.length - 1)];
    if (!node) {
      ent.moving = false;
      return;
    }
    const dx = node.x - ent.x;
    const dy = node.y - ent.y;
    const dist = Math.hypot(dx, dy);
    ent.moving = dist > 0.8;
    if (ent.moving) {
      ent.x += dx * 0.22;
      ent.y += dy * 0.22;
      ent.dir = node.dir;
    }
  }

  function updateCam() {
    const follow = PetPlay.cameraTarget();
    if (banquet || follow) {
      const src = follow || { x: 10.4 * TILE, y: 5.4 * TILE };
      const tx = src.x + 8 - VIEW_W / 2;
      const ty = src.y + 8 - VIEW_H / 2;
      const maxX = Math.max(0, room.pxW - VIEW_W);
      const maxY = Math.max(0, room.pxH - VIEW_H);
      const gx = Math.max(0, Math.min(maxX, tx));
      const gy = Math.max(0, Math.min(maxY, ty));
      cam.x += (gx - cam.x) * 0.12;
      cam.y += (gy - cam.y) * 0.12;
      return;
    }
    const lookUp = room.id === "garden" ? 52 : 0;
    const tx = player.x + 8 - VIEW_W / 2;
    const ty = player.y + 8 - VIEW_H / 2 - lookUp;
    const maxX = Math.max(0, room.pxW - VIEW_W);
    const maxY = Math.max(0, room.pxH - VIEW_H);
    const minY = room.id === "garden" ? -36 : 0;
    const gx = Math.max(0, Math.min(maxX, tx));
    const gy = Math.max(minY, Math.min(maxY, ty));
    const k = mode === "title" ? 0.04 : 0.14;
    cam.x += (gx - cam.x) * k;
    cam.y += (gy - cam.y) * k;
    if (mode === "title") {
      cam.x = 48;
      cam.y = -8;
    }
  }

  function floorType(tile) {
    if (tile.type === "grass") return "grass";
    if (tile.type === "path") return "path";
    if (tile.type === "stone") return "stone";
    if (tile.type === "water") return "water";
    if (tile.type === "fence") return "fence";
    if (tile.type === "hedge") return "hedge";
    if (tile.type === "rug") return room.floor;
    if (tile.type === "door") return room.id === "garden" ? "path" : room.floor;
    if (tile.type === "house") return "path";
    if (tile.type === "wall") return null;
    return room.floor;
  }

  function drawGardenSky() {
    const amb = Art.gardenAmbient(time);
    const dc = Art.dayCycle(time);
    const top = `rgb(${amb.top[0]},${amb.top[1]},${amb.top[2]})`;
    const mid = dc.night > 0.45
      ? `rgb(${Math.max(0, amb.top[0] - 8)},${Math.max(0, amb.top[1] - 6)},${Math.max(0, amb.top[2] + 10)})`
      : `rgb(${Math.min(255, amb.top[0] + 24)},${Math.min(255, amb.top[1] + 18)},${Math.min(255, amb.top[2] + 8)})`;
    const g = v.createLinearGradient(0, -80, 0, 110);
    g.addColorStop(0, top);
    g.addColorStop(1, mid);
    v.fillStyle = g;
    v.fillRect(-16, -80, room.pxW + 32, 200);

    const sunX = room.pxW * 0.48 + Math.sin(dc.ang) * 120;
    const sunY = -6 - dc.day * 22;
    const moonX = room.pxW * 0.48 + Math.sin(dc.ang + Math.PI) * 120;
    const moonY = -4 - dc.night * 20;
    if (dc.day > 0.38) {
      v.fillStyle = dc.day > 0.55 ? "rgba(255, 232, 120, 0.35)" : "rgba(255, 160, 80, 0.28)";
      v.beginPath();
      v.arc(sunX, sunY, 14 + dc.day * 6, 0, Math.PI * 2);
      v.fill();
      v.fillStyle = dc.day > 0.55 ? "#ffe878" : "#ffb060";
      v.beginPath();
      v.arc(sunX, sunY, 6 + dc.day * 3, 0, Math.PI * 2);
      v.fill();
    }
    if (dc.night > 0.4) {
      v.fillStyle = `rgba(240, 236, 224, ${0.35 + dc.night * 0.5})`;
      v.beginPath();
      v.arc(moonX, moonY, 6, 0, Math.PI * 2);
      v.fill();
      v.fillStyle = `rgba(${amb.top[0]},${amb.top[1]},${amb.top[2]},0.55)`;
      v.beginPath();
      v.arc(moonX + 2, moonY - 1, 4, 0, Math.PI * 2);
      v.fill();
    }
  }

  function drawTiles() {
    if (room.id === "garden") drawGardenSky();
    const x0 = Math.max(0, Math.floor(cam.x / TILE) - 1);
    const y0 = Math.max(0, Math.floor(cam.y / TILE) - 1);
    const x1 = Math.min(room.cols, Math.ceil((cam.x + VIEW_W) / TILE) + 1);
    const y1 = Math.min(room.rows, Math.ceil((cam.y + VIEW_H) / TILE) + 1);

    for (let ty = y0; ty < y1; ty++) {
      for (let tx = x0; tx < x1; tx++) {
        const tile = room.tiles[ty][tx];
        const px = tx * TILE;
        const py = ty * TILE;
        if (tile.type === "wall") continue;
        if (tile.type === "house") continue;
        if (tile.type === "door" && room.id === "garden") {
          v.drawImage(Art.tileFor("path", tx, ty, time), px, py);
          continue;
        }
        const ft = floorType(tile);
        if (!ft) continue;
        if (ft === "hedge") {
          v.drawImage(Art.tileFor("grass", tx, ty, time), px, py);
          v.drawImage(Art.tileFor("hedge", tx, ty, time), px, py);
          continue;
        }
        v.drawImage(Art.tileFor(ft, tx, ty, time), px, py);
      }
    }

    for (let ty = y0; ty < y1; ty++) {
      for (let tx = x0; tx < x1; tx++) {
        const tile = room.tiles[ty][tx];
        if (tile.type !== "wall" && tile.type !== "fence") continue;
        const px = tx * TILE;
        const py = ty * TILE;
        if (tile.type === "fence") {
          if (!(room.id === "garden" && ty === 0)) {
            v.drawImage(Art.tileFor("grass", tx, ty, time), px, py);
          }
          v.drawImage(Art.tiles.fence, px, py);
          continue;
        }
        if (ty === 0) {
          Art.r(v, px, py, TILE, 20, wallpaperColor());
          Art.r(v, px, py + 18, TILE, 2, "rgba(90,50,30,0.22)");
          v.drawImage(Art.wallTile(room.wall), px, py + 4);
          Art.r(v, px, py, TILE, 3, "rgba(255,255,255,0.08)");
        } else {
          v.drawImage(Art.wallTile(room.wall), px, py);
        }
      }
    }

    for (let ty = y0; ty < y1; ty++) {
      for (let tx = x0; tx < x1; tx++) {
        if (room.tiles[ty][tx].type !== "door") continue;
        if (room.id === "garden") continue;
        Art.drawers.doorTile(v, tx * TILE, ty * TILE, ty === 0 || ty === room.rows - 1 ? "ns" : "ew");
      }
    }
  }

  function wallpaperColor() {
    const map = {
      Cream: "#f0ddb8",
      Pink: "#f0c0c8",
      Night: "#2a2438",
      Sage: "#c8d4b8",
      Peach: "#f0d4c0",
      Ink: "#16141c",
    };
    return map[room.wall] || "#f0ddb8";
  }

  function pushActor(drawables, ent, who, yOff) {
    if (!ent) return;
    const pose = ent.pose || "stand";
    if ((who === "player" || who === "npc") && pose === "stand") return;
    const isHusband = who === "jk" || who === "qinche";
    const blink = who === "player" && blinkT > 0;
    const yLift = pose === "sit" ? 5 : pose === "lie" ? 8 : 0;
    drawables.push({
      y: ent.y + (pose === "sit" ? 38 : pose === "lie" ? 14 : isHusband ? 34 : yOff || 22),
      draw() {
        Art.drawShadow(v, ent.x, ent.y + 20 - yLift, pose === "lie" ? 20 : 16);
        let bob = who === "npc" && pose === "stand" ? Math.sin(time / 400) * 0.6 : 0;
        if (who === "player") {
          if (player.dance > 0) bob += Math.sin(time / 55) * 3;
          if (player.struggle > 0) bob += Math.sin(time / 35) * 2;
          if (player.onSwing) bob += Math.sin(time / (player.swingHigh ? 80 : 140)) * (player.swingHigh ? 4 : 1.6);
          if (player.onHammock) bob += Math.sin(time / 180) * 1.2;
        }
        if (isHusband) {
          const hb = !!ent.moving ? Math.sin(time / 140) * 1.2 : 0;
          if (!Art.drawPortrait(v, who, ent.x, ent.y, { pose, dir: ent.dir || "down", bob: hb, h: 36 })) {
            const fr = Art.actorFrame(who, pose, ent.dir || "down", !!ent.moving, time, false);
            v.drawImage(fr, ent.x, ent.y + yLift + hb);
          }
          return;
        }
        const fr = Art.actorFrame(who, pose, ent.dir || "down", !!ent.moving || (who === "player" && player.dance > 0), time, blink);
        v.drawImage(fr, ent.x, ent.y + yLift + bob);
        if (who === "player" && pillow.mode === "held") {
          Art.drawers.cushion(v, ent.x + 10, ent.y + 8 + yLift, pillow.color || "#e8a0b0");
        }
        if (room.id === "bar") Bar.drawHeld(v, who, { x: ent.x, y: ent.y + yLift + bob });
      },
    });
  }

  function drawPetWorld(drawables, id, x, y, moving) {
    drawables.push({
      y: y + 16,
      draw() {
        Art.drawShadow(v, x, y + 12, 12);
        const bob = moving ? Math.sin(time / 120) * 1.2 : 0;
        if (!Art.drawPetSprite(v, id, x, y, { h: 20, bob })) {
          v.drawImage(Art.petFrame(id, !!moving, time), x, y + 5);
        }
      },
    });
  }

  function drawHandHold(drawables, a, b) {
    if (!a || !b) return;
    drawables.push({
      y: Math.max(a.y, b.y) + 18,
      draw() {
        const ax = a.x + 8;
        const ay = a.y + (a.pose === "sit" ? 14 : a.pose === "lie" ? 10 : 16);
        const bx = b.x + 8;
        const by = b.y + (b.pose === "sit" ? 14 : b.pose === "lie" ? 10 : 16);
        v.strokeStyle = "rgba(240, 170, 150, 0.95)";
        v.lineWidth = 1.5;
        v.beginPath();
        v.moveTo(ax, ay);
        v.lineTo(bx, by);
        v.stroke();
        v.fillStyle = "#f0a898";
        v.fillRect(((ax + bx) / 2) | 0, ((ay + by) / 2) | 0, 2, 2);
      },
    });
  }

  function drawWorld() {
    v.imageSmoothingEnabled = false;
    if (room.id === "garden") {
      const sky = Art.gardenAmbient(time);
      v.fillStyle = `rgb(${sky.top[0]},${sky.top[1]},${sky.top[2]})`;
    } else {
      v.fillStyle = Art.C.void;
    }
    v.fillRect(0, 0, VIEW_W, VIEW_H);
    v.save();
    v.translate(-Math.round(cam.x), -Math.round(cam.y));
    drawTiles();

    const drawables = [];
    for (const it of room.items) {
      drawables.push({
        y: it.y + (it.sortY || 0),
        floor: !!it.floor,
        draw() {
          Art.drawItem(v, it, time);
        },
      });
    }

    if (room.id === "bar") {
      for (const d of Bar.drawables(v, time)) drawables.push(d);
    }

    if (room.id === "pet") {
      for (const d of PetPlay.drawables(v, time, profile)) drawables.push(d);
      if (!profile.petFollow && !PetPlay.isPlaying()) {
        const homePets = [
          { id: "cotton", x: 6.8 * TILE, y: 7.15 * TILE },
          { id: "tangtang", x: 13.2 * TILE, y: 7.15 * TILE },
        ];
        for (const pet of homePets) drawPetWorld(drawables, pet.id, pet.x, pet.y, false);
      }
    }

    if (room.id === "herBed" && !profile.husbandFollow) {
      pushActor(drawables, { x: 6.7 * TILE, y: 6.25 * TILE, dir: "right", moving: false, pose: "stand" }, "jk", 22);
      pushActor(drawables, { x: 11.9 * TILE, y: 6.25 * TILE, dir: "left", moving: false, pose: "stand" }, "qinche", 22);
    }

    if (room.npc && !room.npcOut) pushActor(drawables, room.npc, "npc", 22);

    if (mode !== "title") {
      pushActor(drawables, player, "player", 22);
      if (banquet) {
        if (banquet.husband && banquet.husbandId) {
          // HD overlay handles husband while following
          drawHandHold(drawables, player, banquet.husband);
        }
        if (banquet.pet && banquet.petId && !(profile.petFollow && profile.pet === banquet.petId)) {
          drawPetWorld(drawables, banquet.petId, banquet.pet.x, banquet.pet.y, false);
        }
      } else {
        if (profile.husbandFollow && profile.husband && !(room.id === "bar" && Bar.isOpen()) && !PetPlay.hidesFollowers()) {
          // HD overlay draws husband; keep hand-hold line on canvas
          drawHandHold(drawables, player, husband);
        }
        // following pet is HD overlay; room pets still canvas via PetPlay / homePets
      }
    }

    drawables.sort((a, b) => {
      if (a.floor && !b.floor) return -1;
      if (!a.floor && b.floor) return 1;
      return a.y - b.y;
    });
    for (const d of drawables) d.draw();
    if (banquet) drawBanquet();
    for (const duck of ducks) {
      const bob = duck.bounce > 0 ? Math.round(Math.sin(time / (90 - Math.min(50, duckSpam * 6))) * 2) : 0;
      v.drawImage(Art.duck, duck.x, duck.y + 8 - bob);
    }
    if (pillow.mode === "fly") {
      Art.drawers.cushion(v, pillow.x, pillow.y, pillow.color || "#e8a0b0");
    }
    if (gardenPet && room.id === "garden") {
      Art.drawShadow(v, gardenPet.x, gardenPet.y + 12, 12);
      if (!Art.drawPetSprite(v, gardenPet.id, gardenPet.x, gardenPet.y, { h: 20 })) {
        if (gardenPet.id === "marsh") v.drawImage(Art.marshmallowDog, gardenPet.x, gardenPet.y);
        else v.drawImage(Art.petFrame(gardenPet.id, false, time), gardenPet.x, gardenPet.y);
      }
    }
    for (const p of particles) {
      v.fillStyle = p.color;
      v.fillRect(p.x, p.y, p.size, p.size);
    }
    v.restore();

    const amb = room.id === "garden" ? Art.gardenAmbient(time) : room.ambient;
    const g = v.createLinearGradient(0, 0, 0, VIEW_H);
    g.addColorStop(0, `rgba(${amb.top.join(",")})`);
    g.addColorStop(1, `rgba(${amb.bottom.join(",")})`);
    v.fillStyle = g;
    v.fillRect(0, 0, VIEW_W, VIEW_H);

    if (room.id === "garden") {
      const dc = Art.dayCycle(time);
      if (dc.night > 0.32) {
        const a = Math.min(1, (dc.night - 0.32) * 1.6);
        for (let i = 0; i < 32; i++) {
          const sx = Art.hash(i, 11) % VIEW_W;
          const sy = Art.hash(i, 23) % 72;
          const tw = 0.4 + Math.sin(time / 260 + i) * 0.6;
          v.fillStyle = `rgba(255,248,220,${Math.max(0, a * tw)})`;
          v.fillRect(sx, sy, i % 6 === 0 ? 2 : 1, i % 6 === 0 ? 2 : 1);
        }
      }
    }

    if (room.id === "movie") {
      const lamp = room.items.find((i) => i.interact === "movieLight");
      const light = (lamp && lamp.mode) || "on";
      const screen = room.items.find((i) => i.interact === "projector");
      const projecting = screen && screen.on !== false && screen.channel;
      if (light === "off") {
        v.fillStyle = "rgba(4, 2, 12, 0.58)";
        v.fillRect(0, 0, VIEW_W, VIEW_H);
      } else if (light === "cinema") {
        v.fillStyle = "rgba(8, 4, 18, 0.42)";
        v.fillRect(0, 0, VIEW_W, VIEW_H);
      }
      if (projecting && light !== "off") {
        v.fillStyle = light === "cinema" ? "rgba(255, 220, 160, 0.1)" : "rgba(255, 220, 160, 0.05)";
        v.beginPath();
        v.moveTo(VIEW_W * 0.35, 20);
        v.lineTo(VIEW_W * 0.72, VIEW_H * 0.72);
        v.lineTo(VIEW_W * 0.22, VIEW_H * 0.72);
        v.closePath();
        v.fill();
      }
      if (room.items.some((i) => i.interact === "shade" && i.curtain)) {
        v.fillStyle = "rgba(0, 0, 0, 0.18)";
        v.fillRect(0, 0, VIEW_W, VIEW_H);
      }
    }

    if (room.id === "bath" && bathFog > 0) {
      v.fillStyle = `rgba(200, 228, 214, ${0.1 + bathFog * 0.52})`;
      v.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    const vig = v.createRadialGradient(VIEW_W / 2, VIEW_H / 2, 40, VIEW_W / 2, VIEW_H / 2, 210);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, room.id === "garden"
      ? (Art.dayCycle(time).night > 0.45 ? "rgba(6,8,24,0.38)" : "rgba(20,40,10,0.16)")
      : "rgba(20,10,6,0.28)");
    v.fillStyle = vig;
    v.fillRect(0, 0, VIEW_W, VIEW_H);

    if (fade > 0) {
      v.fillStyle = `rgba(12,6,4,${fade})`;
      v.fillRect(0, 0, VIEW_W, VIEW_H);
    }
  }

  function startNpcTalk() {
    if (room.npcOut) return;
    talkI = 0;
    talkLines = NPC_LINES[room.id] || NPC_LINES.later;
    showTalk();
  }

  function showTalk() {
    talking = true;
    const line = talkLines[talkI] || "";
    talkName.textContent = typeof line === "string" ? GIFT.npcName : line.name;
    talkText.textContent = typeof line === "string" ? line : line.text;
    talkBox.classList.remove("hidden");
  }

  function hideTalk() {
    talking = false;
    talkBox.classList.add("hidden");
    if (talkThen) {
      const fn = talkThen;
      talkThen = null;
      fn();
    }
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function playSfx(kind) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      sfxCtx = sfxCtx || new AC();
      if (sfxCtx.state === "suspended") sfxCtx.resume();
      const t0 = sfxCtx.currentTime;
      const o = sfxCtx.createOscillator();
      const g = sfxCtx.createGain();
      o.connect(g);
      g.connect(sfxCtx.destination);
      if (kind === "quack") {
        o.type = "square";
        o.frequency.setValueAtTime(440, t0);
        o.frequency.exponentialRampToValueAtTime(170, t0 + 0.12);
        g.gain.setValueAtTime(0.07, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
        o.start(t0);
        o.stop(t0 + 0.15);
      } else if (kind === "water") {
        o.type = "triangle";
        o.frequency.setValueAtTime(280, t0);
        o.frequency.linearRampToValueAtTime(120, t0 + 0.18);
        g.gain.setValueAtTime(0.04, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);
        o.start(t0);
        o.stop(t0 + 0.22);
      }
    } catch (err) {}
  }

  function say17(line) {
    talkI = 0;
    talkLines = Array.isArray(line) ? line : [line];
    showTalk();
  }

  function toast(text) {
    actionToast.textContent = text;
    actionToast.classList.remove("hidden");
    toastT = 1800;
  }

  function npcToast(text) {
    npcToastText.textContent = text;
    npcToastEl.classList.remove("hidden");
    npcToastT = 2200;
  }

  function openChoice(title, body, actions) {
    hideTalk();
    closePanels();
    document.getElementById("choice-title").textContent = title;
    document.getElementById("choice-body").textContent = body || "";
    const box = document.getElementById("choice-actions");
    box.innerHTML = "";
    (actions || []).forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = a.label;
      b.addEventListener("click", () => {
        closePanels();
        if (a.fn) a.fn();
      });
      box.appendChild(b);
    });
    choicePanel.classList.remove("hidden");
  }

  function livingItem(kind) {
    return room.items.find((i) => i.kind === kind);
  }

  function sitOnSofa() {
    const sofa = livingItem("sofa");
    if (!sofa) return;
    sitOnSeat(sofa);
  }

  function sitOnSeat(it) {
    if (!it) return;
    player.pose = "sit";
    player.dir = "down";
    player.moving = false;
    player.x = it.x + (it.kind === "sofa" ? 8 : 4);
    player.y = it.y + 4;
    if (it.kind === "sofa" && room.id === "living") {
      sofaJoinT = 480;
      sofaTalked = false;
    }
  }

  function sprawlOn(it) {
    player.pose = "lie";
    player.dir = "down";
    player.moving = false;
    player.x = it.x + 2;
    player.y = it.y + 6;
  }

  function usePillow(it) {
    if (!it.home) it.home = { x: it.x, y: it.y };
    if (pillow.mode === "held") {
      throwPillow(it, false);
      return;
    }
    pillow.mode = "held";
    pillow.t = 2800;
    pillow.held = it;
    pillow.color = it.theme || "#e8a0b0";
    pillow.smash = false;
    it.hidden = true;
    toast("抱一下");
  }

  function throwPillow(it, smash) {
    if (!it.home) it.home = { x: it.x, y: it.y };
    pillow.mode = "fly";
    pillow.t = 700;
    pillow.held = it;
    pillow.color = it.theme || "#e8a0b0";
    pillow.smash = !!smash;
    pillow.hitNpc = false;
    pillow.x = player.x + 8;
    pillow.y = player.y + 10;
    it.hidden = true;
    if (smash && room.npc && !room.npcOut) {
      const dx = room.npc.x - pillow.x;
      const dy = room.npc.y - pillow.y;
      const len = Math.hypot(dx, dy) || 1;
      pillow.vx = (dx / len) * 2.2;
      pillow.vy = (dy / len) * 2.2;
    } else {
      const dir = player.dir;
      pillow.vx = dir === "left" ? -1.6 : dir === "right" ? 1.6 : 0;
      pillow.vy = dir === "up" ? -1.4 : dir === "down" ? 1.2 : 0.4;
    }
    toast(smash ? "砸过去" : "丢一下");
    if (smash) say17("你最好现在开始跑。");
  }

  function dropPillow(reset) {
    const cush = pillow.held || (room && room.items ? room.items.find((i) => i.interact === "pillow") : null);
    pillow.mode = "idle";
    pillow.t = 0;
    pillow.smash = false;
    pillow.hitNpc = false;
    pillow.held = null;
    if (cush) {
      cush.hidden = false;
      if (reset && cush.home) {
        cush.x = cush.home.x;
        cush.y = cush.home.y;
      } else if (!reset) {
        cush.x = pillow.x;
        cush.y = pillow.y;
      }
    }
  }

  function lieOnRug(wx, wy) {
    const rug = room.items.find((i) => i.interact === "rug");
    if (!rug) return;
    const cx = rug.x + rug.w / 2;
    const cy = rug.y + rug.h / 2;
    const nx = wx != null ? wx : player.x + 8;
    const ny = wy != null ? wy : player.y + 14;
    player.pose = "lie";
    player.dir = "down";
    player.moving = false;
    player.x = Math.max(rug.x, Math.min(rug.x + rug.w - 16, nx - 8));
    player.y = Math.max(rug.y, Math.min(rug.y + rug.h - 8, ny - 6));
    say17("地上到底有什么吸引你的？");
  }

  function cycleTv(it) {
    it.channel = ((it.channel || 0) + 1) % 6;
    const ch = it.channel;
    if (ch === 1) {
      openTv();
      return;
    }
    const lines = {
      0: ["总算安静了。"],
      2: ["又在播这个。", "把音量关小一点。"],
      3: ["你不会真要买吧。", "这个锅我看了八百遍。"],
      4: ["这只比棉花还圆。", "……行吧，挺可爱的。"],
      5: ["这也能看？", "你是在考验我的耐心吗。"],
    };
    if (lines[ch]) say17(pick(lines[ch]));
  }

  function useFire(it) {
    openChoice("壁炉", "要做什么？", [
      {
        label: "添柴",
        fn() {
          it.fire = it.fire || {};
          it.fire.boost = 5000;
          toast("火更旺了");
        },
      },
      {
        label: "烤棉花糖",
        fn() {
          it.fire = it.fire || {};
          it.fire.roast = 3400;
          toast("焦了。很好。");
        },
      },
      {
        label: "发呆",
        fn() {
          player.pose = "sit";
          player.dir = "up";
          player.moving = false;
          player.x = 2.35 * TILE;
          player.y = 3.3 * TILE;
          fireComfortCD = 14000;
          npcToast("哦吼，舒适");
        },
      },
    ]);
  }

  function updateLiving(dt) {
    if (toastT > 0) {
      toastT -= dt;
      if (toastT <= 0) actionToast.classList.add("hidden");
    }
    if (npcToastT > 0) {
      npcToastT -= dt;
      if (npcToastT <= 0) npcToastEl.classList.add("hidden");
    }
    lampFlipAge += dt;
    if (lampFlipAge > 2800) lampFlips = 0;
    lidFlipAge += dt;
    if (lidFlipAge > 2600) lidFlips = 0;
    duckSpamAge += dt;
    if (duckSpamAge > 2200) duckSpam = 0;
    movieLightAge += dt;
    if (movieLightAge > 2800) movieLightFlips = 0;
    shadePullAge += dt;
    if (shadePullAge > 3200) shadePulls = 0;
    lockToastCD = Math.max(0, lockToastCD - dt);
    if (bathFog > 0 && room.id === "bath") bathFog = Math.max(0, bathFog - dt / 18000);
    else if (room.id !== "bath") bathFog = Math.max(0, bathFog - dt / 4000);
    for (const it of room.items) {
      if (it.shake) it.shake = Math.max(0, it.shake - dt);
      if (it.fire) {
        if (it.fire.boost) it.fire.boost = Math.max(0, it.fire.boost - dt);
        if (it.fire.roast) it.fire.roast = Math.max(0, it.fire.roast - dt);
      }
      if (it.popping) {
        it.popT = (it.popT || 0) - dt;
        if (it.popT <= 0) it.popping = false;
      }
    }
    if (pillow.mode === "held") {
      pillow.t -= dt;
      if (pillow.t <= 0) dropPillow(true);
    } else if (pillow.mode === "fly") {
      pillow.x += pillow.vx * (dt / 16.67);
      pillow.y += pillow.vy * (dt / 16.67);
      pillow.t -= dt;
      if (pillow.t <= 0) dropPillow(false);
    }
    if (scaleAnim) {
      scaleAnim.t -= dt;
      if (scaleAnim.t <= 0) {
        scaleAnim.i += 1;
        if (scaleAnim.i >= scaleAnim.seq.length) {
          const scale = room.items.find((i) => i.interact === "scale");
          if (scale) scale.glow = scaleAnim.final === "秘密" ? "secret" : "q";
          toast(scaleAnim.final);
          scaleAnim = null;
        } else {
          toast(scaleAnim.seq[scaleAnim.i]);
          scaleAnim.t = 160;
        }
      }
    }
    const sink = room.items.find((i) => i.interact === "sink");
    if (sink && sink.water) {
      sink.waterT = (sink.waterT || 0) + dt;
      if (Math.random() < 0.12) {
        particles.push({
          x: sink.x + 8 + Math.random() * 4,
          y: sink.y + 10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 0.35,
          life: 18,
          color: "#b8dce8",
          size: 1,
        });
      }
      if (sink.waterT > 7000 && !sink.billed && room.id === "bath") {
        sink.billed = true;
        say17("水费你出。");
      }
    } else if (sink) {
      sink.waterT = 0;
      sink.billed = false;
    }
    const tub = room.items.find((i) => i.interact === "tub");
    if (tub && tub.water && Math.random() < 0.18) {
      particles.push({
        x: tub.x + 8 + Math.random() * 22,
        y: tub.y + 6 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.25 - Math.random() * 0.15,
        life: 28,
        color: "rgba(255,255,255,0.7)",
        size: 2,
      });
    }
    if (sofaJoinT > 0) {
      sofaJoinT -= dt;
      if (sofaJoinT <= 0 && player.pose === "sit" && room.id === "living" && room.npc) {
        const sofa = livingItem("sofa");
        if (sofa) {
          room.npc.pose = "sit";
          room.npc.dir = "down";
          room.npc.x = sofa.x + 26;
          room.npc.y = sofa.y + 4;
        }
        if (!sofaTalked) {
          sofaTalked = true;
          say17(pick(["今天也辛苦啦", "要不要什么都不干，就坐五分钟", "就这样待一会儿也很好"]));
        }
      }
    }
    const dog = room.items.find((i) => i.kind === "marshmallow");
    if (dog) dog.x = 8.6 * TILE + Math.sin(time / 900) * 8;
    if (player.struggle > 0) {
      player.struggle -= dt;
      if (player.struggle <= 0) {
        player.stuck = false;
        standUp();
      }
    }
    if (player.dance > 0) player.dance = Math.max(0, player.dance - dt);
    if (gardenPet) {
      gardenPet.t -= dt;
      if (gardenPet.t <= 0) gardenPet = null;
    }
    for (const it of room.items) {
      if (it.kind === "swing" || it.kind === "hammock") it.t = (it.t || 0) + dt;
      if (it.splash) {
        it.splash = Math.max(0, it.splash - dt);
        if (it.splash <= 0) it.splash = 0;
      }
      if (it.flash) it.flash = Math.max(0, it.flash - dt);
    }
    if (room.id !== "living" || banquet || talking || uiOpen()) return;
    const fp = livingItem("fireplace");
    fireComfortCD = Math.max(0, fireComfortCD - dt);
    if (fp && fireComfortCD <= 0 && player.pose === "stand") {
      const d = Math.hypot(player.x + 8 - (fp.x + 14), player.y + 14 - (fp.y + 20));
      if (d < 34) {
        fireComfortCD = 16000;
        npcToast("哦吼，舒适");
      }
    }
  }

  function kitchenBanquetSeats() {
    const chairs = (room.items || [])
      .filter((it) => it.kind === "chair")
      .slice()
      .sort((a, b) => a.y - b.y || a.x - b.x);
    // Layout: TL, TR, BL, BR around the dining table.
    return {
      npc: chairs[0] || null,
      husband: chairs[3] || chairs[1] || null,
      player: chairs[2] || null,
    };
  }

  function seatAtChair(ent, chair, dir) {
    if (!ent || !chair) return;
    ent.x = chair.x + 4;
    ent.y = chair.y + 4;
    ent.dir = dir;
    ent.pose = "sit";
    ent.moving = false;
  }

  function startBanquet() {
    if (banquet || room.id !== "kitchen") return;
    hideTalk();
    closePanels();
    const npcHome = room.npc ? { x: room.npc.x, y: room.npc.y, dir: room.npc.dir } : null;
    const seats = kitchenBanquetSeats();
    seatAtChair(player, seats.player, "up");
    if (!seats.player) {
      player.x = 9.15 * TILE + 4;
      player.y = 6.55 * TILE + 4;
      player.dir = "up";
      player.moving = false;
      player.pose = "sit";
    }
    if (room.npc) {
      seatAtChair(room.npc, seats.npc, "down");
      if (!seats.npc) {
        room.npc.x = 9.15 * TILE + 4;
        room.npc.y = 3.55 * TILE + 4;
        room.npc.dir = "down";
        room.npc.pose = "sit";
        room.npc.moving = false;
      }
    }
    const bringHusband = !!(profile.husbandFollow && profile.husband);
    const bringPet = !!(profile.petFollow && profile.pet);
    const husbandSeat = seats.husband;
    banquet = {
      phase: "serve",
      t: 0,
      candlesLit: false,
      wishLeft: 10000,
      npcHome,
      cakeFrom: { x: 3.5 * TILE, y: 2.1 * TILE },
      steakFrom: { x: 3.7 * TILE, y: 2.5 * TILE },
      cakeTo: { x: TABLE.x + 6, y: TABLE.y + 1 },
      steakTo: { x: TABLE.x + 26, y: TABLE.y + 6 },
      husband: bringHusband
        ? {
            x: husbandSeat ? husbandSeat.x + 4 : player.x + 22,
            y: husbandSeat ? husbandSeat.y + 4 : player.y,
            dir: "up",
            moving: false,
            pose: "sit",
          }
        : null,
      pet: bringPet
        ? { x: player.x - 16, y: player.y + 6 }
        : null,
      husbandId: bringHusband ? profile.husband : null,
      petId: bringPet ? profile.pet : null,
    };
    if (bringHusband && banquet.husband) {
      husband.x = banquet.husband.x;
      husband.y = banquet.husband.y;
      husband.dir = banquet.husband.dir;
      husband.pose = "sit";
      husband.moving = false;
    }
    banquetCaption.textContent = `${GIFT.npcName} 给 ${GIFT.playerName} 端上了生日蛋糕和一块牛排`;
    if (banquetExitBtn) banquetExitBtn.classList.remove("hidden");
    banquetCaption.classList.remove("hidden");
    wishOverlay.classList.add("hidden");
    if (wishTab) wishTab.classList.add("hidden");
    updateRoomTip();
  }

  function ease(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function banquetFood(kind) {
    const k = ease(banquet.t / 1400);
    const from = kind === "cake" ? banquet.cakeFrom : banquet.steakFrom;
    const to = kind === "cake" ? banquet.cakeTo : banquet.steakTo;
    if (banquet.phase === "serve") return { x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k) };
    return { x: to.x, y: to.y };
  }

  function cakeBox() {
    const c = banquetFood("cake");
    return { x: c.x, y: c.y, w: 26, h: 20 };
  }

  function drawBanquet() {
    const cakePos = banquetFood("cake");
    const steakPos = banquetFood("steak");
    Art.steak(v, steakPos.x, steakPos.y);
    Art.cake(v, cakePos.x, cakePos.y, banquet.candlesLit, time);
    if (banquet.phase === "choir" || banquet.phase === "candles" || banquet.phase === "wishTab" || banquet.phase === "wish" || banquet.phase === "speech") {
      const spots = [7.0, 8.6, 12.2, 13.8];
      const k = banquet.phase === "choir" ? ease((banquet.t - 200) / 900) : 1;
      spots.forEach((sx, i) => {
        const x = sx * TILE;
        const y = lerp(10.4 * TILE, 8.55 * TILE, Math.max(0, k));
        Art.choir(v, x, y, i, time);
      });
    }
  }

  function spawnCandleSparks() {
    const c = banquetFood("cake");
    for (let i = 0; i < 18; i++) {
      particles.push({
        x: c.x + 8 + Math.random() * 12,
        y: c.y + 2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.35 - Math.random() * 0.35,
        life: 50 + Math.random() * 30,
        color: Math.random() > 0.5 ? "#ffee88" : "#ffb040",
        size: 1,
      });
    }
  }

  function playBirthdaySong() {
    if (!bdaySong) return;
    if (bgm) bgm.pause();
    bdaySong.currentTime = 0;
    bdaySong.loop = false;
    if (banquet) banquet.songFailed = false;
    const play = bdaySong.play();
    if (play && play.catch) play.catch(() => {
      if (banquet) banquet.songFailed = true;
    });
  }

  function stopBirthdaySong() {
    if (!bdaySong) return;
    bdaySong.pause();
    bdaySong.currentTime = 0;
    if (bgm && mode === "play" && !paused) bgm.play().catch(() => {});
  }

  function lightCandles() {
    if (!banquet || banquet.phase !== "candles") return;
    banquet.candlesLit = true;
    spawnCandleSparks();
    banquet.phase = "wishTab";
    banquet.t = 0;
    banquetCaption.textContent = "蜡烛灭了。点开许愿吧";
    banquetCaption.classList.remove("hidden");
    wishOverlay.classList.add("hidden");
    if (wishTab) wishTab.classList.remove("hidden");
    updateRoomTip();
  }

  function beginWish() {
    if (!banquet || banquet.phase !== "wishTab") return;
    banquet.phase = "wish";
    banquet.t = 0;
    banquet.wishLeft = 10000;
    banquetCaption.classList.add("hidden");
    if (wishTab) wishTab.classList.add("hidden");
    wishCount.textContent = "10";
    wishOverlay.classList.remove("hidden");
    updateRoomTip();
  }

  function endBanquet() {
    stopBirthdaySong();
    pausedBirthdayWasPlaying = false;
    if (paused) pausedBgmWasPlaying = true;
    banquetCaption.classList.add("hidden");
    wishOverlay.classList.add("hidden");
    if (wishTab) wishTab.classList.add("hidden");
    if (banquet && banquet.npcHome && room.npc) {
      room.npc.x = banquet.npcHome.x;
      room.npc.y = banquet.npcHome.y;
      room.npc.dir = banquet.npcHome.dir;
      room.npc.pose = "stand";
    }
    player.pose = "stand";
    husband.pose = "stand";
    banquet = null;
    if (banquetExitBtn) banquetExitBtn.classList.add("hidden");
    updateRoomTip();
  }

  function updateBanquet(dt) {
    if (!banquet) return;
    if (banquet.husband && banquet.husbandId) {
      husband.x = banquet.husband.x;
      husband.y = banquet.husband.y;
      husband.dir = banquet.husband.dir || "up";
      husband.pose = "sit";
      husband.moving = false;
    }
    if (banquet.pet && banquet.petId && profile.petFollow) {
      followPet.x = banquet.pet.x;
      followPet.y = banquet.pet.y;
      followPet.moving = false;
    }
    banquet.t += dt;
    if (banquet.phase === "serve") {
      if (banquet.t >= 2400) {
        banquet.phase = "choir";
        banquet.t = 0;
        banquetCaption.textContent = "kinkiki合唱团来给kyk唱生日歌啦";
        playBirthdaySong();
      }
    } else if (banquet.phase === "choir") {
      const songDone = !!(bdaySong && bdaySong.ended);
      const audioFallback = !bdaySong || (banquet.songFailed && banquet.t >= 6200);
      if (songDone || audioFallback) {
        stopBirthdaySong();
        banquet.phase = "candles";
        banquet.t = 0;
        banquetCaption.textContent = `${GIFT.playerName}，点击蜡烛吧`;
      }
    } else if (banquet.phase === "wish") {
      banquet.wishLeft -= dt;
      const sec = Math.max(0, Math.ceil(banquet.wishLeft / 1000));
      wishCount.textContent = String(sec);
      if (banquet.wishLeft <= 0) {
        wishOverlay.classList.add("hidden");
        banquet.phase = "speech";
        banquet.t = 0;
        talkI = 0;
        talkLines = ["虽然我不能在你身边陪你过生日，但是这样的形式也等于我在你身边啦"];
        talkThen = endBanquet;
        showTalk();
      }
    }
  }

  function blit() {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(view.c, 0, 0, canvas.width, canvas.height);
  }

  function updateFade(dt) {
    if (fadeDir === 1) {
      fade = Math.min(1, fade + dt / 280);
      if (fade >= 1 && pendingRoom) {
        enterRoom(pendingRoom, pendingSpawn);
        pendingRoom = null;
        fadeDir = -1;
      }
    } else if (fadeDir === -1) {
      fade = Math.max(0, fade - dt / 320);
      if (fade <= 0) fadeDir = 0;
    }
  }

  function hintText() {
    if (talking || uiOpen() || mode !== "play") return "";
    if (banquet) {
      if (banquet.phase === "candles") return "点击蜡烛";
      if (banquet.phase === "wishTab") return "点击许愿";
      if (banquet.phase === "wish") return "闭上眼睛许愿";
      return "";
    }
    const spot = hotspotNear();
    if (spot && spot.interact === "tv") return "按 E / 点击 看电视";
    if (spot && spot.interact === "book") return "按 E / 点击 翻留言簿";
    if (spot && spot.interact === "ipad") return "按 E / 点击 打开 bilibili";
    if (spot && spot.interact === "banquet") return "按 E / 点击 进入生日宴";
    if (spot && spot.interact === "menu") return "点击纸条看菜单";
    if (spot && spot.interact === "fridge") return "点击纸条看菜单 · E 打开冰箱";
    if (spot && spot.interact === "chips") return "幸福黄油薯片 ×6";
    if (spot && spot.interact === "sofa") return player.pose === "sit" ? "走一下就站起来" : "按 E / 点击 坐一会儿";
    if (spot && spot.interact === "fire") return "按 E / 点击 壁炉";
    if (spot && spot.interact === "tv") return "按 E / 点击 电视";
    if (spot && spot.interact === "snack") return "按 E / 点击 偷吃一口";
    if (spot && spot.interact === "mug") return "按 E / 点击 喝一口";
    if (spot && spot.interact === "pillow") return "按 E / 点击 抱枕";
    if (spot && spot.interact === "rug") return "按 E / 点击 躺下";
    if (spot && spot.interact === "shelf") return "按 E / 点击 抽一本书";
    if (spot && spot.interact === "photo") return "按 E / 点击 看看相框";
    if (spot && spot.interact === "plant") return "按 E / 点击 盆栽";
    if (spot && spot.interact === "lamp") return "按 E / 点击 台灯";
    if (spot && spot.interact === "curtain") return "按 E / 点击 窗帘";
    if (spot && spot.interact === "trash") return "按 E / 点击 垃圾桶";
    if (spot && spot.interact === "cabinet") return "按 E / 点击 柜子";
    if (spot && spot.interact === "marsh") return "Marshmallow";
    if (spot && spot.interact === "toilet") return player.pose === "sit" ? "按 E / 点击 冲水" : "按 E / 点击 马桶";
    if (spot && spot.interact === "lid") return "按 E / 点击 马桶盖";
    if (spot && spot.interact === "sink") return "按 E / 点击 洗手池";
    if (spot && spot.interact === "mirror") return "按 E / 点击 照镜子";
    if (spot && spot.interact === "brushes") return "按 E / 点击 牙刷杯";
    if (spot && spot.interact === "towel") return spot.dropped ? "按 E / 点击 捡起来" : "按 E / 点击 毛巾";
    if (spot && spot.interact === "tub") return "按 E / 点击 浴缸";
    if (spot && spot.interact === "laundry") return "按 E / 点击 洗衣篮";
    if (spot && spot.interact === "bathCab") return "按 E / 点击 厕所柜";
    if (spot && spot.interact === "paper") return "按 E / 点击 卷纸";
    if (spot && spot.interact === "scale") return "按 E / 点击 体重秤";
    if (spot && spot.interact === "duck") return "按 E / 点击 小黄鸭";
    if (spot && spot.interact === "spray") return "按 E / 点击 香薰";
    if (spot && spot.interact === "bathLock") return spot.locked ? "按 E / 点击 开门" : "按 E / 点击 锁门";
    if (spot && spot.interact === "projector") return "按 E / 点击 投影仪";
    if (spot && spot.interact === "seat") return player.pose === "sit" ? "走一下就站起来" : "按 E / 点击 坐下";
    if (spot && spot.interact === "lazy") return "按 E / 点击 懒人椅";
    if (spot && spot.interact === "popcorn") return "按 E / 点击 爆米花机";
    if (spot && spot.interact === "snackBar") return "按 E / 点击 零食柜";
    if (spot && spot.interact === "herCup") return "按 E / 点击 喝一口";
    if (spot && spot.interact === "myCup") return "按 E / 点击 饮料杯";
    if (spot && spot.interact === "remote") return "按 E / 点击 遥控器";
    if (spot && spot.interact === "movieLight") return "按 E / 点击 灯光";
    if (spot && spot.interact === "shade") return "按 E / 点击 遮光帘";
    if (spot && spot.interact === "dvd") return "按 E / 点击 影碟柜";
    if (spot && spot.interact === "guestBed") return "按 E / 点击 客床";
    if (spot && spot.interact === "guestPillow") return "按 E / 点击 枕头";
    if (spot && spot.interact === "guestWard") return "按 E / 点击 衣柜";
    if (spot && spot.interact === "drawer") return "按 E / 点击 抽屉";
    if (spot && spot.interact === "guestLamp") return "按 E / 点击 台灯";
    if (spot && spot.interact === "guestMug") return "按 E / 点击 喝一口";
    if (spot && spot.interact === "guestMirror") return "按 E / 点击 照镜子";
    if (spot && spot.interact === "slippers") return "按 E / 点击 客用拖鞋";
    if (spot && spot.interact === "guestDesk") return "按 E / 点击 书桌";
    if (spot && spot.interact === "guestBook") return "按 E / 点击 客房留言本";
    if (spot && spot.interact === "guestKey") return "按 E / 点击 备用钥匙";
    if (spot && spot.interact === "guestSnack") return "按 E / 点击 客人零食";
    if (spot && spot.interact === "guestFridge") return "按 E / 点击 小冰箱";
    if (spot && spot.interact === "plaque") return "按 E / 点击 门牌";
    if (spot && spot.interact === "statue") return "按 E / 点击 雕像";
    if (spot && spot.interact === "flower") return "按 E / 点击 花";
    if (spot && spot.interact === "can") return "按 E / 点击 浇水壶";
    if (spot && spot.interact === "swing") return "按 E / 点击 秋千";
    if (spot && spot.interact === "hammock" || spot && spot.interact === "hammockSit") return "按 E / 点击 坐下";
    if (spot && spot.interact === "picnic") return "按 E / 点击 野餐篮";
    if (spot && spot.interact === "fountain") return "按 E / 点击 喷泉";
    if (spot && spot.interact === "tools") return "按 E / 点击 园艺工具箱";
    if (spot && spot.interact === "veg") return "按 E / 点击 菜园";
    if (spot && spot.interact === "napGrass") return "按 E / 点击 躺下";
    if (spot && spot.interact === "puff") return "按 E / 点击 蒲公英";
    if (spot && spot.interact === "nest") return "按 E / 点击 小动物窝";
    if (spot && spot.interact === "coin") return "按 E / 点击 街机";
    if (spot && spot.interact === "duo") return "按 E / 点击 双人街机";
    if (spot && spot.interact === "bean") return player.stuck ? "再点一次站起来" : "按 E / 点击 懒人沙发";
    if (spot && spot.interact === "dance") return "按 E / 点击 跳舞毯";
    if (spot && spot.interact === "claw") return "按 E / 点击 抓娃娃机";
    if (spot && spot.interact === "hoop") return "按 E / 点击 投篮机";
    if (spot && spot.interact === "punch") return "按 E / 点击 拳击机";
    if (spot && spot.interact === "bag") return "按 E / 点击 沙袋";
    if (spot && spot.interact === "gacha") return "按 E / 点击 扭蛋机";
    if (spot && spot.interact === "gameSnack") return "按 E / 点击 零食架";
    if (spot && spot.interact === "gameFridge") return "按 E / 点击 迷你冰箱";
    const barHint = Bar.hint();
    if (barHint) return barHint;
    if (spot && spot.interact === "barSign") return Bar.isOpen() ? "按 E / 点击 打烊" : "按 E / 点击 营业";
    if (spot && spot.interact === "barMix") return "按 E / 点击 调酒";
    if (spot && spot.interact === "barBoard") return "按 E / 点击 菜单和升级";
    if (spot && spot.interact === "barCabinet") return "按 E / 点击 展示柜";
    if (spot && spot.interact === "barJar") return "按 E / 点击 钱罐";
    if (spot && spot.interact === "barWash") return "按 E / 点击 洗杯子";
    if (spot && spot.interact === "barBottles") return "按 E / 点击 酒瓶";
    if (spot && spot.interact === "barLamp") return "门口的小灯";
    if (spot && (spot.interact === "barStool" || spot.interact === "barSeat")) {
      return Bar.isOpen() ? "客人的位子" : (player.pose === "sit" ? "走一下就站起来" : "按 E / 点击 坐下");
    }
    const playHint = PetPlay.hint();
    if (playHint) return playHint;
    if (spot && spot.interact === "petStart") return "按 E / 点击 开始接零食";
    if (npcNear()) return "按 E / 点击 说话";
    return "";
  }

  function applyGameVolume() {
    for (const audio of [bgm, bdaySong]) {
      if (!audio) continue;
      audio.volume = gameVolume;
      audio.muted = gameMuted;
    }
    if (muteBtn) muteBtn.textContent = gameMuted ? "取消静音" : "静音";
    if (volumeBtn) volumeBtn.textContent = gameMuted ? "音量：关" : `音量 ${Math.round(gameVolume * 100)}%`;
  }

  function setPaused(next) {
    if (mode !== "play") return;
    paused = next;
    keys.clear();
    player.moving = false;
    if (paused) {
      pausedBgmWasPlaying = !!(bgm && !bgm.paused);
      pausedBirthdayWasPlaying = !!(bdaySong && !bdaySong.paused && !bdaySong.ended);
      if (bgm) bgm.pause();
      if (bdaySong) bdaySong.pause();
    } else if (pausedBirthdayWasPlaying && bdaySong) {
      bdaySong.play().catch(() => {});
    } else if (pausedBgmWasPlaying && bgm) {
      bgm.play().catch(() => {});
    }
    if (pauseBtn) pauseBtn.textContent = paused ? "继续" : "暂停";
    if (pauseOverlay) pauseOverlay.classList.toggle("hidden", !paused);
  }

  function drawScreenshotCharacter(out, img, ent, show, who, heightRatio) {
    if (!show || !ent || !img || !img.complete || !img.naturalWidth) return;
    const pose = ent.pose || "stand";
    const ratio = heightRatio || 0.185;
    const height = canvas.height * ratio * (pose === "sit" ? 0.72 : pose === "lie" ? 0.55 : 1);
    const width = height * (img.naturalWidth / (img.naturalHeight * (pose === "sit" ? 0.72 : pose === "lie" ? 0.55 : 1)));
    const seatDrop = pose === "sit" ? canvas.height * 0.04 : 0;
    const x = ((ent.x + 8 - cam.x) / VIEW_W) * canvas.width;
    const y = ((ent.y + 22 - cam.y) / VIEW_H) * canvas.height + seatDrop;
    out.save();
    out.imageSmoothingEnabled = true;
    out.translate(x, y);
    out.scale(ent.dir === "left" ? -1 : 1, 1);
    const srcH = img.naturalHeight * (pose === "sit" ? 0.72 : pose === "lie" ? 0.55 : 1);
    out.drawImage(img, 0, 0, img.naturalWidth, srcH, -width / 2, -height, width, height);
    out.restore();
  }

  function takeScreenshot() {
    const shot = document.createElement("canvas");
    shot.width = canvas.width;
    shot.height = canvas.height;
    const out = shot.getContext("2d");
    out.drawImage(canvas, 0, 0);
    const showActors = mode === "play" && !PetPlay.hidesFollowers();
    const barBusy = room.id === "bar" && Bar.isOpen();
    drawScreenshotCharacter(out, aikoCharacter, player, showActors, "player");
    drawScreenshotCharacter(out, seventeenCharacter, room.npc, showActors && !!room.npc && !room.npcOut, "npc");
    if (showActors && !barBusy && profile.husbandFollow && profile.husband) {
      drawScreenshotCharacter(out, husbandCharacter, husband, true, profile.husband, 0.185);
    }
    if (showActors && !barBusy && profile.petFollow && profile.pet) {
      drawScreenshotCharacter(out, petCharacter, followPet, true, profile.pet, 0.055);
    }
    out.font = 'bold 24px "PingFang SC", sans-serif';
    out.textAlign = "center";
    out.textBaseline = "middle";
    for (const d of room.connections) {
      const info = doorGuideInfo(d);
      const x = ((info.x - cam.x) / VIEW_W) * shot.width;
      const y = ((info.y - cam.y) / VIEW_H) * shot.height;
      const width = out.measureText(info.label).width + 30;
      out.fillStyle = "rgba(43,29,22,.9)";
      out.fillRect(x - width / 2, y - 18, width, 36);
      out.fillStyle = "#fff8dc";
      out.fillText(info.label, x, y + 1);
    }
    shot.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Aiko-17-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      toast("截图已保存");
    }, "image/png");
  }

  function tick(ts) {
    try {
      if (!last) last = ts;
      const dt = Math.min(34, ts - last);
      last = ts;
      if (!paused) {
        time += dt;
        if (blinkT > 0) blinkT -= dt;
        if (Math.random() < 0.003) blinkT = 140;
      }

      if (mode === "play" && !paused) {
        Bar.update(dt, room);
        PetPlay.update(dt, keys, room);
        updatePlayer(dt);
        faceNpc();
        updateParticles();
        updateFade(dt);
        updateBanquet(dt);
        updateLiving(dt);
        updateNpcWalk(dt);
        updateArcade(dt);
        const hint = hintText();
        interactHint.textContent = hint;
        interactHint.classList.toggle("hidden", !hint);
        updateRoomTip();
      } else if (mode !== "play" && !paused) {
        updateParticles();
      }
      if (!paused) updateCam();
      drawWorld();
      blit();
      updateWorldLabels();
      updateDoorGuides();
      updateCharacterOverlays();
      if (room.id === "garden") {
        hudRoom.textContent = "花园 · " + Art.dayCycle(time).label;
      }
    } catch (err) {
      window._gameErr = String(err && err.stack || err);
    }
    requestAnimationFrame(tick);
  }

  function showRules() {
    if (mode !== "title") return;
    titleScreen.classList.add("hidden");
    rulesScreen.classList.remove("hidden");
    rulesScreen.scrollTop = 0;
    const body = rulesScreen.querySelector(".rules-body");
    if (body) body.scrollTop = 0;
  }

  function startGame() {
    if (mode === "play") return;
    if (bgm) {
      applyGameVolume();
      bgm.play().catch(() => {});
    }
    if (rulesScreen && !rulesScreen.classList.contains("hidden")) {
      rulesScreen.classList.add("leaving");
    }
    titleScreen.classList.add("leaving");
    fade = 0;
    setTimeout(() => {
      titleScreen.classList.add("hidden");
      if (rulesScreen) {
        rulesScreen.classList.add("hidden");
        rulesScreen.classList.remove("leaving");
      }
      mode = "play";
      if (gameControls) gameControls.classList.remove("hidden");
      profileBtn.classList.remove("hidden");
      mapBtn.classList.remove("hidden");
      areaGuideBtn.classList.remove("hidden");
      player.x = 10.4 * TILE;
      player.y = 8.6 * TILE;
      player.dir = "down";
      enterRoom(World.rooms.garden, { x: player.x, y: player.y });
    }, 500);
  }

  function openBook() {
    hideTalk();
    closePanels();
    bookPanel.classList.remove("hidden");
    const pages = Math.max(1, Math.ceil(notes.length / PER_PAGE));
    bookPage = Math.min(bookPage, pages - 1);
    renderBook();
    setTimeout(() => bookInput.focus(), 30);
  }

  function renderBook() {
    const pages = Math.max(1, Math.ceil(notes.length / PER_PAGE));
    bookPage = Math.max(0, Math.min(bookPage, pages - 1));
    const start = bookPage * PER_PAGE;
    const slice = notes.slice(start, start + PER_PAGE);
    bookPages.innerHTML = slice
      .map((n) => {
        const d = new Date(n.ts);
        const when = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return `<div class="note"><span class="who">${escapeHtml(n.author)}</span><span class="when">${when}</span><div class="body">${escapeHtml(n.text)}</div></div>`;
      })
      .join("");
    bookInd.textContent = `${bookPage + 1} / ${pages}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function openTv() {
    hideTalk();
    closePanels();
    tvPanel.classList.remove("hidden");
  }

  function openMenu() {
    hideTalk();
    closePanels();
    menuPanel.classList.remove("hidden");
  }

  function openFridge() {
    hideTalk();
    closePanels();
    fridgePanel.classList.remove("hidden");
    Art.paintSprite(document.getElementById("food-beef"), Art.beefRoll, 24, 22, 4);
    Art.paintSprite(document.getElementById("food-foie"), Art.foieGras, 22, 22, 4);
    Art.paintSprite(document.getElementById("food-don"), Art.seafoodDon, 24, 22, 4);
  }

  function openChips() {
    hideTalk();
    closePanels();
    chipsPanel.classList.remove("hidden");
    Art.paintSprite(document.getElementById("chips-hero"), Art.chipStack, 28, 34, 6);
  }

  function useSpot(spot) {
    if (!spot) return false;
    if (spot.interact && String(spot.interact).indexOf("bar") === 0) {
      return Bar.handle(spot.interact, spot);
    }
    if (spot.interact === "book") {
      openBook();
      return true;
    }
    if (spot.interact === "ipad") {
      openIpad();
      return true;
    }
    if (spot.interact === "banquet") {
      startBanquet();
      return true;
    }
    if (spot.interact === "petStart") {
      PetPlay.openStart();
      return true;
    }
    if (spot.interact === "menu") {
      openMenu();
      return true;
    }
    if (spot.interact === "fridge") {
      openFridge();
      return true;
    }
    if (spot.interact === "chips") {
      openChips();
      return true;
    }
    if (spot.interact === "sofa") {
      if (player.pose === "sit") toast("再坐一会儿");
      else sitOnSofa();
      return true;
    }
    if (spot.interact === "fire") {
      useFire(spot);
      return true;
    }
    if (spot.interact === "tv") {
      cycleTv(spot);
      return true;
    }
    if (spot.interact === "snack") {
      if (spot.empty) toast("已经空了。");
      else {
        spot.empty = true;
        toast("偷吃一口");
      }
      return true;
    }
    if (spot.interact === "mug") {
      if (spot.empty) toast("已经空了。");
      else {
        spot.empty = true;
        toast("喝一口");
      }
      return true;
    }
    if (spot.interact === "pillow") {
      if (room.id === "movie") {
        openChoice("靠枕", "", [
          { label: "抱一下", fn() { usePillow(spot); } },
          { label: "扔出去", fn() { throwPillow(spot, false); } },
          { label: "砸向17", fn() { throwPillow(spot, true); } },
        ]);
      } else usePillow(spot);
      return true;
    }
    if (spot.interact === "rug") {
      lieOnRug();
      return true;
    }
    if (spot.interact === "shelf") {
      openChoice("抽到一本", pick([
        "《如何拯救你的恋爱脑闺蜜》",
        "《如何让闺蜜包养我》",
        "《怎么让闺蜜给我钱》",
        "《闺蜜经济学入门》",
        "《今晚谁洗碗》",
      ]), [{ label: "放回去", fn() {} }]);
      return true;
    }
    if (spot.interact === "photo") {
      openChoice("相框", "Aiko 和 17。没什么剧情，就是想把这一天留下来。", [{ label: "看完了", fn() {} }]);
      return true;
    }
    if (spot.interact === "plant") {
      spot.shake = 900;
      plantYank++;
      if (plantYank >= 2) {
        plantYank = 0;
        say17("别薅它。");
      } else toast("叶子晃了晃");
      return true;
    }
    if (spot.interact === "lamp") {
      spot.on = spot.on === false;
      lampFlips++;
      lampFlipAge = 0;
      toast(spot.on === false ? "关了" : "开了");
      if (lampFlips >= 4) {
        lampFlips = 0;
        say17("你是三岁吗？");
      }
      return true;
    }
    if (spot.interact === "curtain") {
      spot.curtain = !spot.curtain;
      toast(spot.curtain ? "拉上窗帘" : "拉开窗帘，往外探头看了一眼");
      return true;
    }
    if (spot.interact === "trash") {
      say17("我现在开始重新认识你了。");
      return true;
    }
    if (spot.interact === "cabinet") {
      spot.open = true;
      openChoice(
        "打开柜子",
        "里面有：零食、一只袜子、游戏手柄，还有一个写着「禁止打开」的盒子。",
        [
          { label: "先把柜子关上", fn() { spot.open = false; } },
          { label: "打开那个盒子", fn() { say17("……里面是一张我们的合照。"); } },
        ]
      );
      return true;
    }
    if (spot.interact === "marsh") {
      openChoice("Marshmallow", "17 的宠物狗。看起来像一颗会走路的棉花糖。", [
        { label: "rua 一下", fn() { say17("别把它rua成方的。"); } },
      ]);
      return true;
    }
    if (spot.interact === "toilet") {
      if (player.pose === "sit") flushToilet(spot);
      else {
        player.pose = "sit";
        player.dir = "down";
        player.moving = false;
        player.x = spot.x;
        player.y = spot.y + 2;
        toast("坐一下");
      }
      return true;
    }
    if (spot.interact === "lid") {
      const bowl = room.items.find((i) => i.interact === "toilet");
      if (bowl) {
        bowl.lidOpen = !bowl.lidOpen;
        lidFlips++;
        lidFlipAge = 0;
        toast(bowl.lidOpen ? "打开马桶盖" : "盖上了");
        if (lidFlips >= 5) {
          lidFlips = 0;
          say17("你到底想确认什么？");
        }
      }
      return true;
    }
    if (spot.interact === "sink") {
      openChoice("洗手池", "", [
        {
          label: "开水",
          fn() {
            spot.water = true;
            playSfx("water");
            toast("水开了");
          },
        },
        {
          label: "关水",
          fn() {
            spot.water = false;
            toast("关上了");
          },
        },
        {
          label: "洗手",
          fn() {
            spot.water = true;
            playSfx("water");
            toast("洗手");
          },
        },
      ]);
      return true;
    }
    if (spot.interact === "mirror") {
      const roll = Math.random();
      if (roll < 0.34) toast("今天也还行。");
      else if (roll < 0.67) toast("头发是不是有点乱？");
      else say17("看够了吗？");
      return true;
    }
    if (spot.interact === "brushes") {
      openChoice("牙刷杯", "", [
        { label: "这是她的牙刷", fn() { toast("那是 Aiko 的"); } },
        { label: "这是我的", fn() { say17("别碰我牙刷。"); } },
      ]);
      return true;
    }
    if (spot.interact === "towel") {
      if (spot.dropped) {
        spot.dropped = false;
        spot.yanks = 0;
        toast("捡起来了");
        return true;
      }
      spot.yanks = (spot.yanks || 0) + 1;
      spot.shake = 520;
      if (spot.yanks >= 3) {
        spot.dropped = true;
        say17("……捡起来。");
      } else toast("扯一下");
      return true;
    }
    if (spot.interact === "tub") {
      openChoice("浴缸", "", [
        {
          label: spot.water ? "把水关上" : "打开水",
          fn() {
            spot.water = !spot.water;
            if (spot.water) playSfx("water");
            toast(spot.water ? "水开了" : "关上了");
          },
        },
        {
          label: "站进去",
          fn() {
            spot.water = true;
            playSfx("water");
            player.pose = "stand";
            player.moving = false;
            player.x = spot.x + 10;
            player.y = spot.y + 6;
            toast("站进去了");
          },
        },
      ]);
      return true;
    }
    if (spot.interact === "laundry") {
      spot.looks = (spot.looks || 0) + 1;
      toast(spot.looks === 1 ? "全是袜子。" : "还是袜子。");
      return true;
    }
    if (spot.interact === "bathCab") {
      spot.open = true;
      openChoice(
        "打开柜子",
        "卷纸、洗发水、护肤品，还有一些莫名其妙的小东西。",
        [
          { label: "关上", fn() { spot.open = false; } },
          { label: "翻翻那些小东西", fn() { say17("别问。"); } },
        ]
      );
      return true;
    }
    if (spot.interact === "paper") {
      spot.paperLen = Math.min(22, (spot.paperLen || 0) + 3);
      spot.pulls = (spot.pulls || 0) + 1;
      toast("拉一下");
      if (spot.pulls >= 6) say17("停手。");
      return true;
    }
    if (spot.interact === "scale") {
      const sc = room.items.find((i) => i.interact === "scale");
      if (sc) sc.glow = "";
      const seq = pick([
        ["86", "19", "73"],
        ["4", "91", "28"],
        ["55", "55", "3"],
      ]);
      scaleAnim = {
        seq,
        i: 0,
        t: 160,
        final: pick(["？", "秘密"]),
      };
      toast(seq[0]);
      return true;
    }
    if (spot.interact === "duck") {
      quackAt(spot);
      return true;
    }
    if (spot.interact === "spray") {
      spot.sprays = (spot.sprays || 0) + 1;
      bathFog = Math.min(1, bathFog + 0.22);
      for (let i = 0; i < 10; i++) {
        particles.push({
          x: spot.x + 2 + Math.random() * 10,
          y: spot.y + Math.random() * 6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.2 - Math.random() * 0.25,
          life: 40,
          color: "rgba(200,230,210,0.8)",
          size: 2 + (Math.random() * 2) | 0,
        });
      }
      if (spot.sprays >= 5) say17("你想毒死谁？");
      else toast("喷一下");
      return true;
    }
    if (spot.interact === "bathLock") {
      spot.locked = !spot.locked;
      bathLocked = !!spot.locked;
      if (spot.locked) {
        room.npcOut = true;
        for (let i = 0; i < 8; i++) {
          particles.push({
            x: 10.4 * TILE + Math.random() * 16,
            y: 8 + Math.random() * 8,
            vx: (Math.random() - 0.5) * 0.3,
            vy: 0.2,
            life: 24,
            color: "#e8c878",
            size: 1,
          });
        }
        say17("你住里面了？");
      } else {
        room.npcOut = false;
        resetNpc(room.id);
        toast("打开了");
      }
      return true;
    }
    if (spot.interact === "projector") {
      useProjector(spot);
      return true;
    }
    if (spot.interact === "seat") {
      if (player.pose === "sit") toast("再坐一会儿");
      else {
        sitOnSeat(spot);
        if (room.id === "bar" && Bar.isOpen()) npcToast("现在可不是坐着的时候。");
      }
      return true;
    }
    if (spot.interact === "lazy") {
      openChoice("懒人椅", "坐下、躺下，还是直接瘫着？", [
        { label: "坐下", fn() { sitOnSeat(spot); } },
        { label: "躺下", fn() { sprawlOn(spot); } },
        { label: "瘫着", fn() { sprawlOn(spot); toast("瘫着"); } },
      ]);
      return true;
    }
    if (spot.interact === "popcorn") {
      spot.popping = true;
      spot.popT = 1400;
      spot.pops = (spot.pops || 0) + 1;
      toast("拿到一桶爆米花");
      if (spot.pops >= 4) {
        spot.mess = spot.mess || [];
        for (let i = 0; i < 14; i++) {
          spot.mess.push({
            x: spot.x + Math.random() * 36 - 8,
            y: spot.y + 14 + Math.random() * 18,
          });
        }
        if (spot.mess.length > 48) spot.mess.length = 48;
        if (!spot.spilled) {
          spot.spilled = true;
          say17("很好，现在地板也能吃了。");
        }
      }
      return true;
    }
    if (spot.interact === "snackBar") {
      toast("拿出" + pick(["薯片", "汽水", "巧克力", "已经放了不知道多久的饼干"]));
      return true;
    }
    if (spot.interact === "herCup") {
      if (spot.empty) toast("已经空了。");
      else {
        spot.sips = (spot.sips || 0) + 1;
        if (spot.sips >= 3) {
          spot.empty = true;
          toast("已经空了。");
        } else toast("喝一口");
      }
      return true;
    }
    if (spot.interact === "myCup") {
      say17("……那杯是我的。");
      return true;
    }
    if (spot.interact === "remote") {
      const screen = room.items.find((i) => i.interact === "projector");
      if (screen) {
        screen.on = true;
        screen.channel = (screen.channel % 4) + 1;
      }
      remoteAnnoy++;
      say17(["这个也不看？", "下一个也不看？", "你到底想看什么？"][Math.min(remoteAnnoy - 1, 2)]);
      return true;
    }
    if (spot.interact === "movieLight") {
      const order = ["on", "cinema", "off"];
      const idx = Math.max(0, order.indexOf(spot.mode || "on"));
      spot.mode = order[(idx + 1) % order.length];
      spot.on = spot.mode !== "off";
      movieLightFlips++;
      movieLightAge = 0;
      toast(spot.mode === "on" ? "开灯" : spot.mode === "off" ? "关灯" : "电影模式");
      if (movieLightFlips >= 4) {
        movieLightFlips = 0;
        say17("你再按一下我就把开关拆了。");
      }
      return true;
    }
    if (spot.interact === "shade") {
      spot.curtain = !spot.curtain;
      shadePulls++;
      shadePullAge = 0;
      toast(spot.curtain ? "拉上遮光帘" : "拉开了");
      if (shadePulls >= 4) {
        shadePulls = 0;
        say17("外面并没有发生任何变化。");
      }
      return true;
    }
    if (spot.interact === "dvd") {
      openChoice("翻到一盘", pick([
        "《绝对不看第二遍》",
        "《我以为这是纪录片》",
        "《走错放映厅》",
        "《字幕消失的那一晚》",
        "《爆米花比剧情重要》",
        "《导演请出来》",
      ]), [{ label: "塞回去", fn() {} }]);
      return true;
    }
    if (spot.interact === "guestBed") {
      openChoice("客床", "明明没人住，铺得倒是很齐。", [
        { label: "坐下", fn() { sitOnSeat(spot); noteGuestBed(); } },
        { label: "躺下", fn() { sprawlOn(spot); noteGuestBed(); } },
        { label: "钻被窝", fn() { sprawlOn(spot); toast("钻进被窝"); noteGuestBed(); } },
        {
          label: spot.blanketOff ? "把被子盖上" : "掀开被子",
          fn() {
            spot.blanketOff = !spot.blanketOff;
            spot.flips = (spot.flips || 0) + 1;
            if (spot.blanketOff && spot.flips >= 3 && !spot.secret) {
              spot.secret = Math.random() < 0.5 ? "plush" : "snack";
              toast(spot.secret === "plush" ? "藏着一只小熊。" : "藏着一包零食。");
            } else toast(spot.blanketOff ? "掀开了" : "盖上了");
          },
        },
      ]);
      return true;
    }
    if (spot.interact === "guestPillow") {
      openChoice("枕头", "", [
        { label: "抱一下", fn() { toast("抱一下"); } },
        { label: "拍一下", fn() { toast("拍一下"); spot.shake = 360; } },
        {
          label: "弄歪",
          fn() {
            const bed = room.items.find((i) => i.interact === "guestBed");
            if (bed) bed.pillowCrook = true;
            spot.x += 3;
            say17("你为什么连没人睡的床都要弄乱？");
          },
        },
      ]);
      return true;
    }
    if (spot.interact === "guestWard") {
      openChoice("给客人准备的衣服", "挂着几套备用的，其中一件不太对。", [
        { label: "米色外套", fn() { toast("给客人的"); } },
        { label: "条纹睡衣", fn() { toast("给客人的"); } },
        { label: "一件粉色裙子", fn() { say17("……那个不是给客人的。"); } },
      ]);
      return true;
    }
    if (spot.interact === "drawer") {
      openChoice("抽屉", pick([
        "备用充电器。",
        "纸巾。",
        "发圈。",
        "创可贴。",
        "一颗石头。完全不知道为什么在这里。",
      ]), [{ label: "关上", fn() {} }]);
      return true;
    }
    if (spot.interact === "guestLamp") {
      spot.on = spot.on === false;
      toast(spot.on === false ? "关了" : "开了");
      return true;
    }
    if (spot.interact === "guestMug") {
      if (spot.empty) toast("已经空了。");
      else {
        spot.empty = true;
        say17("很好，客人还没来，水先被你喝了。");
      }
      return true;
    }
    if (spot.interact === "guestMirror") {
      toast("换个房间照，脸也没变。");
      return true;
    }
    if (spot.interact === "slippers") {
      player.slippers = true;
      player.slipperTold = false;
      toast("客用拖鞋");
      return true;
    }
    if (spot.interact === "guestDesk") {
      openChoice("书桌", "", [
        { label: "坐下来", fn() { sitOnSeat(spot); } },
        {
          label: "点一下纸笔",
          fn() {
            openChoice("写下的留言", pick([
              "此房间暂无客人",
              "入住评分：床很软，NPC很吵",
              "请把拖鞋留在房间内",
              "今天也想赖着不走",
            ]), [{ label: "放下笔", fn() {} }]);
          },
        },
      ]);
      return true;
    }
    if (spot.interact === "guestBook") {
      const notes = [
        "五星好评，但是主人一直来查房。",
        "凌晨三点听见有人偷吃零食。",
        "床很软。隔壁一直有人说话。",
        "此房间暂无客人。",
        "目前唯一住客：某个明明有自己房间的人。",
      ];
      const i = spot.page || 0;
      openChoice("客房留言本", notes[i], [
        {
          label: i >= notes.length - 1 ? "合上" : "翻下一页",
          fn() {
            if (i < notes.length - 1) {
              spot.page = i + 1;
              useSpot(spot);
            } else spot.page = 0;
          },
        },
      ]);
      return true;
    }
    if (spot.interact === "guestKey") {
      if (spot.taken) say17("你拿它干嘛？门又没锁。");
      else {
        spot.taken = true;
        toast("客房钥匙。");
      }
      return true;
    }
    if (spot.interact === "guestSnack") {
      spot.takes = (spot.takes || 0) + 1;
      toast("偷吃" + pick(["薯片", "糖果", "小饼干"]));
      if (spot.takes === 1) say17("那个是客人的。");
      else if (spot.takes === 2) say17("你吃第二个了。");
      else say17("我们家是不是根本不需要客人了？");
      return true;
    }
    if (spot.interact === "guestFridge") {
      spot.open = !spot.open;
      if (spot.open) {
        openChoice("小冰箱", "专门给客人备的饮料。", [
          {
            label: "拿一瓶",
            fn() {
              spot.takes = (spot.takes || 0) + 1;
              toast("拿了一瓶");
              if (spot.takes === 1) say17("那个是客人的。");
              else if (spot.takes === 2) say17("你吃第二个了。");
              else say17("我们家是不是根本不需要客人了？");
            },
          },
          { label: "关上", fn() { spot.open = false; } },
        ]);
      } else toast("关上了");
      return true;
    }
    if (spot.interact === "plaque") {
      spot.flipped = !spot.flipped;
      toast(spot.flipped ? "闲人勿进" : "Guest Room");
      return true;
    }
    if (spot.interact === "statue") {
      toast(pick(["大理石雕像", "金桂冠还在发光", "好像在守着这栋别墅"]));
      return true;
    }
    if (spot.interact === "flower") {
      spot.shake = 500;
      spot.pokes = (spot.pokes || 0) + 1;
      if (spot.pokes === 1) toast("晃了一下");
      else {
        toast("闻了一下");
        say17("别薅，看看就行。");
      }
      return true;
    }
    if (spot.interact === "can") {
      const flowers = room.items.filter((i) => i.interact === "flower");
      let nearest = flowers[0];
      let best = Infinity;
      for (const f of flowers) {
        const d = Math.hypot(player.x - f.x, player.y - f.y);
        if (d < best) {
          best = d;
          nearest = f;
        }
      }
      if (!nearest) return true;
      if (nearest.watered) say17("它不是鱼。");
      else {
        nearest.watered = true;
        nearest.shake = 420;
        sparkle(nearest.x + 8, nearest.y + 4);
        toast("浇了一下");
      }
      return true;
    }
    if (spot.interact === "swing") {
      if (player.onSwing) {
        player.swingHigh = true;
        spot.high = true;
        toast("荡高一点");
      } else {
        sitOnSeat(spot);
        player.onSwing = true;
        spot.high = false;
      }
      return true;
    }
    if (spot.interact === "hammock" || spot.interact === "hammockSit") {
      sitOnSeat(spot);
      player.onHammock = true;
      toast("轻轻晃");
      return true;
    }
    if (spot.interact === "picnic") {
      spot.looks = (spot.looks || 0) + 1;
      if (spot.looks === 1) toast("拿出" + pick(["三明治", "水果", "饼干"]));
      else say17("你是在确认会不会凭空长出新的？");
      return true;
    }
    if (spot.interact === "fountain") {
      spot.splash = 1800;
      playSfx("water");
      toast("水花变大了");
      return true;
    }
    if (spot.interact === "tools") {
      spot.open = true;
      openChoice("园艺工具箱", "铲子、手套、小剪刀。", [
        { label: "铲子", fn() { toast("铲子"); } },
        { label: "手套", fn() { toast("手套"); } },
        {
          label: "小剪刀",
          fn() {
            toast("修剪");
            const f = room.items.find((i) => i.interact === "flower");
            if (f) f.shake = 700;
            setTimeout(() => {
              toast("又剪一下");
              if (f) f.shake = 500;
            }, 400);
          },
        },
        { label: "关上", fn() { spot.open = false; } },
      ]);
      return true;
    }
    if (spot.interact === "veg") {
      if (!spot.ripe) {
        toast("摸了一下");
        say17("……你真的很急。");
      } else if (spot.picked) toast("已经摘过了");
      else {
        spot.picked = true;
        toast("摘一个，直接吃了");
      }
      return true;
    }
    if (spot.interact === "napGrass") {
      sprawlOn(spot);
      toast("躺在草地上");
      return true;
    }
    if (spot.interact === "puff") {
      if (spot.blown) toast("已经飞走了");
      else {
        spot.blown = true;
        for (let i = 0; i < 8; i++) {
          particles.push({
            x: spot.x + 4,
            y: spot.y + 4,
            vx: 0.4 + Math.random() * 0.6,
            vy: -0.35 - Math.random() * 0.3,
            life: 50,
            color: "#f4f0d8",
            size: 1,
          });
        }
        toast("吹了一下");
      }
      return true;
    }
    if (spot.interact === "nest") {
      const who = pick(["marsh", "cotton", "tangtang"]);
      gardenPet = { id: who, x: spot.x + 4, y: spot.y - 2, t: 5200 };
      toast(who === "marsh" ? "Marshmallow 钻出来了" : who === "cotton" ? "棉花出现了" : "糖糖出现了");
      return true;
    }
    if (spot.interact === "coin") {
      startCoinGame();
      return true;
    }
    if (spot.interact === "duo") {
      toast("17 走过来了");
      const nx = spot.x + 18;
      const ny = spot.y + 26;
      walkNpcTo(nx, ny, () => {
        const result = pick(["you", "me", "tie"]);
        if (result === "you") {
          toast("你赢了");
          say17("再来。");
        } else if (result === "me") {
          toast("我赢了");
          say17("承让。");
        } else {
          toast("平局");
          say17("再来。");
        }
      });
      return true;
    }
    if (spot.interact === "bean") {
      if (player.stuck) {
        startStruggle();
        return true;
      }
      sitOnSeat(spot);
      player.stuck = true;
      say17("完了，出不来了。");
      return true;
    }
    if (spot.interact === "dance") {
      player.dance = 1000;
      toast("↑  ↓  ←  →");
      return true;
    }
    if (spot.interact === "claw") {
      if (Math.random() < 0.22) {
        toast("掉出来：" + pick(["一只缺耳朵的兔子", "一颗长得像石头的糖", "一只袜子"]));
        say17("……居然？");
      } else {
        toast("抓空了");
        say17("经典。");
      }
      return true;
    }
    if (spot.interact === "hoop") {
      const inShot = Math.random() < 0.42;
      toast(inShot ? "进了" : "没进");
      if (inShot) hoopMiss = 0;
      else {
        hoopMiss++;
        if (hoopMiss >= 3) {
          hoopMiss = 0;
          say17("至少姿势很好看。");
        }
      }
      return true;
    }
    if (spot.interact === "punch") {
      const score = 10 + ((Math.random() * 990) | 0);
      spot.flash = 400;
      toast("分数 " + score);
      if (score < 80) say17("我没看见。");
      else if (score > 850) say17("你平时是不是对我有意见？");
      return true;
    }
    if (spot.interact === "bag") {
      spot.hits = (spot.hits || 0) + 1;
      spot.shake = 280;
      toast("打一下");
      if (spot.hits >= 8) {
        spot.hits = 0;
        say17("它已经道歉了。");
      }
      return true;
    }
    if (spot.interact === "gacha") {
      toast("获得：一只长得很蠢的青蛙。");
      say17("这个很像你。");
      return true;
    }
    if (spot.interact === "gameSnack") {
      toast("拿走" + pick(["薯片", "糖", "汽水"]));
      say17("放回去。");
      return true;
    }
    if (spot.interact === "gameFridge") {
      if (!spot.open) {
        spot.open = true;
        toast("打开了");
      } else if (!spot.took) {
        spot.took = true;
        toast("拿了一瓶饮料");
      } else {
        spot.open = false;
        toast("关上了");
      }
      return true;
    }
    return false;
  }

  function noteGuestBed() {
    guestBedUses++;
    if (guestBedUses === 3) say17("你自己没床吗？");
    else if (guestBedUses === 4) say17("行，那今晚客房归你。");
  }

  function sparkle(x, y) {
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: x + Math.random() * 8,
        y: y + Math.random() * 6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.25,
        life: 28,
        color: pick(["#fff8c8", "#ffe878", "#ffffff"]),
        size: 1,
      });
    }
  }

  function startStruggle() {
    if (player.struggle > 0) return;
    player.struggle = 700;
    toast("挣扎");
  }

  function walkNpcTo(x, y, then) {
    if (!room.npc || room.npcOut) {
      if (then) then();
      return;
    }
    npcWalk = { x, y, then };
  }

  function updateNpcWalk(dt) {
    if (room.id === "bar" && Bar.isOpen()) return;
    if (!npcWalk || !room.npc || room.npcOut) return;
    const dx = npcWalk.x - room.npc.x;
    const dy = npcWalk.y - room.npc.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 1.6) {
      room.npc.x = npcWalk.x;
      room.npc.y = npcWalk.y;
      room.npc.moving = false;
      const fn = npcWalk.then;
      npcWalk = null;
      if (fn) fn();
      return;
    }
    room.npc.moving = true;
    const sp = 1.4 * (dt / 16.67);
    room.npc.x += (dx / dist) * sp;
    room.npc.y += (dy / dist) * sp;
    if (Math.abs(dx) > Math.abs(dy)) room.npc.dir = dx > 0 ? "right" : "left";
    else room.npc.dir = dy > 0 ? "down" : "up";
  }

  function startCoinGame() {
    hideTalk();
    closePanels();
    arcade = {
      t: 12000,
      score: 0,
      need: 6,
      x: 148,
      coins: [],
      spawn: 0,
    };
    if (arcadeOverlay) arcadeOverlay.classList.remove("hidden");
    drawArcade();
  }

  function endArcade(win) {
    if (arcadeOverlay) arcadeOverlay.classList.add("hidden");
    const result = win;
    arcade = null;
    if (result === true) say17("这机器肯定有问题。");
    else if (result === false) say17("很有实力。");
  }

  function updateArcade(dt) {
    if (!arcade) return;
    arcade.t -= dt;
    arcade.spawn -= dt;
    if (keys.has("arrowleft") || keys.has("a")) arcade.x -= 2.4 * (dt / 16.67);
    if (keys.has("arrowright") || keys.has("d")) arcade.x += 2.4 * (dt / 16.67);
    arcade.x = Math.max(8, Math.min(288, arcade.x));
    if (arcade.spawn <= 0) {
      arcade.spawn = 420 + Math.random() * 280;
      arcade.coins.push({ x: 16 + Math.random() * 288, y: -6, vy: 0.9 + Math.random() * 0.5 });
    }
    const next = [];
    for (const c of arcade.coins) {
      c.y += c.vy * (dt / 16.67) * 1.8;
      if (c.y > 152 && c.y < 168 && c.x > arcade.x - 4 && c.x < arcade.x + 28) {
        arcade.score++;
        continue;
      }
      if (c.y < 190) next.push(c);
    }
    arcade.coins = next;
    if (arcadeHud) arcadeHud.textContent = `接金币  ${arcade.score} / ${arcade.need}`;
    drawArcade();
    if (arcade.score >= arcade.need) {
      endArcade(true);
      return;
    }
    if (arcade.t <= 0) endArcade(false);
  }

  function drawArcade() {
    if (!arcadeCtx || !arcade) return;
    const a = arcadeCtx;
    a.imageSmoothingEnabled = false;
    a.fillStyle = "#14101c";
    a.fillRect(0, 0, 320, 180);
    a.fillStyle = "#2a2438";
    a.fillRect(0, 168, 320, 12);
    a.fillStyle = "#e8c878";
    a.fillRect(arcade.x, 158, 24, 6);
    a.fillStyle = "#f0d050";
    for (const c of arcade.coins) a.fillRect(c.x, c.y, 6, 6);
  }

  function flushToilet(it) {
    it.flushing = 400;
    flushCount++;
    playSfx("water");
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: it.x + 4 + Math.random() * 8,
        y: it.y + 12,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.4,
        life: 16,
        color: "#c8e4f0",
        size: 1,
      });
    }
    toast("冲水");
    if (flushCount >= 3) {
      flushCount = 0;
      say17("你在玩马桶吗？");
    }
  }

  function quackAt(target) {
    duckSpam++;
    duckSpamAge = 0;
    if (target && target.bounce != null) target.bounce = 280;
    playSfx("quack");
    toast("嘎");
    if (duckSpam >= 8) {
      duckSpam = 0;
      say17("它已经求你放过它了。");
    }
  }

  function useProjector(it) {
    openChoice(it.on === false || !it.channel ? "投影仪 · 现在是黑的" : "投影仪", "", [
      {
        label: it.on === false ? "打开" : "关掉",
        fn() {
          it.on = it.on === false;
          if (it.on && !it.channel) it.channel = 1;
          toast(it.on ? "打开了" : "关掉了");
        },
      },
      { label: "恐怖片", fn() { setMovieChannel(it, 1); } },
      { label: "爱情片", fn() { setMovieChannel(it, 2); } },
      { label: "烂俗狗血片", fn() { setMovieChannel(it, 3); } },
      { label: "动物纪录片", fn() { setMovieChannel(it, 4); } },
    ]);
  }

  function setMovieChannel(it, ch) {
    it.on = true;
    it.channel = ch;
    say17({
      1: "你晚上还睡得着吗。",
      2: "又是这一套。",
      3: "编剧出来挨打。",
      4: "这集我可以看。",
    }[ch]);
  }

  function placeWorldLabel(el, wx, wy, show) {
    if (!el) return;
    if (!show) {
      el.classList.add("hidden");
      return;
    }
    if (wx < 10 || wy < 10 || wx > VIEW_W - 10 || wy > VIEW_H - 18) {
      el.classList.add("hidden");
      return;
    }
    const rect = canvas.getBoundingClientRect();
    el.style.left = `${(wx / VIEW_W) * rect.width}px`;
    el.style.top = `${(wy / VIEW_H) * rect.height}px`;
    el.classList.remove("hidden");
  }

  function updateWorldLabels() {
    const hideAll = mode !== "play" || banquet || uiOpen() || talking;
    const chips = room.id === "kitchen" ? room.items.find((i) => i.kind === "chipStack") : null;
    placeWorldLabel(
      chipLabel,
      chips ? chips.x + 14 - cam.x : 0,
      chips ? chips.y - 2 - cam.y : 0,
      !hideAll && !!chips
    );
    const dog = room.id === "pet" ? room.items.find((i) => i.kind === "marshmallow") : null;
    placeWorldLabel(
      marshLabel,
      dog ? dog.x + 8 - cam.x : 0,
      dog ? dog.y - 2 - cam.y : 0,
      !hideAll && !!dog
    );
  }

  function openIpad() {
    window.open("https://www.bilibili.com/", "_blank", "noopener");
  }

  function openMap() {
    if (banquet || PetPlay.isPlaying()) return;
    if (Bar.isOpen() && document.getElementById("bar-close-panel") && !document.getElementById("bar-close-panel").classList.contains("hidden")) return;
    hideTalk();
    closePanels();
    mapPanel.classList.remove("hidden");
    renderMap();
  }

  function renderMap() {
    const grid = document.getElementById("house-map");
    grid.innerHTML = "";
    for (const floor of [1, 2]) {
      const section = document.createElement("section");
      section.className = "map-floor";
      const title = document.createElement("h3");
      title.textContent = floor === 1 ? "一楼" : "二楼";
      section.appendChild(title);
      const floorGrid = document.createElement("div");
      floorGrid.className = "map-floor-grid";
      for (const cell of World.MAP.filter((entry) => entry.floor === floor)) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "map-cell" + (room.id === cell.id ? " here" : "");
        btn.textContent = World.NAMES[cell.id];
        btn.style.gridColumn = String(cell.c);
        btn.style.gridRow = String(cell.r);
        btn.addEventListener("click", () => travelTo(cell.id));
        floorGrid.appendChild(btn);
      }
      section.appendChild(floorGrid);
      grid.appendChild(section);
    }
  }

  function travelTo(id) {
    if (PetPlay.isPlaying()) return;
    if (Bar.isOpen()) {
      toast("先打烊才能离开");
      return;
    }
    if (banquet) endBanquet();
    hideTalk();
    closePanels();
    const next = World.rooms[id];
    const spawn = World.MAP_SPAWN && World.MAP_SPAWN[id];
    if (!next || !spawn || id === room.id) return;
    fade = 0;
    fadeDir = 0;
    pendingRoom = null;
    enterRoom(next, spawn);
  }

  function openProfile() {
    if (banquet || PetPlay.isPlaying()) return;
    hideTalk();
    closePanels();
    profilePanel.classList.remove("hidden");
    renderProfile();
  }

  function renderProfile() {
    husbandFollowEl.checked = !!profile.husbandFollow;
    petFollowEl.checked = !!profile.petFollow;

    const husGrid = document.getElementById("husband-grid");
    husGrid.innerHTML = "";
    for (const [id, label] of [["jk", "JK"], ["qinche", "秦彻"]]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-card" + (profile.husband === id ? " on" : "");
      const c = document.createElement("canvas");
      c.width = 96;
      c.height = 120;
      btn.appendChild(c);
      const name = document.createElement("div");
      name.className = "name";
      name.textContent = label;
      btn.appendChild(name);
      btn.addEventListener("click", () => {
        profile.husband = id;
        saveStore();
        renderProfile();
      });
      husGrid.appendChild(btn);
      Art.stampPortrait(id, c);
      const img = Art.portraits[id];
      if (img && !img.complete) img.addEventListener("load", () => Art.stampPortrait(id, c), { once: true });
    }

    const petGrid = document.getElementById("pet-grid");
    petGrid.innerHTML = "";
    for (const [id, label] of [["cotton", "棉花"], ["tangtang", "糖糖"]]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-card" + (profile.pet === id ? " on" : "");
      const c = document.createElement("canvas");
      c.width = 96;
      c.height = 120;
      btn.appendChild(c);
      const name = document.createElement("div");
      name.className = "name";
      name.textContent = label;
      btn.appendChild(name);
      btn.addEventListener("click", () => {
        profile.pet = id;
        saveStore();
        renderProfile();
      });
      petGrid.appendChild(btn);
      Art.stampPortrait(id, c);
      const img = Art.portraits[id];
      if (img && !img.complete) img.addEventListener("load", () => Art.stampPortrait(id, c), { once: true });
    }
  }

  function onInteract() {
    if (mode !== "play" || fadeDir !== 0 || uiOpen()) return;
    if (PetPlay.isPlaying()) {
      if (talking) {
        talkI++;
        if (talkI >= talkLines.length) hideTalk();
        else showTalk();
        return;
      }
      PetPlay.ability();
      return;
    }
    if (banquet) {
      if (talking) {
        talkI++;
        if (talkI >= talkLines.length) hideTalk();
        else showTalk();
      }
      return;
    }
    if (talking) {
      talkI++;
      if (talkI >= talkLines.length) hideTalk();
      else showTalk();
      return;
    }
    const spot = hotspotNear();
    if (Bar.isOpen() && Bar.tryServe()) return;
    if (useSpot(spot)) return;
    if (npcNear()) startNpcTalk();
  }

  function typing() {
    const el = document.activeElement;
    return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => document.getElementById(btn.dataset.close).classList.add("hidden"));
  });
  document.getElementById("menu-to-fridge").addEventListener("click", () => openFridge());
  document.getElementById("fridge-to-menu").addEventListener("click", () => openMenu());
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t === tab));
      document.querySelectorAll(".tab-page").forEach((p) => p.classList.toggle("on", p.dataset.page === tab.dataset.tab));
    });
  });
  profileBtn.addEventListener("click", openProfile);
  mapBtn.addEventListener("click", openMap);
  areaGuideBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAreaGuide();
  };
  husbandFollowEl.addEventListener("change", () => {
    profile.husbandFollow = husbandFollowEl.checked;
    if (profile.husbandFollow) snapFollowers();
    saveStore();
  });
  petFollowEl.addEventListener("change", () => {
    profile.petFollow = petFollowEl.checked;
    if (profile.petFollow) snapFollowers();
    saveStore();
  });
  document.getElementById("book-prev").addEventListener("click", () => {
    bookPage--;
    renderBook();
  });
  document.getElementById("book-next").addEventListener("click", () => {
    bookPage++;
    renderBook();
  });
  document.getElementById("book-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = bookInput.value.trim();
    if (!text) return;
    notes.push({ author: GIFT.playerName, text, ts: Date.now() });
    bookInput.value = "";
    bookPage = Math.floor((notes.length - 1) / PER_PAGE);
    saveStore();
    renderBook();
  });

  canvas.addEventListener("click", (e) => {
    if (paused) return;
    if (mode !== "play" || uiOpen()) return;
    if (PetPlay.isPlaying()) {
      onInteract();
      return;
    }
    if (banquet) {
      if (talking) {
        onInteract();
        return;
      }
      if (banquet.phase !== "candles") return;
      const rect = canvas.getBoundingClientRect();
      const wx = ((e.clientX - rect.left) / rect.width) * VIEW_W + cam.x;
      const wy = ((e.clientY - rect.top) / rect.height) * VIEW_H + cam.y;
      const box = cakeBox();
      if (wx >= box.x && wx <= box.x + box.w && wy >= box.y && wy <= box.y + box.h) lightCandles();
      return;
    }
    if (talking) {
      onInteract();
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const wx = ((e.clientX - rect.left) / rect.width) * VIEW_W + cam.x;
    const wy = ((e.clientY - rect.top) / rect.height) * VIEW_H + cam.y;
    if (Bar.tryClick(wx, wy)) return;
    if (PetPlay.tryClick(wx, wy)) return;
    for (const d of ducks) {
      if (wx >= d.x - 2 && wx <= d.x + 12 && wy >= d.y + 4 && wy <= d.y + 20) {
        if (Math.hypot(player.x + 8 - (d.x + 4), player.y + 14 - (d.y + 10)) > 70) break;
        quackAt(d);
        return;
      }
    }
    if (room.npc && !room.npcOut) {
      const nx = room.npc.x;
      const ny = room.npc.y;
      if (wx >= nx && wx <= nx + 16 && wy >= ny && wy <= ny + 22) {
        startNpcTalk();
        return;
      }
    }
    const hits = [];
    for (const it of room.items) {
      if (!it.interact) continue;
      if (it.hidden && it.interact !== "pillow") continue;
      const b = interactBox(it);
      if (wx >= it.x && wx <= it.x + b.w && wy >= it.y && wy <= it.y + b.h) {
        hits.push({ it, area: b.w * b.h });
      }
    }
    hits.sort((a, b) => a.area - b.area);
    const hit = hits[0] && hits[0].it;
    if (hit) {
      const b = interactBox(hit);
      if (Math.hypot(player.x + 8 - (hit.x + b.w / 2), player.y + 14 - (hit.y + b.h / 2)) > 70) return;
      useSpot(hit);
      return;
    }
    const rug = room.items.find((i) => i.interact === "rug");
    if (rug && wx >= rug.x && wx <= rug.x + rug.w && wy >= rug.y && wy <= rug.y + rug.h) {
      if (Math.hypot(player.x + 8 - wx, player.y + 14 - wy) > 70) return;
      lieOnRug(wx, wy);
    }
  });

  roomTip.addEventListener("click", () => {
    if (room.id === "guest") travelTo("upperHall");
    if (room.id === "kitchen" && !banquet) startBanquet();
    if (room.id === "pet" && !PetPlay.isPlaying()) PetPlay.openStart();
    if (room.id === "bar") Bar.handle("barSign");
  });

  talkBox.addEventListener("click", () => {
    if (talking) onInteract();
  });

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) e.preventDefault();
    if (k === " " && !typing()) e.preventDefault();
    keys.add(k);
    if (mode === "title" && (k === " " || k === "enter")) {
      startGame();
    }
    if (mode === "play" && paused) {
      if (k === "escape") setPaused(false);
      return;
    }
    if (mode === "play" && (k === " " || k === "enter") && Bar.confirmRulesKey()) {
      e.preventDefault();
      return;
    }
    if (k === "escape") {
      if (arcade) {
        endArcade(false);
        return;
      }
      if (PetPlay.isPlaying()) {
        PetPlay.quit();
        return;
      }
      if (Bar.onEsc()) return;
      closePanels();
      hideTalk();
      if (banquet && banquet.phase !== "speech") endBanquet();
    }
    if ((k === "p" && mode === "play" && !typing() && !banquet && !arcade && !PetPlay.isPlaying())) {
      if (profilePanel.classList.contains("hidden")) openProfile();
      else closePanels();
    }
    if (k === "m" && mode === "play" && !typing() && !banquet && !arcade && !PetPlay.isPlaying()) {
      if (mapPanel.classList.contains("hidden")) openMap();
      else closePanels();
    }
    if ((k === "e" || k === "z" || k === " ") && !typing()) onInteract();
  });
  window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
  startBtn.addEventListener("click", startGame);
  if (rulesOk) rulesOk.addEventListener("click", startGame);
  if (pauseBtn) pauseBtn.addEventListener("click", () => setPaused(!paused));
  if (volumeBtn) volumeBtn.addEventListener("click", () => volumePanel && volumePanel.classList.toggle("hidden"));
  if (muteBtn) muteBtn.addEventListener("click", () => {
    gameMuted = !gameMuted;
    applyGameVolume();
  });
  if (volumeSlider) volumeSlider.addEventListener("input", () => {
    gameVolume = Number(volumeSlider.value) / 100;
    if (gameVolume > 0) gameMuted = false;
    applyGameVolume();
  });
  if (screenshotBtn) screenshotBtn.addEventListener("click", takeScreenshot);
  if (banquetExitBtn) banquetExitBtn.addEventListener("click", endBanquet);
  if (wishTab) wishTab.addEventListener("click", beginWish);
  applyGameVolume();

  PetPlay.bind({
    toast,
    npcToast,
    say17,
    pick,
    openChoice,
    getPlayer: () => player,
    getNpc: () => room.npc,
    getRoom: () => room,
    addParticle: (p) => particles.push(p),
    onMatchStart() {
      const sofa = room.items.find((i) => i.kind === "sofa");
      player.pose = "sit";
      player.dir = "down";
      player.moving = false;
      if (sofa) {
        player.x = sofa.x + 6;
        player.y = sofa.y + 3;
        if (room.npc) {
          room.npc.pose = "sit";
          room.npc.dir = "down";
          room.npc.x = sofa.x + 26;
          room.npc.y = sofa.y + 3;
        }
      }
      updateRoomTip();
    },
    onMatchEnd() {
      player.pose = "stand";
      player.x = 4.4 * TILE;
      player.y = 4.8 * TILE;
      resetNpc(room.id);
      updateRoomTip();
    },
  });

  Bar.bind({
    toast,
    npcToast,
    pick,
    saveStore,
    getPlayer: () => player,
    getNpc: () => room.npc,
    getRoom: () => room,
    addParticle: (p) => particles.push(p),
    sit: sitOnSeat,
    onWallet() {
      Bar.refreshHud();
    },
  });
  Bar.refreshHud();

  hudRoom.textContent = "花园";
  window.HomeDebug = {
    start: startGame,
    state() {
      return { id: room.id, mode, talking, ui: uiOpen(), tip: roomTip.className, fadeDir, fade, banquet: banquet && banquet.phase };
    },
    banquet: startBanquet,
    err() {
      return window._gameErr || null;
    },
    setTime(t) {
      time = t;
      return Art.dayCycle(time);
    },
    getTime() {
      return time;
    },
    go(id, x, y) {
      titleScreen.classList.add("hidden");
      if (rulesScreen) rulesScreen.classList.add("hidden");
      mode = "play";
      profileBtn.classList.remove("hidden");
      mapBtn.classList.remove("hidden");
      areaGuideBtn.classList.remove("hidden");
      fade = 0;
      fadeDir = 0;
      hideTalk();
      enterRoom(World.rooms[id], { x: x != null ? x : 10.5 * TILE, y: y != null ? y : 6.5 * TILE });
    },
    pet(who) {
      this.go("pet", 10.5 * TILE, 5.5 * TILE);
      PetPlay.start(who === "tangtang" ? "tangtang" : "cotton");
    },
    talk() {
      startNpcTalk();
    },
    bar() {
      titleScreen.classList.add("hidden");
      if (rulesScreen) rulesScreen.classList.add("hidden");
      mode = "play";
      profileBtn.classList.remove("hidden");
      mapBtn.classList.remove("hidden");
      areaGuideBtn.classList.remove("hidden");
      fade = 0;
      fadeDir = 0;
      hideTalk();
      enterRoom(World.rooms.bar, { x: 16.4 * TILE, y: 4.8 * TILE });
    },
    openBar() {
      Bar.startShift();
    },
    gold(n) {
      Bar.wallet = n;
      Bar.refreshHud();
    },
    use(interact) {
      const it = room.items.find((i) => i.interact === interact);
      if (!it) return null;
      const b = interactBox(it);
      if (player.pose === "stand") {
        player.x = it.x + Math.max(0, b.w / 2 - 8);
        player.y = it.y + Math.max(0, b.h / 2);
      }
      useSpot(it);
      return interact;
    },
  };
  requestAnimationFrame(tick);
})();
