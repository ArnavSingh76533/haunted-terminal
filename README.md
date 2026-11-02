# 👻 Haunted Terminal — NIGHTSHADE BBS, resurrected

> In 1989 a teenage sysop named MORTIS stayed in a flooding basement to save his bulletin board's hard drive.
> The drive survived. Dial in, and find out what else did.

**Kiroween 2026 · Category: Resurrection**

Haunted Terminal brings back a dead technology — the 1980s dial-up Bulletin Board System — as a browser app. You dial in over a synthesised 2400-baud modem, pick a handle, and land on a BBS whose sysop never logged off.

## Features
- **Real dial-up feel** — dial tone, DTMF digits and modem handshake generated live with Web Audio; text arrives at modem speed on a glowing CRT.
- **Chat with the ghost sysop** — MORTIS remembers your handle, reacts to fear, and reveals his story in 7 lore fragments.
- **Message board** — posts from 1989, your own posts saved in your browser, and someone called `???` who replies.
- **The Crypt of Lost Bytes** — a door game: 5 rooms, darkness, a floppy-locked hatch, 4 backup fragments. Run `RESTORE` to free MORTIS.
- **Hauntings** — go idle and the line picks up on its own.
- Zero dependencies, no build step, no API keys, works offline and on mobile.

## Run it
Open `index.html` in a browser. That's it.
Or serve locally: `npx serve .` / `python3 -m http.server`.

**Speed-run for judges:** ENTER → type a handle → `X` → `take lamp`, `down`, `take fragment`, `north`, `take all`, `south`, `east`, `take fragment`, `use floppy`, `down`, `take fragment`, `restore`.

## Tests
```
node tests/engines.test.js
```

## How Kiro was used
See `.kiro/` — specs (requirements → design → tasks), steering docs (product, tech, style) and agent hooks (auto-run tests, lore consistency). Details in the Devpost write-up.

## License
MIT — see `LICENSE`.
