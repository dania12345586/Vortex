/* Original audio: HARD CIRCUIT, 156 BPM. No recordings or external libraries.
 * Weapon effects are noise/pressure/metal models rendered to PCM buffers,
 * not oscillator beeps. Music and effects have independent buses and toggles. */
(() => {
  "use strict";
  const BPM = 156,
    STEP = 60 / BPM / 4,
    BARS = 32;
  const audio = {
    ctx: null,
    musicEnabled: true,
    bossMode: false,
    mapIndex: 0,
    themes: [
      { name: "HARD CIRCUIT", boss: "CRYSTAL SIEGE", bpm: 156, bossBpm: 184 },
      { name: "FURNACE HEART", boss: "CALDERA RISING", bpm: 138, bossBpm: 162 },
      { name: "VERDANT COIL", boss: "SERPENT CROWN", bpm: 126, bossBpm: 146 },
      { name: "EVENT HORIZON", boss: "VOID SOVEREIGN", bpm: 172, bossBpm: 190 },
      { name: "SKYBOUND", boss: "EYE OF THE STORM", bpm: 148, bossBpm: 174 },
    ],
    sfxEnabled: true,
    started: false,
    step: 0,
    next: 0,
    timer: null,
    voices: 0,
    played: {},
    init() {
      if (this.ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.setup(this.ctx, this.ctx.destination);
      this.timer = setInterval(() => this.schedule(), 25);
      return true;
    },
    setup(ctx, dest) {
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0.72;
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -15;
      compressor.knee.value = 14;
      compressor.ratio.value = 5;
      compressor.attack.value = 0.002;
      compressor.release.value = 0.12;
      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = 0.58;
      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = 0.8;
      this.musicBus.connect(master);
      const delay = ctx.createDelay(1),
        feedback = ctx.createGain(),
        wet = ctx.createGain(),
        damp = ctx.createBiquadFilter();
      delay.delayTime.value = 0.238;
      feedback.gain.value = 0.24;
      wet.gain.value = 0.13;
      damp.type = "lowpass";
      damp.frequency.value = 2400;
      this.musicBus.connect(delay);
      delay.connect(damp);
      damp.connect(feedback);
      feedback.connect(delay);
      damp.connect(wet);
      wet.connect(master);
      this.sfxBus.connect(master);
      master.connect(compressor);
      compressor.connect(dest);
      this.buffers = {};
      for (const name of [
        "basic",
        "sniper",
        "cannon",
        "explosion",
        "impact",
        "ui",
        "build",
        "kick",
        "snare",
        "hat",
        "openhat",
        "laser",
        "crystal",
        "firework",
        "sonic",
        "slice",
        "boomerang",
        "vortex",
        "ice",
        "machine",
      ])
        this.buffers[name] = this.makeBuffer(name);
    },
    makeBuffer(name) {
      const sr = this.ctx.sampleRate,
        durations = {
          basic: 0.24,
          sniper: 0.8,
          cannon: 0.55,
          explosion: 1.05,
          impact: 0.35,
          ui: 0.045,
          build: 0.12,
          kick: 0.25,
          snare: 0.21,
          hat: 0.055,
          openhat: 0.18,
          laser: 0.15,
          crystal: 0.5,
          firework: 0.65,
          sonic: 0.8,
          slice: 0.18,
          boomerang: 0.3,
          vortex: 0.5,
          ice: 0.23,
          machine: 0.14,
        };
      const n = Math.ceil(sr * durations[name]),
        buf = this.ctx.createBuffer(1, n, sr),
        out = buf.getChannelData(0);
      let seed = 1867 + name.length * 13,
        lp = 0,
        body = 0,
        phase = 0,
        metal = 0;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed / 2147483647) * 2 - 1;
      };
      for (let i = 0; i < n; i++) {
        const t = i / sr,
          r = random();
        lp += (r - lp) * (name === "sniper" ? 0.48 : name === "explosion" ? 0.035 : 0.2);
        body += (r - body) * 0.018;
        metal += (r - metal) * 0.7;
        let v = 0;
        if (name === "basic")
          v =
            (r - lp) * Math.exp(-t * 135) * 0.7 +
            lp * Math.exp(-t * 35) * 1.3 +
            Math.sin(2 * Math.PI * 155 * t) * Math.exp(-t * 52) * 0.45 +
            (t > 0.055 ? (metal - lp) * Math.exp(-(t - 0.055) * 110) * 0.06 : 0);
        else if (name === "sniper")
          v =
            (r - lp) * Math.exp(-t * 100) * 1.1 +
            lp * Math.exp(-t * 12) * 0.6 +
            body * Math.exp(-t * 7) * 1.7 +
            Math.sin(2 * Math.PI * 90 * t) * Math.exp(-t * 30) * 0.5;
        else if (name === "cannon" || name === "impact")
          v =
            lp * Math.exp(-t * 16) * 1.5 +
            body * Math.exp(-t * 9) * 2 +
            Math.sin(2 * Math.PI * (72 * t + 8 * (1 - Math.exp(-t * 25)))) *
              Math.exp(-t * 23) *
              0.5 +
            r * Math.exp(-t * 160) * 0.4;
        else if (name === "explosion")
          v =
            body * Math.exp(-t * 5) * 5 +
            lp * Math.exp(-t * 9) * 1.7 +
            Math.sin(2 * Math.PI * 46 * t) * Math.exp(-t * 14) * 0.45 +
            r * Math.exp(-t * 90) * 0.25;
        else if (name === "kick") {
          phase += (2 * Math.PI * (48 + 130 * Math.exp(-t * 45))) / sr;
          v = Math.sin(phase) * Math.exp(-t * 21) + r * Math.exp(-t * 250) * 0.12;
        } else if (name === "snare")
          v =
            (r - body) * Math.exp(-t * 28) * 0.7 +
            Math.sin(2 * Math.PI * 178 * t) * Math.exp(-t * 45) * 0.42;
        else if (name === "hat" || name === "openhat")
          v = (r - metal) * Math.exp(-t * (name === "hat" ? 100 : 25)) * 0.7;
        else if (name === "laser")
          v =
            (r - lp) * Math.exp(-t * 75) * 0.6 +
            Math.sin(2 * Math.PI * (460 * t + 12 * (1 - Math.exp(-t * 40)))) *
              Math.exp(-t * 52) *
              0.25;
        else if (name === "crystal")
          v =
            (Math.sin(2 * Math.PI * 1120 * t) +
              0.55 * Math.sin(2 * Math.PI * 1773 * t) +
              0.3 * Math.sin(2 * Math.PI * 2390 * t)) *
              Math.exp(-t * 14) *
              0.18 +
            (r - lp) * Math.exp(-t * 90) * 0.24;
        else if (name === "sonic")
          v =
            (Math.sin(2 * Math.PI * (165 * t - 22 * t * t)) * 0.5 +
              Math.sin(2 * Math.PI * 330 * t) * 0.18 +
              lp * 0.3) *
            Math.exp(-t * 5) *
            Math.sin((Math.min(1, t * 14) * Math.PI) / 2);
        else if (name === "firework")
          v =
            (r - lp) * Math.exp(-t * 8) * 0.35 +
            body * Math.exp(-t * 6) * 1.5 +
            Math.sin(2 * Math.PI * (180 * t + 200 * t * t)) * Math.exp(-t * 14) * 0.15;
        else if (name === "slice")
          v =
            (r - lp) * Math.exp(-t * 28) * 0.7 +
            Math.sin(2 * Math.PI * (2300 * t - 2700 * t * t)) * Math.exp(-t * 35) * 0.1;
        else if (name === "boomerang")
          v =
            (lp - body) * Math.exp(-t * 12) * Math.sin(t * 85) * 2 +
            (r - lp) * Math.exp(-t * 50) * 0.1;
        else if (name === "vortex")
          v =
            (lp - body) * Math.exp(-t * 7) * 2 +
            Math.sin(2 * Math.PI * (110 * t - 40 * t * t)) * Math.exp(-t * 9) * 0.2;
        else if (name === "ice")
          v =
            (r - lp) * Math.exp(-t * 32) * 0.6 +
            Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 45) * 0.13;
        else if (name === "machine")
          v =
            (r - lp) * Math.exp(-t * 150) * 0.5 +
            lp * Math.exp(-t * 45) * 1.7 +
            Math.sin(2 * Math.PI * 140 * t) * Math.exp(-t * 52) * 0.3;
        else if (name === "ui")
          v = (r - lp) * Math.exp(-t * 200) * 0.3 + lp * Math.exp(-t * 85) * 0.6;
        else
          v =
            lp * Math.exp(-t * 52) * 0.7 +
            Math.sin(2 * Math.PI * 210 * t) * Math.exp(-t * 65) * 0.2;
        out[i] = v * Math.min(1, t / 0.0004);
      }
      if (["basic", "sniper", "cannon", "explosion"].includes(name)) {
        const dry = out.slice();
        const echoes =
          name === "basic"
            ? [
                [0.029, 0.12],
                [0.067, 0.06],
              ]
            : [
                [0.043, 0.18],
                [0.091, 0.11],
                [0.17, 0.055],
              ];
        for (const [delay, gain] of echoes) {
          const off = Math.floor(delay * sr);
          for (let i = off; i < n; i++) out[i] += dry[i - off] * gain;
        }
      }
      let peak = 0.001;
      for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
      for (let i = 0; i < n; i++) out[i] = (out[i] / peak) * 0.82;
      return buf;
    },
    unlock() {
      if (!this.init()) return;
      if (this.ctx.state === "suspended") this.ctx.resume();
    },
    startMusic() {
      this.unlock();
      this.started = true;
      if (this.ctx && this.next < this.ctx.currentTime) this.next = this.ctx.currentTime + 0.05;
    },
    playBuffer(name, time, gain, bus, pan = 0, rate = 1) {
      const s = this.ctx.createBufferSource(),
        g = this.ctx.createGain();
      s.buffer = this.buffers[name];
      s.playbackRate.value = rate;
      g.gain.value = gain * (bus === this.musicBus ? this.arrangeMix(name) : 1);
      s.connect(g);
      if (pan && this.ctx.createStereoPanner) {
        const p = this.ctx.createStereoPanner();
        p.pan.value = pan;
        g.connect(p);
        p.connect(bus);
      } else g.connect(bus);
      s.start(time);
      return s;
    },
    effect(name, x = 0.5) {
      if (!this.sfxEnabled) return;
      this.unlock();
      if (!this.ctx || this.ctx.state !== "running" || this.voices >= 30) return;
      this.voices++;
      const gain =
        {
          basic: 0.33,
          laser: 0.16,
          crystal: 0.26,
          sonic: 0.34,
          slice: 0.17,
          boomerang: 0.18,
          vortex: 0.23,
          ice: 0.13,
          machine: 0.15,
          firework: 0.3,
          sniper: 0.6,
          cannon: 0.5,
          explosion: 0.48,
          impact: 0.45,
          ui: 0.19,
          build: 0.22,
        }[name] || 0.2;
      const s = this.playBuffer(
        name,
        this.ctx.currentTime,
        gain,
        this.sfxBus,
        (x - 0.5) * 0.8,
        0.94 + Math.random() * 0.12,
      );
      s.onended = () => this.voices--;
      this.played[name] = (this.played[name] || 0) + 1;
    },
    tone(midi, time, duration, gain, type = "bass", cutoff = 1100) {
      gain *= this.arrangeMix(type);
      const ctx = this.ctx,
        freq = 440 * Math.pow(2, (midi - 69) / 12),
        env = ctx.createGain(),
        filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = type === "bass" ? 2 : 1;
      filter.frequency.setValueAtTime(cutoff, time);
      filter.frequency.exponentialRampToValueAtTime(200, time + duration);
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(gain, time + (type === "pad" ? 0.12 : 0.004));
      env.gain.setValueAtTime(gain * 0.72, time + duration * 0.65);
      env.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = i / 127.5 - 1;
        curve[i] = Math.tanh(x * 2.2);
      }
      shaper.curve = curve;
      filter.connect(shaper);
      shaper.connect(env);
      env.connect(this.musicBus);
      for (const detune of [-6, 6]) {
        const o = ctx.createOscillator();
        o.type =
          type === "bell" || type === "pad" ? "sine" : type === "pluck" ? "triangle" : "sawtooth";
        o.frequency.value = freq;
        o.detune.value = detune;
        o.connect(filter);
        o.start(time);
        o.stop(time + duration + 0.01);
      }
      if (type === "bass") {
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = freq / 2;
        g.gain.value = 0.45;
        o.connect(g);
        g.connect(env);
        o.start(time);
        o.stop(time + duration + 0.01);
      }
    },
    musicBPM() {
      const p = this.themes[this.mapIndex || 0];
      return this.bossMode ? p.bossBpm : p.bpm;
    },
    setMap(index) {
      this.mapIndex = index;
      this.bossMode = false;
      this.step = 0;
      if (this.ctx) {
        const t = this.ctx.currentTime;
        this.next = t + 0.14;
        this.musicBus.gain.cancelScheduledValues(t);
        this.musicBus.gain.setTargetAtTime(0, t, 0.025);
        this.musicBus.gain.setTargetAtTime(this.musicEnabled ? 0.58 : 0, t + 0.12, 0.12);
      }
    },
    composeMapStep(index, time) {
      const b = index % 16,
        bar = Math.floor(index / 16) % 32,
        boss = this.bossMode,
        step = 60 / this.musicBPM() / 4,
        breakdown = !boss && bar >= 24 && bar < 28,
        fill = bar % 8 === 7;
      const drum = (name, gain, pan = 0, rate = 1) =>
        this.playBuffer(name, time, gain, this.musicBus, pan, rate);
      if (this.mapIndex === 4) {
        // SKYBOUND: airy suspended hook, liquid breaks; the storm adds a harder syncopated bass.
        const root = [38, 41, 34, 36][Math.floor(bar / 2) % 4];
        if (!breakdown && [0, 6, 10, ...(boss ? [3, 14] : [])].includes(b))
          drum("kick", boss ? 0.83 : 0.72);
        if (!breakdown && [4, 12].includes(b)) drum("snare", boss ? 0.6 : 0.46, 0, 1.08);
        if (!breakdown && (b % 2 === 0 || boss))
          drum("hat", b % 2 ? 0.08 : 0.15, Math.sin(b) * 0.45, 1.3);
        const bass = [0, null, 0, 12, null, 7, 0, null, 0, 12, null, 10, 7, null, 0, 7];
        if (bass[b] !== null)
          this.tone(root - 12 + bass[b], time, step * 1.5, 0.078, "bass", boss ? 1800 : 950);
        const hook = [12, 19, 22, 24, 19, 17, 14, 19];
        if (b % 2 === 0)
          this.tone(
            root + hook[(b / 2 + Math.floor(bar / 2)) % 8],
            time,
            step * 2.7,
            0.035,
            "bell",
            4200,
          );
        if (b === 0)
          for (const n of [0, 7, 14]) this.tone(root + 12 + n, time, step * 14, 0.014, "pad", 2200);
        if (boss && [3, 7, 11, 15].includes(b))
          this.tone(root + 24 + [0, 1, 7, 10][b >> 2], time, step * 1.4, 0.03, "lead", 3200);
        if (fill && b >= 12) drum("snare", 0.14 + (b - 12) * 0.025, (b - 13.5) * 0.22);
      } else if (this.mapIndex === 1) {
        // FURNACE HEART: heavy four-on-floor, Phrygian ostinato, metallic syncopation.
        const root = [33, 33, 34, 29][Math.floor(bar / 2) % 4];
        if ((!breakdown && b % 4 === 0) || (boss && [3, 10, 15].includes(b)))
          drum("kick", 0.88, 0, 0.88);
        if (!breakdown && [4, 12].includes(b)) drum("snare", 0.44, 0, 0.78);
        if (!breakdown && b % 2 === 0)
          drum(b % 4 === 2 ? "openhat" : "hat", 0.17, ((b % 4) - 1.5) * 0.18, 0.82);
        const riff = [0, null, 0, 12, 0, 1, null, 7, 0, null, 0, 13, 0, 7, 1, null];
        if (riff[b] !== null && (!breakdown || b % 4 === 0))
          this.tone(root + riff[b], time, step * 1.2, 0.095, "bass", 700 + (b % 4) * 350);
        if ([2, 6, 10, 14].includes(b) && bar >= 2)
          this.tone(
            root + 24 + [0, 1, 7, 8][(((b / 4) | 0) + (bar % 2)) & 3],
            time,
            step * 1.7,
            0.036,
            "pluck",
            2600,
          );
        if (b === 0 && bar % 2 === 0)
          for (const n of [0, 7, 13]) this.tone(root + 24 + n, time, step * 6, 0.015, "pad", 1400);
        if ((fill || boss) && b >= 13) drum("cannon", 0.1, (b - 14) * 0.25, 1.2 + (b - 13) * 0.14);
      } else if (this.mapIndex === 2) {
        // VERDANT COIL: suspended chords, bright bell arpeggios, broken drums.
        const root = [45, 41, 48, 43][Math.floor(bar / 2) % 4];
        if (!breakdown && [0, 6, 10].includes(b)) drum("kick", 0.7);
        if (!breakdown && [4, 12].includes(b)) drum("snare", 0.4, 0, 1.12);
        if (!breakdown && (b % 2 === 0 || boss))
          drum("hat", b % 4 === 2 ? 0.18 : 0.1, ((b % 4) - 1.5) * 0.35, 1.3);
        const bass = [0, null, 7, null, 0, null, 10, 7, 0, null, 12, null, 7, null, 3, null];
        if (bass[b] !== null) this.tone(root - 12 + bass[b], time, step * 1.6, 0.07, "bass", 800);
        if (b % 2 === 0) {
          const arp = [0, 7, 10, 14, 12, 7, 3, 10];
          this.tone(root + 12 + arp[(b / 2 + bar) % 8], time, step * 3.2, 0.034, "bell", 3800);
        }
        if (b === 0)
          for (const n of [0, 3, 7, 14]) this.tone(root + n, time, step * 13, 0.012, "pad", 1500);
        if (boss && [3, 7, 11, 15].includes(b))
          this.tone(root + 24 + [0, 3, 7, 10][b >> 2], time, step * 0.8, 0.029, "lead", 3200);
        if (fill && b > 12) drum("snare", 0.17, (b - 14) * 0.2, 1.1);
      } else {
        // EVENT HORIZON: fast DnB breaks, rolling sub, wide neon arpeggios.
        const root = [30, 33, 26, 28][Math.floor(bar / 2) % 4];
        if (!breakdown && ([0, 7, 10].includes(b) || (boss && [3, 14].includes(b))))
          drum("kick", 0.8);
        if (!breakdown && [4, 12].includes(b)) drum("snare", 0.62);
        if (!breakdown)
          drum(b === 14 ? "openhat" : "hat", b % 2 ? 0.095 : 0.19, ((b % 4) - 1.5) * 0.23, 1.15);
        const roll = [0, 0, 12, null, 7, 0, 10, 0, 0, 12, 0, null, 7, 10, 0, 12];
        if (roll[b] !== null && (!breakdown || b % 4 === 0))
          this.tone(root + roll[b], time, step * 0.85, 0.09, "bass", 1100 + (b % 4) * 450);
        if (b % 2 === 0 || boss) {
          const arp = [0, 7, 12, 15, 19, 15, 12, 7];
          this.tone(root + 36 + arp[(b + bar) % 8], time, step * 1.7, 0.024, "pluck", 4000);
        }
        if (b === 0 && bar % 2 === 0)
          for (const n of [0, 3, 7]) this.tone(root + 24 + n, time, step * 14, 0.013, "pad", 1900);
        if (fill && b >= 13) drum("snare", 0.15 + (b - 13) * 0.045, (b - 14) * 0.25, 1);
      }
    },
    setBoss(on) {
      if (this.bossMode === on) return;
      this.bossMode = on;
      this.step = 0;
      if (this.ctx) {
        const t = this.ctx.currentTime;
        this.next = t + 0.12;
        this.musicBus.gain.cancelScheduledValues(t);
        this.musicBus.gain.setTargetAtTime(0, t, 0.025);
        this.musicBus.gain.setTargetAtTime(this.musicEnabled ? 0.58 : 0, t + 0.1, 0.1);
      }
    },
    composeBossStep(index, time) {
      // CRYSTAL SIEGE: 184 BPM, double-time breaks and dissonant minor-seconds.
      const b = index % 16,
        bar = Math.floor(index / 16) % 16,
        step = 60 / 184 / 4;
      const root = [34, 34, 35, 31][Math.floor(bar / 2) % 4];
      if ([0, 3, 6, 8, 10, 14].includes(b)) this.playBuffer("kick", time, 0.86, this.musicBus);
      if ([4, 12].includes(b) || (bar % 4 === 3 && b >= 13))
        this.playBuffer("snare", time, b === 4 || b === 12 ? 0.65 : 0.28, this.musicBus);
      this.playBuffer(
        b === 14 ? "openhat" : "hat",
        time,
        b % 2 ? 0.17 : 0.24,
        this.musicBus,
        ((b % 4) - 1.5) * 0.2,
      );
      const riff = [0, 12, 0, 1, 0, 7, 0, 13, 0, 0, 12, 1, 0, 7, 13, 7];
      this.tone(root + riff[b], time, step * 0.85, 0.105, "bass", 1100 + (b % 4) * 600);
      if (b % 2 === 0) {
        const melody = [0, 1, 7, 6, 12, 13, 7, 1];
        this.tone(root + 36 + melody[(b / 2 + bar) % 8], time, step * 1.3, 0.032, "lead", 4200);
      }
      if (bar % 4 === 3 && b >= 12)
        this.playBuffer(
          "crystal",
          time,
          0.13,
          this.musicBus,
          (b - 13.5) * 0.25,
          0.75 + (b - 12) * 0.12,
        );
    },
    composeCoreStep(index, time) {
      if (this.mapIndex > 0) {
        this.composeMapStep(index, time);
        return;
      }
      if (this.bossMode) {
        this.composeBossStep(index, time);
        return;
      }
      const s = index % (16 * 32),
        bar = Math.floor(s / 16),
        b = s % 16,
        root = [38, 38, 34, 36][Math.floor(bar / 2) % 4];
      const breakDown = bar >= 24 && bar < 28,
        fill = bar % 8 === 7;
      if (!breakDown || b === 0) {
        if ([0, 6, 8, 11].includes(b) || (fill && b === 14))
          this.playBuffer("kick", time, 0.83, this.musicBus);
        if (b === 4 || b === 12) this.playBuffer("snare", time, 0.58, this.musicBus);
      }
      if (!breakDown) {
        this.playBuffer(
          b === 14 ? "openhat" : "hat",
          time,
          b % 2 ? 0.12 : 0.21,
          this.musicBus,
          ((b % 4) - 1.5) * 0.17,
        );
        if (fill && b >= 12) this.playBuffer("snare", time, 0.16 + (b - 12) * 0.07, this.musicBus);
      }
      const riff = [0, 0, 12, null, 0, 7, 0, 10, 0, null, 12, 0, 7, 0, 10, 7],
        note = riff[b];
      if (note !== null && (!breakDown || b % 4 === 0))
        this.tone(
          root + note,
          time,
          STEP * (b % 4 === 0 ? 1.7 : 0.72),
          breakDown ? 0.065 : 0.12,
          "bass",
          650 + (b % 4) * 330,
        );
      if (bar >= 4 && [0, 3, 6, 10, 12, 14].includes(b)) {
        const melody = [74, 77, 81, 79, 77, 72, 74, 69];
        let pitch = melody[(Math.floor(b / 2) + Math.floor(bar / 2)) % 8];
        this.tone(pitch, time, STEP * 1.4, breakDown ? 0.028 : 0.047, "lead", 2600);
      }
      if (bar % 8 === 7 && b >= 14) this.playBuffer("openhat", time, 0.3, this.musicBus);
    },
    arrangeMix() {
      return 1;
    },
    composeStep(index, time) {
      this.composeCoreStep(index % (16 * 32), time);
    },
    schedule() {
      if (!this.ctx || this.ctx.state !== "running" || !this.started || !this.musicEnabled) return;
      const now = this.ctx.currentTime;
      if (this.next < now - 0.2) this.next = now + 0.03;
      while (this.next < now + 0.12) {
        this.composeStep(this.step, this.next);
        this.step++;
        this.next += 60 / this.musicBPM() / 4;
      }
    },
    toggleMusic() {
      this.musicEnabled = !this.musicEnabled;
      this.unlock();
      this.musicBus.gain.setTargetAtTime(this.musicEnabled ? 0.58 : 0, this.ctx.currentTime, 0.04);
      if (this.musicEnabled) this.next = this.ctx.currentTime + 0.05;
    },
    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      this.unlock();
      this.sfxBus.gain.setTargetAtTime(this.sfxEnabled ? 0.8 : 0, this.ctx.currentTime, 0.04);
    },
    status() {
      return {
        state: this.ctx?.state,
        music: this.musicEnabled,
        sfx: this.sfxEnabled,
        started: this.started,
        steps: this.step,
        totalBars: BARS,
        section: Math.floor(this.step / 16) % BARS,
        voices: this.voices,
        played: { ...this.played },
        bpm: this.musicBPM(),
        track: this.bossMode ? this.themes[this.mapIndex].boss : this.themes[this.mapIndex].name,
      };
    },
    async renderTrack(boss = false, mapIndex = this.mapIndex, bars = BARS) {
      // Capture the same score events, then cache/mix PCM voices. This avoids keeping thousands
      // of simultaneous OfflineAudioContext oscillator graphs alive for a three-minute export.
      const sr = 32000,
        theme = this.themes[mapIndex],
        step = 60 / (boss ? theme.bossBpm : theme.bpm) / 4;
      const out = new Float32Array(Math.ceil((bars * 16 * step + 2) * sr)),
        events = [],
        score = Object.create(this);
      score.mapIndex = mapIndex;
      score.bossMode = boss;
      score.musicBus = {};
      score.playBuffer = function (name, time, gain, bus, pan = 0, rate = 1) {
        events.push({ name, time, gain: gain * this.arrangeMix(name), rate });
      };
      score.tone = function (midi, time, duration, gain, type = "bass", cutoff = 1100) {
        events.push({ midi, time, duration, gain: gain * this.arrangeMix(type), type, cutoff });
      };
      for (let i = 0; i < bars * 16; i++) score.composeStep(i, i * step);
      const maker = Object.create(this);
      maker.ctx = {
        sampleRate: sr,
        createBuffer: (_c, n) => {
          const data = new Float32Array(n);
          return { getChannelData: () => data };
        },
      };
      const drums = {},
        cache = new Map();
      for (const e of events) {
        let data;
        if (e.name) {
          drums[e.name] ??= maker.makeBuffer(e.name).getChannelData(0);
          data = drums[e.name];
        } else {
          const key = [e.midi, e.duration.toFixed(4), e.type, e.cutoff].join(":");
          data = cache.get(key);
          if (!data) {
            const n = Math.ceil(e.duration * sr);
            data = new Float32Array(n);
            const f = 440 * 2 ** ((e.midi - 69) / 12);
            let low = 0,
              low2 = 0,
              coef = 0.1;
            for (let j = 0; j < n; j++) {
              const t = j / sr,
                u = j / n;
              if (j % 64 === 0)
                coef = 1 - Math.exp((-2 * Math.PI * (e.cutoff * (200 / e.cutoff) ** u)) / sr);
              let v = 0;
              for (const detune of [-6, 6]) {
                const phase = f * 2 ** (detune / 1200) * t;
                v +=
                  e.type === "bell" || e.type === "pad"
                    ? Math.sin(2 * Math.PI * phase)
                    : e.type === "pluck"
                      ? (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * phase))
                      : 2 * (phase - Math.floor(phase + 0.5));
              }
              low += (v - low) * coef;
              low2 += (low - low2) * coef;
              const attack = e.type === "pad" ? 0.12 : 0.004,
                env =
                  t < attack
                    ? t / attack
                    : u < 0.65
                      ? 1 - ((u - 0.02) / 0.63) * 0.28
                      : 0.72 * (0.0001 / 0.72) ** ((u - 0.65) / 0.35);
              data[j] =
                (Math.tanh(low2 * 2.2) +
                  (e.type === "bass" ? Math.sin(Math.PI * f * t) * 0.45 : 0)) *
                Math.max(0, env);
            }
            cache.set(key, data);
          }
        }
        const start = Math.round(e.time * sr),
          rate = e.rate || 1,
          n = Math.min(out.length - start, Math.ceil(data.length / rate));
        for (let j = 0; j < n; j++) {
          const at = j * rate,
            a = Math.floor(at),
            f = at - a;
          out[start + j] += ((data[a] || 0) * (1 - f) + (data[a + 1] || 0) * f) * e.gain;
        }
      }
      const dry = out.slice(),
        delay = Math.round(0.238 * sr);
      let damp = 0;
      for (let i = 0; i < out.length; i++) {
        damp += ((i >= delay ? dry[i - delay] + out[i - delay] * 0.24 : 0) - damp) * 0.376;
        out[i] = dry[i] + damp * 0.13;
      }
      for (let i = 0; i < out.length; i++) out[i] = Math.tanh(out[i] * 0.72 * 0.58) * 0.95;
      return { samples: out, sampleRate: sr };
    },
  };
  window.VectorAudio = audio;
})();
