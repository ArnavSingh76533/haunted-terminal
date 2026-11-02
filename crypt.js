// THE CRYPT OF LOST BYTES — a tiny text adventure hidden under the BBS.
// Goal: collect the 4 backup fragments and RESTORE the sysop.
(function () {
  const ROOMS = {
    stairs: {
      name: "Basement Stairs",
      desc: "Wet concrete steps lead down into the dark. A dead lamp hangs on a nail. Water drips somewhere below.",
      exits: { down: "server" },
      items: ["lamp"],
    },
    server: {
      name: "Flooded Server Room",
      desc: "Ankle-deep black water. A beige tower PC hums though it is unplugged. Doors lead NORTH and EAST. Stairs go UP.",
      exits: { up: "stairs", north: "archive", east: "phone" },
      items: ["fragment-1"],
      dark: true,
    },
    archive: {
      name: "Floppy Archive",
      desc: "Shelves of 5.25\" floppies, each labelled with a caller's handle. One is labelled with YOUR name.",
      exits: { south: "server" },
      items: ["fragment-2", "floppy"],
      dark: true,
    },
    phone: {
      name: "Phone Closet",
      desc: "A rotary phone sits off the hook. From the receiver: modem tones, and under them, breathing. A narrow hatch leads DOWN.",
      exits: { west: "server", down: "vault" },
      items: ["fragment-3"],
      dark: true,
      locked: { dir: "down", need: "floppy", msg: "The hatch has a floppy-drive slot instead of a keyhole." },
    },
    vault: {
      name: "The Backup Vault",
      desc: "A tape drive spins by itself. On the screen: RESTORE? (Y/N). This is where MORTIS was saved, and lost.",
      exits: { up: "phone" },
      items: ["fragment-4"],
      dark: true,
    },
  };

  const ITEM_TEXT = {
    lamp: "an old oil lamp (it flickers on by itself)",
    floppy: "a floppy disk with your name on it",
    "fragment-1": "BACKUP FRAGMENT 1/4",
    "fragment-2": "BACKUP FRAGMENT 2/4",
    "fragment-3": "BACKUP FRAGMENT 3/4",
    "fragment-4": "BACKUP FRAGMENT 4/4",
  };

  function fresh() {
    const rooms = JSON.parse(JSON.stringify(ROOMS));
    return { rooms, at: "stairs", inv: [], done: false, moves: 0 };
  }

  const Crypt = {
    s: fresh(),
    start() { this.s = fresh(); return ["THE CRYPT OF LOST BYTES", "Commands: LOOK, GO <dir> (or N/S/E/W/UP/DOWN), TAKE <item>, USE <item>, INV, RESTORE, EXIT", "", this.look()]; },
    room() { return this.s.rooms[this.s.at]; },
    canSee() { return !this.room().dark || this.s.inv.includes("lamp"); },
    look() {
      const r = this.room();
      if (!this.canSee()) return `${r.name.toUpperCase()}\nIt is pitch black. You hear something breathing. You need light.`;
      const items = r.items.length ? "\nYou see: " + r.items.map((i) => ITEM_TEXT[i]).join(", ") : "";
      return `${r.name.toUpperCase()}\n${r.desc}${items}\nExits: ${Object.keys(r.exits).join(", ").toUpperCase()}`;
    },
    go(dir) {
      const map = { n: "north", s: "south", e: "east", w: "west", u: "up", d: "down" };
      dir = map[dir] || dir;
      const r = this.room();
      if (!r.exits[dir]) return "You can't go that way. The walls feel closer.";
      if (r.locked && r.locked.dir === dir) return r.locked.msg;
      this.s.at = r.exits[dir];
      this.s.moves++;
      return this.look();
    },
    take(word) {
      if (!this.canSee()) return "You grope in the dark. Something cold grabs your hand back. You let go.";
      const r = this.room();
      if (word === "all") {
        if (!r.items.length) return "There's nothing here to take.";
        return r.items.slice().map((i) => this.take(i)).join("\n");
      }
      const item = word && r.items.find((i) => i === word || i.startsWith(word));
      if (!item) return "There's nothing like that here.";
      r.items = r.items.filter((i) => i !== item);
      this.s.inv.push(item);
      const n = this.s.inv.filter((i) => i.startsWith("fragment")).length;
      return `Taken: ${ITEM_TEXT[item]}.` + (item.startsWith("fragment") ? `  [${n}/4 fragments]` : "");
    },
    use(word) {
      if (word.startsWith("floppy") && this.s.inv.includes("floppy") && this.s.at === "phone") {
        delete this.room().locked;
        return "You slide the floppy into the slot. The drive grinds. The hatch clicks open. Your name flashes on a tiny screen: ACCESS GRANTED.";
      }
      if (word.startsWith("lamp") && this.s.inv.includes("lamp")) return "The lamp is already lit. You didn't light it.";
      return "Nothing happens. Something laughs, very quietly.";
    },
    inv() { return this.s.inv.length ? "You carry: " + this.s.inv.map((i) => ITEM_TEXT[i]).join(", ") : "You carry nothing. Not even hope."; },
    restore() {
      const n = this.s.inv.filter((i) => i.startsWith("fragment")).length;
      if (this.s.at !== "vault") return "RESTORE must be run from the Backup Vault.";
      if (n < 4) return `RESTORE FAILED: ${n}/4 fragments. Backup incomplete. Something in the tape drive is crying.`;
      this.s.done = true;
      return "WIN";
    },
    // Returns {out: string|string[], exit?: bool, win?: bool}
    handle(input) {
      const [verb, ...rest] = input.toLowerCase().trim().split(/\s+/);
      const arg = rest.join(" ");
      switch (verb) {
        case "look": case "l": return { out: this.look() };
        case "go": case "walk": return { out: this.go(arg) };
        case "n": case "s": case "e": case "w": case "u": case "d":
        case "north": case "south": case "east": case "west": case "up": case "down":
          return { out: this.go(verb) };
        case "take": case "get": case "grab": return { out: this.take(arg) };
        case "use": case "insert": return { out: this.use(arg) };
        case "inv": case "i": case "inventory": return { out: this.inv() };
        case "restore": case "y": { const r = this.restore(); return r === "WIN" ? { out: "", win: true } : { out: r }; }
        case "exit": case "menu": case "quit": return { out: "You climb back up to the main menu. The basement door closes behind you.", exit: true };
        case "help": case "?": return { out: "LOOK, GO <dir>, N/S/E/W/UP/DOWN, TAKE <item>, USE <item>, INV, RESTORE, EXIT" };
        default: return { out: "The crypt does not understand. Type HELP." };
      }
    },
  };

  if (typeof module !== "undefined") module.exports = Crypt;
  else window.Crypt = Crypt;
})();
