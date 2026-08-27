/* Pet room mini-game: 接零食 */
const PetPlay = (() => {
  const T = 16;
  const GOAL = 10;
  const MAX_MISSES = 3;
  const NAMES = { cotton: "棉花", tangtang: "糖糖", marsh: "Marshmallow" };
  const HUD = {
    box: document.getElementById("petplay-hud"),
    scores: document.getElementById("petplay-scores"),
    line: document.getElementById("petplay-line"),
    ability: document.getElementById("petplay-ability"),
    count: document.getElementById("petplay-count"),
    exit: document.getElementById("petplay-exit"),
  };

  let api = {};
  let match = null;
  let lounge = null;

  function bind(next) {
    api = next || {};
    if (HUD.exit && !HUD.exit.dataset.bound) {
      HUD.exit.dataset.bound = "1";
      HUD.exit.addEventListener("click", quit);
    }
  }
  function isPlaying() { return !!match; }
  function isBusy() { return !!match; }

  function refreshHud() {
    if (!HUD.box) return;
    if (!match) {
      HUD.box.classList.add("hidden");
      if (HUD.count) HUD.count.classList.add("hidden");
      return;
    }
    HUD.box.classList.remove("hidden");
    if (HUD.scores) {
      HUD.scores.innerHTML = `<span class="mine">${NAMES[match.playerId]} ·你　🍪 ${match.caught}/${GOAL}</span><span>漏掉　${match.missed}/${MAX_MISSES}</span>`;
    }
    if (HUD.line) HUD.line.textContent = match.line || "";
    if (HUD.ability) HUD.ability.textContent = "只用 ← → 或 A D 移动 · 接住掉下来的零食";
    if (HUD.count) {
      if (match.phase === "countdown") {
        HUD.count.textContent = match.countText || "3";
        HUD.count.classList.remove("hidden");
      } else HUD.count.classList.add("hidden");
    }
  }

  function openPick() {
    if (match || !api.openChoice) return;
    api.openChoice("选择接零食的宠物", "棉花和糖糖都只需要左右移动。", [
      { label: "🐱 棉花", fn() { start("cotton"); } },
      { label: "🐶 糖糖", fn() { start("tangtang"); } },
    ]);
  }

  function openStart() {
    if (match || !api.openChoice) return;
    api.openChoice(
      "宠物接零食",
      [
        "零食会从上方掉下来，左右移动宠物把它接住。",
        "",
        `接到 ${GOAL} 个就获胜，漏掉 ${MAX_MISSES} 个游戏结束。`,
        "",
        "操作只有 ← → 或 A D。也可以点击宠物左边或右边移动。",
        "",
        "Esc 可以随时退出。",
      ].join("\n"),
      [{ label: "看懂了，选择宠物", fn() { openPick(); } }]
    );
  }

  function start(playerId) {
    const room = api.getRoom && api.getRoom();
    if (!room || room.id !== "pet") return;
    lounge = null;
    match = {
      playerId: playerId === "tangtang" ? "tangtang" : "cotton",
      phase: "countdown",
      t: 0,
      countText: "3",
      caught: 0,
      missed: 0,
      spawnT: 650,
      line: "准备接零食！",
      tapDir: 0,
      tapT: 0,
      pet: { x: 9.6 * T, y: 7.25 * T, dir: "down", moving: false, pose: "stand" },
      marsh: { x: 15.2 * T, y: 7.25 * T, dir: "left", moving: false, pose: "sit" },
      snacks: [],
    };
    if (api.onMatchStart) api.onMatchStart();
    if (api.npcToast) api.npcToast("接住十个就算你厉害。");
    refreshHud();
  }

  function spawnSnack() {
    if (!match) return;
    const kinds = ["cookies", "chips", "cake", "fries"];
    match.snacks.push({
      x: 3.4 * T + Math.random() * 12.8 * T,
      y: 2.4 * T,
      vy: 0.62 + Math.random() * 0.18 + match.caught * 0.018,
      id: kinds[(Math.random() * kinds.length) | 0],
      spin: Math.random() * 10,
    });
  }

  function finish(won) {
    if (!match || match.phase === "end") return;
    match.phase = "end";
    match.t = 0;
    match.line = won ? "全部接住啦！" : "零食掉太多了。";
    match.won = won;
    match.pet.pose = won ? "wag" : "sit";
    refreshHud();
    if (api.say17) api.say17(won ? "可以嘛，再来一局？" : "没关系，掉地上的给 Marshmallow。 ");
  }

  function endToLounge() {
    lounge = {
      pets: {
        cotton: { x: 7.4 * T, y: 5.35 * T, pose: "sleep" },
        marsh: { x: 9.15 * T, y: 5.55 * T, pose: "sleep" },
        tangtang: { x: 10.9 * T, y: 5.4 * T, pose: "sleep" },
      },
    };
    match = null;
    refreshHud();
    if (api.onMatchEnd) api.onMatchEnd();
    if (api.toast) api.toast("三只又躺到一起了");
  }

  function update(dt, keys, room) {
    if (!match) return;
    if (!room || room.id !== "pet") {
      leaveRoom();
      return;
    }
    if (match.phase === "countdown") {
      match.t += dt;
      if (match.t < 650) match.countText = "3";
      else if (match.t < 1300) match.countText = "2";
      else if (match.t < 1950) match.countText = "1";
      else if (match.t < 2450) match.countText = "GO！";
      else {
        match.phase = "play";
        match.line = "";
      }
      refreshHud();
      return;
    }
    if (match.phase === "end") {
      match.t += dt;
      if (match.t > 3000) endToLounge();
      return;
    }

    let dir = 0;
    if (keys.has("arrowleft") || keys.has("a")) dir -= 1;
    if (keys.has("arrowright") || keys.has("d")) dir += 1;
    if (!dir && match.tapT > 0) dir = match.tapDir;
    match.tapT = Math.max(0, match.tapT - dt);
    const pet = match.pet;
    pet.moving = dir !== 0;
    if (dir) {
      pet.dir = dir < 0 ? "left" : "right";
      pet.x += dir * 1.55 * (dt / 16.67);
      pet.x = Math.max(2.6 * T, Math.min(17 * T, pet.x));
    }

    match.spawnT -= dt;
    if (match.spawnT <= 0) {
      spawnSnack();
      match.spawnT = Math.max(520, 980 - match.caught * 28);
    }

    const catchX = pet.x + 8;
    const catchY = pet.y + 6;
    for (let i = match.snacks.length - 1; i >= 0; i--) {
      const s = match.snacks[i];
      s.y += s.vy * (dt / 16.67);
      s.spin += dt * 0.01;
      if (Math.abs(s.x + 5 - catchX) < 15 && Math.abs(s.y + 5 - catchY) < 13) {
        match.snacks.splice(i, 1);
        match.caught++;
        match.line = "接到了！";
        if (api.addParticle) {
          for (let n = 0; n < 6; n++) api.addParticle({ x: s.x + 5, y: s.y, vx: (Math.random() - 0.5), vy: -0.5, life: 22, color: "#ffe878", size: 1 });
        }
        refreshHud();
        if (match.caught >= GOAL) finish(true);
        continue;
      }
      if (s.y > 8.5 * T) {
        match.snacks.splice(i, 1);
        match.missed++;
        match.line = "掉了一个……";
        refreshHud();
        if (match.missed >= MAX_MISSES) finish(false);
      }
    }
  }

  function drawPet(v, id, pet, time) {
    Art.drawShadow(v, pet.x, pet.y + 12, 14);
    const bob = pet.moving ? Math.sin(time / 120) * 1.2 : 0;
    if (!Art.drawPetSprite(v, id, pet.x, pet.y, { h: 20, bob })) {
      const frame = pet.pose === "sleep" ? Art.petArt[id].sleep : Art.petFrame(id, !!pet.moving, time);
      v.drawImage(frame, pet.x, pet.y);
    }
  }

  function drawables(v, time, profile) {
    const out = [];
    if (match) {
      for (const s of match.snacks) {
        out.push({ y: s.y + 10, draw() { Art.snackPlate(v, s.x, s.y, s.id); } });
      }
      out.push({ y: match.pet.y + 14, draw() { drawPet(v, match.playerId, match.pet, time); } });
      out.push({ y: match.marsh.y + 14, draw() { drawPet(v, "marsh", match.marsh, time); } });
      return out;
    }
    if (lounge) {
      for (const [id, pet] of Object.entries(lounge.pets)) {
        out.push({ y: pet.y + 14, draw() { drawPet(v, id, pet, time); } });
      }
      return out;
    }
    const idle = {
      cotton: { x: 4.1 * T, y: 6.5 * T, pose: "stand" },
      tangtang: { x: 14.2 * T, y: 6.4 * T, pose: "stand" },
    };
    const follow = profile && profile.petFollow && profile.pet;
    for (const id of ["cotton", "tangtang"]) {
      if (follow === id) continue;
      const pet = idle[id];
      out.push({ y: pet.y + 14, draw() { drawPet(v, id, pet, time); } });
    }
    return out;
  }

  function tryClick(wx) {
    if (!match || match.phase !== "play") return false;
    match.tapDir = wx < match.pet.x + 8 ? -1 : 1;
    match.tapT = 420;
    return true;
  }

  function ability() {}
  function cameraTarget() { return null; }
  function hint() { return match ? "← → / A D 移动接零食" : ""; }

  function quit() {
    if (!match) return;
    match = null;
    refreshHud();
    if (api.onMatchEnd) api.onMatchEnd();
    if (api.toast) api.toast("下次再接");
  }

  function leaveRoom() {
    match = null;
    lounge = null;
    refreshHud();
  }

  return {
    bind, isPlaying, isBusy, openStart, start, quit, leaveRoom, ability,
    update, drawables, cameraTarget, tryClick, hint,
    hidesFollowers() { return !!match; },
  };
})();
