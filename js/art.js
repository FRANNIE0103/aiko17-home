/* Pixel art atelier — Stardew-inspired stamps, tiles, characters, furniture */
const Art = (() => {
  const TILE = 16;

  const C = {
    void: "#1a100c",
    shadow: "rgba(30,18,12,0.35)",
    wood1: "#e2b87a",
    wood2: "#c99254",
    wood3: "#a36b36",
    wood4: "#6e4020",
    wood5: "#4a2814",
    darkWood1: "#8a5a32",
    darkWood2: "#6a4024",
    darkWood3: "#3e2414",
    pinkWood1: "#e8c4a8",
    pinkWood2: "#d4a088",
    grass1: "#4f9a2e",
    grass2: "#3d7d22",
    grass3: "#6bb83c",
    grass4: "#2f6418",
    grassHi: "#8fd45a",
    dirt1: "#c4a05a",
    dirt2: "#a88248",
    dirt3: "#8a6838",
    stone1: "#b8b0a0",
    stone2: "#8a8274",
    stone3: "#6a6258",
    water1: "#3a7cae",
    water2: "#2a5e8c",
    water3: "#5aa4c8",
    water4: "#1e4468",
    wallCream: "#f0ddb8",
    wallTrim: "#7a4a28",
    wallPink: "#f0c0c8",
    wallNight: "#2a2438",
    wallSage: "#c8d4b8",
    wallPeach: "#f0d4c0",
    wallLav: "#d4c4e0",
    wallInk: "#16141c",
    brick1: "#b85a48",
    brick2: "#8a3c30",
    fire1: "#ffee88",
    fire2: "#ffb040",
    fire3: "#ee5a20",
    leaf1: "#3d8a2a",
    leaf2: "#64b43a",
    leaf3: "#2a6418",
    flowerR: "#e85a6a",
    flowerY: "#f0d050",
    flowerP: "#d080d0",
    flowerW: "#f4f0e8",
    skin: "#f3c49a",
    skinS: "#dca070",
    eye: "#1a1418",
    hairBlk: "#16141c",
    hairBlkH: "#2c2838",
    hairY: "#f0c43c",
    hairYS: "#c89418",
    hairYH: "#ffe878",
    dressBlk: "#1a1824",
    dressBlkH: "#2e2a3c",
    dressP: "#f08ab0",
    dressPD: "#d45a88",
    dressPH: "#ffb0cc",
    shoe: "#2a2228",
    white: "#f8f4ec",
    cream: "#f4e8c8",
    gold: "#e8c878",
    goldHi: "#f8e8a0",
    marble: "#f4ead8",
    marbleD: "#d8ccb4",
    slate: "#2a3048",
    slateH: "#4a5878",
    red: "#c44a48",
    ink: "#2a1c14",
  };

  const DAY_MS = 52000;

  function mix3(a, b, t) {
    const k = Math.max(0, Math.min(1, t));
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  }

  function dayCycle(t) {
    const p = (((t % DAY_MS) + DAY_MS) % DAY_MS) / DAY_MS;
    const ang = p * Math.PI * 2;
    const day = (Math.cos(ang) + 1) / 2;
    const night = 1 - day;
    let label = "夜晚";
    if (day > 0.62) label = "白天";
    else if (day > 0.32) label = p < 0.5 ? "黄昏" : "黎明";
    else label = "夜晚";
    return { p, ang, day, night, label };
  }

  function gardenAmbient(t) {
    const { p, day, night } = dayCycle(t);
    const warm = p < 0.5 ? [255, 96, 52] : [255, 172, 118];
    const dayTop = [126, 186, 230];
    const dayBot = [255, 220, 150];
    const nightTop = [8, 12, 36];
    const nightBot = [16, 10, 32];
    let top;
    let bot;
    if (day > 0.5) {
      const k = (day - 0.5) * 2;
      top = mix3(warm, dayTop, k);
      bot = mix3([255, 168, 96], dayBot, k);
    } else {
      const k = day * 2;
      top = mix3(nightTop, warm, k);
      bot = mix3(nightBot, [255, 140, 80], k);
    }
    const topA = 0.05 + night * 0.42;
    const botA = 0.08 + night * 0.34;
    return {
      top: [top[0] | 0, top[1] | 0, top[2] | 0, topA],
      bottom: [bot[0] | 0, bot[1] | 0, bot[2] | 0, botA],
      mul: [0.72 + day * 0.28, 0.76 + day * 0.24, 0.92 + day * 0.08],
      p,
      day,
      night,
    };
  }

  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return { c, ctx };
  }

  function r(ctx, x, y, w, h, color) {
    if (!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(x | 0, y | 0, w, h);
  }

  function p(ctx, x, y, color) {
    r(ctx, x, y, 1, 1, color);
  }

  function stamp(ctx, x, y, rows, pal) {
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j];
      for (let i = 0; i < row.length; i++) {
        const col = pal[row[i]];
        if (col) p(ctx, x + i, y + j, col);
      }
    }
  }

  function compile(rows, pal) {
    const { c, ctx } = makeCanvas(rows[0].length, rows.length);
    stamp(ctx, 0, 0, rows, pal);
    return c;
  }

  function flipH(src) {
    const { c, ctx } = makeCanvas(src.width, src.height);
    ctx.translate(src.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(src, 0, 0);
    return c;
  }

  function hash(x, y) {
    let n = (x * 374761393 + y * 668265263) | 0;
    n = (n ^ (n >>> 13)) * 1274126177;
    return Math.abs(n);
  }

  function rnd(x, y, k) {
    return (hash(x, y + k * 17) % 1000) / 1000;
  }

  /* ---------- tiles ---------- */
  const tiles = {};

  function woodTile(variant, palette) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    const [a, b, d, line] = palette;
    r(ctx, 0, 0, 16, 16, variant % 2 ? a : b);
    for (let i = 0; i < 16; i++) {
      if (rnd(variant, i, 1) > 0.72) p(ctx, i, (i * 3 + variant) % 15, d);
      if (rnd(variant, i, 2) > 0.82) p(ctx, (i * 5) % 16, i, a);
    }
    r(ctx, 0, 15, 16, 1, line);
    if (variant % 3 === 0) r(ctx, 7, 0, 1, 15, d);
    else r(ctx, 0, 0, 1, 15, d);
    return c;
  }

  function grassTile(variant) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    const stripe = ((variant >> 1) & 1) === 0;
    r(ctx, 0, 0, 16, 16, stripe ? "#3c8a36" : "#2f7a2c");
    r(ctx, 0, 0, 16, 1, stripe ? "#4a9a40" : "#378434");
    for (let i = 0; i < 10; i++) {
      const x = hash(variant, i) % 16;
      const y = hash(variant + 3, i) % 16;
      p(ctx, x, y, i % 2 ? "#58b44a" : "#246820");
    }
    if (variant % 9 === 0) {
      p(ctx, 5, 7, "#c45a68");
      p(ctx, 10, 11, C.gold);
    }
    return c;
  }

  function pathTile(variant) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 0, 0, 16, 16, variant % 2 ? "#e8dcc4" : "#f2ead8");
    r(ctx, 0, 0, 16, 1, "#d4c4a4");
    r(ctx, 0, 0, 1, 16, "#d4c4a4");
    r(ctx, 15, 0, 1, 16, "#c8b898");
    r(ctx, 0, 15, 16, 1, "#c8b898");
    if (variant % 2 === 0) r(ctx, 7, 1, 2, 14, "#e8c878");
    else r(ctx, 1, 7, 14, 2, "#e8c878");
    p(ctx, 3, 4, "#fff8ec");
    p(ctx, 12, 11, "#c4b090");
    return c;
  }

  function stoneTile(variant) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 0, 0, 16, 16, "#e4d8c0");
    r(ctx, 1, 1, 7, 7, variant % 2 ? "#f4ead8" : "#d8ccb4");
    r(ctx, 9, 2, 6, 6, "#cfc3ab");
    r(ctx, 3, 9, 10, 6, "#e8dcc8");
    r(ctx, 0, 7, 16, 1, "#d4a040");
    r(ctx, 8, 0, 1, 16, "#d4a040");
    p(ctx, 4, 3, "#fff8ec");
    return c;
  }

  function hedgeTile(variant) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 0, 0, 16, 16, "#1e4a1c");
    r(ctx, 1, 1, 14, 13, variant % 2 ? "#2f6e28" : "#3a7e30");
    r(ctx, 2, 2, 12, 4, "#4c9840");
    p(ctx, 4, 7, "#6ab848");
    p(ctx, 11, 10, "#164016");
    r(ctx, 0, 14, 16, 2, "#143814");
    r(ctx, 0, 0, 16, 1, "#5aaa4a");
    p(ctx, 7, 1, "#d4a040");
    p(ctx, 8, 0, "#f8e8a0");
    return c;
  }

  function waterTile(variant, t) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 0, 0, 16, 16, C.water2);
    const o = (variant + (t | 0)) % 8;
    r(ctx, 0, 0, 16, 16, o > 4 ? C.water1 : C.water2);
    p(ctx, (2 + o) % 16, 4, C.water3);
    p(ctx, (9 + o * 2) % 16, 11, C.water3);
    r(ctx, 0, 0, 16, 1, C.water4);
    return c;
  }

  function bathTile(variant) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    const light = variant % 2 === 0;
    r(ctx, 0, 0, 16, 16, light ? "#e8f0ee" : "#c8dcd8");
    r(ctx, 0, 0, 16, 1, "#a8c0bc");
    r(ctx, 0, 0, 1, 16, "#a8c0bc");
    return c;
  }

  function carpetTile(base, hi, lo, variant) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 0, 0, 16, 16, base);
    for (let i = 0; i < 8; i++) p(ctx, hash(variant, i) % 16, hash(i, variant + 2) % 16, hi);
    if (variant % 2 === 0) {
      r(ctx, 0, 0, 16, 1, lo);
      r(ctx, 0, 0, 1, 16, lo);
    }
    return c;
  }

  function checkTile(a, b) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 0, 0, 16, 16, a);
    r(ctx, 0, 0, 8, 8, b);
    r(ctx, 8, 8, 8, 8, b);
    return c;
  }

  function fenceTile(kind) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 3, 3, 2, 13, "#16141c");
    r(ctx, 11, 3, 2, 13, "#16141c");
    r(ctx, 2, 0, 4, 4, "#d4a040");
    r(ctx, 10, 0, 4, 4, "#d4a040");
    p(ctx, 3, 0, "#f8e8a0");
    p(ctx, 11, 0, "#f8e8a0");
    r(ctx, 0, 6, 16, 2, "#1c1824");
    r(ctx, 0, 11, 16, 2, "#1c1824");
    if (kind === "gate") {
      r(ctx, 0, 0, 16, 16, null);
      r(ctx, 0, 8, 16, 2, "#d4a040");
    }
    return c;
  }

  function wallFace(color, trim, rail) {
    const { c, ctx } = makeCanvas(TILE, TILE);
    r(ctx, 0, 0, 16, 16, color);
    r(ctx, 0, 14, 16, 2, trim || C.wallTrim);
    r(ctx, 0, 13, 16, 1, rail || C.wood3);
    return c;
  }

  function initTiles() {
    tiles.wood = [0, 1, 2, 3, 4, 5].map((v) => woodTile(v, [C.wood1, C.wood2, C.wood3, C.wood4]));
    tiles.darkWood = [0, 1, 2, 3].map((v) => woodTile(v, [C.darkWood1, C.darkWood2, C.wood5, C.darkWood3]));
    tiles.pinkWood = [0, 1, 2, 3].map((v) => woodTile(v, [C.pinkWood1, C.pinkWood2, "#c88870", "#a06050"]));
    tiles.grass = [0, 1, 2, 3, 4, 5, 6, 7].map(grassTile);
    tiles.path = [0, 1, 2, 3].map(pathTile);
    tiles.stone = [0, 1, 2, 3].map(stoneTile);
    tiles.hedge = [0, 1, 2, 3].map(hedgeTile);
    tiles.bath = [0, 1, 2, 3].map(bathTile);
    tiles.redCarpet = [0, 1, 2, 3].map((v) => carpetTile("#6a2030", "#8a3044", "#4a1420", v));
    tiles.navyCarpet = [0, 1, 2, 3].map((v) => carpetTile("#243044", "#2c3c58", "#1a2434", v));
    tiles.purpleRug = [0, 1, 2, 3].map((v) => carpetTile("#5a3a68", "#7a5488", "#3a2448", v));
    tiles.sage = [0, 1, 2, 3].map((v) => woodTile(v, ["#d8e0c8", "#c4d0b0", "#a0b090", "#708060"]));
    tiles.cream = [0, 1, 2, 3].map((v) => carpetTile("#efe4cc", "#f6edd8", "#d4c4a0", v));
    tiles.checkA = checkTile("#efe4c8", "#d8b888");
    tiles.checkB = checkTile("#d8b888", "#efe4c8");
    tiles.fence = fenceTile("post");
    tiles.wallCream = wallFace(C.wallCream);
    tiles.wallPink = wallFace(C.wallPink);
    tiles.wallNight = wallFace(C.wallNight);
    tiles.wallSage = wallFace(C.wallSage);
    tiles.wallPeach = wallFace(C.wallPeach);
    tiles.wallLav = wallFace(C.wallLav);
    tiles.wallInk = wallFace(C.wallInk, "#0c0a10", "#2a2430");
    tiles.blank = makeCanvas(TILE, TILE).c;
  }

  function tileFor(type, tx, ty, time) {
    const v = hash(tx, ty) & 7;
    switch (type) {
      case "grass": return tiles.grass[v];
      case "path": return tiles.path[v & 3];
      case "stone": return tiles.stone[v & 3];
      case "wood": return tiles.wood[v % 6];
      case "darkWood": return tiles.darkWood[v & 3];
      case "pinkWood": return tiles.pinkWood[v & 3];
      case "bath": return tiles.bath[v & 3];
      case "redCarpet": return tiles.redCarpet[v & 3];
      case "navy": return tiles.navyCarpet[v & 3];
      case "purple": return tiles.purpleRug[v & 3];
      case "sage": return tiles.sage[v & 3];
      case "cream": return tiles.cream[v & 3];
      case "check": return ((tx + ty) & 1) === 0 ? tiles.checkA : tiles.checkB;
      case "fence": return tiles.fence;
      case "hedge": return tiles.hedge[v & 3];
      case "water": return waterTile(v, time * 0.004);
      default: return tiles.wood[0];
    }
  }

  function wallTile(theme) {
    return tiles["wall" + theme] || tiles.wallCream;
  }

  /* ---------- characters ---------- */
  const palPlayer = {
    ".": null,
    H: C.hairBlk,
    h: C.hairBlkH,
    s: C.skin,
    S: C.skinS,
    e: C.eye,
    d: C.dressBlk,
    D: C.dressBlkH,
    k: C.skin,
    o: C.shoe,
    w: "#f4eef8",
    m: "#8f294f",
    M: "#c44770",
  };

  const palNpc = {
    ".": null,
    H: C.hairYS,
    h: C.hairY,
    Y: C.hairYH,
    s: C.skin,
    S: C.skinS,
    e: C.eye,
    d: C.dressPD,
    D: C.dressP,
    p: C.dressPH,
    k: C.skin,
    o: "#6f432d",
    w: "#fffaf2",
  };

  /* Slimmer signature sprites: Aiko is dark and sharp; 17 is soft and feminine. */
  const aikoMaps = {
    down: [
      ".....HHHHH......", "....HHHHHHH.....", "...HHssssHHH....", "...HhseseshH....",
      "....HssssH......", ".....sSss.......", ".....HDDDDH.....", ".....DmmmmD.....",
      ".....DmMMmD.....", "......DDDD......", ".....dddddd.....", "....dddddddd....",
      "......d..d......", "......k..k......", "......k..k......", "......k..k......",
      "......o..o......", ".....oo..oo.....", ".....oo..oo.....", "................",
    ],
    up: [
      ".....HHHHH......", "....HHHHHHH.....", "...HHHHHHHHH....", "...HHHHHHHHH....",
      "....HHHHHHH.....", ".....HHHHH......", ".....HDDDDH.....", ".....DmmmmD.....",
      ".....DmmmmD.....", "......DDDD......", ".....dddddd.....", "....dddddddd....",
      "......d..d......", "......k..k......", "......k..k......", "......k..k......",
      "......o..o......", ".....oo..oo.....", ".....oo..oo.....", "................",
    ],
    left: [
      "......HHHH......", "....HHHHHHH.....", "...HHssssHH.....", "...HhssesHH.....",
      "....HssssH......", ".....sSs........", ".....HDDDH......", ".....DmmmD......",
      ".....DmMMd......", "......Dmmm......", ".....ddddd......", "....dddddd......",
      "......d.d.......", "......k.k.......", "......k.k.......", "......k.k.......",
      "......o.o.......", ".....oo.oo......", ".....oo.oo......", "................",
    ],
    sitDown: [
      ".....HHHHH......", "....HHHHHHH.....", "...HHssssHHH....", "...HhseseshH....",
      "....HssssH......", ".....sSss.......", "....HDDDDHH.....", "...HDmmmmDH.....",
      "...dddddddd.....", "....kk....kk....", "....oo....oo....", "................",
    ],
    sitUp: [
      ".....HHHHH......", "....HHHHHHH.....", "...HHHHHHHHH....", "....HHHHHHH.....",
      ".....HHHHH......", "....HDDDDHH.....", "...HDmmmmDH.....", "...dddddddd.....",
      "....kk....kk....", "....oo....oo....", "................", "................",
    ],
    lie: [
      "................",
      "................",
      "..HHHHH.........",
      ".HssssHDmmmkoo..",
      ".HesesHDdddkoo..",
      "..sSssHdddd.....",
      "................",
      "................",
    ],
  };

  const seventeenMaps = {
    down: [
      "....pHHHHHp.....", "....HHHHHHH.....", "...HHssssHHH....", "...HhseseshH....",
      "....HssssH......", ".....sSss.......", ".....pwwp.......", ".....wwww.......",
      ".....wpww.......", ".....wwww.......", ".....dddd.......", "....dddddd......",
      "...dddddddd.....", "......k..k......", "......k..k......", "......k..k......",
      "......w..w......", "......o..o......", ".....oo..oo.....", "................",
    ],
    up: [
      "....pHHHHHp.....", "....HHHHHHH.....", "...HHHHHHHHH....", "...HHHHHHHHH....",
      "....HHHHHHH.....", ".....HHHHH......", ".....pwwp.......", ".....wwww.......",
      ".....wwww.......", ".....wwww.......", ".....dddd.......", "....dddddd......",
      "...dddddddd.....", "......k..k......", "......k..k......", "......k..k......",
      "......w..w......", "......o..o......", ".....oo..oo.....", "................",
    ],
    left: [
      ".....pHHHH......", "....HHHHHHH.....", "...HHssssHH.....", "...HhssesHH.....",
      "....HssssH......", ".....sSs........", ".....pwww.......", ".....wwww.......",
      ".....wpww.......", ".....wwww.......", ".....dddd.......", "....dddddd......",
      "....dddddd......", "......k.k.......", "......k.k.......", "......k.k.......",
      "......w.w.......", "......o.o.......", ".....oo.oo......", "................",
    ],
    sitDown: [
      "....pHHHHHp.....", "....HHHHHHH.....", "...HHssssHHH....", "...HhseseshH....",
      "....HssssH......", ".....sSss.......", "....pwwwwp......", "...wwwwwwww.....",
      "...dddddddd.....", "....kk....kk....", "....oo....oo....", "................",
    ],
    sitUp: [
      "....pHHHHHp.....", "....HHHHHHH.....", "...HHHHHHHHH....", "....HHHHHHH.....",
      ".....HHHHH......", "....pwwwwp......", "...wwwwwwww.....", "...dddddddd.....",
      "....kk....kk....", "....oo....oo....", "................", "................",
    ],
    lie: [
      "................",
      "................",
      "..pHHHHH........",
      ".HssssHwwwdkoo..",
      ".HesesHddddkoo..",
      "..sSssHdddd.....",
      "................",
      "................",
    ],
  };

  const girlDown = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHssssHH....",
    "...HHsessesh....",
    "....HssssssH....",
    ".....sSsss......",
    "...HHHddddHHH...",
    "..HHhddddddhHH..",
    "..HHddDDddddHH..",
    "..HhddddddddhH..",
    "...HddddddddH...",
    "...HddddddddH...",
    "...HddddddddH...",
    "....dddddddd....",
    "....ddd..ddd....",
    "....kk....kk....",
    "....oo....oo....",
    "................",
  ];

  const girlDownW1 = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHssssHH....",
    "...HHsessesh....",
    "....HssssssH....",
    ".....sSsss......",
    "...HHHddddHHH...",
    "..HHhddddddhHH..",
    "..HHddDDddddHH..",
    "..HhddddddddhH..",
    "...HddddddddH...",
    "...HddddddddH...",
    "...HddddddddH...",
    "....dddddddd....",
    "....dddd.dd.....",
    "....kk...kk.....",
    "....oo...oo.....",
    "................",
  ];

  const girlDownW2 = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHssssHH....",
    "...HHsessesh....",
    "....HssssssH....",
    ".....sSsss......",
    "...HHHddddHHH...",
    "..HHhddddddhHH..",
    "..HHddDDddddHH..",
    "..HhddddddddhH..",
    "...HddddddddH...",
    "...HddddddddH...",
    "...HddddddddH...",
    "....dddddddd....",
    ".....dd.dddd....",
    ".....kk...kk....",
    ".....oo...oo....",
    "................",
  ];

  const girlUp = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "...HHHHHHHHHH...",
    "....HHHHHHHH....",
    "....HHHHHHHH....",
    "...HHHddddHHH...",
    "..HHHHDDDDHHHH..",
    "..HHddddddddHH..",
    "..HHddddddddHH..",
    "...HddddddddH...",
    "...HddddddddH...",
    "...HddddddddH...",
    "....dddddddd....",
    "....ddd..ddd....",
    "....kk....kk....",
    "....oo....oo....",
    "................",
  ];

  const girlUpW1 = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "...HHHHHHHHHH...",
    "....HHHHHHHH....",
    "....HHHHHHHH....",
    "...HHHddddHHH...",
    "..HHHHDDDDHHHH..",
    "..HHddddddddHH..",
    "..HHddddddddHH..",
    "...HddddddddH...",
    "...HddddddddH...",
    "...HddddddddH...",
    "....dddddddd....",
    "....dddd.dd.....",
    "....kk...kk.....",
    "....oo...oo.....",
    "................",
  ];

  const girlUpW2 = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "...HHHHHHHHHH...",
    "....HHHHHHHH....",
    "....HHHHHHHH....",
    "...HHHddddHHH...",
    "..HHHHDDDDHHHH..",
    "..HHddddddddHH..",
    "..HHddddddddHH..",
    "...HddddddddH...",
    "...HddddddddH...",
    "...HddddddddH...",
    "....dddddddd....",
    ".....dd.dddd....",
    ".....kk...kk....",
    ".....oo...oo....",
    "................",
  ];

  const girlLeft = [
    "......HHHH......",
    "....HHHHHHHH....",
    "...HHHssssHH....",
    "...HHssesHHH....",
    "....HssssHH.....",
    ".....sSsH.......",
    "....HHddddH.....",
    "...HhddddddH....",
    "...HHddDdddH....",
    "...HhddddddH....",
    "....HdddddH.....",
    "....HdddddH.....",
    "....HdddddH.....",
    ".....ddddd......",
    ".....dd.dd......",
    ".....kk.kk......",
    ".....oo.oo......",
    "................",
  ];

  const girlLeftW1 = [
    "......HHHH......",
    "....HHHHHHHH....",
    "...HHHssssHH....",
    "...HHssesHHH....",
    "....HssssHH.....",
    ".....sSsH.......",
    "....HHddddH.....",
    "...HhddddddH....",
    "...HHddDdddH....",
    "...HhddddddH....",
    "....HdddddH.....",
    "....HdddddH.....",
    "....HdddddH.....",
    ".....ddddd......",
    "......dddd......",
    "......kk........",
    "......oo........",
    "................",
  ];

  const girlLeftW2 = [
    "......HHHH......",
    "....HHHHHHHH....",
    "...HHHssssHH....",
    "...HHssesHHH....",
    "....HssssHH.....",
    ".....sSsH.......",
    "....HHddddH.....",
    "...HhddddddH....",
    "...HHddDdddH....",
    "...HhddddddH....",
    "....HdddddH.....",
    "....HdddddH.....",
    "....HdddddH.....",
    ".....ddddd......",
    ".....d..ddd.....",
    ".....kk...k.....",
    ".....oo...o.....",
    "................",
  ];

  const girlSitDown = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHssssHH....",
    "...HHsessesh....",
    "....HssssssH....",
    ".....sSsss......",
    "...HHddddddHH...",
    "..HhddddddddhH..",
    "...HddddddddH...",
    "....dddddddd....",
    "....kk....kk....",
    "....oo....oo....",
    "................",
  ];

  const girlSitUp = [
    ".....HHHHH......",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "...HHHHHHHHHH...",
    "....HHHHHHHH....",
    "...HHHddddHHH...",
    "..HHddddddddHH..",
    "...HddddddddH...",
    "....dddddddd....",
    "....kk....kk....",
    "....oo....oo....",
    "................",
  ];

  const girlLie = [
    "................",
    "..HHHHH.........",
    ".HssssHdddkk.oo.",
    ".HesesHddddkoo..",
    "..sSssHddd......",
    "................",
  ];

  const chars = { player: {}, npc: {} };

  function outline(src, color) {
    const { c, ctx } = makeCanvas(src.width, src.height);
    ctx.drawImage(src, 0, 0);
    const img = ctx.getImageData(0, 0, src.width, src.height);
    const d = img.data;
    const orig = new Uint8ClampedArray(d);
    const w = src.width;
    const h = src.height;
    const on = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return false;
      return orig[(y * w + x) * 4 + 3] > 0;
    };
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (orig[i + 3] > 0) continue;
        if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) {
          d[i] = color[0];
          d[i + 1] = color[1];
          d[i + 2] = color[2];
          d[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  function blinkRows(rows) {
    return rows.map((row) => row.replace(/e/g, "s"));
  }

  function buildChars() {
    for (const [who, pal, maps] of [["player", palPlayer, aikoMaps], ["npc", palNpc, seventeenMaps]]) {
      const ol = who === "player" ? [16, 14, 22, 255] : [96, 58, 28, 255];
      const packed = compilePack({
        down: maps.down, downW1: maps.down, downW2: maps.down,
        up: maps.up, upW1: maps.up, upW2: maps.up,
        left: maps.left, leftW1: maps.left, leftW2: maps.left,
        sitDown: maps.sitDown, sitUp: maps.sitUp, lie: maps.lie,
      }, pal, ol);
      chars[who] = packed;
    }
  }

  function drawShadow(ctx, x, y, w) {
    ctx.fillStyle = "rgba(20,12,8,0.28)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y, w * 0.38, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function frameFor(who, dir, moving, time, blink) {
    const pack = chars[who];
    if (!pack) return chars.player.down[0];
    if (!moving) {
      if (dir === "down" && blink && pack.downBlink) return pack.downBlink;
      return pack[dir][0];
    }
    const f = Math.floor(time / 140) % 2;
    return pack[dir][1 + f];
  }

  function actorFrame(who, pose, dir, moving, time, blink) {
    const pack = chars[who];
    if (!pack) return frameFor(who, dir, moving, time, blink);
    if (pose === "sit") return dir === "up" ? pack.sitUp || pack.up[0] : pack.sitDown || pack.down[0];
    if (pose === "lie") return pack.lie || pack.down[0];
    return frameFor(who, dir, moving, time, blink);
  }

  const HAIRS = {
    black: { name: "黑色", H: "#16141c", h: "#2c2838" },
    darkBrown: { name: "深棕", H: "#2a1a12", h: "#4a3224" },
    wine: { name: "酒红", H: "#4a1828", h: "#6a2840" },
    ash: { name: "雾灰", H: "#5a5860", h: "#7a7880" },
    silver: { name: "银色", H: "#c8c4c8", h: "#ece8ec" },
    midnight: { name: "墨蓝", H: "#121828", h: "#243048" },
    chestnut: { name: "栗色", H: "#5a3018", h: "#8a5030" },
  };

  const OUTFITS = {
    blackDress: { name: "黑裙", d: "#1a1824", D: "#2e2a3c", k: C.skin, o: "#2a2228", pants: false },
    turtleneck: { name: "黑色高领", d: "#141416", D: "#2c2c30", k: C.skin, o: "#1a1a1c", pants: false },
    leather: { name: "皮衣", d: "#1c1410", D: "#3a2820", k: "#1a1414", o: "#0e0e10", pants: true },
    coat: { name: "深灰大衣", d: "#2a282c", D: "#444048", k: "#1a1820", o: "#121214", pants: true },
    whiteShirt: { name: "白衬衫", d: "#efece6", D: "#d4cfc6", k: "#1c1c24", o: "#121214", pants: true },
    wineDress: { name: "酒红长裙", d: "#5a1828", D: "#7a2838", k: C.skin, o: "#2a1820", pants: false },
    navy: { name: "海军外套", d: "#1a2438", D: "#2c3c58", k: "#121820", o: "#0e1014", pants: true },
  };

  function pantsRows(rows) {
    return rows.map((row) =>
      row
        .replace("ddd..ddd", "kkkkkkkk")
        .replace("dddd.dd.", "kkkkk.kk")
        .replace("dd.dddd", "kk.kkkkk")
        .replace("ddddd...", "kkkkk...")
        .replace("dd.dd.", "kk.kk.")
        .replace("......dddd", "......kkkk")
        .replace("d..ddd", "k..kkk")
    );
  }

  function compilePack(maps, pal, ol) {
    const mk = (rows) => outline(compile(rows, pal), ol);
    const L = [mk(maps.left), mk(maps.leftW1), mk(maps.leftW2)];
    return {
      down: [mk(maps.down), mk(maps.downW1), mk(maps.downW2)],
      up: [mk(maps.up), mk(maps.upW1), mk(maps.upW2)],
      left: L,
      right: L.map(flipH),
      downBlink: mk(blinkRows(maps.down)),
      sitDown: mk(maps.sitDown || girlSitDown),
      sitUp: mk(maps.sitUp || girlSitUp),
      lie: mk(maps.lie || girlLie),
    };
  }

  function rebuildPlayer(hairId, outfitId) {
    const hair = HAIRS.black;
    const fit = OUTFITS[outfitId] || OUTFITS.blackDress;
    const pal = {
      ...palPlayer,
      H: hair.H,
      h: hair.h,
      d: fit.d,
      D: fit.D,
      k: fit.k,
      o: fit.o,
      m: "#8f294f",
      M: "#c44770",
    };
    const maps = {
      down: aikoMaps.down,
      downW1: aikoMaps.down,
      downW2: aikoMaps.down,
      up: aikoMaps.up,
      upW1: aikoMaps.up,
      upW2: aikoMaps.up,
      left: aikoMaps.left,
      leftW1: aikoMaps.left,
      leftW2: aikoMaps.left,
      sitDown: aikoMaps.sitDown,
      sitUp: aikoMaps.sitUp,
      lie: aikoMaps.lie,
    };
    if (fit.pants) {
      for (const key of Object.keys(maps)) maps[key] = pantsRows(maps[key]);
    }
    chars.player = compilePack(maps, pal, [16, 14, 22, 255]);
  }

  const jkMaps = {
    down: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHssssssHH...",
      "..HHsesrsehHH...",
      "...HHssssssH....",
      "....ssStss......",
      "...dd.ww.dd.....",
      "...ddddddddd....",
      "...ddDddddDd....",
      "....dddddddd....",
      "....bbkkkkbb....",
      "....kkkkkkkk....",
      "....kk....kk....",
      "....oo....oo....",
      "................",
    ],
    downW1: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHssssssHH...",
      "..HHsesrsehHH...",
      "...HHssssssH....",
      "....ssStss......",
      "...dd.ww.dd.....",
      "...ddddddddd....",
      "...ddDddddDd....",
      "....dddddddd....",
      "....bbkkkkbb....",
      "....kkkk.kk.....",
      "....kk...kk.....",
      "....oo...oo.....",
      "................",
    ],
    downW2: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHssssssHH...",
      "..HHsesrsehHH...",
      "...HHssssssH....",
      "....ssStss......",
      "...dd.ww.dd.....",
      "...ddddddddd....",
      "...ddDddddDd....",
      "....dddddddd....",
      "....bbkkkkbb....",
      ".....kk.kkkk....",
      ".....kk...kk....",
      ".....oo...oo....",
      "................",
    ],
    up: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHHHHHHHHH...",
      "...HHHHHHHHHH...",
      "....HHHHHHHH....",
      ".....HHHHH......",
      "....dddddddd....",
      "...dddddddddd...",
      "...dddddddddd...",
      "....dddddddd....",
      "....bbkkkkbb....",
      "....kkkkkkkk....",
      "....kk....kk....",
      "....oo....oo....",
      "................",
    ],
    upW1: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHHHHHHHHH...",
      "...HHHHHHHHHH...",
      "....HHHHHHHH....",
      ".....HHHHH......",
      "....dddddddd....",
      "...dddddddddd...",
      "...dddddddddd...",
      "....dddddddd....",
      "....bbkkkkbb....",
      "....kkkk.kk.....",
      "....kk...kk.....",
      "....oo...oo.....",
      "................",
    ],
    upW2: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHHHHHHHHH...",
      "...HHHHHHHHHH...",
      "....HHHHHHHH....",
      ".....HHHHH......",
      "....dddddddd....",
      "...dddddddddd...",
      "...dddddddddd...",
      "....dddddddd....",
      "....bbkkkkbb....",
      ".....kk.kkkk....",
      ".....kk...kk....",
      ".....oo...oo....",
      "................",
    ],
    left: [
      ".....HhHHHH.....",
      "....HHHHHHHH....",
      "...HHHssssHH....",
      "...HHsserHH.....",
      "....HsssH.......",
      ".....sSt........",
      "....dd.wd.......",
      "...ddddddd......",
      "...dDddddd......",
      "....dddddd......",
      "....bbkkkk......",
      "....kkkkkk......",
      ".....kk.kk......",
      ".....oo.oo......",
      "................",
    ],
    leftW1: [
      ".....HhHHHH.....",
      "....HHHHHHHH....",
      "...HHHssssHH....",
      "...HHsserHH.....",
      "....HsssH.......",
      ".....sSt........",
      "....dd.wd.......",
      "...ddddddd......",
      "...dDddddd......",
      "....dddddd......",
      "....bbkkkk......",
      ".....kkkk.......",
      "......kk........",
      "......oo........",
      "................",
    ],
    leftW2: [
      ".....HhHHHH.....",
      "....HHHHHHHH....",
      "...HHHssssHH....",
      "...HHsserHH.....",
      "....HsssH.......",
      ".....sSt........",
      "....dd.wd.......",
      "...ddddddd......",
      "...dDddddd......",
      "....dddddd......",
      "....bbkkkk......",
      "....kk..kkk.....",
      "....kk...k......",
      "....oo...o......",
      "................",
    ],
    sitDown: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHssssssHH...",
      "..HHsesrsehHH...",
      "...HHssssssH....",
      "....ssStss......",
      "...dd.ww.dd.....",
      "...ddddddddd....",
      "....bbkkkkbb....",
      "....kk....kk....",
      "....oo....oo....",
      "................",
    ],
    sitUp: [
      "...HhHHHHHHh....",
      "..HHHHHHHHHHH...",
      "..HHHHHHHHHHH...",
      "...HHHHHHHHHH...",
      "....HHHHHHHH....",
      "....dddddddd....",
      "...dddddddddd...",
      "....bbkkkkbb....",
      "....kk....kk....",
      "....oo....oo....",
      "................",
      "................",
    ],
    lie: [
      "................",
      "................",
      "..HhHHHH........",
      ".HssssHddddkoo..",
      ".HesesHddddkoo..",
      "..sStsHkkkk.....",
      "................",
      "................",
    ],
  };

  const qinMaps = {
    down: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHssssssH....",
      "...HsRsseshH....",
      "....HsssssH.....",
      ".....sSss.......",
      "....ww.nn.ww....",
      "...dDvvvvvvDd...",
      "...ddddddddd....",
      "...gddddddddg...",
      "....kkkkkkkk....",
      "....kkkkkkkk....",
      "....kk....kk....",
      "....oo....oo....",
      "................",
    ],
    downW1: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHssssssH....",
      "...HsRsseshH....",
      "....HsssssH.....",
      ".....sSss.......",
      "....ww.nn.ww....",
      "...dDvvvvvvDd...",
      "...ddddddddd....",
      "...gddddddddg...",
      "....kkkkkkkk....",
      "....kkkk.kk.....",
      "....kk...kk.....",
      "....oo...oo.....",
      "................",
    ],
    downW2: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHssssssH....",
      "...HsRsseshH....",
      "....HsssssH.....",
      ".....sSss.......",
      "....ww.nn.ww....",
      "...dDvvvvvvDd...",
      "...ddddddddd....",
      "...gddddddddg...",
      "....kkkkkkkk....",
      ".....kk.kkkk....",
      ".....kk...kk....",
      ".....oo...oo....",
      "................",
    ],
    up: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHHHHHHHH....",
      "....HHHHHHHH....",
      "....HHHHHHHH....",
      ".....HHHHH......",
      "....dddddddd....",
      "...dddddddddd...",
      "...dddddddddd...",
      "...gddddddddg...",
      "....kkkkkkkk....",
      "....kkkkkkkk....",
      "....kk....kk....",
      "....oo....oo....",
      "................",
    ],
    upW1: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHHHHHHHH....",
      "....HHHHHHHH....",
      "....HHHHHHHH....",
      ".....HHHHH......",
      "....dddddddd....",
      "...dddddddddd...",
      "...dddddddddd...",
      "...gddddddddg...",
      "....kkkkkkkk....",
      "....kkkk.kk.....",
      "....kk...kk.....",
      "....oo...oo.....",
      "................",
    ],
    upW2: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHHHHHHHH....",
      "....HHHHHHHH....",
      "....HHHHHHHH....",
      ".....HHHHH......",
      "....dddddddd....",
      "...dddddddddd...",
      "...dddddddddd...",
      "...gddddddddg...",
      "....kkkkkkkk....",
      ".....kk.kkkk....",
      ".....kk...kk....",
      ".....oo...oo....",
      "................",
    ],
    left: [
      ".....H.HhH......",
      "....HHHHHHH.....",
      "...HHHssssH.....",
      "...HHssRsH......",
      "....HsssH.......",
      ".....sSs........",
      "....ww.n........",
      "...dDvvvv.......",
      "...ddddddd......",
      "...gdddddd......",
      "....kkkkkk......",
      "....kkkkkk......",
      ".....kk.kk......",
      ".....oo.oo......",
      "................",
    ],
    leftW1: [
      ".....H.HhH......",
      "....HHHHHHH.....",
      "...HHHssssH.....",
      "...HHssRsH......",
      "....HsssH.......",
      ".....sSs........",
      "....ww.n........",
      "...dDvvvv.......",
      "...ddddddd......",
      "...gdddddd......",
      "....kkkkkk......",
      ".....kkkk.......",
      "......kk........",
      "......oo........",
      "................",
    ],
    leftW2: [
      ".....H.HhH......",
      "....HHHHHHH.....",
      "...HHHssssH.....",
      "...HHssRsH......",
      "....HsssH.......",
      ".....sSs........",
      "....ww.n........",
      "...dDvvvv.......",
      "...ddddddd......",
      "...gdddddd......",
      "....kkkkkk......",
      "....kk..kkk.....",
      "....kk...k......",
      "....oo...o......",
      "................",
    ],
    sitDown: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHssssssH....",
      "...HsRsseshH....",
      "....HsssssH.....",
      ".....sSss.......",
      "....ww.nn.ww....",
      "...dDvvvvvvDd...",
      "...gddddddddg...",
      "....kk....kk....",
      "....oo....oo....",
      "................",
    ],
    sitUp: [
      "..H..HhHh..H....",
      "...HHHHHHHHH....",
      "...HHHHHHHHH....",
      "....HHHHHHHH....",
      ".....HHHHH......",
      "....dddddddd....",
      "...dddddddddd...",
      "...gddddddddg...",
      "....kk....kk....",
      "....oo....oo....",
      "................",
      "................",
    ],
    lie: [
      "................",
      "................",
      "..HhHHH.........",
      ".HssssHddddgkoo.",
      ".HsRssHddddgkoo.",
      "..sSssHkkkk.....",
      "................",
      "................",
    ],
  };

  const palJk = {
    ".": null,
    H: "#121014",
    h: "#2c2834",
    s: C.skin,
    S: C.skinS,
    e: "#1a1014",
    r: "#e8ecee",
    t: "#2a2228",
    w: "#2a1c20",
    d: "#f2efe8",
    D: "#d8d0c4",
    b: "#1a1a1e",
    k: "#1c1c24",
    o: "#0e0e12",
  };

  const palQin = {
    ".": null,
    H: "#c8c8d0",
    h: "#ececf2",
    s: "#f0d4c0",
    S: "#d8b49a",
    e: "#1a1010",
    R: "#c81828",
    w: "#f4f0ec",
    n: "#1a1014",
    v: "#4a1428",
    d: "#6a2038",
    D: "#8a3048",
    g: "#f8f4f0",
    k: "#3a1020",
    o: "#101014",
  };

  function buildHusbands() {
    chars.jk = compilePack(jkMaps, palJk, [18, 14, 16, 255]);
    chars.qinche = compilePack(qinMaps, palQin, [80, 40, 48, 255]);
  }

  const cottonPal = {
    ".": null,
    e: "#8a7060",
    E: "#6a5648",
    W: "#f8f4ee",
    w: "#e8e0d6",
    b: "#5ab0e0",
    B: "#2a6088",
    g: "#a88870",
    n: "#e8a8b0",
    t: "#9a8070",
  };

  const cottonIdle = compile(
    [
      "................",
      "...ee......ee...",
      "..eEWWWWWWWEe...",
      "..WWWbBBbWWW....",
      "...WWnWnWWWW....",
      "...WWWgggWWW....",
      "..WWWWWWWWWWW...",
      "...WWWWWWWWW....",
      "....WWW.WWW.t...",
      ".............t..",
    ],
    cottonPal
  );
  const cottonIdle2 = compile(
    [
      "................",
      "...ee......ee...",
      "..eEWWWWWWWEe...",
      "..WWWbBBbWWW....",
      "...WWnWnWWWW....",
      "...WWWgggWWW....",
      "..WWWWWWWWWWW...",
      "...WWWWWWWWW.t..",
      "....WWW.WWW.....",
      ".............t..",
    ],
    cottonPal
  );
  const cottonSit = compile(
    [
      "................",
      "...ee......ee...",
      "..eEWWWWWWWEe...",
      "..WWWbBBbWWW....",
      "...WWnWnWWWW....",
      "...WWWgggWWW....",
      "..WWWWWWWWWWW...",
      "...WWWWWWWWW....",
      "....WW...WW.t...",
      ".............t..",
    ],
    cottonPal
  );
  const cottonLick = compile(
    [
      "................",
      "...ee......ee...",
      "..eEWWWWWWWEe...",
      "..WWWbBBbWWW....",
      "...WWnWgWWW.....",
      "...WWWWggWWW....",
      "..WWWWWWWWWWW...",
      "...WWWWWWWWW....",
      "....WW...WW.t...",
      ".............t..",
    ],
    cottonPal
  );
  const cottonSleep = compile(
    [
      "................",
      "................",
      "......eeee......",
      "....eWWWWWWe....",
      "...WWWnWnWWWW...",
      "...WWWgggWWWW...",
      "....WWWWWWWW.t..",
      ".....WWWWW......",
      ".............t..",
      "................",
    ],
    cottonPal
  );

  const tangPal = {
    ".": null,
    t: "#e8c080",
    T: "#d4a060",
    o: "#1a1010",
    D: "#2a2a34",
    d: "#3a3a48",
    n: "#2a1810",
    e: "#1a1418",
  };

  const tangIdle = compile(
    [
      "................",
      "...DD......DD...",
      "..DtTttttTtD....",
      "..Tte..e.tTT....",
      "...TtnnttTT.....",
      "...tTddddTt.....",
      "...tTddddTt.....",
      "....t.tt.t......",
      "....T....T......",
      "................",
    ],
    tangPal
  );
  const tangSleep = compile(
    [
      "................",
      "................",
      ".....DDttt......",
      "....DtTTttTt....",
      "...tTtt..ttt....",
      "....tDDDDtt.....",
      ".....ttttt......",
      "................",
      "................",
      "................",
    ],
    tangPal
  );
  const tangIdle2 = compile(
    [
      "................",
      "...DD......DD...",
      "..DtTttttTtD....",
      "..Tte..e.tTT....",
      "...TtnnttTT.....",
      "...tTddddTt.....",
      "...tTddddTt.....",
      ".....t.tt.......",
      ".....T..T.......",
      "................",
    ],
    tangPal
  );

  const petArt = {
    cotton: {
      idle: [cottonIdle, cottonIdle2],
      walk: [cottonIdle, cottonIdle2],
      sit: cottonSit,
      lick: cottonLick,
      sleep: cottonSleep,
    },
    tangtang: {
      idle: [tangIdle, tangIdle2],
      walk: [tangIdle, tangIdle2],
      sleep: tangSleep,
    },
  };

  const duck = compile(
    [
      "........",
      "..yyyy..",
      ".y.oyyy.",
      ".yyyyOy.",
      "..yyyy..",
      "...nn...",
      "........",
    ],
    { ".": null, y: "#f4d018", o: "#2a1c14", O: "#f09020", n: "#d49020" }
  );

  const marshPal = {
    ".": null,
    W: "#faf8f6",
    w: "#e4dcd8",
    g: "#d0c8c4",
    o: "#1a1414",
    n: "#f090a8",
    p: "#f8c0d0",
  };

  const marshmallowDog = compile(
    [
      "................",
      "...WW....WW.....",
      "..WWWWWWWWWW....",
      ".WWooWWooWWW....",
      "..WWwWnwwWWW....",
      "..WWWWWWWWWW....",
      ".WWWWWWWWWWWW...",
      "..WW.WW.WWW.....",
      "...o...o.g......",
      "................",
    ],
    marshPal
  );
  const marshmallowDog2 = compile(
    [
      "................",
      "...WW....WW.....",
      "..WWWWWWWWWW....",
      ".WWooWWooWWW....",
      "..WWwWnwwWWW....",
      "..WWWWWWWWWW....",
      ".WWWWWWWWWWWW...",
      "...WW.WW.WW.....",
      "....o...o.......",
      "................",
    ],
    marshPal
  );

  const marshSleep = compile(
    [
      "................",
      "................",
      ".....WWWWW......",
      "...WWWWWWWWW....",
      "..WWWwWnwwWW....",
      "...WWWWWWWWW....",
      "....WWWWWWW.....",
      "................",
      "................",
      "................",
    ],
    marshPal
  );

  petArt.marsh = {
    idle: [marshmallowDog, marshmallowDog2],
    walk: [marshmallowDog, marshmallowDog2],
    sleep: marshSleep,
  };

  function petFrame(id, moving, time) {
    const p = petArt[id];
    if (!p) return cottonIdle;
    const arr = moving ? p.walk : p.idle;
    return arr[Math.floor(time / (moving ? 160 : 480)) % arr.length];
  }

  function stampPreview(packOrImg, dest, scale) {
    const ctx = dest.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, dest.width, dest.height);
    const img = packOrImg.down ? packOrImg.down[0] : packOrImg;
    const s = scale || 4;
    const x = (dest.width - img.width * s) / 2;
    const y = dest.height - img.height * s - 4;
    ctx.fillStyle = "rgba(40,24,16,0.12)";
    ctx.beginPath();
    ctx.ellipse(dest.width / 2, dest.height - 8, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(img, x, y, img.width * s, img.height * s);
  }

  const PORTRAIT_SRC = {
    jk: "assets/jk-character.png?v=5",
    qinche: "assets/qinche-character.png?v=5",
    cotton: "assets/cotton-character.png?v=5",
    tangtang: "assets/tangtang-character.png?v=5",
    marsh: "assets/marshmallow-character.png?v=5",
  };
  const portraits = {};
  for (const [id, src] of Object.entries(PORTRAIT_SRC)) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    portraits[id] = img;
  }

  function portraitReady(id) {
    const img = portraits[id];
    return !!(img && img.complete && img.naturalWidth);
  }

  function stampPortrait(id, dest) {
    const ctx = dest.getContext("2d");
    ctx.clearRect(0, 0, dest.width, dest.height);
    ctx.fillStyle = "rgba(40,24,16,0.12)";
    ctx.beginPath();
    ctx.ellipse(dest.width / 2, dest.height - 8, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    const img = portraits[id];
    if (!img || !img.complete || !img.naturalWidth) {
      if (id === "jk" || id === "qinche") stampPreview(chars[id], dest, 4);
      else if (petArt[id]) stampPreview(petArt[id].idle[0], dest, 5);
      else if (id === "marsh") stampPreview(marshmallowDog, dest, 5);
      return;
    }
    ctx.imageSmoothingEnabled = true;
    const maxH = dest.height - 16;
    const maxW = dest.width - 12;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (dest.width - dw) / 2, dest.height - dh - 6, dw, dh);
  }

  function drawPortrait(ctx, id, x, y, opts) {
    const img = portraits[id];
    if (!img || !img.complete || !img.naturalWidth) return false;
    const pose = (opts && opts.pose) || "stand";
    const dir = (opts && opts.dir) || "down";
    const bob = (opts && opts.bob) || 0;
    const h = (opts && opts.h) || 34;
    const clip = pose === "sit" ? 0.7 : pose === "lie" ? 0.52 : 1;
    const fullW = (img.naturalWidth * h) / img.naturalHeight;
    const visibleH = h * clip;
    const dx = x + 8 - fullW / 2;
    const dy = y + 22 - visibleH + bob;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if (dir === "left") {
      ctx.translate(dx + fullW / 2, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * clip, -fullW / 2, 0, fullW, visibleH);
    } else {
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * clip, dx, dy, fullW, visibleH);
    }
    ctx.restore();
    return true;
  }

  function drawPetSprite(ctx, id, x, y, opts) {
    const key = id === "marshmallow" ? "marsh" : id;
    const img = portraits[key];
    if (!img || !img.complete || !img.naturalWidth) return false;
    const h = (opts && opts.h) || 20;
    const bob = (opts && opts.bob) || 0;
    const w = (img.naturalWidth * h) / img.naturalHeight;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, x + 8 - w / 2, y + 14 - h + bob, w, h);
    ctx.restore();
    return true;
  }

  /* ---------- pets ---------- */
  const catSit = compile(
    [
      "................",
      "....hh....hh....",
      "...hHhhhhhhH....",
      "...h.o..o.hh....",
      "....hhhhhhhh....",
      "....hhwwwwwh....",
      "...hhhhhhhhh....",
      "...hhhhhhhhh....",
      "....hhhhhhh.....",
      ".....hhhhh..t...",
      "............t...",
      "................",
    ],
    { ".": null, h: "#d8d0c8", H: "#f4eee6", o: "#2a1c14", w: "#f8f4ec", t: "#c8b8a8" }
  );

  const catSit2 = compile(
    [
      "................",
      "....hh....hh....",
      "...hHhhhhhhH....",
      "...h.o..o.hh....",
      "....hhhhhhhh....",
      "....hhwwwwwh....",
      "...hhhhhhhhh....",
      "...hhhhhhhhh....",
      "....hhhhhhh.....",
      ".....hhhhh......",
      "..........tt....",
      "................",
    ],
    { ".": null, h: "#d8d0c8", H: "#f4eee6", o: "#2a1c14", w: "#f8f4ec", t: "#c8b8a8" }
  );

  const dogSleep = compile(
    [
      "................",
      "................",
      "......eeeeee....",
      "....eeeEEeeEe...",
      "...eEeeeeeeee...",
      "...eeee..eeee...",
      "....eeeeeeee....",
      ".....eeeee......",
      "................",
      "................",
      "................",
      "................",
    ],
    { ".": null, e: "#c4a070", E: "#8a6a40" }
  );

  /* ---------- furniture drawers ---------- */
  function fireplace(ctx, x, y, t, extra) {
    r(ctx, x, y + 6, 28, 26, C.brick2);
    r(ctx, x + 1, y + 7, 26, 24, C.brick1);
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        const ox = (row % 2) * 3;
        r(ctx, x + 2 + col * 6 + ox, y + 8 + row * 4, 5, 3, row % 2 ? "#c86a58" : "#a84838");
      }
    }
    r(ctx, x + 6, y + 16, 16, 14, C.ink);
    const boost = extra && extra.boost ? 1 : 0;
    const flicker = 0.5 + Math.sin(t / 90) * 0.3 + Math.sin(t / 37) * 0.2;
    r(ctx, x + 9, y + 22 - boost, 10, 8 + boost, C.fire3);
    r(ctx, x + 10, y + 20 - boost, 8, 8 + boost, C.fire2);
    r(ctx, x + 12, y + 18 + (flicker > 0.7 ? 0 : 1) - boost, 4, 6 + boost, C.fire1);
    if (boost) {
      p(ctx, x + 11, y + 17, "#ffee88");
      p(ctx, x + 16, y + 19, "#ffb040");
    }
    r(ctx, x + 8, y + 28, 12, 2, C.wood4);
    r(ctx, x, y + 4, 28, 4, C.wood4);
    r(ctx, x + 1, y + 5, 26, 2, C.wood2);
    r(ctx, x + 10, y, 8, 6, "#c4b49a");
    r(ctx, x + 12, y + 2, 4, 3, C.gold);
    if (extra && extra.roast) {
      r(ctx, x + 22, y + 14, 2, 16, C.wood4);
      r(ctx, x + 21, y + 12, 4, 4, C.white);
      p(ctx, x + 22, y + 12, extra.roast > 1800 ? "#c49040" : "#fff8ec");
    }
  }

  function sofa(ctx, x, y, theme) {
    const body = theme === "pink" ? "#e8a0b0" : theme === "navy" ? "#304868" : "#6a8a58";
    const dark = theme === "pink" ? "#c87888" : theme === "navy" ? "#203048" : "#486838";
    const cush = theme === "pink" ? "#f8c8d0" : theme === "navy" ? "#486888" : "#98b878";
    r(ctx, x + 2, y + 10, 44, 12, dark);
    r(ctx, x, y + 6, 8, 16, body);
    r(ctx, x + 40, y + 6, 8, 16, body);
    r(ctx, x + 6, y + 8, 36, 10, cush);
    r(ctx, x + 8, y + 6, 14, 8, body);
    r(ctx, x + 26, y + 6, 14, 8, body);
    r(ctx, x + 4, y + 20, 4, 4, C.wood4);
    r(ctx, x + 40, y + 20, 4, 4, C.wood4);
    r(ctx, x + 10, y + 10, 12, 2, "rgba(255,255,255,0.15)");
  }

  function table(ctx, x, y) {
    r(ctx, x, y + 6, 28, 10, C.wood3);
    r(ctx, x + 1, y + 7, 26, 8, C.wood1);
    r(ctx, x + 2, y + 16, 3, 6, C.wood4);
    r(ctx, x + 23, y + 16, 3, 6, C.wood4);
  }

  function snackBowl(ctx, x, y, empty) {
    r(ctx, x, y + 4, 10, 6, "#c8b090");
    r(ctx, x + 1, y + 5, 8, 4, "#efe0c4");
    if (!empty) {
      r(ctx, x + 2, y + 3, 3, 2, "#e0a040");
      r(ctx, x + 5, y + 2, 3, 2, "#d49030");
      r(ctx, x + 4, y + 4, 3, 2, "#f0c060");
    }
  }

  function mug(ctx, x, y, empty) {
    r(ctx, x + 1, y + 3, 7, 7, "#f0ece4");
    r(ctx, x + 2, y + 4, 5, 5, empty ? "#d8d0c4" : "#c47848");
    r(ctx, x + 8, y + 5, 2, 3, "#f0ece4");
    if (!empty) {
      p(ctx, x + 3, y + 1, "rgba(255,255,255,0.55)");
      p(ctx, x + 5, y, "rgba(255,255,255,0.4)");
    }
  }

  function trashCan(ctx, x, y) {
    r(ctx, x + 2, y + 4, 12, 14, "#6a7278");
    r(ctx, x + 3, y + 5, 10, 12, "#8a9298");
    r(ctx, x + 1, y + 2, 14, 3, "#4a5056");
    r(ctx, x + 4, y, 8, 3, "#3a4046");
    p(ctx, x + 10, y + 8, "#c8d0d4");
  }

  function sideCabinet(ctx, x, y, open) {
    r(ctx, x, y, 18, 22, C.wood4);
    r(ctx, x + 1, y + 1, 16, 20, C.wood2);
    if (open) {
      r(ctx, x + 14, y + 2, 8, 18, C.wood3);
      r(ctx, x + 3, y + 4, 5, 4, "#e8c070");
      r(ctx, x + 9, y + 5, 4, 3, "#4a88c8");
      r(ctx, x + 4, y + 10, 6, 3, "#f0d0d8");
      r(ctx, x + 5, y + 14, 7, 5, "#8a3038");
    } else {
      r(ctx, x + 2, y + 3, 6, 16, C.wood1);
      r(ctx, x + 10, y + 3, 6, 16, C.wood1);
      p(ctx, x + 6, y + 11, C.gold);
      p(ctx, x + 14, y + 11, C.gold);
    }
  }

  function bookshelf(ctx, x, y) {
    r(ctx, x, y, 20, 40, C.wood4);
    r(ctx, x + 1, y + 1, 18, 38, C.wood3);
    for (let shelf = 0; shelf < 4; shelf++) {
      r(ctx, x + 2, y + 8 + shelf * 8, 16, 2, C.wood4);
      const colors = ["#c44848", "#4878b0", "#d4a050", "#689858", "#a068c0", "#e8d8b0"];
      for (let b = 0; b < 5; b++) {
        r(ctx, x + 3 + b * 3, y + 3 + shelf * 8, 2, 5, colors[(shelf * 5 + b) % colors.length]);
      }
    }
  }

  function plant(ctx, x, y, pot) {
    r(ctx, x + 3, y + 12, 8, 7, pot || "#c45a48");
    r(ctx, x + 4, y + 13, 6, 4, "#a84838");
    r(ctx, x + 2, y + 4, 10, 10, C.leaf3);
    p(ctx, x + 4, y + 2, C.leaf2);
    p(ctx, x + 8, y + 1, C.leaf1);
    p(ctx, x + 6, y + 3, C.leaf2);
    p(ctx, x + 3, y + 6, C.leaf2);
    p(ctx, x + 10, y + 5, C.grassHi);
    r(ctx, x + 5, y + 6, 4, 8, C.leaf1);
  }

  function bed(ctx, x, y, theme, item) {
    const blanket = theme.blanket;
    const blanketD = theme.blanketD;
    const sheet = theme.sheet;
    const frame = theme.frame || C.wood4;
    r(ctx, x, y + 4, 32, 28, frame);
    r(ctx, x + 1, y, 30, 10, theme.head);
    r(ctx, x + 2, y + 1, 26, 6, theme.headH || theme.head);
    r(ctx, x + 2, y + 8, 12, 7, sheet);
    r(ctx, x + 16, y + 8, 12, 7, sheet);
    const crooked = item && item.pillowCrook ? 2 : 0;
    r(ctx, x + 3 + crooked, y + 9, 10, 4, "#ffffff");
    r(ctx, x + 17 - crooked, y + 9, 10, 4, "#ffffff");
    if (item && item.blanketOff) {
      r(ctx, x + 2, y + 14, 28, 16, sheet);
      r(ctx, x + 16, y + 22, 14, 8, blanket);
      r(ctx, x + 16, y + 22, 14, 2, blanketD);
      if (item.secret === "plush") {
        r(ctx, x + 8, y + 18, 8, 7, "#e8a070");
        p(ctx, x + 10, y + 20, "#1a1418");
        p(ctx, x + 13, y + 20, "#1a1418");
      } else if (item.secret === "snack") {
        r(ctx, x + 8, y + 19, 8, 5, "#e8c050");
      }
    } else {
      r(ctx, x + 2, y + 14, 28, 16, blanket);
      r(ctx, x + 2, y + 14, 28, 2, blanketD);
      if (theme.catPattern) {
        catLoaf(ctx, x + 8, y + 17);
      } else {
        for (let i = 0; i < 4; i++) r(ctx, x + 4 + i * 6, y + 20, 3, 3, theme.motif || blanketD);
      }
    }
    r(ctx, x + 1, y + 30, 4, 3, C.wood5);
    r(ctx, x + 27, y + 30, 4, 3, C.wood5);
  }

  function catLoaf(ctx, x, y) {
    r(ctx, x + 2, y + 3, 11, 6, "#f6f6fa");
    r(ctx, x, y + 1, 7, 7, "#f6f6fa");
    p(ctx, x + 1, y, "#f6f6fa");
    p(ctx, x + 4, y, "#f6f6fa");
    r(ctx, x + 12, y + 4, 5, 2, "#f6f6fa");
    p(ctx, x + 16, y + 5, "#f6f6fa");
  }

  function vanity(ctx, x, y, theme) {
    const dark = theme === "dark";
    const hotel = theme === "hotel";
    const frame = dark ? "#2a2a34" : hotel ? "#d4b06a" : "#d8ecf0";
    const glass = dark ? "#243044" : hotel ? "#d8ecf4" : "#b8d0e0";
    const desk = dark ? "#1c1c24" : hotel ? "#efe4cc" : C.wood2;
    const deskHi = dark ? "#2a2a32" : hotel ? "#f8f0dc" : C.wood1;
    const leg = dark ? "#121018" : hotel ? "#c4a060" : C.wood4;
    r(ctx, x + 4, y, 16, 14, frame);
    r(ctx, x + 5, y + 1, 14, 12, glass);
    r(ctx, x + 6, y + 3, 4, 5, "rgba(255,255,255,0.35)");
    r(ctx, x, y + 14, 24, 12, desk);
    r(ctx, x + 1, y + 15, 22, 4, deskHi);
    r(ctx, x + 3, y + 16, 5, 3, dark ? "#c45a78" : C.flowerP);
    r(ctx, x + 14, y + 16, 6, 3, hotel ? "#f0e0c0" : "#f8e8f0");
    r(ctx, x + 2, y + 26, 3, 4, leg);
    r(ctx, x + 19, y + 26, 3, 4, leg);
  }

  function ipad(ctx, x, y) {
    r(ctx, x, y, 16, 12, "#2a2a32");
    r(ctx, x + 1, y + 1, 14, 10, "#101018");
    r(ctx, x + 2, y + 2, 12, 8, "#00a1d6");
    r(ctx, x + 4, y + 3, 8, 6, "#f8f8fc");
    r(ctx, x + 6, y + 4, 4, 4, "#00a1d6");
    p(ctx, x + 8, y + 8, "#fb7299");
  }

  function poster(ctx, x, y, theme) {
    if (theme === "bts") posterBts(ctx, x, y);
    else if (theme === "gojo") posterGojo(ctx, x, y);
    else posterMask(ctx, x, y);
  }

  function posterBts(ctx, x, y) {
    r(ctx, x, y, 28, 22, "#121018");
    r(ctx, x + 1, y + 1, 26, 20, "#b8d0e0");
    r(ctx, x + 2, y + 2, 24, 7, "#e8f0f6");
    const back = [
      { hx: 3, hair: "#1a1418", top: "#1a1a22" },
      { hx: 9, hair: "#f0d080", top: "#f0f0f4" },
      { hx: 15, hair: "#1a1418", top: "#c43038" },
      { hx: 21, hair: "#241c20", top: "#1a1a22" },
    ];
    for (const m of back) {
      r(ctx, x + m.hx, y + 4, 4, 3, m.hair);
      r(ctx, x + m.hx + 1, y + 6, 2, 2, C.skin);
      r(ctx, x + m.hx, y + 8, 4, 5, m.top);
    }
    const front = [
      { hx: 5, hair: "#1a1418", top: "#f0f0f4" },
      { hx: 12, hair: "#16141c", top: "#1a1a22" },
      { hx: 19, hair: "#1a1418", top: "#c43038" },
    ];
    for (const m of front) {
      r(ctx, x + m.hx, y + 11, 5, 3, m.hair);
      r(ctx, x + m.hx + 1, y + 13, 3, 2, C.skin);
      r(ctx, x + m.hx, y + 15, 5, 5, m.top);
    }
  }

  function posterGojo(ctx, x, y) {
    r(ctx, x, y, 20, 26, "#080614");
    r(ctx, x + 1, y + 1, 18, 24, "#181040");
    p(ctx, x + 3, y + 4, "#88c8ff");
    p(ctx, x + 16, y + 6, C.white);
    p(ctx, x + 5, y + 21, "#6080ff");
    p(ctx, x + 14, y + 18, "#a0c8ff");
    r(ctx, x + 4, y + 3, 12, 5, "#f4f8ff");
    p(ctx, x + 4, y + 2, "#f4f8ff");
    p(ctx, x + 8, y + 1, "#f4f8ff");
    p(ctx, x + 12, y + 2, "#f4f8ff");
    p(ctx, x + 15, y + 4, "#f4f8ff");
    r(ctx, x + 6, y + 7, 8, 6, C.skin);
    r(ctx, x + 7, y + 8, 6, 1, "#121018");
    p(ctx, x + 8, y + 10, "#40e0ff");
    p(ctx, x + 12, y + 10, "#40e0ff");
    r(ctx, x + 5, y + 13, 10, 11, "#121428");
    r(ctx, x + 7, y + 13, 6, 2, "#1c1c30");
    r(ctx, x + 14, y + 10, 3, 4, C.skin);
    p(ctx, x + 16, y + 8, C.skin);
    p(ctx, x + 17, y + 8, C.skin);
  }

  function posterMask(ctx, x, y) {
    r(ctx, x, y, 22, 26, "#8a6a30");
    r(ctx, x + 1, y + 1, 20, 24, "#3a3a42");
    r(ctx, x + 2, y + 2, 18, 22, "#ece8e0");
    r(ctx, x + 4, y + 3, 14, 7, "#5a3020");
    p(ctx, x + 3, y + 5, "#8a5a38");
    p(ctx, x + 16, y + 4, "#3a2018");
    p(ctx, x + 6, y + 2, "#8a5a38");
    p(ctx, x + 11, y + 2, "#6a4028");
    p(ctx, x + 14, y + 3, "#4a2818");
    r(ctx, x + 6, y + 8, 9, 5, C.skin);
    p(ctx, x + 12, y + 10, "#2a2218");
    p(ctx, x + 13, y + 10, "#f0e8d8");
    r(ctx, x + 5, y + 12, 12, 8, "#f8f8fc");
    r(ctx, x + 6, y + 13, 8, 6, "#d8dce4");
    r(ctx, x + 8, y + 15, 1, 3, "#6a6a74");
    r(ctx, x + 10, y + 15, 1, 3, "#6a6a74");
    r(ctx, x + 12, y + 15, 1, 3, "#6a6a74");
    r(ctx, x + 14, y + 12, 5, 4, "#f0f0f4");
    r(ctx, x + 16, y + 13, 3, 2, "#b8bcc4");
    r(ctx, x + 6, y + 20, 10, 4, "#e8e8ec");
  }

  function plush(ctx, x, y, theme) {
    if (theme === "shooky") {
      r(ctx, x + 2, y + 2, 10, 10, "#d4a060");
      r(ctx, x + 3, y + 3, 8, 8, "#e0b070");
      p(ctx, x + 5, y + 5, "#1a1418");
      p(ctx, x + 9, y + 5, "#1a1418");
      r(ctx, x + 4, y + 4, 2, 1, "#1a1418");
      r(ctx, x + 4, y + 7, 6, 3, "#5a3020");
      r(ctx, x + 6, y + 7, 2, 2, "#f8f4ec");
      r(ctx, x, y + 6, 3, 2, "#5a3020");
      r(ctx, x + 11, y + 6, 3, 2, "#5a3020");
      r(ctx, x + 4, y + 11, 2, 3, "#5a3020");
      r(ctx, x + 8, y + 11, 2, 3, "#5a3020");
    } else if (theme === "cooky") {
      r(ctx, x + 4, y, 2, 5, "#f08ab0");
      r(ctx, x + 5, y + 3, 3, 2, "#f08ab0");
      r(ctx, x + 9, y, 2, 6, "#f48ab4");
      r(ctx, x + 3, y + 5, 9, 9, "#f48ab4");
      p(ctx, x + 6, y + 8, "#1a1418");
      p(ctx, x + 10, y + 8, "#1a1418");
      r(ctx, x + 9, y + 6, 3, 1, "#1a1418");
      p(ctx, x + 8, y + 11, "#1a1418");
      r(ctx, x + 2, y + 12, 2, 2, "#f8f4ec");
      r(ctx, x + 11, y + 12, 2, 2, "#f8f4ec");
    } else if (theme === "goose") {
      r(ctx, x, y + 4, 16, 5, "#f8f4ec");
      r(ctx, x + 1, y + 3, 6, 3, "#f8f4ec");
      r(ctx, x + 9, y + 3, 6, 3, "#f8f4ec");
      r(ctx, x + 14, y + 2, 6, 4, "#f8f4ec");
      r(ctx, x + 18, y + 1, 4, 4, "#f8f4ec");
      p(ctx, x + 20, y + 2, "#1a1418");
      r(ctx, x + 21, y + 3, 3, 2, "#f08030");
      r(ctx, x + 2, y + 8, 3, 2, "#f08030");
      r(ctx, x + 6, y + 8, 3, 2, "#f08030");
    } else if (theme === "linabell") {
      r(ctx, x + 2, y, 3, 5, "#f0a0b0");
      r(ctx, x + 8, y, 3, 5, "#f0a0b0");
      p(ctx, x + 1, y + 2, "#f8e0e8");
      p(ctx, x + 2, y + 1, "#f0d050");
      r(ctx, x + 3, y + 4, 8, 8, "#f0b0a0");
      r(ctx, x + 4, y + 8, 6, 3, "#f8f0e8");
      p(ctx, x + 5, y + 7, "#48a0e0");
      p(ctx, x + 8, y + 7, "#48a0e0");
      r(ctx, x + 10, y + 8, 6, 5, "#f0b0a0");
      p(ctx, x + 14, y + 10, "#f8f0e8");
      r(ctx, x + 4, y + 11, 2, 2, "#f8f0e8");
      r(ctx, x + 8, y + 11, 2, 2, "#f8f0e8");
    } else {
      r(ctx, x + 2, y, 3, 3, "#8a5a32");
      r(ctx, x + 9, y, 3, 3, "#8a5a32");
      r(ctx, x + 3, y + 2, 8, 8, "#a07040");
      r(ctx, x + 5, y + 6, 4, 3, "#d4a070");
      p(ctx, x + 5, y + 5, "#1a1418");
      p(ctx, x + 9, y + 5, "#1a1418");
      p(ctx, x + 7, y + 8, "#4a2814");
      r(ctx, x + 1, y + 8, 3, 3, "#8a5a32");
      r(ctx, x + 10, y + 8, 3, 3, "#8a5a32");
    }
  }

  function wardrobe(ctx, x, y, color) {
    r(ctx, x, y, 22, 40, C.wood4);
    r(ctx, x + 1, y + 1, 20, 38, color || C.wood2);
    r(ctx, x + 10, y + 1, 2, 38, C.wood4);
    p(ctx, x + 7, y + 20, C.gold);
    p(ctx, x + 14, y + 20, C.gold);
    r(ctx, x + 2, y + 4, 6, 8, "rgba(255,255,255,0.12)");
  }

  function desk(ctx, x, y) {
    r(ctx, x, y + 10, 36, 10, C.wood3);
    r(ctx, x + 1, y + 11, 34, 8, C.wood1);
    r(ctx, x + 2, y + 20, 3, 8, C.wood4);
    r(ctx, x + 31, y + 20, 3, 8, C.wood4);
    r(ctx, x + 6, y + 4, 18, 12, "#2a3038");
    r(ctx, x + 7, y + 5, 16, 10, "#6ad0e0");
    r(ctx, x + 9, y + 7, 4, 3, "#ffffff");
    r(ctx, x + 26, y + 12, 6, 4, "#e8dcc0");
  }

  function chair(ctx, x, y, color) {
    r(ctx, x + 1, y, 12, 8, color || C.wood3);
    r(ctx, x, y + 8, 14, 6, color || C.wood2);
    r(ctx, x + 1, y + 14, 3, 6, C.wood4);
    r(ctx, x + 10, y + 14, 3, 6, C.wood4);
  }

  function arcade(ctx, x, y, t) {
    r(ctx, x, y + 4, 18, 36, "#2a2438");
    r(ctx, x + 1, y + 5, 16, 34, "#3a3450");
    r(ctx, x + 3, y + 8, 12, 10, "#101018");
    const g = `hsl(${(t / 20) % 360},70%,55%)`;
    r(ctx, x + 4, y + 9, 10, 8, g);
    r(ctx, x + 3, y + 20, 12, 6, "#1a1828");
    p(ctx, x + 6, y + 22, C.red);
    p(ctx, x + 10, y + 22, C.gold);
    r(ctx, x + 2, y + 28, 14, 8, "#c44858");
  }

  function screen(ctx, x, y, item, t) {
    r(ctx, x, y, 56, 28, "#1a1820");
    r(ctx, x + 2, y + 2, 52, 22, "#101018");
    const on = !item || item.on !== false;
    const ch = item && item.channel ? item.channel : 0;
    if (!on || ch === 0) {
      r(ctx, x + 2, y + 2, 52, 22, "#08080c");
      r(ctx, x + 22, y + 10, 12, 6, "#181820");
    } else if (ch === 1) {
      r(ctx, x + 2, y + 2, 52, 22, "#140c18");
      r(ctx, x + 18, y + 6, 20, 14, "#2a1828");
      p(ctx, x + 24, y + 12, C.flowerR);
      p(ctx, x + 32, y + 12, C.flowerR);
      r(ctx, x + 2, y + 18, 52, 6, "#08040c");
    } else if (ch === 2) {
      r(ctx, x + 2, y + 2, 52, 22, "#402028");
      r(ctx, x + 16, y + 7, 8, 12, C.hairBlk);
      r(ctx, x + 28, y + 7, 8, 12, C.hairY);
      r(ctx, x + 17, y + 14, 6, 6, C.dressBlk);
      r(ctx, x + 29, y + 14, 6, 6, C.dressP);
      p(ctx, x + 26, y + 12, C.flowerR);
    } else if (ch === 3) {
      r(ctx, x + 2, y + 2, 52, 22, "#501828");
      r(ctx, x + 8, y + 10, 40, 8, C.gold);
      r(ctx, x + 22, y + 5, 12, 14, "#f0d0d8");
      r(ctx, x + 24, y + 8, 8, 4, C.flowerR);
    } else {
      r(ctx, x + 2, y + 2, 52, 14, "#3a7cae");
      r(ctx, x + 2, y + 16, 52, 8, "#6bb83c");
      r(ctx, x + 22, y + 10, 14, 10, "#d8d0c8");
      p(ctx, x + 26, y + 12, "#2a1c14");
      p(ctx, x + 30, y + 12, "#2a1c14");
      const bob = Math.round(Math.sin((t || 0) / 180) * 1);
      r(ctx, x + 40, y + 12 + bob, 6, 4, "#f4d018");
    }
    r(ctx, x + 20, y + 24, 16, 4, C.wood5);
  }

  function cinemaChair(ctx, x, y) {
    r(ctx, x, y + 6, 20, 14, "#6a2030");
    r(ctx, x + 1, y, 18, 10, "#8a3044");
    r(ctx, x + 2, y + 2, 16, 6, "#a04858");
    r(ctx, x + 2, y + 18, 4, 4, C.wood5);
    r(ctx, x + 14, y + 18, 4, 4, C.wood5);
  }

  function tub(ctx, x, y, item, t) {
    r(ctx, x, y + 8, 36, 16, C.stone2);
    r(ctx, x + 2, y + 10, 32, 12, C.white);
    r(ctx, x + 4, y + 12, 28, 8, item && item.water ? "#b8dce8" : "#d0e8f0");
    r(ctx, x + 6, y + 14, 10, 4, "rgba(255,255,255,0.5)");
    r(ctx, x + 28, y + 6, 4, 6, C.stone3);
    r(ctx, x + 2, y + 22, 4, 3, C.stone3);
    r(ctx, x + 30, y + 22, 4, 3, C.stone3);
    if (!(item && item.water)) p(ctx, x + 20, y + 13, C.flowerP);
    if (item && item.water) {
      const bob = Math.round(Math.sin((t || 0) / 160) * 1);
      r(ctx, x + 8, y + 5 + bob, 5, 4, "rgba(255,255,255,0.4)");
      r(ctx, x + 18, y + 3 + bob, 6, 5, "rgba(255,255,255,0.32)");
      r(ctx, x + 26, y + 6 + bob, 5, 4, "rgba(255,255,255,0.38)");
      r(ctx, x + 12, y + 13, 16, 2, "rgba(255,255,255,0.35)");
    }
  }

  function sink(ctx, x, y, item) {
    r(ctx, x, y + 8, 20, 12, C.wood2);
    r(ctx, x + 3, y + 6, 14, 8, C.white);
    r(ctx, x + 5, y + 8, 10, 4, item && item.water ? "#9ccce0" : "#d0e0e8");
    r(ctx, x + 9, y + 4, 3, 4, C.stone2);
    r(ctx, x + 2, y + 20, 3, 4, C.wood4);
    r(ctx, x + 15, y + 20, 3, 4, C.wood4);
    if (item && item.water) {
      r(ctx, x + 10, y + 7, 1, 5, "#8ec8e8");
      r(ctx, x + 8, y + 11, 5, 2, "#c0e0ec");
    }
  }

  function toilet(ctx, x, y, item) {
    r(ctx, x + 2, y, 12, 10, C.white);
    r(ctx, x + 3, y + 1, 10, 6, "#e8eef0");
    r(ctx, x, y + 10, 16, 10, C.white);
    r(ctx, x + 3, y + 12, 10, 6, "#d8e0e4");
    if (item && item.lidOpen) {
      r(ctx, x + 4, y - 8, 8, 9, C.white);
      r(ctx, x + 5, y - 7, 6, 7, "#e8eef0");
      r(ctx, x + 4, y + 10, 8, 2, "#c8d0d4");
    } else {
      r(ctx, x + 3, y + 10, 10, 2, "#d0d8dc");
      r(ctx, x + 4, y + 11, 8, 5, "#eef2f4");
    }
  }

  function bathMirror(ctx, x, y) {
    r(ctx, x, y, 16, 18, C.wood3);
    r(ctx, x + 1, y + 1, 14, 16, "#d0e4ec");
    r(ctx, x + 2, y + 2, 5, 4, "rgba(255,255,255,0.55)");
    r(ctx, x + 9, y + 8, 4, 6, "#1a1418");
    r(ctx, x + 10, y + 12, 3, 4, "#2a2030");
  }

  function toothCups(ctx, x, y) {
    r(ctx, x, y + 5, 6, 6, "#f0c0c8");
    r(ctx, x + 2, y, 2, 7, C.white);
    r(ctx, x + 2, y, 2, 2, "#e8a0b0");
    r(ctx, x + 8, y + 5, 6, 6, "#c8e0f0");
    r(ctx, x + 10, y, 2, 7, "#f4e8a0");
    r(ctx, x + 10, y, 2, 2, C.dressP);
  }

  function towel(ctx, x, y, item) {
    const sh = item && item.shake ? Math.round(Math.sin(item.shake / 40) * 2) : 0;
    if (item && item.dropped) {
      r(ctx, x, y + 8, 14, 6, "#e8d8c8");
      r(ctx, x + 1, y + 9, 12, 3, "#f4ece0");
      return;
    }
    r(ctx, x + sh, y, 5, 18, "#e8d8c8");
    r(ctx, x + 1 + sh, y + 1, 3, 16, "#f4ece0");
    r(ctx, x + 2 + sh, y, 1, 2, C.wood4);
  }

  function laundryBasket(ctx, x, y) {
    r(ctx, x, y + 6, 14, 10, "#d4a878");
    r(ctx, x + 1, y + 7, 12, 8, "#e8c898");
    r(ctx, x + 2, y + 3, 10, 5, "#f0e8e0");
    p(ctx, x + 4, y + 4, "#c45a58");
    p(ctx, x + 8, y + 5, "#4a88c8");
    r(ctx, x + 3, y + 14, 2, 2, C.wood4);
    r(ctx, x + 9, y + 14, 2, 2, C.wood4);
  }

  function bathCabinet(ctx, x, y, item) {
    r(ctx, x, y, 18, 22, C.wood4);
    r(ctx, x + 1, y + 1, 16, 20, C.wood2);
    if (item && item.open) {
      r(ctx, x + 2, y + 3, 14, 16, "#f4ead8");
      r(ctx, x + 3, y + 5, 4, 6, C.white);
      r(ctx, x + 8, y + 4, 3, 8, "#88c0b0");
      r(ctx, x + 12, y + 6, 3, 6, "#e8a0b0");
      p(ctx, x + 5, y + 14, C.gold);
      p(ctx, x + 11, y + 15, "#6a88c8");
    } else {
      r(ctx, x + 8, y + 1, 2, 20, C.wood4);
      p(ctx, x + 5, y + 11, C.gold);
      p(ctx, x + 12, y + 11, C.gold);
    }
  }

  function toiletPaper(ctx, x, y, item) {
    r(ctx, x + 1, y + 2, 10, 10, "#e8e0d4");
    r(ctx, x + 2, y + 3, 8, 8, C.white);
    p(ctx, x + 5, y + 6, "#d0c8b8");
    const len = item && item.paperLen ? item.paperLen : 0;
    for (let i = 0; i < len; i++) {
      r(ctx, x + 8 + Math.round(Math.sin(i * 0.7) * 2), y + 12 + i * 2, 7, 2, C.white);
    }
  }

  function scale(ctx, x, y, item) {
    r(ctx, x, y + 6, 16, 6, "#c8c8d0");
    r(ctx, x + 1, y + 7, 14, 4, "#e8e8f0");
    r(ctx, x + 4, y, 8, 7, "#2a2a32");
    r(ctx, x + 5, y + 1, 6, 4, item && item.glow === "secret" ? "#f0d050" : "#8ad0a0");
  }

  function spray(ctx, x, y) {
    r(ctx, x + 3, y + 6, 6, 10, "#88c0a8");
    r(ctx, x + 4, y + 2, 4, 5, "#c8e0d8");
    r(ctx, x + 5, y, 2, 4, "#6a9080");
    p(ctx, x + 6, y + 10, "#d8f0e8");
  }

  function doorLock(ctx, x, y, item) {
    const locked = item && item.locked;
    r(ctx, x + 2, y + 4, 8, 10, locked ? "#c4a040" : "#b8b0a0");
    r(ctx, x + 4, y + 1, 4, 5, locked ? "#e8c878" : "#d0c8b8");
    p(ctx, x + 5, y + 8, C.wood5);
  }

  function rubberDuck(ctx, x, y) {
    ctx.drawImage(duck, x, y);
  }

  function popcornMachine(ctx, x, y, item, t) {
    r(ctx, x, y + 10, 16, 16, "#c44848");
    r(ctx, x + 1, y + 11, 14, 6, "#e07070");
    r(ctx, x + 2, y, 12, 12, "#e8e0d0");
    r(ctx, x + 3, y + 1, 10, 10, "#f8f4e8");
    r(ctx, x + 6, y + 22, 4, 4, C.wood4);
    if (item && item.popping) {
      for (let i = 0; i < 6; i++) {
        const bx = x + 4 + ((i * 5 + ((t / 70) | 0)) % 10);
        const by = y - 1 - ((i + ((t / 90) | 0)) % 5);
        p(ctx, bx, by, i % 2 ? "#f4e8a0" : C.white);
      }
    }
    if (item && item.mess) {
      for (const bit of item.mess) p(ctx, bit.x, bit.y, "#f4e8a0");
    }
  }

  function snackCabinet(ctx, x, y) {
    r(ctx, x, y, 18, 24, C.wood5);
    r(ctx, x + 1, y + 1, 16, 22, "#3a3040");
    r(ctx, x + 3, y + 4, 5, 8, "#e8c050");
    r(ctx, x + 10, y + 5, 4, 7, "#c44858");
    r(ctx, x + 4, y + 14, 10, 4, "#6a4030");
    r(ctx, x + 6, y + 15, 6, 2, "#c47848");
  }

  function remote(ctx, x, y) {
    r(ctx, x, y, 6, 12, "#2a2a32");
    p(ctx, x + 2, y + 2, C.red);
    p(ctx, x + 2, y + 5, C.white);
    p(ctx, x + 2, y + 8, C.gold);
  }

  function dvdShelf(ctx, x, y) {
    r(ctx, x, y, 14, 28, C.wood5);
    r(ctx, x + 1, y + 1, 12, 26, C.wood3);
    const cols = ["#c44858", "#4a88c8", "#e8c050", "#88a070", "#8a60a0", "#e07090"];
    for (let i = 0; i < 6; i++) r(ctx, x + 2, y + 3 + i * 4, 10, 3, cols[i]);
  }

  function lazyChair(ctx, x, y) {
    r(ctx, x, y + 10, 22, 12, "#4a3058");
    r(ctx, x + 2, y + 4, 18, 14, "#6a4880");
    r(ctx, x + 4, y + 6, 14, 8, "#8a68a0");
    r(ctx, x + 3, y + 20, 4, 3, "#3a2048");
    r(ctx, x + 15, y + 20, 4, 3, "#3a2048");
  }

  function doorSign(ctx, x, y, item) {
    r(ctx, x, y, 16, 12, C.wood4);
    r(ctx, x + 1, y + 1, 14, 10, item && item.flipped ? "#c45a48" : "#f4ead4");
    r(ctx, x + 3, y + 4, 10, 2, item && item.flipped ? "#f4ead4" : "#8a5040");
    r(ctx, x + 4, y + 7, 8, 2, item && item.flipped ? "#f4ead4" : "#8a5040");
  }

  function wallKey(ctx, x, y) {
    r(ctx, x + 2, y, 8, 3, C.wood4);
    r(ctx, x + 5, y + 2, 2, 8, C.gold);
    r(ctx, x + 4, y + 8, 6, 3, C.gold);
    p(ctx, x + 9, y + 9, C.gold);
  }

  function slippers(ctx, x, y) {
    r(ctx, x, y + 2, 7, 4, "#e8d0b0");
    r(ctx, x + 9, y + 2, 7, 4, "#e8d0b0");
    r(ctx, x + 1, y + 1, 5, 2, "#f4e8d0");
    r(ctx, x + 10, y + 1, 5, 2, "#f4e8d0");
  }

  function snackBasket(ctx, x, y) {
    r(ctx, x, y + 6, 16, 10, "#d4a060");
    r(ctx, x + 1, y + 7, 14, 8, "#e8c078");
    r(ctx, x + 3, y + 3, 4, 6, "#e8c050");
    r(ctx, x + 8, y + 2, 5, 7, "#c44858");
    r(ctx, x + 6, y + 5, 4, 4, "#88c070");
  }

  function miniFridge(ctx, x, y, item) {
    r(ctx, x, y, 14, 22, "#c8d0d8");
    r(ctx, x + 1, y + 1, 12, 20, item && item.open ? "#e8f0f4" : "#d8e0e8");
    if (item && item.open) {
      r(ctx, x + 2, y + 4, 6, 4, "#c44858");
      r(ctx, x + 2, y + 10, 6, 4, "#88c0e0");
    } else {
      r(ctx, x + 10, y + 10, 2, 3, C.gold);
    }
  }

  function wateringCan(ctx, x, y) {
    r(ctx, x + 2, y + 6, 10, 8, "#7a9cb0");
    r(ctx, x + 10, y + 4, 6, 3, "#6a8ca0");
    r(ctx, x + 4, y + 3, 6, 4, "#8ab0c4");
    r(ctx, x, y + 7, 3, 4, "#6a8ca0");
  }

  function swing(ctx, x, y, item) {
    r(ctx, x + 1, y, 2, 22, C.wood4);
    r(ctx, x + 17, y, 2, 22, C.wood4);
    r(ctx, x, y, 20, 3, C.wood3);
    const bob = Math.round(Math.sin(((item && item.t) || 0) / (item && item.high ? 80 : 140)) * (item && item.high ? 3 : 1));
    r(ctx, x + 4, y + 14 + bob, 12, 4, C.wood2);
    r(ctx, x + 5, y + 4, 1, 11 + bob, "#d8c8a8");
    r(ctx, x + 14, y + 4, 1, 11 + bob, "#d8c8a8");
  }

  function hammock(ctx, x, y, item) {
    r(ctx, x + 2, y, 2, 16, C.wood4);
    r(ctx, x + 20, y, 2, 16, C.wood4);
    const bob = Math.round(Math.sin(((item && item.t) || 0) / 180) * 1);
    r(ctx, x + 3, y + 8 + bob, 18, 6, "#e8c090");
    r(ctx, x + 5, y + 9 + bob, 14, 4, "#f4d8a8");
  }

  function picnicBasket(ctx, x, y) {
    r(ctx, x, y + 6, 16, 10, "#c47838");
    r(ctx, x + 1, y + 7, 14, 8, "#e0a050");
    r(ctx, x + 4, y + 2, 8, 6, "#c47838");
    r(ctx, x + 3, y + 8, 4, 3, "#f4e8c8");
    r(ctx, x + 9, y + 8, 4, 3, "#88c070");
  }

  function toolBox(ctx, x, y, item) {
    r(ctx, x, y + 6, 18, 10, "#c45a38");
    r(ctx, x + 1, y + 7, 16, 8, "#e07048");
    if (item && item.open) {
      r(ctx, x + 2, y + 2, 4, 6, C.stone2);
      r(ctx, x + 7, y + 3, 5, 4, "#e8d8c0");
      r(ctx, x + 13, y + 2, 3, 7, C.stone3);
    } else {
      r(ctx, x + 2, y + 4, 14, 3, "#a84830");
    }
  }

  function dandelion(ctx, x, y, item) {
    r(ctx, x + 3, y + 8, 2, 8, C.leaf1);
    if (!(item && item.blown)) {
      r(ctx, x + 1, y + 2, 6, 6, "#f4f0d8");
      p(ctx, x + 3, y + 4, C.gold);
    } else {
      p(ctx, x + 4, y + 6, "#e8e0c0");
    }
  }

  function dualArcade(ctx, x, y, t) {
    r(ctx, x, y + 4, 28, 36, "#241828");
    r(ctx, x + 1, y + 5, 26, 34, "#3a2450");
    r(ctx, x + 2, y + 8, 10, 8, "#101018");
    r(ctx, x + 16, y + 8, 10, 8, "#101018");
    const g = `hsl(${(t / 18) % 360},70%,55%)`;
    r(ctx, x + 3, y + 9, 8, 6, g);
    r(ctx, x + 17, y + 9, 8, 6, `hsl(${(t / 18 + 80) % 360},70%,55%)`);
    r(ctx, x + 2, y + 28, 24, 8, "#c44858");
    p(ctx, x + 6, y + 22, C.red);
    p(ctx, x + 20, y + 22, C.gold);
  }

  function clawMachine(ctx, x, y, t) {
    r(ctx, x, y, 20, 36, "#3a5088");
    r(ctx, x + 2, y + 2, 16, 18, "#b8d8e8");
    r(ctx, x + 7, y + 4 + Math.round(Math.sin(t / 200)), 6, 4, "#d0d8e0");
    r(ctx, x + 4, y + 14, 4, 4, C.flowerR);
    r(ctx, x + 12, y + 13, 4, 4, C.gold);
    r(ctx, x + 2, y + 22, 16, 12, "#2a3860");
    p(ctx, x + 6, y + 26, C.red);
    p(ctx, x + 12, y + 26, C.white);
  }

  function hoopMachine(ctx, x, y) {
    r(ctx, x + 6, y, 8, 22, "#c45838");
    r(ctx, x + 2, y + 4, 16, 3, "#e07848");
    r(ctx, x + 4, y + 5, 12, 8, "#1a2030");
    r(ctx, x + 6, y + 7, 8, 4, "#e07030");
    r(ctx, x + 4, y + 22, 12, 6, "#8a3020");
  }

  function punchMachine(ctx, x, y, item) {
    r(ctx, x, y, 16, 36, "#2a2438");
    r(ctx, x + 2, y + 2, 12, 8, "#101018");
    r(ctx, x + 3, y + 3, 10, 6, item && item.flash ? C.gold : "#3a8a48");
    r(ctx, x + 4, y + 14, 8, 14, "#c44858");
    r(ctx, x + 2, y + 30, 12, 6, "#1a1828");
  }

  function sandbag(ctx, x, y) {
    r(ctx, x + 6, y, 2, 8, C.wood4);
    r(ctx, x + 2, y + 8, 12, 18, "#c47848");
    r(ctx, x + 3, y + 10, 10, 14, "#d49060");
    r(ctx, x + 4, y + 12, 8, 3, "#e8b080");
  }

  function gacha(ctx, x, y) {
    r(ctx, x + 2, y + 14, 12, 12, "#c44858");
    r(ctx, x + 3, y + 2, 10, 14, "#88d0e8");
    r(ctx, x + 4, y + 4, 8, 10, "#b8e8f4");
    p(ctx, x + 6, y + 7, C.flowerR);
    p(ctx, x + 9, y + 9, C.gold);
    r(ctx, x + 6, y + 22, 4, 4, C.wood4);
  }

  function snackRack(ctx, x, y) {
    r(ctx, x, y, 16, 28, C.wood4);
    r(ctx, x + 1, y + 1, 14, 26, "#3a3040");
    r(ctx, x + 3, y + 4, 4, 6, "#e8c050");
    r(ctx, x + 9, y + 5, 4, 5, C.flowerR);
    r(ctx, x + 3, y + 13, 4, 6, "#88c0e0");
    r(ctx, x + 9, y + 14, 4, 5, "#c44858");
    r(ctx, x + 4, y + 21, 8, 4, "#6a4030");
  }

  function dancePad(ctx, x, y) {
    r(ctx, x, y, 20, 20, "#2a2a38");
    r(ctx, x + 6, y + 1, 8, 6, "#e07090");
    r(ctx, x + 1, y + 6, 6, 8, "#70a0e0");
    r(ctx, x + 13, y + 6, 6, 8, "#70e0a0");
    r(ctx, x + 6, y + 13, 8, 6, "#e0c070");
  }

  function beanSofa(ctx, x, y) {
    r(ctx, x, y + 8, 28, 14, "#3a6a48");
    r(ctx, x + 2, y + 4, 24, 16, "#4a8858");
    r(ctx, x + 5, y + 6, 18, 10, "#68a070");
  }

  function catTree(ctx, x, y) {
    r(ctx, x + 6, y + 8, 6, 28, "#d4b07a");
    r(ctx, x, y + 32, 20, 6, C.wood3);
    r(ctx, x + 2, y + 18, 16, 4, "#c4a068");
    r(ctx, x + 4, y + 4, 14, 8, "#8a6a48");
    r(ctx, x + 12, y + 8, 4, 16, "#d4b07a");
    r(ctx, x + 10, y + 2, 10, 6, "#a08060");
  }

  function dogBed(ctx, x, y) {
    r(ctx, x, y + 6, 24, 12, "#8a5040");
    r(ctx, x + 2, y + 8, 20, 8, "#c87870");
    r(ctx, x + 4, y + 10, 16, 5, "#e8a8a0");
  }

  function bowls(ctx, x, y) {
    r(ctx, x, y + 4, 10, 6, "#c0c4c8");
    r(ctx, x + 2, y + 5, 6, 3, "#e8a050");
    r(ctx, x + 12, y + 4, 10, 6, "#c0c4c8");
    r(ctx, x + 14, y + 5, 6, 3, "#5aa4c8");
  }

  function petNest(ctx, x, y, theme) {
    const outer = (theme && theme.outer) || "#8a5040";
    const inner = (theme && theme.inner) || "#c87870";
    const pad = (theme && theme.pad) || "#e8a8a0";
    r(ctx, x, y + 6, 24, 12, outer);
    r(ctx, x + 2, y + 8, 20, 8, inner);
    r(ctx, x + 4, y + 10, 16, 5, pad);
  }

  function cardboardBox(ctx, x, y) {
    r(ctx, x, y + 6, 18, 12, "#c49048");
    r(ctx, x + 1, y + 7, 16, 10, "#e8b868");
    r(ctx, x + 4, y + 8, 10, 8, "#6a4820");
    r(ctx, x + 5, y + 9, 8, 6, "#1a1008");
    r(ctx, x + 1, y + 4, 7, 4, "#d4a058");
    r(ctx, x + 10, y + 3, 7, 5, "#c49048");
    p(ctx, x + 8, y + 11, "#e8c878");
  }

  function petTunnel(ctx, x, y) {
    r(ctx, x, y + 6, 36, 12, "#e07090");
    r(ctx, x + 1, y + 7, 34, 10, "#f090a8");
    r(ctx, x + 3, y + 8, 8, 8, "#5a2030");
    r(ctx, x + 25, y + 8, 8, 8, "#5a2030");
    r(ctx, x + 4, y + 9, 6, 6, "#1a0810");
    r(ctx, x + 26, y + 9, 6, 6, "#1a0810");
    r(ctx, x + 12, y + 6, 12, 3, "#ffb0c4");
    r(ctx, x + 8, y + 16, 4, 2, "#c44868");
    r(ctx, x + 24, y + 16, 4, 2, "#c44868");
  }

  function toyBasket(ctx, x, y) {
    r(ctx, x + 1, y + 6, 16, 10, "#c47848");
    r(ctx, x + 2, y + 7, 14, 8, "#e8a060");
    r(ctx, x, y + 5, 18, 3, "#a06038");
    r(ctx, x + 4, y + 3, 5, 5, "#e07070");
    r(ctx, x + 9, y + 2, 5, 5, "#70b0e0");
    p(ctx, x + 5, y + 4, "#fff0f0");
    p(ctx, x + 11, y + 3, "#e8f4ff");
    r(ctx, x + 7, y + 8, 4, 3, "#f0d050");
  }

  function toyBall(ctx, x, y, golden, t) {
    const bob = Math.round(Math.sin((t || 0) / 80) * 1);
    r(ctx, x + 1, y + 9 + bob, 8, 2, "rgba(40,20,10,0.28)");
    if (golden) {
      r(ctx, x, y - 1 + bob, 10, 10, "#a06818");
      r(ctx, x + 1, y + bob, 8, 8, "#f0c040");
      r(ctx, x + 2, y + 1 + bob, 6, 6, "#ffe878");
      p(ctx, x + 3, y + 2 + bob, "#fff8d0");
      p(ctx, x + 6, y + 5 + bob, "#e8a020");
    } else {
      r(ctx, x, y - 1 + bob, 10, 10, "#7a2028");
      r(ctx, x + 1, y + bob, 8, 8, "#d44848");
      r(ctx, x + 2, y + 1 + bob, 6, 6, "#f07070");
      p(ctx, x + 3, y + 2 + bob, "#fff0f0");
      p(ctx, x + 6, y + 5 + bob, "#b03038");
    }
  }

  function fridge(ctx, x, y) {
    r(ctx, x, y, 18, 36, "#c8d0d8");
    r(ctx, x + 1, y + 1, 16, 34, "#e8eef4");
    r(ctx, x + 1, y + 14, 16, 2, "#b8c0c8");
    p(ctx, x + 14, y + 7, "#8a9098");
    p(ctx, x + 14, y + 22, "#8a9098");
    r(ctx, x + 3, y + 3, 6, 5, "rgba(255,255,255,0.45)");
    r(ctx, x + 4, y + 32, 4, 3, "#d0d8e0");
    r(ctx, x + 10, y + 32, 4, 3, "#d0d8e0");
    p(ctx, x + 4, y + 4, "#c43028");
  }

  function fridgeNote(ctx, x, y) {
    r(ctx, x, y, 8, 9, "#e8c830");
    r(ctx, x + 1, y + 1, 6, 7, "#fff3a0");
    r(ctx, x + 2, y + 2, 4, 1, "#e07090");
    r(ctx, x + 2, y + 4, 5, 1, "#e07090");
    r(ctx, x + 2, y + 6, 3, 1, "#70a0c8");
    p(ctx, x + 3, y, "#c43028");
  }

  function chipBag(ctx, x, y) {
    r(ctx, x + 1, y + 1, 10, 16, "#f4d018");
    r(ctx, x, y + 3, 12, 14, "#f4d018");
    r(ctx, x + 1, y + 1, 10, 3, "#fff8e8");
    r(ctx, x, y + 2, 1, 14, "#e0b810");
    r(ctx, x + 11, y + 2, 1, 14, "#d4a808");
    r(ctx, x + 1, y + 2, 3, 2, "#d42828");
    r(ctx, x + 2, y + 4, 8, 5, "#f04080");
    r(ctx, x + 3, y + 5, 6, 3, "#ff78a8");
    p(ctx, x + 3, y + 4, "#fff8f0");
    p(ctx, x + 8, y + 4, "#fff8f0");
    r(ctx, x + 1, y + 9, 10, 3, "#5a3018");
    r(ctx, x + 2, y + 10, 8, 1, "#fff4d8");
    r(ctx, x + 2, y + 13, 3, 2, "#e0a040");
    r(ctx, x + 5, y + 14, 3, 2, "#d49030");
    r(ctx, x + 7, y + 12, 4, 4, "#ffe848");
    p(ctx, x + 8, y + 13, "#2a1c14");
    p(ctx, x + 10, y + 13, "#2a1c14");
    p(ctx, x + 8, y + 15, "#f09090");
    p(ctx, x + 10, y + 15, "#f09090");
    p(ctx, x + 9, y + 12, "#ff90b0");
  }

  function chipStack(ctx, x, y) {
    r(ctx, x + 2, y + 24, 24, 8, "#b07838");
    r(ctx, x + 3, y + 25, 22, 3, "#d4a060");
    r(ctx, x + 3, y + 29, 22, 2, "#8a5828");
    chipBag(ctx, x + 2, y);
    chipBag(ctx, x + 14, y + 2);
    chipBag(ctx, x + 1, y + 8);
    chipBag(ctx, x + 15, y + 10);
    chipBag(ctx, x + 2, y + 16);
    chipBag(ctx, x + 14, y + 18);
  }

  function beefRoll(ctx, x, y) {
    r(ctx, x + 1, y + 12, 22, 8, "#c8d0d8");
    r(ctx, x + 2, y + 13, 20, 6, "#e8eef4");
    r(ctx, x + 4, y + 6, 16, 14, "#7a2818");
    r(ctx, x + 5, y + 7, 14, 12, "#c45030");
    r(ctx, x + 7, y + 9, 10, 8, "#f0d4b8");
    r(ctx, x + 8, y + 10, 8, 6, "#a83828");
    r(ctx, x + 10, y + 12, 4, 3, "#f4e4cc");
    r(ctx, x + 5, y + 8, 5, 2, "rgba(255,255,255,0.35)");
    r(ctx, x + 18, y + 10, 3, 8, "#d8c0a0");
  }

  function foieGras(ctx, x, y) {
    r(ctx, x + 2, y + 14, 18, 6, "#c8b090");
    r(ctx, x + 3, y + 15, 16, 4, "#efe0c4");
    r(ctx, x + 4, y + 6, 12, 10, "#b07828");
    r(ctx, x + 5, y + 7, 10, 8, "#e8b040");
    r(ctx, x + 6, y + 8, 8, 3, "#f4d078");
    p(ctx, x + 7, y + 12, "#8a5020");
    r(ctx, x + 15, y + 9, 5, 7, "#d49838");
    r(ctx, x + 16, y + 10, 3, 5, "#f0c060");
  }

  function seafoodDon(ctx, x, y) {
    r(ctx, x + 2, y + 12, 20, 8, "#c45a48");
    r(ctx, x + 3, y + 13, 18, 6, "#a04038");
    r(ctx, x + 4, y + 10, 16, 8, "#f4ead0");
    r(ctx, x + 5, y + 11, 14, 5, "#fff8e8");
    r(ctx, x + 4, y + 7, 7, 5, "#f07050");
    r(ctx, x + 5, y + 8, 5, 2, "#f4a078");
    r(ctx, x + 12, y + 7, 6, 5, "#f0e8dc");
    p(ctx, x + 13, y + 8, "#d8c8b0");
    r(ctx, x + 9, y + 9, 5, 4, "#f4d060");
    r(ctx, x + 15, y + 11, 3, 2, "#3a7848");
    p(ctx, x + 6, y + 12, "#c43028");
    p(ctx, x + 8, y + 13, "#c43028");
    p(ctx, x + 11, y + 12, "#c43028");
  }

  function paintSprite(dest, drawFn, srcW, srcH, scale) {
    const tmp = makeCanvas(srcW, srcH);
    drawFn(tmp.ctx, 0, 0);
    dest.width = srcW * scale;
    dest.height = srcH * scale;
    const d = dest.getContext("2d");
    d.imageSmoothingEnabled = false;
    d.clearRect(0, 0, dest.width, dest.height);
    d.drawImage(tmp.c, 0, 0, dest.width, dest.height);
  }

  function stove(ctx, x, y, t) {
    r(ctx, x + 2, y, 18, 10, "#6a6a74");
    r(ctx, x + 4, y + 2, 14, 6, "#3a3a44");
    r(ctx, x, y + 10, 22, 18, "#3a3a42");
    r(ctx, x + 1, y + 11, 20, 14, "#2a2a32");
    r(ctx, x + 3, y + 13, 6, 6, "#1a1a22");
    r(ctx, x + 13, y + 13, 6, 6, "#1a1a22");
    const lit = Math.sin(t / 90) > -0.2;
    if (lit) {
      p(ctx, x + 5, y + 15, "#ffb040");
      p(ctx, x + 6, y + 16, "#ffee88");
      p(ctx, x + 15, y + 15, "#ff7040");
    }
    r(ctx, x + 6, y + 21, 10, 3, "#1a1a22");
    r(ctx, x + 2, y + 26, 4, 3, "#2a2a32");
    r(ctx, x + 16, y + 26, 4, 3, "#2a2a32");
  }

  function counter(ctx, x, y) {
    r(ctx, x, y + 8, 28, 16, C.wood4);
    r(ctx, x + 1, y + 9, 26, 5, "#efe0c4");
    r(ctx, x + 2, y + 16, 10, 6, C.wood2);
    r(ctx, x + 16, y + 16, 10, 6, C.wood2);
    p(ctx, x + 6, y + 18, C.gold);
    p(ctx, x + 20, y + 18, C.gold);
    r(ctx, x + 4, y + 10, 5, 3, "#c45a48");
    r(ctx, x + 18, y + 10, 4, 3, C.leaf2);
  }

  function kitchenSink(ctx, x, y) {
    r(ctx, x, y + 8, 24, 16, C.wood4);
    r(ctx, x + 1, y + 9, 22, 5, "#efe0c4");
    r(ctx, x + 4, y + 11, 14, 8, "#c8d4dc");
    r(ctx, x + 6, y + 13, 10, 4, "#98b4c4");
    r(ctx, x + 10, y + 7, 3, 5, C.stone2);
    r(ctx, x + 2, y + 22, 3, 3, C.wood5);
    r(ctx, x + 19, y + 22, 3, 3, C.wood5);
  }

  function diningTable(ctx, x, y) {
    r(ctx, x, y + 6, 44, 18, C.wood4);
    r(ctx, x + 2, y + 7, 40, 14, C.wood2);
    r(ctx, x + 3, y + 8, 38, 10, "#e8c888");
    r(ctx, x + 8, y + 10, 6, 6, C.white);
    r(ctx, x + 30, y + 10, 6, 6, C.white);
    p(ctx, x + 10, y + 12, C.flowerR);
    p(ctx, x + 32, y + 12, C.leaf2);
    r(ctx, x + 20, y + 9, 4, 5, "#c45a48");
    p(ctx, x + 21, y + 10, C.gold);
    r(ctx, x + 4, y + 22, 4, 4, C.wood5);
    r(ctx, x + 36, y + 22, 4, 4, C.wood5);
  }

  function wallCabinet(ctx, x, y) {
    r(ctx, x, y, 28, 14, C.wood4);
    r(ctx, x + 1, y + 1, 12, 12, C.wood2);
    r(ctx, x + 15, y + 1, 12, 12, C.wood2);
    p(ctx, x + 10, y + 7, C.gold);
    p(ctx, x + 24, y + 7, C.gold);
    r(ctx, x + 3, y + 3, 6, 3, "rgba(255,255,255,0.12)");
  }

  function cake(ctx, x, y, lit, t) {
    r(ctx, x + 1, y + 11, 24, 9, "#f4d0dc");
    r(ctx, x + 2, y + 12, 22, 7, "#e890b0");
    r(ctx, x + 3, y + 10, 20, 4, "#fff4f8");
    r(ctx, x + 4, y + 16, 18, 3, "#d07090");
    p(ctx, x + 6, y + 11, C.flowerR);
    p(ctx, x + 14, y + 11, C.flowerR);
    p(ctx, x + 20, y + 11, C.flowerR);
    for (let i = 0; i < 3; i++) {
      const cx = x + 7 + i * 5;
      r(ctx, cx, y + 4, 2, 7, "#f8f0d8");
      if (lit) {
        const bob = Math.round(Math.sin((t || 0) / 90 + i) * 1);
        p(ctx, cx, y + 2 + bob, "#ffee88");
        p(ctx, cx, y + 1 + bob, "#ffb040");
        p(ctx, cx + 1, y + 2 + bob, "#ffe878");
      } else {
        p(ctx, cx, y + 3, "#6a5a40");
      }
    }
  }

  function steak(ctx, x, y) {
    r(ctx, x, y + 2, 16, 12, "#f0ece4");
    r(ctx, x + 1, y + 3, 14, 10, C.white);
    r(ctx, x + 3, y + 5, 10, 7, "#7a3020");
    r(ctx, x + 4, y + 6, 8, 5, "#c45a38");
    p(ctx, x + 7, y + 8, "#e8a070");
    p(ctx, x + 5, y + 7, "#5a2018");
  }

  function choir(ctx, x, y, i, t) {
    const robes = ["#f4e8d0", "#e8c878", "#fff4e0", "#d4b06a"];
    const hairs = ["#2a1810", C.hairY, C.hairBlk, "#8a4a28"];
    const robe = robes[i % 4];
    const hair = hairs[i % 4];
    const sing = ((t / 160) | 0) % 2 === 0;
    r(ctx, x + 4, y, 8, 5, hair);
    r(ctx, x + 5, y + 4, 6, 5, C.skin);
    p(ctx, x + 6, y + 6, C.eye);
    p(ctx, x + 9, y + 6, C.eye);
    if (sing) r(ctx, x + 7, y + 8, 2, 2, "#c45a48");
    else p(ctx, x + 7, y + 8, "#c45a48");
    r(ctx, x + 3, y + 10, 10, 10, robe);
    r(ctx, x + 5, y + 12, 6, 4, "#fff8ec");
    r(ctx, x + 4, y + 20, 3, 3, C.wood5);
    r(ctx, x + 9, y + 20, 3, 3, C.wood5);
  }

  function windowPane(ctx, x, y, sky, curtain) {
    r(ctx, x, y, 22, 20, C.wood4);
    r(ctx, x + 2, y + 2, 18, 16, sky || "#8ec8e8");
    r(ctx, x + 10, y + 2, 2, 16, C.wood4);
    r(ctx, x + 2, y + 9, 18, 2, C.wood4);
    r(ctx, x + 3, y + 3, 5, 4, "rgba(255,255,255,0.35)");
    if (curtain) {
      const c1 = curtain === "navy" ? "#2a2040" : "#c45a58";
      const c2 = curtain === "navy" ? "#3a3050" : "#d87878";
      r(ctx, x + 2, y + 2, 7, 16, c1);
      r(ctx, x + 13, y + 2, 7, 16, c1);
      r(ctx, x + 3, y + 2, 5, 16, c2);
      r(ctx, x + 14, y + 2, 5, 16, c2);
    }
  }

  function painting(ctx, x, y, type) {
    r(ctx, x, y, 16, 14, C.wood4);
    if (type === "us") {
      r(ctx, x + 2, y + 2, 12, 10, "#b8d8a0");
      r(ctx, x + 3, y + 5, 4, 6, C.hairBlk);
      r(ctx, x + 4, y + 8, 3, 4, C.dressBlk);
      r(ctx, x + 8, y + 5, 4, 6, C.hairY);
      r(ctx, x + 9, y + 8, 3, 4, C.dressP);
    } else if (type === "moon") {
      r(ctx, x + 2, y + 2, 12, 10, "#1a2038");
      r(ctx, x + 7, y + 4, 5, 5, "#f0e8c0");
    } else {
      r(ctx, x + 2, y + 2, 12, 10, "#f0d090");
      r(ctx, x + 4, y + 6, 8, 4, C.leaf2);
    }
  }

  function lamp(ctx, x, y, shade, on) {
    r(ctx, x + 5, y + 12, 4, 8, C.wood4);
    r(ctx, x + 2, y + 2, 10, 10, shade || "#e8b85a");
    r(ctx, x + 4, y + 4, 6, 6, on === false ? "#b8a878" : "#fff0b0");
    r(ctx, x + 1, y + 10, 12, 2, shade || "#d4a040");
    if (on !== false) {
      r(ctx, x + 3, y + 5, 8, 1, "rgba(255,255,255,0.45)");
    }
  }

  function nightstand(ctx, x, y) {
    r(ctx, x, y + 6, 14, 12, C.wood3);
    r(ctx, x + 1, y + 7, 12, 4, C.wood1);
    p(ctx, x + 10, y + 12, C.gold);
    r(ctx, x + 4, y + 2, 6, 5, "#f8e8c8");
  }

  function shoes(ctx, x, y, color) {
    r(ctx, x, y + 2, 6, 4, color || C.hairBlk);
    r(ctx, x + 8, y + 2, 6, 4, color || C.hairBlk);
    p(ctx, x + 1, y + 3, C.white);
    p(ctx, x + 9, y + 3, C.white);
  }

  function cushion(ctx, x, y, color) {
    r(ctx, x, y + 2, 12, 8, color);
    r(ctx, x + 1, y + 3, 10, 5, "rgba(255,255,255,0.2)");
  }

  function clock(ctx, x, y) {
    r(ctx, x, y, 12, 12, C.wood3);
    r(ctx, x + 2, y + 2, 8, 8, C.cream);
    p(ctx, x + 6, y + 6, C.ink);
    r(ctx, x + 6, y + 3, 1, 3, C.ink);
    r(ctx, x + 6, y + 6, 3, 1, C.ink);
  }

  function rugOval(ctx, x, y, w, h, color, edge) {
    ctx.fillStyle = edge;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2 - 2, h / 2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function tree(ctx, x, y) {
    r(ctx, x + 12, y + 30, 7, 16, "#6a4020");
    r(ctx, x + 14, y + 30, 3, 16, "#8a5a30");
    r(ctx, x + 2, y + 10, 28, 24, "#1e4a24");
    r(ctx, x + 6, y + 4, 20, 24, "#2a6430");
    r(ctx, x + 8, y, 16, 16, "#3d8a3a");
    r(ctx, x + 10, y + 2, 12, 8, "#c45a78");
    p(ctx, x + 8, y + 10, "#f0d0d8");
    p(ctx, x + 18, y + 8, C.flowerR);
    p(ctx, x + 14, y + 4, C.gold);
    p(ctx, x + 22, y + 14, "#f4e8ec");
  }

  function cypress(ctx, x, y) {
    r(ctx, x + 7, y + 38, 5, 10, "#5a3820");
    r(ctx, x + 2, y + 10, 14, 32, "#164820");
    r(ctx, x + 4, y + 4, 10, 30, "#1e5c28");
    r(ctx, x + 6, y, 6, 16, "#2e7a38");
    p(ctx, x + 8, y + 6, "#58a048");
    r(ctx, x + 6, y + 46, 8, 2, "#d4a040");
  }

  function flowerPatch(ctx, x, y, kind) {
    r(ctx, x, y + 10, 20, 5, "#c4b090");
    r(ctx, x + 1, y + 11, 18, 3, "#6a4020");
    r(ctx, x, y + 14, 20, 1, "#d4a040");
    const cols = [C.flowerR, "#c43048", C.gold, C.flowerP, "#fff0f4", C.flowerR];
    for (let i = 0; i < 8; i++) {
      const fx = x + 2 + (i % 4) * 4;
      const fy = y + 1 + Math.floor(i / 4) * 5 - ((kind + i) % 2);
      r(ctx, fx, fy + 4, 2, 5, C.leaf1);
      r(ctx, fx - 1, fy, 4, 4, cols[(kind + i) % cols.length]);
      p(ctx, fx, fy + 1, C.gold);
    }
  }

  function vegBox(ctx, x, y, crop) {
    r(ctx, x, y, 20, 16, C.wood4);
    r(ctx, x + 1, y + 1, 18, 14, C.dirt3);
    const top = crop === "berry" ? C.flowerR : crop === "gold" ? C.flowerY : C.leaf2;
    for (let i = 0; i < 6; i++) {
      p(ctx, x + 3 + (i % 3) * 5, y + 4 + Math.floor(i / 3) * 5, top);
      p(ctx, x + 4 + (i % 3) * 5, y + 5 + Math.floor(i / 3) * 5, C.leaf1);
    }
  }

  function planter(ctx, x, y, crop) {
    r(ctx, x, y + 8, 20, 10, "#d8ccb4");
    r(ctx, x + 1, y + 9, 18, 4, "#f4ead8");
    r(ctx, x, y + 16, 20, 2, "#d4a040");
    r(ctx, x + 2, y + 18, 3, 2, "#c4b090");
    r(ctx, x + 15, y + 18, 3, 2, "#c4b090");
    const top = crop === "berry" ? C.flowerR : crop === "gold" ? C.gold : C.leaf2;
    r(ctx, x + 4, y + 2, 12, 10, "#2a6418");
    p(ctx, x + 6, y, top);
    p(ctx, x + 10, y + 1, C.flowerR);
    p(ctx, x + 13, y, C.gold);
  }

  function bench(ctx, x, y) {
    r(ctx, x, y + 6, 28, 6, "#e8dcc4");
    r(ctx, x, y + 4, 28, 3, "#f8f0dc");
    r(ctx, x, y + 4, 28, 1, "#d4a040");
    r(ctx, x + 2, y + 12, 3, 6, "#d4a040");
    r(ctx, x + 23, y + 12, 3, 6, "#d4a040");
  }

  function fountain(ctx, x, y, t, item) {
    r(ctx, x, y + 16, 32, 12, "#c8b898");
    r(ctx, x + 2, y + 14, 28, 12, "#e8dcc4");
    r(ctx, x + 1, y + 14, 30, 2, "#d4a040");
    r(ctx, x + 5, y + 16, 22, 8, "#3a88b0");
    r(ctx, x + 7, y + 18, 18, 5, "#5aa4c8");
    r(ctx, x + 14, y + 6, 4, 12, "#d4a040");
    r(ctx, x + 12, y + 2, 8, 8, "#f0e090");
    r(ctx, x + 13, y, 6, 4, "#e8dcc4");
    p(ctx, x + 15, y - 2, "#f8e8a0");
    const boost = item && item.splash ? 5 : 0;
    const bob = Math.sin(t / 200) * 2;
    r(ctx, x + 15, y - 1 + bob - boost, 2, 8 + boost, C.water3);
    p(ctx, x + 14, y - 2 + bob - boost, C.white);
    p(ctx, x + 17, y + bob - boost, C.white);
    if (boost) {
      p(ctx, x + 10, y + bob, C.white);
      p(ctx, x + 20, y + bob - 2, C.white);
      r(ctx, x + 8, y + 16, 16, 3, C.water3);
    }
  }

  function statue(ctx, x, y) {
    r(ctx, x, y + 24, 16, 6, "#c4b090");
    r(ctx, x + 1, y + 22, 14, 4, "#e8dcc4");
    r(ctx, x, y + 24, 16, 1, "#d4a040");
    r(ctx, x + 5, y + 10, 6, 12, "#f0e8d8");
    r(ctx, x + 6, y + 3, 5, 7, "#f4ead8");
    r(ctx, x + 2, y + 12, 4, 8, "#e8dcc4");
    r(ctx, x + 11, y + 12, 3, 7, "#e8dcc4");
    r(ctx, x + 5, y, 7, 3, "#d4a040");
    p(ctx, x + 8, y - 1, "#f8e8a0");
  }

  function topiary(ctx, x, y, kind) {
    r(ctx, x + 7, y + 22, 4, 10, "#6a4020");
    r(ctx, x + 6, y + 30, 6, 2, "#d4a040");
    if (kind === "spiral") {
      r(ctx, x + 5, y + 16, 8, 8, "#1e5c28");
      r(ctx, x + 3, y + 10, 12, 8, "#2a6e30");
      r(ctx, x + 5, y + 4, 8, 8, "#3a8a3a");
      r(ctx, x + 7, y, 4, 6, "#4c9a44");
    } else {
      r(ctx, x + 1, y + 6, 16, 16, "#1e5c28");
      r(ctx, x + 3, y + 8, 12, 12, "#2e7a34");
      r(ctx, x + 5, y + 10, 8, 6, "#58a048");
    }
  }

  function roseArch(ctx, x, y) {
    r(ctx, x + 2, y + 8, 3, 24, "#8a6a40");
    r(ctx, x + 27, y + 8, 3, 24, "#8a6a40");
    r(ctx, x + 2, y + 2, 28, 8, "#8a6a40");
    r(ctx, x + 1, y + 2, 3, 3, "#d4a040");
    r(ctx, x + 28, y + 2, 3, 3, "#d4a040");
    const blooms = [C.flowerR, "#c43048", "#f4d0d8", C.gold, C.flowerP];
    for (let i = 0; i < 9; i++) {
      p(ctx, x + 4 + i * 3, y + (i % 2), blooms[i % 5]);
      p(ctx, x + 3 + (i % 2) * 24, y + 10 + i * 2, blooms[(i + 2) % 5]);
    }
  }

  function gardenLantern(ctx, x, y, t) {
    const on = dayCycle(t || 0).night > 0.4;
    r(ctx, x + 5, y + 10, 3, 16, "#16141c");
    r(ctx, x + 4, y + 24, 5, 2, "#d4a040");
    r(ctx, x + 2, y + 2, 9, 10, on ? "#f0d060" : "#4a4030");
    r(ctx, x + 3, y + 3, 7, 8, on ? "#fff4b0" : "#6a5840");
    r(ctx, x + 1, y, 11, 3, "#d4a040");
    p(ctx, x + 6, y - 1, "#f8e8a0");
    if (on) r(ctx, x - 1, y + 10, 15, 6, "rgba(255, 210, 90, 0.28)");
  }

  function marbleUrn(ctx, x, y) {
    r(ctx, x + 3, y + 14, 10, 8, "#e8dcc4");
    r(ctx, x + 2, y + 12, 12, 4, "#f4ead8");
    r(ctx, x + 3, y + 12, 10, 1, "#d4a040");
    r(ctx, x + 4, y + 2, 8, 10, "#2a6418");
    p(ctx, x + 5, y, C.flowerR);
    p(ctx, x + 8, y + 1, C.gold);
    p(ctx, x + 10, y, C.flowerP);
  }

  function villaWindow(ctx, x, y, w, h, sky, night) {
    r(ctx, x, y, w, h, "#d4a040");
    r(ctx, x + 1, y + 1, w - 2, h - 2, night ? "#f0c448" : sky);
    r(ctx, x + ((w / 2) | 0) - 1, y + 1, 2, h - 2, "#c49038");
    r(ctx, x + 1, y + ((h / 2) | 0) - 1, w - 2, 2, "#c49038");
    r(ctx, x + 2, y + 2, 3, 3, night ? "rgba(255,255,220,0.55)" : "rgba(255,255,255,0.35)");
  }

  function houseFacade(ctx, x, y, t) {
    const dc = dayCycle(t || 0);
    const night = dc.night > 0.42;
    const sky = night ? "#f0c448" : dc.day > 0.45 ? "#7ec8e0" : "#d4a078";
    const w = 224;

    r(ctx, x + 6, y + 98, w - 12, 6, "#c8b898");
    r(ctx, x + 18, y + 94, w - 36, 6, "#e8dcc4");
    r(ctx, x + 30, y + 90, w - 60, 5, "#f4ead8");
    r(ctx, x + 30, y + 90, w - 60, 1, "#d4a040");

    r(ctx, x + 10, y + 32, w - 20, 60, "#d8ccb4");
    r(ctx, x + 14, y + 34, w - 28, 56, "#f4ead8");
    r(ctx, x + 16, y + 36, w - 32, 6, "#fff8ec");

    r(ctx, x - 4, y + 44, 20, 48, "#e8dcc4");
    r(ctx, x - 2, y + 46, 16, 44, "#f4ead8");
    r(ctx, x + w - 16, y + 44, 20, 48, "#e8dcc4");
    r(ctx, x + w - 14, y + 46, 16, 44, "#f4ead8");

    r(ctx, x - 12, y + 14, w + 24, 18, "#1e2438");
    r(ctx, x - 6, y + 6, w + 12, 16, "#2c3858");
    r(ctx, x + 18, y - 2, w - 36, 16, "#3a4868");
    r(ctx, x + 40, y - 8, w - 80, 12, "#2a3048");
    r(ctx, x - 12, y + 14, w + 24, 3, "#d4a040");
    r(ctx, x - 6, y + 6, w + 12, 3, "#e8c878");
    r(ctx, x + 18, y - 2, w - 36, 3, "#f0d878");
    r(ctx, x + 40, y - 8, w - 80, 2, "#f8e8a0");
    for (let i = 0; i < 7; i++) {
      r(ctx, x + 24 + i * 26, y + 4, 10, 6, "#d4a040");
      p(ctx, x + 28 + i * 26, y + 6, "#f8e8a0");
    }

    r(ctx, x + w / 2 - 9, y - 6, 18, 10, "#3a4868");
    r(ctx, x + w / 2 - 11, y + 2, 22, 5, "#d4a040");
    r(ctx, x + w / 2 - 3, y - 14, 6, 10, "#c8b090");
    r(ctx, x + w / 2 - 5, y - 16, 10, 4, "#d4a040");
    r(ctx, x + w / 2 - 1, y - 22, 2, 8, "#e8c878");
    p(ctx, x + w / 2 - 2, y - 24, "#f8e8a0");

    r(ctx, x + 30, y - 4, 10, 16, "#c8b8a0");
    r(ctx, x + 28, y - 6, 14, 4, "#d4a040");
    r(ctx, x + w - 40, y - 4, 10, 16, "#c8b8a0");
    r(ctx, x + w - 42, y - 6, 14, 4, "#d4a040");

    r(ctx, x + 6, y + 30, w - 12, 5, "#d4a040");
    r(ctx, x + 8, y + 31, w - 16, 2, "#f0e090");

    for (const cx of [x + 42, x + 60, x + w - 64, x + w - 46]) {
      r(ctx, cx, y + 58, 5, 32, "#efe4cc");
      r(ctx, cx - 1, y + 56, 7, 4, "#fff8ec");
      r(ctx, cx - 1, y + 88, 7, 3, "#d4a040");
    }

    r(ctx, x + 50, y + 54, w - 100, 5, "#e8dcc4");
    r(ctx, x + 50, y + 52, w - 100, 2, "#d4a040");
    for (let i = 0; i < 9; i++) r(ctx, x + 54 + i * 13, y + 48, 2, 6, "#e8c878");

    villaWindow(ctx, x + 50, y + 36, 16, 16, sky, night);
    villaWindow(ctx, x + 76, y + 36, 16, 16, sky, night);
    villaWindow(ctx, x + 132, y + 36, 16, 16, sky, night);
    villaWindow(ctx, x + 158, y + 36, 16, 16, sky, night);
    villaWindow(ctx, x + 102, y + 34, 18, 20, sky, night);
    villaWindow(ctx, x + 0, y + 52, 14, 16, sky, night);
    villaWindow(ctx, x + w - 14, y + 52, 14, 16, sky, night);

    r(ctx, x + w / 2 - 16, y + 62, 32, 30, "#4a2818");
    r(ctx, x + w / 2 - 14, y + 64, 28, 26, "#6a3a22");
    r(ctx, x + w / 2 - 12, y + 66, 12, 22, "#5a301c");
    r(ctx, x + w / 2, y + 66, 12, 22, "#5a301c");
    r(ctx, x + w / 2 - 14, y + 64, 28, 6, "#d4a040");
    p(ctx, x + w / 2 - 4, y + 78, "#f0d878");
    p(ctx, x + w / 2 + 6, y + 78, "#f0d878");
    r(ctx, x + w / 2 - 6, y + 54, 12, 8, "#d4a040");
    p(ctx, x + w / 2 - 1, y + 56, "#fff0b0");

    r(ctx, x + w / 2 - 22, y + 68, 5, 8, night ? "#fff0a8" : "#c4b090");
    r(ctx, x + w / 2 + 17, y + 68, 5, 8, night ? "#fff0a8" : "#c4b090");
    if (night) {
      r(ctx, x + w / 2 - 24, y + 72, 10, 4, "rgba(255,220,100,0.3)");
      r(ctx, x + w / 2 + 14, y + 72, 10, 4, "rgba(255,220,100,0.3)");
    }

    r(ctx, x + 20, y + 82, 10, 10, "#e8dcc4");
    r(ctx, x + 22, y + 76, 6, 8, "#2a6418");
    p(ctx, x + 23, y + 74, C.flowerR);
    p(ctx, x + 26, y + 75, C.gold);
    r(ctx, x + w - 30, y + 82, 10, 10, "#e8dcc4");
    r(ctx, x + w - 28, y + 76, 6, 8, "#2a6418");
    p(ctx, x + w - 27, y + 74, C.flowerP);
    p(ctx, x + w - 24, y + 75, C.flowerR);

    r(ctx, x + 16, y + 70, 3, 16, "#3d8a2a");
    p(ctx, x + 18, y + 68, "#6bb83c");
    r(ctx, x + w - 18, y + 66, 3, 18, "#2a6418");
    p(ctx, x + w - 16, y + 64, "#4f9a2e");

    r(ctx, x + 28, y + 6, 14, 4, "rgba(255,255,255,0.22)");
    r(ctx, x + w - 52, y + 8, 12, 3, "rgba(255,255,255,0.16)");
  }

  function doorTile(ctx, x, y, dir) {
    r(ctx, x, y, 16, 16, C.wood4);
    r(ctx, x + 2, y + 1, 12, 14, C.wood3);
    r(ctx, x + 3, y + 2, 10, 12, C.wood2);
    p(ctx, x + 11, y + 8, C.gold);
    if (dir === "ns") r(ctx, x, y, 16, 2, C.wood5);
  }

  function tv(ctx, x, y, t, item) {
    r(ctx, x, y + 4, 32, 26, "#2a2a32");
    r(ctx, x + 2, y + 6, 28, 18, "#101018");
    const ch = item && item.channel != null ? item.channel : 1;
    if (ch <= 0) {
      r(ctx, x + 3, y + 7, 26, 16, "#18181c");
    } else if (ch === 1) {
      r(ctx, x + 3, y + 7, 26, 16, "#402028");
      r(ctx, x + 8, y + 10, 16, 8, C.gold);
      p(ctx, x + 12, y + 12, C.flowerR);
      p(ctx, x + 18, y + 12, C.dressP);
    } else if (ch === 2) {
      r(ctx, x + 3, y + 7, 26, 16, "#1a2848");
      r(ctx, x + 5, y + 9, 10, 7, "#c8d0d8");
      r(ctx, x + 16, y + 10, 10, 2, C.white);
      r(ctx, x + 16, y + 13, 8, 2, C.white);
    } else if (ch === 3) {
      r(ctx, x + 3, y + 7, 26, 16, "#f0c070");
      r(ctx, x + 8, y + 9, 14, 10, "#e07050");
      r(ctx, x + 10, y + 11, 10, 6, C.gold);
    } else if (ch === 4) {
      r(ctx, x + 3, y + 7, 26, 16, "#3a7cae");
      r(ctx, x + 12, y + 12, 8, 6, "#d8d0c8");
      p(ctx, x + 14, y + 13, "#2a1c14");
      p(ctx, x + 17, y + 13, "#2a1c14");
    } else {
      for (let i = 0; i < 40; i++) {
        p(ctx, x + 3 + (hash(i, (t / 40) | 0) % 26), y + 7 + (hash(i + 9, (t / 30) | 0) % 16), i % 2 ? C.white : "#6a6a74");
      }
    }
    r(ctx, x + 5, y + 9, 8, 5, "rgba(255,255,255,0.12)");
    r(ctx, x + 10, y + 24, 12, 4, C.wood5);
    r(ctx, x + 4, y + 28, 24, 3, C.wood4);
  }

  function marshmallow(ctx, x, y, t) {
    if (!drawPetSprite(ctx, "marsh", x, y, { h: 20, bob: ((t / 480) | 0) % 2 ? -1 : 0 })) {
      const img = ((t / 480) | 0) % 2 ? marshmallowDog2 : marshmallowDog;
      ctx.drawImage(img, x, y);
    }
  }

  function guestbook(ctx, x, y) {
    r(ctx, x, y + 4, 16, 11, "#8a3038");
    r(ctx, x + 1, y + 5, 14, 9, "#f4ead4");
    r(ctx, x + 2, y + 7, 10, 1, "#c4a070");
    r(ctx, x + 2, y + 9, 8, 1, "#c4a070");
    r(ctx, x + 2, y + 11, 6, 1, "#c4a070");
    r(ctx, x + 12, y + 6, 2, 8, "#6a2028");
  }

  function barCounter(ctx, x, y) {
    r(ctx, x, y + 8, 180, 18, "#3a2014");
    r(ctx, x + 2, y + 6, 176, 12, "#6a3a22");
    r(ctx, x + 3, y + 7, 174, 8, "#8a5230");
    r(ctx, x + 4, y + 8, 172, 2, "#c49058");
    r(ctx, x + 8, y + 4, 8, 4, "#e8e0d4");
    r(ctx, x + 22, y + 3, 6, 5, "#d8c8b0");
    r(ctx, x + 40, y + 4, 7, 4, "#c45a48");
    r(ctx, x + 58, y + 3, 6, 5, "#f0e8dc");
    r(ctx, x + 8, y + 24, 4, 4, "#2a140c");
    r(ctx, x + 168, y + 24, 4, 4, "#2a140c");
  }

  function barStool(ctx, x, y) {
    r(ctx, x + 3, y + 2, 10, 4, "#4a2430");
    r(ctx, x + 4, y + 1, 8, 5, "#7a4050");
    r(ctx, x + 6, y + 6, 4, 10, "#3a2018");
    r(ctx, x + 2, y + 14, 12, 3, "#2a140c");
  }

  function bottleShelf(ctx, x, y, t) {
    r(ctx, x, y, 28, 16, "#2a1810");
    r(ctx, x + 1, y + 1, 26, 14, "#3a2418");
    const cols = ["#c44858", "#4a88c8", "#e8c050", "#88c070", "#c070c8", "#f4ead4"];
    for (let i = 0; i < 6; i++) {
      const bx = x + 3 + i * 4;
      r(ctx, bx, y + 4, 3, 9, cols[i]);
      r(ctx, bx, y + 2, 3, 3, "#d8d0c4");
      if (((t / 400) | 0) % 2 === i % 2) p(ctx, bx + 1, y + 6, "#fff8e0");
    }
  }

  function shaker(ctx, x, y, item) {
    const shake = item && item.busy ? Math.round(Math.sin((item.t || 0) / 40) * 2) : 0;
    r(ctx, x + 3 + shake, y + 6, 6, 10, "#c8d0d8");
    r(ctx, x + 4 + shake, y + 7, 4, 8, "#e8eef4");
    r(ctx, x + 2 + shake, y + 2, 8, 5, "#a8b0b8");
    r(ctx, x + 4 + shake, y, 4, 3, "#d0d8e0");
    p(ctx, x + 5 + shake, y + 8, "#ffffff");
  }

  function openSign(ctx, x, y, item) {
    const on = item && item.open;
    r(ctx, x + 2, y, 12, 3, "#4a2818");
    r(ctx, x, y + 3, 16, 14, "#2a1810");
    r(ctx, x + 1, y + 4, 14, 12, on ? "#2a6a38" : "#6a2030");
    r(ctx, x + 3, y + 6, 10, 3, on ? "#8ae070" : "#e07080");
    r(ctx, x + 4, y + 11, 8, 3, on ? "#c8f0b0" : "#f0b0b8");
    p(ctx, x + 7, y + 2, "#e8c878");
  }

  function doorLamp(ctx, x, y, item) {
    const on = item && item.on;
    r(ctx, x + 4, y, 4, 4, "#4a3020");
    r(ctx, x + 2, y + 4, 8, 10, on ? "#f0d060" : "#6a5840");
    r(ctx, x + 3, y + 5, 6, 8, on ? "#fff0a8" : "#8a7860");
    if (on) {
      r(ctx, x, y + 8, 12, 2, "rgba(255, 220, 120, 0.28)");
    }
  }

  function souvenirCabinet(ctx, x, y, item) {
    r(ctx, x, y, 18, 32, "#3a2418");
    r(ctx, x + 1, y + 1, 16, 30, "#c8dce8");
    r(ctx, x + 2, y + 2, 14, 28, "#e8f4f8");
    r(ctx, x + 1, y + 10, 16, 1, "#3a2418");
    r(ctx, x + 1, y + 20, 16, 1, "#3a2418");
    const n = item && item.count ? item.count : 0;
    const bits = ["#e8a0b0", "#e8c878", "#88c070", "#70a0e0", "#c070c8", "#f0e8dc"];
    for (let i = 0; i < Math.min(9, n); i++) {
      const cx = x + 3 + (i % 3) * 4;
      const cy = y + 4 + Math.floor(i / 3) * 9;
      r(ctx, cx, cy, 3, 3, bits[i % bits.length]);
    }
  }

  function coinJar(ctx, x, y, item) {
    const lv = item && item.level ? item.level : 0;
    r(ctx, x + 2, y + 4, 10, 12, "#b8d0d8");
    r(ctx, x + 3, y + 5, 8, 10, "#d8e8ee");
    r(ctx, x + 4, y + 2, 6, 3, "#c8d4d8");
    if (lv > 0) {
      r(ctx, x + 4, y + 14 - Math.min(8, lv * 2), 6, Math.min(8, lv * 2), "#e8c050");
      p(ctx, x + 5, y + 12, "#fff0a0");
    }
  }

  function chalkboard(ctx, x, y) {
    r(ctx, x, y, 22, 18, "#3a2a18");
    r(ctx, x + 1, y + 1, 20, 16, "#243018");
    r(ctx, x + 3, y + 4, 10, 1, "#e8d080");
    r(ctx, x + 3, y + 7, 14, 1, "#e07090");
    r(ctx, x + 3, y + 10, 8, 1, "#88c0e0");
    r(ctx, x + 3, y + 13, 12, 1, "#98d080");
  }

  function washTub(ctx, x, y, item) {
    r(ctx, x, y + 6, 16, 12, "#6a6a74");
    r(ctx, x + 1, y + 7, 14, 10, "#c8d0d8");
    r(ctx, x + 3, y + 9, 10, 6, item && item.water ? "#8ec0d8" : "#d0dce4");
    r(ctx, x + 6, y + 4, 3, 4, "#8a9098");
    if (item && item.cups) {
      r(ctx, x + 4, y + 8, 4, 3, "#e8e0d4");
      r(ctx, x + 9, y + 8, 4, 3, "#d0e0e8");
    }
  }

  function drinkCup(ctx, x, y, drink) {
    const cup = (drink && drink.cup) || "tall";
    const col = (drink && drink.color) || "#e8a0b0";
    if (cup === "mug") {
      r(ctx, x + 1, y + 3, 7, 7, "#f0ece4");
      r(ctx, x + 2, y + 4, 5, 5, col);
      r(ctx, x + 8, y + 5, 2, 3, "#f0ece4");
    } else if (cup === "cocktail") {
      r(ctx, x + 4, y + 1, 2, 6, "#e8e0d4");
      r(ctx, x + 2, y, 6, 4, col);
      r(ctx, x + 3, y + 7, 4, 2, "#d8d0c4");
    } else {
      r(ctx, x + 2, y, 5, 10, "#e8e0d4");
      r(ctx, x + 3, y + 2, 3, 7, col);
    }
  }

  function snackPlate(ctx, x, y, id) {
    r(ctx, x, y + 6, 10, 4, "#f0ece4");
    if (id === "fries") {
      r(ctx, x + 2, y + 1, 2, 6, "#e8c050");
      r(ctx, x + 5, y, 2, 7, "#f0d070");
      r(ctx, x + 7, y + 2, 2, 5, "#d4a040");
    } else if (id === "chips") {
      r(ctx, x + 2, y + 2, 6, 5, "#f4d018");
      r(ctx, x + 3, y + 3, 4, 2, "#f04080");
    } else if (id === "cake") {
      r(ctx, x + 2, y + 2, 6, 5, "#f0b0c0");
      r(ctx, x + 3, y + 3, 4, 2, "#fff4f8");
    } else {
      r(ctx, x + 2, y + 3, 3, 3, "#e0b070");
      r(ctx, x + 5, y + 2, 3, 3, "#c49050");
    }
  }

  function drawGuest(ctx, g, time) {
    const x = g.x | 0;
    const y = g.y | 0;
    const sit = g.pose === "sit";
    const bob = g.moving ? Math.round(Math.sin(time / 110) * 1) : 0;
    const hair = g.hair || "#2a1810";
    const shirt = g.shirt || "#c44858";
    const skin = g.skin || C.skin;
    drawShadow(ctx, x, y + (sit ? 16 : 20), sit ? 14 : 12);
    r(ctx, x + 4, y + bob, 8, 4, hair);
    r(ctx, x + 5, y + 3 + bob, 6, 5, skin);
    p(ctx, x + 6, y + 5 + bob, C.eye);
    p(ctx, x + 9, y + 5 + bob, C.eye);
    if (g.trait === "impatient" && g.sweat) {
      p(ctx, x + 3, y + 4 + bob, "#b8dce8");
      p(ctx, x + 12, y + 6 + bob, "#b8dce8");
    }
    r(ctx, x + 4, y + 8 + bob, 8, sit ? 6 : 8, shirt);
    if (sit) {
      r(ctx, x + 4, y + 14, 3, 3, "#1a1418");
      r(ctx, x + 9, y + 14, 3, 3, "#1a1418");
    } else {
      r(ctx, x + 5, y + 16 + bob, 2, 4, "#1a1418");
      r(ctx, x + 9, y + 16 + bob, 2, 4, "#1a1418");
    }
  }

  function orderBubble(ctx, x, y, icon, mood) {
    r(ctx, x - 10, y - 16, 22, 12, "#fff8ec");
    r(ctx, x - 9, y - 15, 20, 10, "#fffdf6");
    ctx.fillStyle = "#4a2e22";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(icon || "?", x + 1, y - 7);
    if (mood) {
      ctx.font = "7px sans-serif";
      ctx.fillText(mood, x + 14, y - 18);
    }
    ctx.textAlign = "left";
    p(ctx, x, y - 4, "#fff8ec");
    p(ctx, x + 1, y - 3, "#fff8ec");
  }

  function staircase(ctx, x, y) {
    r(ctx, x + 2, y + 46, 126, 28, "#7a4a32");
    for (let i = 0; i < 8; i++) {
      const sx = x + 6 + i * 15;
      const sy = y + 43 - i * 5;
      r(ctx, sx, sy, 18, 8, i % 2 ? "#d8b080" : "#e8c89c");
      r(ctx, sx, sy + 6, 18, 2, "#9a6848");
    }
    r(ctx, x + 3, y + 14, 4, 58, "#5a3428");
    r(ctx, x + 124, y + 8, 4, 64, "#5a3428");
    for (let i = 0; i < 7; i++) r(ctx, x + 8 + i * 18, y + 16 - i, 16, 3, "#b88458");
    r(ctx, x, y + 70, 132, 5, "#4a2c22");
  }

  const drawers = {
    fireplace, sofa, table, bookshelf, plant, bed, vanity, wardrobe, desk, chair,
    arcade, screen, cinemaChair, tub, sink, toilet, catTree, dogBed, bowls,
    petNest, cardboardBox, petTunnel, toyBasket, toyBall,
    windowPane, painting, clock, rugOval, tree, flowerPatch, vegBox, bench,
    fountain, houseFacade, doorTile, lamp, nightstand, shoes, cushion, tv, guestbook,
    poster, plush, ipad, fridge, stove, counter, kitchenSink, diningTable, wallCabinet,
    fridgeNote, chipStack, snackBowl, mug, trashCan, sideCabinet, marshmallow,
    bathMirror, toothCups, towel, laundryBasket, bathCabinet, toiletPaper, scale, spray,
    doorLock, rubberDuck, popcornMachine, snackCabinet, remote, dvdShelf, lazyChair,
    doorSign, wallKey, slippers, snackBasket, miniFridge, wateringCan, swing, hammock,
    picnicBasket, toolBox, dandelion, dualArcade, clawMachine, hoopMachine, punchMachine,
    sandbag, gacha, snackRack, dancePad, beanSofa,
    cypress, statue, topiary, roseArch, gardenLantern, marbleUrn, planter,
    barCounter, barStool, bottleShelf, shaker, openSign, doorLamp, souvenirCabinet,
    coinJar, chalkboard, washTub, staircase,
  };

  function drawItem(ctx, item, time) {
    const fn = drawers[item.kind];
    if (!fn) return;
    const shakeX = item.shake ? Math.round(Math.sin(item.shake / 30) * 2) : 0;
    switch (item.kind) {
      case "fireplace":
        fn(ctx, item.x, item.y, time, item.fire);
        break;
      case "arcade":
      case "stove":
      case "dualArcade":
      case "clawMachine":
        fn(ctx, item.x, item.y, time);
        break;
      case "fountain":
        fn(ctx, item.x, item.y, time, item);
        break;
      case "houseFacade":
      case "gardenLantern":
        fn(ctx, item.x, item.y, time);
        break;
      case "screen":
      case "tub":
      case "popcornMachine":
        fn(ctx, item.x, item.y, item, time);
        break;
      case "toilet":
      case "sink":
      case "towel":
      case "toiletPaper":
      case "bathCabinet":
      case "scale":
      case "doorLock":
      case "doorSign":
      case "miniFridge":
      case "toolBox":
      case "dandelion":
      case "punchMachine":
      case "swing":
      case "hammock":
      case "shaker":
      case "openSign":
      case "doorLamp":
      case "souvenirCabinet":
      case "coinJar":
      case "washTub":
        fn(ctx, item.x, item.y, item);
        break;
      case "bottleShelf":
        fn(ctx, item.x, item.y, time);
        break;
      case "tv":
        fn(ctx, item.x, item.y, time, item);
        break;
      case "marshmallow":
        fn(ctx, item.x, item.y, time);
        break;
      case "rugOval":
        fn(ctx, item.x, item.y, item.w, item.h, item.color, item.edge);
        break;
      case "windowPane":
        fn(ctx, item.x, item.y, item.theme, item.curtain ? (item.drape || true) : false);
        break;
      case "lamp":
        fn(ctx, item.x, item.y, item.theme, item.on !== false);
        break;
      case "plant":
        fn(ctx, item.x + shakeX, item.y, item.theme);
        break;
      case "flowerPatch":
        fn(ctx, item.x + shakeX, item.y, item.theme);
        break;
      case "bed":
        fn(ctx, item.x, item.y, item.theme, item);
        break;
      case "snackBowl":
        fn(ctx, item.x, item.y, !!item.empty);
        break;
      case "mug":
        fn(ctx, item.x, item.y, !!item.empty);
        break;
      case "sideCabinet":
        fn(ctx, item.x, item.y, !!item.open);
        break;
      case "cushion":
        if (item.hidden) return;
        fn(ctx, item.x, item.y, item.theme);
        break;
      case "sofa":
      case "wardrobe":
      case "chair":
      case "painting":
      case "vegBox":
      case "planter":
      case "doorTile":
      case "shoes":
      case "vanity":
      case "poster":
      case "plush":
      case "topiary":
      case "petNest":
        fn(ctx, item.x, item.y, item.theme);
        break;
      default:
        fn(ctx, item.x, item.y);
    }
  }

  initTiles();
  buildChars();
  buildHusbands();
  rebuildPlayer("black", "blackDress");

  return {
    TILE, C, tiles, chars, catSit, catSit2, dogSleep,
    stamp, compile, flipH, hash, rnd, r, p, makeCanvas,
    tileFor, wallTile, drawShadow, frameFor, actorFrame, drawItem, drawers,
    HAIRS, OUTFITS, rebuildPlayer, petArt, petFrame, stampPreview, stampPortrait,
    drawPortrait, drawPetSprite, portraitReady, portraits,
    cake, steak, choir, chipBag, chipStack, fridgeNote, beefRoll, foieGras, seafoodDon, paintSprite,
    duck, marshmallowDog, marshmallowDog2, toyBall,
    drinkCup, snackPlate, drawGuest, orderBubble,
    dayCycle, gardenAmbient, DAY_MS,
  };
})();
