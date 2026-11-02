// Run: node tests/engines.test.js
const assert = require("assert");
const Ghost = require("../ghost.js");
const Crypt = require("../crypt.js");
let n = 0; const t = (name, fn) => { fn(); n++; console.log("ok -", name); };

t("ghost remembers name", () => { Ghost.reset(); Ghost.reply("my name is harsh"); assert.strictEqual(Ghost.memory.name, "Harsh"); });
t("ghost reveals lore in order", () => { Ghost.reset(); assert.match(Ghost.reply("how did you die"), /FRAGMENT 1\/7/); assert.match(Ghost.reply("tell me more"), /FRAGMENT 2\/7/); });
t("ghost lore eventually exhausts", () => { Ghost.reset(); for (let i = 0; i < 7; i++) Ghost.reply("story"); assert.match(Ghost.reply("story"), /everything I remember/); });
t("crypt dark without lamp", () => { Crypt.start(); Crypt.handle("down"); assert.match(Crypt.handle("look").out, /pitch black/); });
t("crypt hatch locked until floppy", () => {
  Crypt.start(); ["take lamp", "down", "east"].forEach((c) => Crypt.handle(c));
  assert.match(Crypt.handle("down").out, /floppy-drive slot/);
});
t("crypt full win path", () => {
  Crypt.start();
  const path = ["take lamp", "down", "take fragment", "north", "take all", "south", "east", "take fragment", "use floppy", "down", "take fragment"];
  path.forEach((c) => Crypt.handle(c));
  assert.strictEqual(Crypt.handle("restore").win, true);
});
t("restore fails with missing fragments", () => { Crypt.start(); assert.match(Crypt.handle("restore").out, /Backup Vault/); });
console.log(`\n${n} tests passed`);
