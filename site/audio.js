/* Original music and effects synthesized in the browser with the Web Audio API.
   No samples or third-party recordings. */
var AdultAudio = (function () {
  var KEY = "adult-life-audio";
  var ctx = null;
  var master = null;
  var musicGain = null;
  var sfxGain = null;
  var muted = loadMuted();
  var unlocked = false;
  var looping = false;
  var timer = 0;
  var nextTime = 0;
  var stepIndex = 0;
  var talking = false;
  var wanted = "story";
  var pendingStars = 0;

  var STORY = {
    step: 0.48,
    level: 0.16,
    melody: [
      76, 0, 74, 0, 72, 0, 67, 0,
      69, 0, 67, 0, 64, 0, 67, 0,
      72, 0, 67, 0, 69, 0, 72, 0,
      74, 0, 72, 0, 67, 0, 64, 0
    ],
    pad: [48, 52, 55]
  };
  var ENDING = {
    step: 0.52,
    level: 0.28,
    melody: [
      72, 0, 76, 0, 79, 0, 84, 0,
      79, 0, 76, 0, 72, 0, 67, 0
    ],
    pad: [60, 64, 67, 71]
  };
  var bed = STORY;

  function loadMuted() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "");
      return !!(data && data.muted);
    } catch (err) {
      return false;
    }
  }

  function saveMuted() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ muted: muted }));
    } catch (err) {
      /* private mode */
    }
  }

  function midi(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function envGain(value, time, attack, dur) {
    var gain = ctx.createGain();
    var start = Math.max(time, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(value, 0.0001), start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + dur);
    return gain;
  }

  function tone(freq, time, dur, type, peak, dest, cutoff) {
    if (!ctx || !dest) return;
    var start = Math.max(time, ctx.currentTime);
    var osc = ctx.createOscillator();
    var filter = ctx.createBiquadFilter();
    var gain = envGain(peak, start, 0.02, dur);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff || 1800, start);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(start);
    osc.stop(start + dur + 0.08);
    osc.onended = function () {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  function level() {
    var base = bed.level;
    if (talking && wanted !== "end") base *= 0.55;
    return muted ? 0.0001 : base;
  }

  function applyLevel() {
    if (!musicGain || !ctx) return;
    var now = ctx.currentTime;
    musicGain.gain.cancelScheduledValues(now);
    musicGain.gain.setValueAtTime(Math.max(musicGain.gain.value, 0.0001), now);
    musicGain.gain.linearRampToValueAtTime(level(), now + 0.25);
  }

  function tick() {
    if (!looping || !ctx) return;
    if (ctx.state === "suspended") {
      timer = setTimeout(tick, 200);
      return;
    }
    var horizon = ctx.currentTime + 0.3;
    if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.05;
    while (nextTime < horizon) {
      var note = bed.melody[stepIndex % bed.melody.length];
      if (note) {
        tone(midi(note), nextTime, 0.42, "triangle", 0.07, musicGain, 1600);
        tone(midi(note) * 2, nextTime, 0.18, "sine", 0.012, musicGain, 2400);
      }
      if (stepIndex % 8 === 0) {
        bed.pad.forEach(function (padNote) {
          tone(midi(padNote), nextTime, bed.step * 7.2, "sine", 0.018, musicGain, 900);
        });
      }
      nextTime += bed.step;
      stepIndex += 1;
    }
    timer = setTimeout(tick, 90);
  }

  function startLoop() {
    if (looping || !ctx || muted || document.hidden) return;
    looping = true;
    nextTime = ctx.currentTime + 0.06;
    tick();
  }

  function stopLoop() {
    looping = false;
    clearTimeout(timer);
  }

  function ensureGraph() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.0001;
    musicGain.connect(master);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = muted ? 0.0001 : 0.85;
    sfxGain.connect(master);
    return true;
  }

  function unlock() {
    if (!ensureGraph()) return;
    unlocked = true;
    if (ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }
    if (pendingStars) playStars(pendingStars);
  }

  function sync(view) {
    wanted = view === "end" ? "end" : "story";
    bed = wanted === "end" ? ENDING : STORY;
    if (!unlocked || !ctx) return;
    applyLevel();
    if (!muted && !document.hidden) startLoop();
  }

  function setTalking(next) {
    talking = !!next;
    applyLevel();
  }

  function sfx(name) {
    if (!unlocked || muted || !ctx || document.hidden) return;
    var now = ctx.currentTime;
    if (name === "tap") {
      tone(740, now, 0.045, "sine", 0.04, sfxGain, 2400);
    } else if (name === "option") {
      tone(520, now, 0.05, "sine", 0.045, sfxGain, 2000);
      tone(780, now + 0.04, 0.06, "sine", 0.04, sfxGain, 2200);
    } else if (name === "correct") {
      tone(659.25, now, 0.22, "sine", 0.06, sfxGain, 2800);
      tone(783.99, now + 0.09, 0.24, "sine", 0.055, sfxGain, 2800);
      tone(1046.5, now + 0.18, 0.32, "sine", 0.05, sfxGain, 3000);
    } else if (name === "wrong") {
      tone(196, now, 0.16, "sine", 0.045, sfxGain, 420);
      tone(174, now, 0.18, "triangle", 0.03, sfxGain, 380);
    } else if (name === "xp") {
      tone(784, now, 0.1, "sine", 0.05, sfxGain, 2600);
      tone(988, now + 0.08, 0.12, "sine", 0.045, sfxGain, 2800);
      tone(1174, now + 0.16, 0.16, "sine", 0.04, sfxGain, 3000);
    } else if (name === "card") {
      tone(523.25, now, 0.18, "triangle", 0.05, sfxGain, 2400);
      tone(659.25, now + 0.1, 0.2, "sine", 0.045, sfxGain, 2600);
      tone(783.99, now + 0.2, 0.22, "sine", 0.04, sfxGain, 2800);
      tone(1046.5, now + 0.3, 0.28, "sine", 0.035, sfxGain, 3000);
    } else if (name === "place") {
      tone(210, now, 0.07, "triangle", 0.06, sfxGain, 700);
      tone(420, now + 0.01, 0.05, "sine", 0.03, sfxGain, 1200);
    }
  }

  function playStars(count) {
    if (!unlocked || muted || !ctx || document.hidden) return;
    pendingStars = 0;
    var notes = [523.25, 659.25, 783.99, 1046.5];
    var total = Math.max(1, Math.min(count, 3));
    var now = ctx.currentTime + 0.05;
    for (var i = 0; i < total; i += 1) {
      tone(notes[i], now + i * 0.22, 0.34, "sine", 0.06, sfxGain, 3200);
      tone(notes[i] * 2, now + i * 0.22, 0.16, "triangle", 0.015, sfxGain, 3600);
    }
  }

  function stars(count) {
    pendingStars = count;
    playStars(count);
  }

  function setMuted(next) {
    muted = !!next;
    saveMuted();
    if (sfxGain && ctx) {
      var now = ctx.currentTime;
      sfxGain.gain.cancelScheduledValues(now);
      sfxGain.gain.setValueAtTime(muted ? 0.0001 : 0.85, now);
    }
    if (muted) stopLoop();
    applyLevel();
    if (!muted && unlocked && !document.hidden) startLoop();
    paint();
  }

  function paint() {
    var icon = document.getElementById("menu-sound-icon");
    var label = document.getElementById("menu-sound-label");
    var button = document.getElementById("menu-sound");
    if (!icon || !label || !button) return;
    icon.textContent = muted ? "🔇" : "🔊";
    label.textContent = muted ? "音樂與音效：關" : "音樂與音效：開";
    button.setAttribute("aria-pressed", muted ? "true" : "false");
  }

  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) {
      stopLoop();
      ctx.suspend().catch(function () {});
      return;
    }
    if (!unlocked) return;
    ctx.resume().then(function () {
      if (!muted) {
        applyLevel();
        startLoop();
      }
    }).catch(function () {});
  });

  return {
    unlock: unlock,
    sync: sync,
    setTalking: setTalking,
    sfx: sfx,
    stars: stars,
    toggle: function () {
      unlock();
      setMuted(!muted);
    },
    paint: paint,
    isMuted: function () { return muted; }
  };
})();
