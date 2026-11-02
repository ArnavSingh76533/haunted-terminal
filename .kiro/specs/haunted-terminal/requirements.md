# Requirements — Haunted Terminal

## Introduction
Resurrect a dead 1980s dial-up Bulletin Board System (BBS) as a modern web app that runs in any browser with no install, no server and no API keys. The board comes back haunted by its former sysop, MORTIS.

## Requirement 1 — Dial-up experience
**User story:** As a caller, I want the connection to feel like a real 2400-baud modem, so that the resurrection is believable.
- WHEN the caller presses ENTER on the boot screen THEN the system SHALL play a dial tone, DTMF digits and a modem handshake using Web Audio.
- WHEN text is printed THEN the system SHALL type it out character by character at modem speed.
- WHEN the modem is connecting THEN the system SHALL ignore keyboard input.

## Requirement 2 — Login and main menu
- WHEN the caller enters a handle THEN the system SHALL sanitise it to max 12 alphanumeric characters and greet the caller.
- IF the caller tries the handle MORTIS THEN the system SHALL reject it and rename them IMPOSTOR.
- The main menu SHALL offer Chat, Message Board, Crypt door game, User List and Log off.

## Requirement 3 — Ghost sysop chat
- WHEN the caller types in chat THEN MORTIS SHALL reply in character using pattern rules and memory (handle, fear level).
- WHEN the caller asks about his story or death THEN MORTIS SHALL reveal the next of 7 lore fragments in order.
- The chat SHALL work fully offline.

## Requirement 4 — Message board
- The board SHALL show seeded posts from 1989 and the caller's own posts saved in browser storage.
- IF browser storage is unavailable THEN the board SHALL still work with seeded posts only.
- WHEN the caller posts THEN an unknown user "???" SHALL reply.

## Requirement 5 — The Crypt (door game)
- The crypt SHALL have 5 rooms, darkness that needs a lamp, a floppy-locked hatch and 4 backup fragments.
- WHEN the caller runs RESTORE in the vault with 4/4 fragments THEN the ending SHALL play and MORTIS SHALL log off.
- IF RESTORE is run elsewhere or with fewer fragments THEN the system SHALL explain why it failed.

## Requirement 6 — Haunting
- WHEN the caller is idle for 25 s in chat, menu or board THEN the system SHALL show a haunting event with a screen glitch and low drone.

## Requirement 7 — Accessibility and devices
- Output SHALL be in an aria-live log region.
- The layout SHALL work at 390 px width.
- Sound SHALL be toggleable.
