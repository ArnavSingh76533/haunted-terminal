# Design — Haunted Terminal

## Architecture
Static site, zero dependencies, zero build step.

| File | Responsibility |
|------|----------------|
| `index.html` | CRT frame, output log, input line, HUD |
| `style.css` | Phosphor glow, scanlines, vignette, flicker, possession animation |
| `app.js` | Output queue + typewriter, Web Audio synth, mode state machine, haunting timer, board storage |
| `ghost.js` | `Ghost` engine: ordered regex rules → memory mutations → reply; lore track |
| `crypt.js` | `Crypt` engine: room graph, items, locks, light, win condition |

## State machine (`app.js`)
`boot → dialing → login → menu ⇄ {chat, board, crypt} → end → dialing`

## Output queue
All writes chain onto a single Promise so typed lines never interleave. `wait(ms)` inserts dramatic pauses.

## Sound
No audio files. Oscillators generate the dial tone (350+440 Hz), DTMF pairs, handshake noise and keyclick blips.

## Ghost engine
`reply(text)`: lower-case → first matching rule wins → optional `mem()` mutation → either `nextLore()` or a random line. Every 4th unmatched turn advances the lore so the story always moves forward.

## Crypt engine
`handle(input) → {out, exit?, win?}` so the UI layer stays dumb and the engine is unit-testable in Node.

## Error handling
- localStorage wrapped in try/catch.
- AudioContext creation failure → sound disabled silently.
