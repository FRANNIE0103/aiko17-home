/* House maps, doors, furniture. */
const World = (() => {
  const T = Art.TILE;

  const FLOOR = {
    living: "wood",
    upperHall: "darkWood",
    herBed: "darkWood",
    myBed: "cream",
    bath: "bath",
    guest: "wood",
    movie: "navy",
    game: "sage",
    kitchen: "check",
    pet: "wood",
    garden: "grass",
    bar: "darkWood",
  };

  const WALL = {
    living: "Cream",
    upperHall: "Ink",
    herBed: "Ink",
    myBed: "Cream",
    bath: "Sage",
    guest: "Peach",
    movie: "Night",
    game: "Sage",
    kitchen: "Peach",
    pet: "Peach",
    garden: "Cream",
    bar: "Night",
  };

  const NAMES = {
    garden: "花园",
    living: "客厅",
    upperHall: "二楼走廊",
    herBed: "Aiko的卧室",
    myBed: "17的卧室",
    bath: "厕所",
    guest: "客房",
    movie: "电影房",
    game: "游戏房",
    kitchen: "餐厅",
    pet: "宠物房",
    bar: "酒吧",
  };

  const INNER = "...................."; // 20

  function planAscii(doors) {
    const north = doors.N ? "##########DD##########" : "######################";
    const south = doors.S ? "##########DD##########" : "######################";
    const lines = [north];
    for (let i = 0; i < 10; i++) {
      const w = i === 4 && doors.W ? "D" : "#";
      const e = i === 4 && doors.E ? "D" : "#";
      lines.push(w + INNER + e);
    }
    lines.push(south);
    return lines.join("\n");
  }

  function parse(id, ascii, links) {
    const lines = ascii.trim().split("\n").map((l) => l.trim());
    const rows = lines.length;
    const cols = lines[0].length;
    const tiles = [];
    const doors = [];
    for (let y = 0; y < rows; y++) {
      tiles[y] = [];
      if (lines[y].length !== cols) {
        throw new Error(`${id} row ${y} len ${lines[y].length} != ${cols} (${lines[y]})`);
      }
      for (let x = 0; x < cols; x++) {
        const ch = lines[y][x];
        let type = "floor";
        let walk = true;
        if (ch === "#") {
          type = "wall";
          walk = false;
        } else if (ch === "F") {
          type = "fence";
          walk = false;
        } else if (ch === "B") {
          type = "hedge";
          walk = false;
        } else if (ch === "H") {
          type = "house";
          walk = false;
        } else if (ch === ",") {
          type = "grass";
        } else if (ch === "=") {
          type = "path";
        } else if (ch === "s") {
          type = "stone";
        } else if (ch === "w") {
          type = "water";
          walk = false;
        } else if (ch === "~") {
          type = "rug";
        } else if (ch === "D") {
          type = "door";
          walk = true;
          let edge = "south";
          if (y === 0) edge = "north";
          else if (y === rows - 1) edge = "south";
          else if (x === 0) edge = "west";
          else if (x === cols - 1) edge = "east";
          doors.push({ x: x * T, y: y * T, w: T, h: T, edge, tx: x, ty: y });
        }
        tiles[y][x] = { type, walk, ch };
      }
    }

    const byEdge = {};
    for (const d of doors) {
      (byEdge[d.edge] || (byEdge[d.edge] = [])).push(d);
    }
    const connections = [];
    for (const [edge, dest] of Object.entries(links)) {
      const group = byEdge[edge];
      if (!group) continue;
      const minX = Math.min(...group.map((d) => d.x));
      const minY = Math.min(...group.map((d) => d.y));
      const maxX = Math.max(...group.map((d) => d.x + d.w));
      const maxY = Math.max(...group.map((d) => d.y + d.h));
      connections.push({
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
        edge,
        to: dest.room,
        spawn: dest.spawn,
      });
    }

    return {
      id,
      name: NAMES[id],
      cols,
      rows,
      pxW: cols * T,
      pxH: rows * T,
      tiles,
      connections,
      floor: FLOOR[id],
      wall: WALL[id],
      items: [],
      solids: [],
      ambient: destAmbient(id),
      pets: [],
      npc: null,
    };
  }

  function destAmbient(id) {
    if (id === "garden") return Art.gardenAmbient(0);
    if (id === "movie") return { top: [20, 16, 40, 0.38], bottom: [40, 10, 20, 0.42], mul: [0.78, 0.75, 0.95] };
    if (id === "bath") return { top: [180, 220, 220, 0.08], bottom: [200, 220, 220, 0.06], mul: [0.95, 1, 1] };
    if (id === "herBed") return { top: [8, 8, 18, 0.32], bottom: [6, 8, 22, 0.38], mul: [0.78, 0.78, 0.95] };
    if (id === "myBed") return { top: [255, 228, 186, 0.08], bottom: [210, 170, 110, 0.12], mul: [1, 0.96, 0.88] };
    if (id === "kitchen") return { top: [255, 210, 150, 0.08], bottom: [180, 90, 40, 0.14], mul: [1, 0.95, 0.88] };
    if (id === "pet") return { top: [255, 214, 176, 0.1], bottom: [196, 112, 72, 0.14], mul: [1, 0.96, 0.9] };
    if (id === "game") return { top: [40, 80, 60, 0.08], bottom: [20, 40, 30, 0.16], mul: [0.9, 1, 0.9] };
    if (id === "bar") return { top: [60, 20, 28, 0.16], bottom: [90, 36, 18, 0.28], mul: [1, 0.9, 0.82] };
    return { top: [255, 200, 120, 0.07], bottom: [80, 40, 20, 0.18], mul: [1, 0.94, 0.82] };
  }

  function makeRoom(id, doors, links) {
    return parse(id, planAscii(doors), links);
  }

  function item(room, kind, x, y, extra = {}) {
    const it = { kind, x: x * T, y: y * T, ...extra };
    room.items.push(it);
    if (extra.solid) {
      const s = extra.solid;
      room.solids.push({
        x: it.x + (s.x || 0),
        y: it.y + (s.y || 0),
        w: s.w,
        h: s.h,
      });
    }
    return it;
  }

  const S = {
    fromN: { x: 10.5 * T, y: 2 * T },
    fromS: { x: 10.5 * T, y: 9 * T },
    fromW: { x: 2 * T, y: 4.6 * T },
    fromE: { x: 18.5 * T, y: 4.6 * T },
  };

  const garden = parse(
    "garden",
    `
FFFFFFFFFFFFFFFFFFFFFFFFFFFF
F,,,,,HHHHHHHHHHHHHH,,,,,,,F
F,,,,,HHHHHHHHHHHHHH,,,,,,,F
F,,,,,HHHHHHHHHHHHHH,,,,,,,F
F,,,,,HHHHHHHHHHHHHH,,,,,,,F
F,,,,,HHHHDDHHHHHHHH,,,,,,,F
F,,,,,,,,,,==,,,,,,,,,,,,,,F
F,,,,B,,,,====,,,,B,,,,,,,,F
F,,,,BB,,==ss==,,BB,,,,,,,,F
F,,,,BB,,ssssss,,BB,,,,,,,,F
F,,,,BB,,sswwss,,BB,,,,,,,,F
F,,,,BB,,sswwss,,BB,,,,,,,,F
F,,,,BB,,ssssss,,BB,,,,,,,,F
F,,,,BB,,==ss==,,BB,,,,,,,,F
F,,,,B,,,,====,,,,B,,,,,,,,F
F,,,,,,,,,,==,,,,,,,,,,,,,,F
F,,,,,,,,,,,,,,,,,,,,,,,,,,F
F,,,,,,,,,,,,,,,,,,,,,,,,,,F
F,,,,,,,,,,,,,,,,,,,,,,,,,,F
FFFFFFFFFFFFFFFFFFFFFFFFFFFF
`,
    {
      south: { room: "living", spawn: S.fromN },
    }
  );

  const living = makeRoom(
    "living",
    { N: true, S: true, E: true, W: true },
    {
      north: { room: "garden", spawn: { x: 10.5 * T, y: 6.2 * T } },
      west: { room: "guest", spawn: S.fromE },
      east: { room: "movie", spawn: S.fromW },
      south: { room: "kitchen", spawn: S.fromN },
    }
  );

  const herBed = makeRoom(
    "herBed",
    { S: true, E: true },
    {
      east: { room: "upperHall", spawn: S.fromW },
      south: { room: "bath", spawn: S.fromN },
    }
  );

  const bath = makeRoom(
    "bath",
    { N: true },
    { north: { room: "herBed", spawn: S.fromS } }
  );

  const movie = makeRoom(
    "movie",
    { S: true, W: true },
    {
      west: { room: "living", spawn: S.fromE },
      south: { room: "game", spawn: S.fromN },
    }
  );

  const game = makeRoom(
    "game",
    { N: true },
    {
      north: { room: "movie", spawn: S.fromS },
    }
  );

  const kitchen = makeRoom(
    "kitchen",
    { N: true },
    {
      north: { room: "living", spawn: S.fromS },
    }
  );

  const pet = makeRoom(
    "pet",
    { S: true },
    {
      south: { room: "upperHall", spawn: S.fromN },
    }
  );

  const guest = makeRoom(
    "guest",
    { S: true, E: true, W: true },
    {
      east: { room: "living", spawn: S.fromW },
      west: { room: "bar", spawn: S.fromE },
      south: { room: "upperHall", spawn: S.fromN },
    }
  );

  const upperHall = makeRoom(
    "upperHall",
    { N: true, S: true, E: true, W: true },
    {
      north: { room: "pet", spawn: S.fromS },
      west: { room: "herBed", spawn: S.fromE },
      east: { room: "myBed", spawn: S.fromW },
      south: { room: "guest", spawn: S.fromN },
    }
  );

  const bar = makeRoom(
    "bar",
    { E: true },
    {
      east: { room: "guest", spawn: S.fromW },
    }
  );

  const myBed = makeRoom(
    "myBed",
    { W: true },
    {
      west: { room: "upperHall", spawn: S.fromE },
    }
  );

  /* living */
  item(living, "fireplace", 1.2, 1.15, {
    solid: { x: 0, y: 14, w: 28, h: 16 },
    sortY: 38,
    interact: "fire",
    hit: { w: 28, h: 32 },
    fire: { boost: 0, roast: 0 },
  });

  /* upstairs landing */
  item(upperHall, "rugOval", 5.7, 5.0, { w: 166, h: 26, color: "#704858", edge: "#3e2838", sortY: 0, floor: true });
  item(upperHall, "painting", 9.8, 0.7, { sortY: 6, theme: "us", interact: "photo", hit: { w: 18, h: 16 } });
  item(upperHall, "lamp", 4.0, 6.8, { theme: "#d7b56d", sortY: 24, on: true });
  item(upperHall, "lamp", 17.0, 6.8, { theme: "#d7b56d", sortY: 24, on: true });

  item(living, "windowPane", 5.6, 0.35, { sortY: 6, theme: "#9ad4f0", interact: "curtain", hit: { w: 22, h: 20 } });
  item(living, "windowPane", 14.4, 0.35, { sortY: 6, theme: "#9ad4f0", interact: "curtain", hit: { w: 22, h: 20 } });
  item(living, "painting", 10.3, 0.45, { sortY: 6, theme: "us", interact: "photo", hit: { w: 16, h: 14 } });
  item(living, "clock", 12.5, 0.55, { sortY: 6 });
  item(living, "bookshelf", 18.5, 1.05, {
    solid: { x: 0, y: 22, w: 20, h: 16 },
    sortY: 42,
    interact: "shelf",
    hit: { w: 20, h: 40 },
  });
  item(living, "rugOval", 6.2, 5.6, {
    w: 58,
    h: 30,
    color: "#c45a48",
    edge: "#8a3028",
    sortY: 0,
    floor: true,
    interact: "rug",
    hit: { w: 58, h: 30 },
  });
  item(living, "sofa", 6.4, 4.8, {
    theme: "sage",
    solid: { x: 0, y: 12, w: 48, h: 12 },
    sortY: 30,
    interact: "sofa",
    hit: { w: 48, h: 24 },
  });
  item(living, "cushion", 7.15, 5.05, { theme: "#e8a0b0", sortY: 32, interact: "pillow", hit: { w: 12, h: 10 } });
  item(living, "table", 7.5, 6.8, { solid: { x: 2, y: 8, w: 24, h: 10 }, sortY: 26 });
  item(living, "snackBowl", 7.55, 6.42, { sortY: 28, interact: "snack", hit: { w: 10, h: 10 } });
  item(living, "mug", 9.2, 6.45, { sortY: 28, interact: "mug", hit: { w: 10, h: 10 } });
  item(living, "plant", 3.1, 7.6, { solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22, interact: "plant", hit: { w: 14, h: 20 } });
  item(living, "plant", 17.6, 7.8, {
    solid: { x: 3, y: 12, w: 8, h: 6 },
    sortY: 22,
    theme: "#6a8a48",
    interact: "plant",
    hit: { w: 14, h: 20 },
  });
  item(living, "lamp", 5.4, 6.0, { theme: "#e8d080", sortY: 24, interact: "lamp", hit: { w: 14, h: 20 }, on: true });
  item(living, "tv", 15.2, 1.12, {
    solid: { x: 2, y: 18, w: 28, h: 12 },
    sortY: 40,
    interact: "tv",
    channel: 0,
  });
  item(living, "guestbook", 8.35, 6.55, { sortY: 29, interact: "book" });
  item(living, "trashCan", 1.35, 7.55, { solid: { x: 2, y: 10, w: 12, h: 8 }, sortY: 20, interact: "trash", hit: { w: 16, h: 18 } });
  item(living, "sideCabinet", 16.55, 6.35, {
    solid: { x: 0, y: 12, w: 18, h: 10 },
    sortY: 26,
    interact: "cabinet",
    hit: { w: 18, h: 22 },
  });

  /* her bedroom — black, posters + plushes + iPad */
  item(herBed, "windowPane", 4.2, 0.3, { sortY: 6, theme: "#101828" });
  item(herBed, "poster", 7.6, 0.12, { sortY: 8, theme: "bts" });
  item(herBed, "poster", 13.4, 0.08, { sortY: 8, theme: "gojo" });
  item(herBed, "bed", 1.6, 2.15, {
    theme: {
      blanket: "#152a58",
      blanketD: "#0e1c40",
      sheet: "#d8dce8",
      head: "#121018",
      headH: "#2a2430",
      frame: "#121018",
      catPattern: true,
    },
    solid: { x: 0, y: 14, w: 32, h: 18 },
    sortY: 38,
  });
  item(herBed, "plush", 1.7, 3.35, { theme: "shooky", sortY: 44 });
  item(herBed, "plush", 2.85, 3.15, { theme: "cooky", sortY: 45 });
  item(herBed, "plush", 1.85, 3.95, { theme: "goose", sortY: 43 });
  item(herBed, "plush", 3.35, 3.55, { theme: "linabell", sortY: 46 });
  item(herBed, "vanity", 12.3, 2.35, { theme: "dark", solid: { x: 0, y: 16, w: 24, h: 12 }, sortY: 32 });
  item(herBed, "ipad", 13.15, 3.42, { sortY: 34, interact: "ipad" });
  item(herBed, "wardrobe", 17.35, 1.35, { theme: "#1a1824", solid: { x: 0, y: 24, w: 22, h: 14 }, sortY: 42 });
  item(herBed, "plant", 1.1, 7.4, { theme: "#3a4850", solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22 });
  item(herBed, "rugOval", 6, 5.6, { w: 64, h: 32, color: "#1a1a28", edge: "#0c0c14", sortY: 0, floor: true });
  item(herBed, "nightstand", 3.95, 2.55, { solid: { x: 0, y: 8, w: 14, h: 10 }, sortY: 22 });
  item(herBed, "lamp", 4.1, 1.65, { theme: "#4a6088", sortY: 26 });
  item(herBed, "shoes", 2.2, 8.4, { theme: "#1a1824", sortY: 8 });

  /* my bedroom — hotel */
  item(myBed, "windowPane", 4.4, 0.3, { sortY: 6, theme: "#c8e4f0" });
  item(myBed, "poster", 13.6, 0.1, { sortY: 8, theme: "mask" });
  item(myBed, "bed", 12.5, 2.15, {
    theme: {
      blanket: "#f4ead8",
      blanketD: "#e0d0b0",
      sheet: "#fff8f0",
      head: "#c4a060",
      headH: "#e8c878",
      frame: "#d4b06a",
      motif: "#fff8f0",
    },
    solid: { x: 0, y: 14, w: 32, h: 18 },
    sortY: 38,
  });
  item(myBed, "plush", 13.55, 3.45, { theme: "bear", sortY: 44 });
  item(myBed, "vanity", 1.4, 2.4, { theme: "hotel", solid: { x: 0, y: 16, w: 24, h: 12 }, sortY: 32 });
  item(myBed, "wardrobe", 17.45, 1.35, { theme: "#efe4cc", solid: { x: 0, y: 24, w: 22, h: 14 }, sortY: 42 });
  item(myBed, "plant", 16.2, 7.4, { theme: "#88a070", solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22 });
  item(myBed, "rugOval", 6.4, 6.1, { w: 56, h: 26, color: "#efe4cc", edge: "#d4b06a", sortY: 0, floor: true });
  item(myBed, "nightstand", 11.25, 2.4, { solid: { x: 0, y: 8, w: 14, h: 10 }, sortY: 22 });
  item(myBed, "lamp", 11.4, 1.5, { theme: "#e8c878", sortY: 26 });
  item(myBed, "shoes", 14.8, 8.2, { theme: "#c4a060", sortY: 8 });
  item(pet, "marshmallow", 9.4, 7.15, { sortY: 18, interact: "marsh", hit: { w: 16, h: 14 } });

  item(bath, "windowPane", 9, 0.3, { sortY: 6, theme: "#c8e8e0" });
  item(bath, "doorLock", 12.45, 0.85, { sortY: 10, interact: "bathLock", hit: { w: 12, h: 16 }, locked: false });
  item(bath, "spray", 7.55, 0.95, { sortY: 10, interact: "spray", hit: { w: 12, h: 16 } });
  item(bath, "towel", 14.35, 0.95, { sortY: 12, interact: "towel", hit: { w: 10, h: 18 } });
  item(bath, "bathMirror", 10.55, 1.12, { sortY: 12, interact: "mirror", hit: { w: 16, h: 18 } });
  item(bath, "tub", 1.3, 3.0, { solid: { x: 0, y: 12, w: 36, h: 14 }, sortY: 30, interact: "tub", hit: { w: 36, h: 24 } });
  item(bath, "rubberDuck", 2.55, 3.55, { sortY: 34, interact: "duck", hit: { w: 10, h: 10 } });
  item(bath, "sink", 10.4, 2.6, { solid: { x: 0, y: 12, w: 20, h: 12 }, sortY: 26, interact: "sink", hit: { w: 20, h: 22 } });
  item(bath, "toothCups", 10.55, 2.28, { sortY: 32, interact: "brushes", hit: { w: 16, h: 12 } });
  item(bath, "toilet", 16.6, 3.2, { solid: { x: 0, y: 8, w: 16, h: 12 }, sortY: 24, interact: "toilet", hit: { w: 16, h: 20 }, lidOpen: false });
  item(bath, "lidSpot", 16.72, 3.05, { sortY: 36, interact: "lid", hit: { w: 10, h: 10 } });
  item(bath, "toiletPaper", 15.45, 3.45, { sortY: 22, interact: "paper", hit: { w: 12, h: 14 }, paperLen: 0 });
  item(bath, "laundryBasket", 3.85, 7.45, { sortY: 16, interact: "laundry", hit: { w: 14, h: 16 } });
  item(bath, "scale", 13.05, 7.45, { sortY: 12, interact: "scale", hit: { w: 16, h: 14 }, floor: true });
  item(bath, "bathCabinet", 17.55, 6.35, { solid: { x: 0, y: 12, w: 18, h: 10 }, sortY: 26, interact: "bathCab", hit: { w: 18, h: 22 } });
  item(bath, "rugOval", 8, 7.2, { w: 40, h: 16, color: "#a8d8d0", edge: "#70b0a8", sortY: 0, floor: true });

  item(guest, "windowPane", 8, 0.3, { sortY: 6, theme: "#d8ecc8" });
  item(guest, "doorSign", 12.4, 0.85, { sortY: 10, interact: "plaque", hit: { w: 16, h: 14 } });
  item(guest, "wallKey", 7.15, 0.9, { sortY: 10, interact: "guestKey", hit: { w: 12, h: 14 } });
  item(guest, "bathMirror", 10.35, 1.12, { sortY: 12, interact: "guestMirror", hit: { w: 16, h: 18 } });
  item(guest, "bed", 1.55, 2.15, {
    theme: { blanket: "#d8c8a8", blanketD: "#b8a080", sheet: "#f4eee0", head: "#c4a880", headH: "#e0d0b0", motif: "#f0e8d0" },
    solid: { x: 0, y: 14, w: 32, h: 18 },
    sortY: 38,
    interact: "guestBed",
    hit: { w: 32, h: 32 },
  });
  item(guest, "cushion", 2.05, 2.55, { theme: "#f4ead4", sortY: 42, interact: "guestPillow", hit: { w: 12, h: 10 } });
  item(guest, "nightstand", 3.95, 2.45, { solid: { x: 0, y: 8, w: 14, h: 10 }, sortY: 22, interact: "drawer", hit: { w: 14, h: 18 } });
  item(guest, "lamp", 4.1, 1.55, { theme: "#e8d8b0", sortY: 26, interact: "guestLamp", hit: { w: 14, h: 18 }, on: true });
  item(guest, "mug", 4.25, 2.15, { sortY: 28, interact: "guestMug", hit: { w: 10, h: 10 } });
  item(guest, "wardrobe", 17.15, 1.35, { theme: "#e0d0b0", solid: { x: 0, y: 24, w: 22, h: 14 }, sortY: 42, interact: "guestWard", hit: { w: 22, h: 40 } });
  item(guest, "plant", 15.35, 2.55, { solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22 });
  item(guest, "table", 12.15, 6.25, { solid: { x: 2, y: 8, w: 24, h: 10 }, sortY: 24, interact: "guestDesk", hit: { w: 28, h: 20 } });
  item(guest, "guestbook", 12.55, 6.05, { sortY: 32, interact: "guestBook", hit: { w: 16, h: 12 }, page: 0 });
  item(guest, "slippers", 2.15, 7.85, { sortY: 10, floor: true, interact: "slippers", hit: { w: 16, h: 10 } });
  item(guest, "snackBasket", 16.75, 6.45, { sortY: 20, interact: "guestSnack", hit: { w: 16, h: 16 } });
  item(guest, "miniFridge", 18.55, 6.15, { solid: { x: 0, y: 12, w: 14, h: 10 }, sortY: 26, interact: "guestFridge", hit: { w: 14, h: 22 } });
  item(guest, "rugOval", 6.4, 5.8, { w: 52, h: 24, color: "#e8dcc0", edge: "#c8b890", sortY: 0, floor: true });

  item(movie, "windowPane", 1.05, 0.28, { sortY: 6, theme: "#101828", interact: "shade", hit: { w: 22, h: 20 }, drape: "navy" });
  item(movie, "windowPane", 16.55, 0.28, { sortY: 6, theme: "#101828", interact: "shade", hit: { w: 22, h: 20 }, drape: "navy" });
  item(movie, "screen", 4.2, 0.9, {
    sortY: 18,
    solid: { x: 4, y: 20, w: 48, h: 8 },
    interact: "projector",
    hit: { w: 56, h: 28 },
    on: false,
    channel: 0,
  });
  item(movie, "dvdShelf", 1.15, 1.55, { solid: { x: 0, y: 16, w: 14, h: 12 }, sortY: 32, interact: "dvd", hit: { w: 14, h: 28 } });
  item(movie, "snackCabinet", 17.35, 1.55, { solid: { x: 0, y: 14, w: 18, h: 10 }, sortY: 30, interact: "snackBar", hit: { w: 18, h: 24 } });
  item(movie, "lamp", 15.15, 2.55, { theme: "#c8b070", sortY: 24, interact: "movieLight", hit: { w: 14, h: 20 }, on: true, mode: "on" });
  item(movie, "lazyChair", 1.45, 5.85, { solid: { x: 2, y: 12, w: 18, h: 10 }, sortY: 28, interact: "lazy", hit: { w: 22, h: 24 } });
  item(movie, "cushion", 2.15, 6.35, { theme: "#c07090", sortY: 32, interact: "pillow", hit: { w: 12, h: 10 } });
  item(movie, "sofa", 6.15, 6.45, {
    theme: "navy",
    solid: { x: 0, y: 12, w: 48, h: 12 },
    sortY: 30,
    interact: "seat",
    hit: { w: 48, h: 24 },
  });
  item(movie, "table", 8.15, 5.15, { solid: { x: 2, y: 8, w: 24, h: 10 }, sortY: 26 });
  item(movie, "mug", 8.25, 4.85, { sortY: 28, interact: "herCup", hit: { w: 10, h: 10 }, sips: 0 });
  item(movie, "mug", 9.55, 4.85, { sortY: 28, interact: "myCup", hit: { w: 10, h: 10 }, theme: "#e8c878" });
  item(movie, "remote", 10.35, 4.95, { sortY: 29, interact: "remote", hit: { w: 10, h: 14 } });
  item(movie, "popcornMachine", 17.45, 5.35, {
    solid: { x: 0, y: 12, w: 16, h: 14 },
    sortY: 32,
    interact: "popcorn",
    hit: { w: 16, h: 26 },
    mess: [],
  });
  item(movie, "plant", 18.15, 7.45, { theme: "#304050", solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22 });

  item(game, "arcade", 1.15, 1.2, { solid: { x: 0, y: 22, w: 18, h: 16 }, sortY: 42, interact: "coin", hit: { w: 18, h: 40 } });
  item(game, "dualArcade", 3.45, 1.2, { solid: { x: 0, y: 22, w: 28, h: 16 }, sortY: 42, interact: "duo", hit: { w: 28, h: 40 } });
  item(game, "gacha", 15.05, 1.45, { solid: { x: 2, y: 18, w: 12, h: 10 }, sortY: 36, interact: "gacha", hit: { w: 16, h: 28 } });
  item(game, "clawMachine", 17.15, 1.15, { solid: { x: 0, y: 22, w: 20, h: 14 }, sortY: 42, interact: "claw", hit: { w: 20, h: 36 } });
  item(game, "snackRack", 12.85, 1.55, { solid: { x: 0, y: 16, w: 16, h: 12 }, sortY: 32, interact: "gameSnack", hit: { w: 16, h: 28 } });
  item(game, "sandbag", 1.25, 5.65, { solid: { x: 2, y: 16, w: 12, h: 10 }, sortY: 30, interact: "bag", hit: { w: 16, h: 28 } });
  item(game, "beanSofa", 4.05, 6.15, { solid: { x: 2, y: 12, w: 24, h: 10 }, sortY: 28, interact: "bean", hit: { w: 28, h: 24 } });
  item(game, "punchMachine", 14.65, 4.85, { solid: { x: 0, y: 22, w: 16, h: 14 }, sortY: 40, interact: "punch", hit: { w: 16, h: 36 } });
  item(game, "hoopMachine", 17.25, 5.05, { solid: { x: 2, y: 18, w: 14, h: 12 }, sortY: 36, interact: "hoop", hit: { w: 18, h: 30 } });
  item(game, "miniFridge", 12.95, 5.55, { solid: { x: 0, y: 12, w: 14, h: 10 }, sortY: 26, interact: "gameFridge", hit: { w: 14, h: 22 } });
  item(game, "dancePad", 8.35, 7.15, { sortY: 4, floor: true, interact: "dance", hit: { w: 20, h: 20 } });
  item(game, "rugOval", 5, 6.4, { w: 70, h: 28, color: "#88b878", edge: "#508048", sortY: 0, floor: true });

  item(kitchen, "windowPane", 3.2, 0.3, { sortY: 6, theme: "#c8e8f0" });
  item(kitchen, "windowPane", 14.6, 0.3, { sortY: 6, theme: "#c8e8f0" });
  item(kitchen, "wallCabinet", 6.4, 0.2, { sortY: 8 });
  item(kitchen, "wallCabinet", 15.6, 0.2, { sortY: 8 });
  item(kitchen, "fridge", 1.15, 1.15, {
    solid: { x: 0, y: 22, w: 18, h: 14 },
    sortY: 42,
    interact: "fridge",
    hit: { w: 18, h: 36 },
  });
  item(kitchen, "fridgeNote", 1.4, 1.32, { sortY: 48, interact: "menu", hit: { w: 8, h: 9 } });
  item(kitchen, "stove", 3.35, 1.2, { solid: { x: 0, y: 16, w: 22, h: 12 }, sortY: 38 });
  item(kitchen, "counter", 1.2, 4.55, { solid: { x: 0, y: 12, w: 28, h: 12 }, sortY: 30 });
  item(kitchen, "kitchenSink", 1.35, 6.55, { solid: { x: 0, y: 12, w: 24, h: 12 }, sortY: 30 });
  item(kitchen, "chipStack", 15.15, 7.45, {
    solid: { x: 1, y: 18, w: 26, h: 14 },
    sortY: 36,
    interact: "chips",
    hit: { w: 28, h: 34 },
  });
  item(kitchen, "rugOval", 7.4, 4.9, { w: 72, h: 34, color: "#e8c090", edge: "#c49058", sortY: 0, floor: true });
  item(kitchen, "diningTable", 8.35, 4.55, { solid: { x: 2, y: 8, w: 40, h: 14 }, sortY: 28, interact: "banquet" });
  item(kitchen, "chair", 9.15, 3.55, { theme: "#c47848", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 22 });
  item(kitchen, "chair", 11.55, 3.55, { theme: "#c47848", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 22 });
  item(kitchen, "chair", 9.15, 6.55, { theme: "#c47848", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 24 });
  item(kitchen, "chair", 11.55, 6.55, { theme: "#c47848", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 24 });
  item(kitchen, "plant", 18.2, 1.95, { solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22 });
  item(kitchen, "lamp", 13.7, 2.7, { theme: "#e8c878", sortY: 22 });
  item(kitchen, "vegBox", 17.5, 7.45, { theme: "leaf", solid: { x: 0, y: 4, w: 20, h: 12 }, sortY: 18 });

  /* pet room — arena in the middle, nests along the south wall */
  item(pet, "windowPane", 4.2, 0.28, { sortY: 6, theme: "#f0d8b0" });
  item(pet, "windowPane", 14.6, 0.28, { sortY: 6, theme: "#f0d8b0" });
  item(pet, "chalkboard", 9.85, 0.22, { sortY: 10, interact: "petStart", hit: { w: 22, h: 18 } });
  item(pet, "sofa", 2.15, 1.42, {
    theme: "pink",
    solid: { x: 0, y: 12, w: 48, h: 12 },
    sortY: 30,
    petBlock: "all",
    hit: { w: 48, h: 24 },
  });
  item(pet, "catTree", 16.45, 1.08, {
    solid: { x: 2, y: 28, w: 16, h: 8 },
    sortY: 42,
    petBlock: "dog",
    petClimb: "cotton",
    hit: { w: 20, h: 36 },
  });
  item(pet, "sideCabinet", 17.55, 3.55, {
    solid: { x: 0, y: 12, w: 18, h: 10 },
    sortY: 26,
    petBlock: "dog",
    petClimb: "cotton",
    hit: { w: 18, h: 22 },
  });
  item(pet, "rugOval", 4.85, 4.15, {
    w: 78,
    h: 40,
    color: "#e8c4a0",
    edge: "#c49068",
    sortY: 0,
    floor: true,
    interact: "rug",
    hit: { w: 78, h: 40 },
  });
  item(pet, "toyBasket", 10.05, 3.35, {
    sortY: 18,
    petBlock: "all",
    petHit: { x: 1, y: 6, w: 14, h: 8 },
    interact: "petStart",
    hit: { w: 18, h: 16 },
  });
  item(pet, "cardboardBox", 3.05, 6.55, {
    solid: { x: 1, y: 8, w: 16, h: 8 },
    sortY: 18,
    petBlock: "dog",
    petHide: "cotton",
    hit: { w: 18, h: 16 },
  });
  item(pet, "table", 12.15, 5.55, {
    solid: { x: 2, y: 8, w: 24, h: 10 },
    sortY: 24,
    petBlock: "all",
  });
  item(pet, "petTunnel", 7.05, 6.95, {
    sortY: 8,
    floor: true,
    petBlock: "cat",
    petBoost: "dog",
    petHit: { x: 2, y: 4, w: 30, h: 10 },
    hit: { w: 36, h: 16 },
  });
  item(pet, "dogBed", 14.35, 6.95, {
    sortY: 14,
    petBlock: "all",
    petHit: { x: 1, y: 6, w: 22, h: 10 },
    hit: { w: 24, h: 16 },
  });
  item(pet, "petNest", 1.45, 8.15, {
    theme: { outer: "#c47858", inner: "#f0c0a8", pad: "#fff0e0" },
    sortY: 12,
    nest: "cotton",
    hit: { w: 24, h: 16 },
  });
  item(pet, "petNest", 8.85, 8.15, {
    theme: { outer: "#e8b0c0", inner: "#f8e0e8", pad: "#fff8f4" },
    sortY: 12,
    nest: "marsh",
    hit: { w: 24, h: 16 },
  });
  item(pet, "petNest", 16.35, 8.15, {
    theme: { outer: "#c49048", inner: "#e8c878", pad: "#fff0c8" },
    sortY: 12,
    nest: "tangtang",
    hit: { w: 24, h: 16 },
  });
  item(pet, "bowls", 4.15, 8.35, { sortY: 14 });
  item(pet, "plant", 18.15, 7.35, { theme: "#88a070", solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22, petBlock: "all" });
  item(pet, "lamp", 5.55, 1.55, { theme: "#e8c878", sortY: 22, on: true });

  item(garden, "houseFacade", 6.0, 0.05, { sortY: 96 });
  item(garden, "cypress", 1.15, 1.35, { solid: { x: 6, y: 38, w: 6, h: 8 }, sortY: 50 });
  item(garden, "cypress", 24.35, 1.35, { solid: { x: 6, y: 38, w: 6, h: 8 }, sortY: 50 });
  item(garden, "cypress", 0.95, 7.15, { solid: { x: 6, y: 38, w: 6, h: 8 }, sortY: 50 });
  item(garden, "cypress", 24.55, 7.15, { solid: { x: 6, y: 38, w: 6, h: 8 }, sortY: 50 });
  item(garden, "statue", 7.05, 6.05, { solid: { x: 2, y: 22, w: 12, h: 8 }, sortY: 30, interact: "statue", hit: { w: 16, h: 28 } });
  item(garden, "statue", 14.85, 6.05, { solid: { x: 2, y: 22, w: 12, h: 8 }, sortY: 30, interact: "statue", hit: { w: 16, h: 28 } });
  item(garden, "marbleUrn", 8.05, 6.35, { sortY: 22 });
  item(garden, "marbleUrn", 13.85, 6.35, { sortY: 22 });
  item(garden, "roseArch", 9.35, 5.85, { sortY: 40 });
  item(garden, "gardenLantern", 8.05, 7.15, { sortY: 24 });
  item(garden, "gardenLantern", 14.55, 7.15, { sortY: 24 });
  item(garden, "gardenLantern", 8.05, 13.35, { sortY: 24 });
  item(garden, "gardenLantern", 14.55, 13.35, { sortY: 24 });
  item(garden, "topiary", 2.05, 8.05, { theme: "ball", solid: { x: 4, y: 22, w: 8, h: 8 }, sortY: 32 });
  item(garden, "topiary", 21.85, 8.05, { theme: "ball", solid: { x: 4, y: 22, w: 8, h: 8 }, sortY: 32 });
  item(garden, "topiary", 2.05, 12.15, { theme: "spiral", solid: { x: 4, y: 22, w: 8, h: 8 }, sortY: 32 });
  item(garden, "topiary", 21.85, 12.15, { theme: "spiral", solid: { x: 4, y: 22, w: 8, h: 8 }, sortY: 32 });
  item(garden, "fountain", 10.4, 9.05, { solid: { x: 4, y: 16, w: 24, h: 12 }, sortY: 32, interact: "fountain", hit: { w: 32, h: 28 } });
  item(garden, "tree", 19.6, 5.85, { solid: { x: 10, y: 32, w: 8, h: 8 }, sortY: 46 });
  item(garden, "tree", 1.35, 14.35, { solid: { x: 10, y: 32, w: 8, h: 8 }, sortY: 46 });
  item(garden, "flowerPatch", 1.85, 9.85, { theme: 0, sortY: 14, interact: "flower", hit: { w: 20, h: 16 } });
  item(garden, "flowerPatch", 1.35, 11.05, { theme: 2, sortY: 14, interact: "flower", hit: { w: 20, h: 16 } });
  item(garden, "flowerPatch", 22.15, 9.85, { theme: 1, sortY: 14, interact: "flower", hit: { w: 20, h: 16 } });
  item(garden, "flowerPatch", 22.55, 11.15, { theme: 3, sortY: 14, interact: "flower", hit: { w: 20, h: 16 } });
  item(garden, "wateringCan", 3.15, 15.35, { sortY: 14, interact: "can", hit: { w: 16, h: 16 } });
  item(garden, "dandelion", 5.05, 16.25, { sortY: 12, interact: "puff", hit: { w: 10, h: 16 } });
  item(garden, "swing", 7.55, 16.15, { solid: { x: 0, y: 16, w: 20, h: 8 }, sortY: 24, interact: "swing", hit: { w: 20, h: 24 } });
  item(garden, "hammock", 11.15, 16.05, { solid: { x: 2, y: 12, w: 20, h: 8 }, sortY: 22, interact: "hammock", hit: { w: 24, h: 20 } });
  item(garden, "bench", 15.05, 16.25, { solid: { x: 0, y: 8, w: 28, h: 8 }, sortY: 20, interact: "hammockSit", hit: { w: 28, h: 16 } });
  item(garden, "picnicBasket", 13.15, 17.15, { sortY: 16, interact: "picnic", hit: { w: 16, h: 16 } });
  item(garden, "toolBox", 19.15, 16.25, { sortY: 16, interact: "tools", hit: { w: 18, h: 16 } });
  item(garden, "planter", 20.35, 14.15, { theme: "leaf", solid: { x: 0, y: 10, w: 20, h: 10 }, sortY: 22, interact: "veg", hit: { w: 20, h: 18 }, ripe: false });
  item(garden, "planter", 22.05, 14.15, { theme: "berry", solid: { x: 0, y: 10, w: 20, h: 10 }, sortY: 22, interact: "veg", hit: { w: 20, h: 18 }, ripe: true });
  item(garden, "planter", 21.15, 15.45, { theme: "gold", solid: { x: 0, y: 10, w: 20, h: 10 }, sortY: 22, interact: "veg", hit: { w: 20, h: 18 }, ripe: true });
  item(garden, "dogBed", 23.15, 16.55, { sortY: 16, interact: "nest", hit: { w: 24, h: 16 } });
  item(garden, "rugOval", 3.15, 17.25, { w: 40, h: 16, color: "#48a050", edge: "#d4a040", sortY: 0, floor: true, interact: "napGrass", hit: { w: 40, h: 16 } });

  item(bar, "windowPane", 4.2, 0.28, { sortY: 6, theme: "#241018", drape: "navy" });
  item(bar, "windowPane", 12.4, 0.28, { sortY: 6, theme: "#241018", drape: "navy" });
  item(bar, "bottleShelf", 7.15, 0.18, { sortY: 10, interact: "barBottles", hit: { w: 28, h: 18 } });
  item(bar, "chalkboard", 16.85, 0.32, { sortY: 12, interact: "barBoard", hit: { w: 22, h: 22 } });
  item(bar, "souvenirCabinet", 1.15, 1.15, {
    solid: { x: 0, y: 18, w: 18, h: 12 },
    sortY: 36,
    interact: "barCabinet",
    hit: { w: 18, h: 32 },
  });
  item(bar, "washTub", 1.25, 4.55, { solid: { x: 0, y: 10, w: 16, h: 10 }, sortY: 24, interact: "barWash", hit: { w: 16, h: 20 } });
  item(bar, "barCounter", 3.15, 2.55, {
    solid: { x: 2, y: 10, w: 176, h: 12 },
    sortY: 28,
    interact: "barMix",
    hit: { w: 180, h: 28 },
  });
  item(bar, "shaker", 11.15, 2.42, { sortY: 34, interact: "barMix", hit: { w: 12, h: 16 } });
  item(bar, "openSign", 14.35, 2.28, { sortY: 36, interact: "barSign", hit: { w: 16, h: 18 }, open: false });
  item(bar, "coinJar", 16.55, 2.55, { sortY: 34, interact: "barJar", hit: { w: 14, h: 16 } });
  item(bar, "doorLamp", 18.55, 3.85, { sortY: 22, interact: "barLamp", hit: { w: 12, h: 16 }, on: false });
  item(bar, "barStool", 3.85, 4.22, { solid: { x: 2, y: 10, w: 10, h: 6 }, sortY: 22, interact: "barStool", hit: { w: 14, h: 16 }, seat: "bar1" });
  item(bar, "barStool", 6.35, 4.22, { solid: { x: 2, y: 10, w: 10, h: 6 }, sortY: 22, interact: "barStool", hit: { w: 14, h: 16 }, seat: "bar2" });
  item(bar, "barStool", 8.85, 4.22, { solid: { x: 2, y: 10, w: 10, h: 6 }, sortY: 22, interact: "barStool", hit: { w: 14, h: 16 }, seat: "bar3" });
  item(bar, "rugOval", 5.4, 5.55, { w: 72, h: 22, color: "#6a2430", edge: "#3a1018", sortY: 0, floor: true });
  item(bar, "table", 3.15, 6.55, { solid: { x: 2, y: 8, w: 24, h: 10 }, sortY: 24 });
  item(bar, "chair", 2.35, 7.45, { theme: "#6a3040", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 22, interact: "barSeat", hit: { w: 14, h: 16 }, seat: "t1a" });
  item(bar, "chair", 5.05, 7.45, { theme: "#6a3040", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 22, interact: "barSeat", hit: { w: 14, h: 16 }, seat: "t1b" });
  item(bar, "table", 12.05, 6.55, { solid: { x: 2, y: 8, w: 24, h: 10 }, sortY: 24 });
  item(bar, "chair", 11.25, 7.45, { theme: "#6a3040", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 22, interact: "barSeat", hit: { w: 14, h: 16 }, seat: "t2a" });
  item(bar, "chair", 13.95, 7.45, { theme: "#6a3040", solid: { x: 0, y: 10, w: 14, h: 8 }, sortY: 22, interact: "seat", hit: { w: 14, h: 16 } });
  item(bar, "plant", 18.15, 6.85, { theme: "#3a4850", solid: { x: 3, y: 12, w: 8, h: 6 }, sortY: 22 });
  item(bar, "lamp", 17.15, 6.15, { theme: "#e8b070", sortY: 22, on: true });

  const rooms = { garden, living, upperHall, herBed, myBed, bath, guest, movie, game, kitchen, pet, bar };
  const NPC_SPOTS = {
    garden: { x: 8.4 * T, y: 9.6 * T, dir: "down" },
    living: { x: 10.2 * T, y: 4.4 * T, dir: "down" },
    upperHall: { x: 14.4 * T, y: 5.4 * T, dir: "left" },
    herBed: { x: 15.4 * T, y: 6.6 * T, dir: "left" },
    myBed: { x: 7.2 * T, y: 6.6 * T, dir: "right" },
    bath: { x: 7.2 * T, y: 6.4 * T, dir: "down" },
    guest: { x: 8.35 * T, y: 5.15 * T, dir: "down" },
    movie: { x: 14.35 * T, y: 4.75 * T, dir: "left" },
    game: { x: 10.15 * T, y: 5.55 * T, dir: "down" },
    kitchen: { x: 14.6 * T, y: 5.5 * T, dir: "left" },
    pet: { x: 14.35 * T, y: 5.15 * T, dir: "left" },
    bar: { x: 10.4 * T, y: 5.35 * T, dir: "down" },
  };
  for (const [id, spot] of Object.entries(NPC_SPOTS)) {
    rooms[id].npc = { ...spot };
  }

  const MAP = [
    { id: "garden", floor: 1, c: 3, r: 1 },
    { id: "bar", floor: 1, c: 1, r: 2 },
    { id: "guest", floor: 1, c: 2, r: 2 },
    { id: "living", floor: 1, c: 3, r: 2 },
    { id: "movie", floor: 1, c: 4, r: 2 },
    { id: "kitchen", floor: 1, c: 3, r: 3 },
    { id: "game", floor: 1, c: 4, r: 3 },
    { id: "pet", floor: 2, c: 2, r: 1 },
    { id: "herBed", floor: 2, c: 1, r: 2 },
    { id: "upperHall", floor: 2, c: 2, r: 2 },
    { id: "myBed", floor: 2, c: 3, r: 2 },
    { id: "bath", floor: 2, c: 1, r: 3 },
  ];

  const MAP_SPAWN = {
    garden: { x: 10.4 * T, y: 8.6 * T },
    living: { x: 10.5 * T, y: 6.5 * T },
    upperHall: { x: 10.5 * T, y: 6.5 * T },
    herBed: { x: 10.5 * T, y: 6.5 * T },
    myBed: { x: 10.5 * T, y: 6.5 * T },
    bath: { x: 10.5 * T, y: 6.5 * T },
    guest: { x: 10.5 * T, y: 6.5 * T },
    movie: { x: 10.5 * T, y: 6.5 * T },
    game: { x: 10.5 * T, y: 6.5 * T },
    kitchen: { x: 10.5 * T, y: 8.6 * T },
    pet: { x: 10.5 * T, y: 6.5 * T },
    bar: { x: 16.4 * T, y: 4.8 * T },
  };

  function blocksAt(room, x, y) {
    const tx = Math.floor(x / T);
    const ty = Math.floor(y / T);
    if (ty < 0 || tx < 0 || ty >= room.rows || tx >= room.cols) return true;
    return !room.tiles[ty][tx].walk;
  }

  function rectBlocked(room, x, y, w, h) {
    const pts = [
      [x, y],
      [x + w - 1, y],
      [x, y + h - 1],
      [x + w - 1, y + h - 1],
      [x + w / 2, y],
      [x + w / 2, y + h - 1],
      [x, y + h / 2],
      [x + w - 1, y + h / 2],
    ];
    for (const [px, py] of pts) {
      if (blocksAt(room, px, py)) return true;
    }
    for (const s of room.solids) {
      if (x < s.x + s.w && x + w > s.x && y < s.y + s.h && y + h > s.y) return true;
    }
    return false;
  }

  return { rooms, NAMES, T, rectBlocked, FLOOR, WALL, MAP, MAP_SPAWN, NPC_SPOTS };
})();
