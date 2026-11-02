# Tech steering
- Plain HTML/CSS/JavaScript only. No frameworks, no build step, no network calls, no API keys.
- Engines (`ghost.js`, `crypt.js`) must be pure and runnable in Node for tests; export via `module.exports` when available.
- Wrap all browser storage in try/catch.
- Generate all sound with Web Audio oscillators — no audio files.
- Keep each file under ~300 lines.
