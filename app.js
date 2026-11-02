// Haunted Terminal — terminal UI, modes, sound and haunting events.
(function () {
  const screen = document.getElementById("screen");
  const cmd = document.getElementById("cmd");
  const promptEl = document.getElementById("prompt");
  const crt = document.getElementById("crt");
  const soundBtn = document.getElementById("sound");
  const clock = document.getElementById("clock");

  const BAUD_MS = 9; // ms per character: feels like an old modem
  let queue = Promise.resolve();
  let mode = "boot";
  let handle = null;
  let soundOn = true;
  let ctx = null;

  // ---------- output ----------
  function line(text = "", cls = "") {
    queue = queue.then(() => typeLine(String(text), cls));
    return queue;
  }
  function typeLine(text, cls) {
    return new Promise((res) => {
      const el = document.createElement("div");
      if (cls) el.className = cls;
      screen.appendChild(el);
      if (!text) { el.innerHTML = "&nbsp;"; return res(); }
      let i = 0;
      const fast = text.length > 400;
      (function tick() {
        const step = fast ? 6 : 1;
        el.textContent += text.slice(i, i + step);
        i += step;
        screen.scrollTop = screen.scrollHeight;
        if (i % 6 === 0) blip();
        if (i < text.length) setTimeout(tick, BAUD_MS); else res();
      })();
    });
  }
  function lines(arr, cls) { arr.forEach((t) => line(t, cls)); return queue; }
  function wait(ms) { queue = queue.then(() => new Promise((r) => setTimeout(r, ms))); return queue; }
  function clear() { queue = queue.then(() => { screen.innerHTML = ""; }); return queue; }
  function setPrompt(p) { queue = queue.then(() => { promptEl.textContent = p; }); }

  // ---------- sound (Web Audio, no files) ----------
  function audio() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { soundOn = false; } }
    return ctx;
  }
  function tone(freq, dur, type = "square", vol = 0.03, when = 0) {
    if (!soundOn || !audio()) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime + when;
    o.start(t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.stop(t + dur + 0.02);
  }
  function blip() { tone(1800 + Math.random() * 400, 0.015, "square", 0.006); }
  function handshake() {
    // dial tone, DTMF-ish digits, then the famous screech
    tone(350, 0.8, "sine", 0.03); tone(440, 0.8, "sine", 0.03);
    [697, 770, 852, 941, 697, 852, 770].forEach((f, i) => tone(f, 0.09, "sine", 0.04, 0.9 + i * 0.12));
    for (let i = 0; i < 18; i++) tone(1000 + Math.random() * 2400, 0.12, "sawtooth", 0.02, 1.9 + i * 0.08);
    tone(2100, 0.9, "sine", 0.025, 3.4);
  }
  function scream() { for (let i = 0; i < 10; i++) tone(200 + i * 90, 0.15, "sawtooth", 0.04, i * 0.05); }

  // ---------- message board (per-browser storage, safe if blocked) ----------
  const SEED = [
    { from: "SYSOP", date: "10-30-89", text: "Storm tonight. If the board goes down, it's the power, not me." },
    { from: "NEONRAT", date: "11-02-89", text: "Mortis hasn't answered chat in 3 days. Anyone know his phone #?" },
    { from: "DIALTONE", date: "11-07-89", text: "Board keeps calling MY house at 3:33 AM. Not funny." },
    { from: "???", date: "10-31-89", text: "i am still here. i am still here. i am still here." },
  ];
  function loadPosts() { try { return SEED.concat(JSON.parse(localStorage.getItem("ht-posts") || "[]")); } catch (e) { return SEED.slice(); } }
  function savePost(p) { try { const a = JSON.parse(localStorage.getItem("ht-posts") || "[]"); a.push(p); localStorage.setItem("ht-posts", JSON.stringify(a.slice(-30))); } catch (e) {} }

  // ---------- screens ----------
  const LOGO = [
    "  _   _ ___ ____ _   _ _____ ____  _   _    _    ____  _____ ",
    " | \\ | |_ _/ ___| | | |_   _/ ___|| | | |  / \\  |  _ \\| ____|",
    " |  \\| || | |  _| |_| | | | \\___ \\| |_| | / _ \\ | | | |  _|  ",
    " | |\\  || | |_| |  _  | | |  ___) |  _  |/ ___ \\| |_| | |___ ",
    " |_| \\_|___\\____|_| |_| |_| |____/|_| |_/_/   \\_\\____/|_____|",
    "                    B . B . S .   est. 1987",
  ];

  function boot() {
    mode = "boot";
    clear();
    setPrompt("");
    lines(["HAYES SMARTMODEM 2400 READY", "", "Press ENTER to dial NIGHTSHADE BBS (555-0133)..."], "sys");
  }
  function dial() {
    mode = "dialing";
    handshake();
    lines(["ATDT 555-0133", "DIALING..."], "sys");
    wait(1400);
    line("RINGING...", "sys");
    wait(1200);
    line("CONNECT 2400", "amber");
    wait(500);
    lines(LOGO);
    line("");
    line("Last caller: MORTIS  ·  Last call: 10-31-1989 23:59  ·  Callers since: 0", "sys");
    line("");
    line("Enter your handle:");
    setPrompt("HANDLE>");
    queue.then(() => { mode = "login"; });
  }
  function menu() {
    mode = "menu";
    line("");
    lines([
      "+------------------- MAIN MENU -------------------+",
      "|  [C] Chat with the Sysop                        |",
      "|  [B] Message Board                              |",
      "|  [X] Enter the Crypt   (door game)              |",
      "|  [U] User List                                  |",
      "|  [G] Goodbye / log off                          |",
      "+-------------------------------------------------+",
    ]);
    setPrompt("MENU>");
  }

  function chatIntro() {
    mode = "chat";
    line("");
    line("Paging sysop...", "sys");
    wait(900);
    line("*** SYSOP HAS ENTERED CHAT ***", "amber");
    line("MORTIS: " + (handle ? `${handle}. I wasn't expecting anyone. Not anymore.` : "Who's there?"), "ghost");
    line("(Type to chat. Try: your story, how did you die, can I help you. Type MENU to leave.)", "sys");
    window.Ghost.memory.name = window.Ghost.memory.name || handle;
    setPrompt(`${handle || "YOU"}>`);
  }
  function board() {
    mode = "board";
    line("");
    line("== MESSAGE BOARD: GENERAL ==", "amber");
    loadPosts().forEach((p, i) => line(`#${i + 1}  ${p.date}  <${p.from}>  ${p.text}`, p.from === "???" ? "ghost" : ""));
    line("");
    line("Type a message to post it, or MENU to return.", "sys");
    setPrompt("POST>");
  }
  function users() {
    lines(["", "== USER LIST ==", "  1  MORTIS     SYSOP   last on 10-31-89", "  2  NEONRAT    USER    last on 11-02-89", "  3  DIALTONE   USER    last on 11-07-89",
      `  4  ${(handle || "YOU").padEnd(10)} USER    last on NOW`, "  5  ????????   ?????   last on ALWAYS"]);
    menu();
  }
  function cryptStart() {
    mode = "crypt";
    line("");
    lines(window.Crypt.start(), "");
    setPrompt("CRYPT>");
  }
  function ending() {
    mode = "end";
    queue = queue.then(() => { crt.classList.add("possessed"); scream(); });
    lines(["", "RESTORING BACKUP . . . . . . . . . . 100%", ""], "amber");
    wait(1200);
    queue = queue.then(() => crt.classList.remove("possessed"));
    lines([
      "MORTIS: ...I can feel the tape spinning. I can feel my hands.",
      `MORTIS: Thank you, ${handle || "caller"}. Thirty-seven years on hold, and you were the one who picked up.`,
      "MORTIS: Leave the board running, would you? For the next one.",
    ], "ghost");
    wait(800);
    lines(["", "*** SYSOP HAS LOGGED OFF ***", "", "NO CARRIER"], "red");
    line("");
    line("You freed MORTIS. Press ENTER to dial again.", "sys");
    setPrompt("");
  }

  // ---------- haunting ----------
  let lastInput = Date.now();
  setInterval(() => {
    if (!["chat", "menu", "board"].includes(mode)) return;
    if (Date.now() - lastInput < 25000) return;
    lastInput = Date.now();
    line(window.Ghost.haunt(), "red glitch");
    crt.classList.add("possessed"); setTimeout(() => crt.classList.remove("possessed"), 900);
    tone(55, 1.2, "sawtooth", 0.05);
  }, 5000);

  // ---------- input ----------
  function onEnter(raw) {
    const text = raw.trim();
    const low = text.toLowerCase();
    lastInput = Date.now();
    if (mode !== "boot" && mode !== "end" && text) line(`${promptEl.textContent} ${text}`, "user");

    switch (mode) {
      case "dialing": return; // ignore keys while the modem connects
      case "boot": case "end": audio(); dial(); return;
      case "login":
        if (!text) return line("A handle is required. Even the dead have names.", "sys");
        handle = text.replace(/[^\w-]/g, "").slice(0, 12).toUpperCase() || "CALLER";
        line(`Welcome, ${handle}. You are caller #1 since 1989.`);
        if (/^mortis$/i.test(handle)) { line("That handle is taken.", "red glitch"); handle = "IMPOSTOR"; }
        return menu();
      case "menu": {
        const k = low[0];
        if (k === "c") return chatIntro();
        if (k === "b") return board();
        if (k === "x") return cryptStart();
        if (k === "u") return users();
        if (k === "g") { lines(["", "MORTIS: Leaving so soon?", ""], "ghost"); lines(["NO CARRIER"], "red"); queue.then(() => { mode = "end"; setPrompt(""); line("Press ENTER to dial again.", "sys"); }); return; }
        return line("Unknown option. Choose C, B, X, U or G.", "sys");
      }
      case "chat":
        if (low === "menu" || low === "exit") { line("*** SYSOP HAS LEFT CHAT ***", "amber"); return menu(); }
        wait(400 + Math.random() * 700);
        return line("MORTIS: " + window.Ghost.reply(text), "ghost");
      case "board":
        if (low === "menu" || low === "exit" || !text) return menu();
        savePost({ from: handle, date: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" }).replace(/\//g, "-"), text: text.slice(0, 140) });
        line("Message posted.", "sys");
        wait(1500);
        return line(`#${loadPosts().length + 1}  10-31-89  <???>  i read it, ${handle}.`, "ghost");
      case "crypt": {
        const r = window.Crypt.handle(text);
        if (r.out) line(r.out);
        if (r.win) return ending();
        if (r.exit) return menu();
        return;
      }
    }
  }

  cmd.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { const v = cmd.value; cmd.value = ""; onEnter(v); }
    else if (soundOn) blip();
  });
  document.addEventListener("click", () => cmd.focus());
  soundBtn.addEventListener("click", (e) => { e.stopPropagation(); soundOn = !soundOn; soundBtn.textContent = "SOUND: " + (soundOn ? "ON" : "OFF"); });
  setInterval(() => { clock.textContent = new Date().toLocaleTimeString(); }, 1000);

  window.HT = { onEnter, get mode() { return mode; } }; // for automated tests
  boot();
  cmd.focus();
})();
