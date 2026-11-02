# Devpost submission kit — Haunted Terminal (Kiroween 2026)

Deadline: **Dec 5, 2026, 3:30 AM IST** (Dec 4 PT). Category: **Resurrection**. Also tick **Costume Contest** if allowed, plus **Social Blitz** and **Bonus Blog** (easy extra chances).

---
## ⚠️ Do these yourself in Kiro FIRST (judges check real Kiro usage)
The `.kiro/` folder is a starter. Judges score how well YOU used Kiro, so do these for real and keep screenshots:
1. Open the folder in **Kiro IDE**. Let it read the steering docs.
2. **New spec via Kiro:** ask Kiro: *"Create a spec for a new door game called SÉANCE: the caller asks yes/no questions and a planchette spells answers letter by letter."* Let Kiro write requirements → design → tasks, then run the tasks.
3. **Hooks:** edit `crypt.js` and watch the *Run engine tests on save* hook fire. Screenshot it.
4. **Vibe coding vs spec:** ask Kiro in chat for one small polish (e.g. "add a CRT power-on animation"). Note how it compared to the spec flow.
5. Optional: add an **MCP server** or a **Kiro power** if you can — it's a judged topic.
Then update the write-up below so every sentence is TRUE about what you did.

## Publish
1. Create a **public GitHub repo** `haunted-terminal`, upload everything **including the `.kiro` folder** (don't gitignore it). LICENSE must show in the About section.
2. Settings → Pages → Deploy from branch `main` / root → your app URL is `https://<you>.github.io/haunted-terminal/`.
3. Record the video (script below), upload to **YouTube as Public**.
4. Devpost → Kiroween → Enter a submission. Paste the fields below.

---
## Tagline
A dead 1987 dial-up BBS, resurrected in your browser — and its sysop never logged off.

## Inspiration
Before the web, people dialled into Bulletin Board Systems run from someone's bedroom. Thousands died when the internet arrived. I wanted to bring one back — and imagine that the sysop came back with it.

## What it does
You dial NIGHTSHADE BBS over a synthesised 2400-baud modem, choose a handle and explore: chat with MORTIS, the ghost sysop who remembers you and reveals his story; read and post on a message board where someone from 1989 replies; and play The Crypt of Lost Bytes, a door game where you recover four backup fragments and RESTORE MORTIS so he can finally log off. Go idle and the board haunts you.

## How I built it
Plain HTML, CSS and JavaScript — no frameworks, no keys, no server. All sound is generated with Web Audio oscillators. The ghost and crypt are pure engines tested in Node; the UI is a small state machine with a typewriter output queue.

## How I used Kiro  ← EDIT to match what you really did
- **Spec-driven development:** requirements in EARS format (dial-up, login, ghost chat, board, crypt, haunting, accessibility) → design (state machine, engines) → 10 tasks. The spec kept a creative project from sprawling; [add your SÉANCE spec experience].
- **Steering:** product (1987 authenticity, tone), tech (no deps, pure engines, try/catch storage) and style (colours, uppercase system text). [Say what changed in Kiro's answers.]
- **Agent hooks:** on save of `ghost.js`/`crypt.js` Kiro runs the unit tests and fixes failures; a second hook checks lore consistency (dates, names, fragment counts). [Describe a bug it caught.]
- **Spec vs vibe coding:** [your comparison].

## Challenges
Making text arrive at modem speed without lines interleaving (solved with a single Promise output queue), and browser autoplay rules for sound (audio starts on the first keypress).

## Accomplishments
A complete, finishable story in under 3 minutes, with sound, that works offline and on a phone.

## What I learned
[Your words.]

## What's next
Multi-caller nodes so two people can chat on the same haunted board, and more door games.

## Built with
html, css, javascript, web-audio-api, kiro

---
## 3-minute video script
- **0:00–0:15** Black screen. "In 1989, Bulletin Board Systems ran the online world. Then they died. I brought one back."
- **0:15–0:40** Press ENTER — let the modem handshake play loud. CONNECT 2400, logo.
- **0:40–1:15** Handle → Chat. Type `hello`, `how did you die`, `can I help you`. Show the lore.
- **1:15–1:35** Message board: post something, show `???` replying.
- **1:35–2:20** Crypt speed-run → RESTORE → possession effect → NO CARRIER.
- **2:20–2:55** Show Kiro: the spec tabs, steering docs, a hook firing on save.
- **2:55–3:00** "Haunted Terminal. Some connections never drop."

## Social Blitz post (post during submission period)
#KiroweenHackathon26 I resurrected a 1987 dial-up BBS with Kiro — and the sysop never logged off. Spec-driven dev kept my spooky idea on track: requirements → design → tasks, with hooks auto-running my tests. [link]
