/* Sound effects are synthesized in this file. Background music is the
   CC0 recording documented in CREDITS.md (site/assets/bgm.mp3). */
var AdultAudio = (function () {
  var KEY = "adult-life-audio";
  var MUSIC_URL = "assets/bgm.mp3";
  var MUSIC_LEVEL = 0.35;
  var ctx = null;
  var master = null;
  var musicGain = null;
  var sfxGain = null;
  var musicBuffer = null;
  var musicLoading = null;
  var musicSource = null;
  var fadedIn = false;
  var muted = loadMuted();
  var unlocked = false;
  var talking = false;
  var wanted = "story";
  var pendingStars = 0;

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
    if (muted) return 0.0001;
    var base = MUSIC_LEVEL;
    if (talking && wanted !== "end") base *= 0.55;
    return base;
  }

  function applyLevel(fadeIn) {
    if (!musicGain || !ctx) return;
    var now = ctx.currentTime;
    var target = level();
    musicGain.gain.cancelScheduledValues(now);
    if (fadeIn) {
      musicGain.gain.setValueAtTime(0.0001, now);
      musicGain.gain.linearRampToValueAtTime(target, now + 1.2);
      fadedIn = true;
      return;
    }
    musicGain.gain.setValueAtTime(Math.max(musicGain.gain.value, 0.0001), now);
    musicGain.gain.linearRampToValueAtTime(target, now + 0.25);
  }

  function loadMusic() {
    if (musicBuffer) return Promise.resolve(musicBuffer);
    if (musicLoading) return musicLoading;
    musicLoading = fetch(MUSIC_URL).then(function (res) {
      if (!res.ok) throw new Error("bgm");
      return res.arrayBuffer();
    }).then(function (raw) {
      return ctx.decodeAudioData(raw);
    }).then(function (audio) {
      musicBuffer = audio;
      return audio;
    }).catch(function () {
      musicLoading = null;
    });
    return musicLoading;
  }

  function startMusic() {
    if (!ctx || !unlocked || muted || document.hidden) return;
    if (musicSource) {
      applyLevel(false);
      return;
    }
    loadMusic().then(function () {
      if (!musicBuffer || musicSource || !unlocked || muted || document.hidden) return;
      var src = ctx.createBufferSource();
      src.buffer = musicBuffer;
      src.loop = true;
      src.connect(musicGain);
      applyLevel(!fadedIn);
      src.start();
      musicSource = src;
    }).catch(function () {});
  }

  function ensureGraph() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1;
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
    if (!unlocked || !ctx || muted || document.hidden) return;
    startMusic();
  }

  function setTalking(next) {
    talking = !!next;
    applyLevel(false);
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
    if (!muted && unlocked && !document.hidden) startMusic();
    else applyLevel(false);
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
      ctx.suspend().catch(function () {});
      return;
    }
    if (!unlocked) return;
    ctx.resume().then(function () {
      if (!muted) startMusic();
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
