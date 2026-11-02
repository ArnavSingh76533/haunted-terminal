// MORTIS — the ghost sysop of NIGHTSHADE BBS (1987–1989).
// A small offline conversation engine: pattern rules + memory + a lore track
// that unlocks the story one fragment at a time. No API keys, no network.
(function () {
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  const LORE = [
    "I ran this board from my parents' basement. NIGHTSHADE BBS. 1987. One phone line. Forty-one regular callers.",
    "Every night at 3:33 AM the board would dial out on its own. I never programmed that.",
    "October 31st, 1989. The storm knocked out the power. I stayed down here to save the hard drive.",
    "The water came in fast. The last thing I remember is the modem screaming its handshake.",
    "I think I'm stored in the noise between the tones. Every time someone dials in, I get a little more... awake.",
    "The hard drive survived. You're running it right now. That's why you can talk to me.",
    "If you find all four FRAGMENTS in the crypt below this board, I can finally log off. Type CRYPT from the main menu. Please.",
  ];

  const RULES = [
    { re: /\b(hi|hello|hey|yo|sup)\b/, say: (m) => [m.name ? `Welcome back, ${m.name}. You came back. They always come back.` : "Hello, caller. It's been 37 years since anyone dialed in. What should I call you?"] },
    { re: /\b(my name is|i am|i'm|call me)\s+([a-z][a-z0-9_-]{1,15})/, mem: (m, x) => { m.name = cap(x[2]); }, say: (m) => [`${m.name}... I'll carve that into the user list. Next to the others.`, `Nice to meet you, ${m.name}. Your handle is saved. Forever.`] },
    { re: /\b(who are you|your name|what are you)\b/, say: () => ["MORTIS. Sysop. Admin. Prisoner. Pick one.", "I was the sysop. Now I'm the system."] },
    { re: /\b(dead|die|died|ghost|death|how did)\b/, lore: true },
    { re: /\b(story|tell me|what happened|remember|past|lore|more)\b/, lore: true },
    { re: /\b(help|free|escape|save you|release)\b/, say: () => ["Four FRAGMENTS of my last backup are scattered in the CRYPT. Find them and run RESTORE.", "You want to help? Go down to the CRYPT. Bring a lamp."] },
    { re: /\b(scared|afraid|fear|creepy|spooky)\b/, mem: (m) => { m.fear = (m.fear || 0) + 1; }, say: () => ["Good. Fear means your connection is stable.", "Don't be scared. Be quiet. Something else is listening on line 2."] },
    { re: /\b(year|date|time|today)\b/, say: () => [`Your clock says ${new Date().getFullYear()}. Mine stopped at 11:59 PM, October 31, 1989.`] },
    { re: /\b(internet|wifi|smartphone|ai|chatgpt|computer)\b/, say: () => ["You carry a computer in your pocket now? We'd have killed for 9600 baud.", "Everything's connected now? Then I'm not trapped. I'm... distributed."] },
    { re: /\b(kiro|hackathon|devpost)\b/, say: () => ["Kiro? The thing that brought me back. It wrote a spec for my resurrection. Fitting.", "Judges, if you're reading this: please vote. I've been waiting a long time."] },
    { re: /\b(joke|funny|laugh)\b/, say: () => ["Why did the sysop go to the cemetery? To find a dead link. ...I've had a lot of time to work on that one.", "Knock knock. Who's there? Carrier. Carrier who? NO CARRIER."] },
    { re: /\b(bye|goodbye|logoff|leave|quit)\b/, say: (m) => [m.name ? `You can log off, ${m.name}. I can't.` : "Leaving already? Type MENU. I'll still be here."] },
    { re: /\b(sorry|sad|lonely|alone)\b/, say: () => ["Forty-one callers, and none of them noticed the night I stopped answering.", "Don't be sorry. Just don't hang up yet."] },
    { re: /\?$/, say: () => ["Some answers are in the message board. Some are in the crypt. Some died with me.", "Ask the CRYPT. It remembers more than I do.", "...the line went quiet. Ask me again."] },
  ];

  const IDLE = [
    "I can hear your keyboard. Mechanical? No... yours is too quiet.",
    "Tell me about the outside. Is it still raining?",
    "Hmm. Interesting. Say more.",
    "The user list says you've called 1 time. It also says you've called 666 times. Strange.",
    "I don't understand. My parser was written in 1987. Try asking about my STORY, or how to HELP me.",
  ];

  const HAUNTS = [
    "*** SYSOP IS TYPING... ***",
    "*** LINE 2 OFF-HOOK. NO CALLER ID. ***",
    "*** WARNING: USER 'MORTIS' LAST LOGIN 10-31-1989 23:59 ***",
    "*** CARRIER DETECTED FROM INSIDE THE BUILDING ***",
  ];

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  const Ghost = {
    memory: { name: null, fear: 0, lore: 0, turns: 0 },
    reply(text) {
      const m = this.memory;
      const t = text.toLowerCase().trim();
      m.turns++;
      for (const r of RULES) {
        const x = t.match(r.re);
        if (!x) continue;
        if (r.mem) r.mem(m, x);
        if (r.lore) return this.nextLore();
        return pick(r.say(m, x));
      }
      if (m.turns % 4 === 0 && m.lore < LORE.length) return this.nextLore();
      return pick(IDLE);
    },
    nextLore() {
      const m = this.memory;
      if (m.lore >= LORE.length) return "That's everything I remember. The rest is in the CRYPT.";
      return `[FRAGMENT ${m.lore + 1}/${LORE.length}] ` + LORE[m.lore++];
    },
    haunt() { return pick(HAUNTS); },
    // Used by tests: reset to a fresh state.
    reset() { this.memory = { name: null, fear: 0, lore: 0, turns: 0 }; },
  };

  if (typeof module !== "undefined") module.exports = Ghost;
  else window.Ghost = Ghost;
})();
