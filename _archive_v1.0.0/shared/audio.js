/**
 * KiddoEducation - Unified Core Audio & Speech Engine
 * Web Audio API Synthesizer (100% Offline, Zero external MP3 dependencies)
 * Features:
 * - Safe gain limiter (max gain <= 0.35 per CYBERSECURITY.md for child ear health)
 * - Complete sound effects suite: Pop, Correct/Success, Wrong/Error, Fanfare/Cheer,
 *   Coin/Collect, Flip, Sparkle, Boing, Bounce, MagnetSnap, Repel, Sizzle, Laser, Explosion
 * - Native Web Speech API Text-to-Speech (English & Uzbek, kid-friendly pitch & turtle slow mode)
 * - Backwards-compatible aliases: window.kiddoAudio, window.soundEngine, window.mathAudio, window.physicsAudio
 */

(function () {
  'use strict';

  class UnifiedKiddoAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.masterGain = null;
      this.soundEnabled = true;
      this.isTurtleMode = false;
      this.speechSynth = window.speechSynthesis || null;
      this.voices = [];
      this.preferredVoice = null;

      // Load sound state from storage if exists
      const savedSound = localStorage.getItem('kiddo_sound_enabled') ?? localStorage.getItem('kiddo_sound');
      if (savedSound !== null) {
        this.soundEnabled = savedSound === 'true';
      }

      // Load turtle mode from storage
      const savedTurtle = localStorage.getItem('kiddo_turtle');
      if (savedTurtle !== null) {
        this.isTurtleMode = savedTurtle === 'true';
      }

      this.initVoices();
    }

    getAudioContext() {
      if (!this.audioCtx) {
        try {
          const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
          if (AudioCtxClass) {
            this.audioCtx = new AudioCtxClass();
            this.masterGain = this.audioCtx.createGain();
            // Child-safe volume limiter: <= 0.35
            this.masterGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
            this.masterGain.connect(this.audioCtx.destination);
          }
        } catch (e) {
          console.warn('Web Audio API not supported on this browser', e);
        }
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      return this.audioCtx;
    }

    initVoices() {
      if (!this.speechSynth) return;
      this.loadVoices();
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => this.loadVoices();
      }
    }

    loadVoices() {
      if (!this.speechSynth) return;
      try {
        this.voices = this.speechSynth.getVoices() || [];
        if (!this.voices || this.voices.length === 0) return;

        const englishVoices = this.voices.filter(v => v.lang && (v.lang.startsWith('en') || v.lang.startsWith('EN')));
        // Priority 1: High-quality local offline voice
        const localNatural = englishVoices.find(v => v.localService && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny')));
        // Priority 2: Any local English voice
        const anyLocal = englishVoices.find(v => v.localService === true);
        // Priority 3: Default English voice
        const defaultVoice = englishVoices.find(v => v.default);
        // Priority 4: Any English voice
        this.preferredVoice = localNatural || anyLocal || defaultVoice || englishVoices[0] || null;
      } catch (e) {
        console.warn('Voice loading error', e);
      }
    }

    toggleSound(enable) {
      this.soundEnabled = enable !== undefined ? enable : !this.soundEnabled;
      localStorage.setItem('kiddo_sound_enabled', this.soundEnabled);
      localStorage.setItem('kiddo_sound', this.soundEnabled);
      localStorage.setItem('math_sound', this.soundEnabled);
      localStorage.setItem('physics_sound', this.soundEnabled);
      localStorage.setItem('kiddo_muted', !this.soundEnabled);

      if (!this.soundEnabled) {
        // Immediate silence when muted (Bez Zvuk)
        if (this.speechSynth) {
          try { this.speechSynth.cancel(); } catch (e) {}
        }
        if (this.masterGain && this.audioCtx) {
          try { this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime); } catch (e) {}
        }
      } else {
        // Restore child-safe volume limiter (<= 0.35)
        if (this.masterGain && this.audioCtx) {
          try { this.masterGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime); } catch (e) {}
        }
      }

      try {
        window.dispatchEvent(new CustomEvent('kiddo_sound_changed', { detail: { soundEnabled: this.soundEnabled } }));
      } catch (e) {}

      return this.soundEnabled;
    }

    toggleTurtleMode(enable) {
      this.isTurtleMode = enable !== undefined ? enable : !this.isTurtleMode;
      localStorage.setItem('kiddo_turtle', this.isTurtleMode);

      try {
        window.dispatchEvent(new CustomEvent('kiddo_turtle_changed', { detail: { isTurtleMode: this.isTurtleMode } }));
      } catch (e) {}

      return this.isTurtleMode;
    }

    // =========================================================================
    // UNIVERSAL SOUND EFFECTS (Synthesized via Web Audio API)
    // =========================================================================

    /** Friendly, gentle UI button pop */
    playPop() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

        gain.gain.setValueAtTime(0.30, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {}
    }

    /** Success / Correct Answer (Joyful ascending C5-E5-G5-C6 chord) */
    playCorrect() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.07;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.33);
        });
      } catch (e) {}
    }
    // Alias for compatibility
    playSuccess() { this.playCorrect(); }
    playDing() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.36);
      } catch (e) {}
    }

    /** Wrong / Error Answer (Soft non-scary low buzz) */
    playWrong() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.22);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.23);
      } catch (e) {}
    }
    // Aliases
    playError() { this.playWrong(); }
    playBuzzer() { this.playWrong(); }

    /** Victory Fanfare / Cheer (Level completed, high score) */
    playFanfare() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const melody = [
          { f: 523.25, d: 0.12 }, // C5
          { f: 523.25, d: 0.12 }, // C5
          { f: 523.25, d: 0.12 }, // C5
          { f: 659.25, d: 0.25 }, // E5
          { f: 783.99, d: 0.18 }, // G5
          { f: 1046.50, d: 0.45 } // C6
        ];

        let offset = 0;
        melody.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + offset;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, t);

          gain.gain.setValueAtTime(0.28, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + item.d + 0.05);

          offset += item.d * 0.9;
        });
      } catch (e) {}
    }
    playCheer() { this.playFanfare(); }

    /** Coin / Star Collected (Glittery high chime) */
    playCoin() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const notes = [987.77, 1318.51]; // B5, E6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.08;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.3);
        });
      } catch (e) {}
    }
    playCollect() { this.playCoin(); }

    /** Card Flip Swoosh */
    playFlip() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
      } catch (e) {}
    }

    /** Magic Sparkle Chimes */
    playSparkle() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const freqs = [1046.5, 1318.5, 1567.9, 2093.0];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * 0.04;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);

          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.22);
        });
      } catch (e) {}
    }

    /** Spring Boing */
    playBoing() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.15);
        osc.frequency.linearRampToValueAtTime(300, now + 0.25);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }

    /** Physics Gravity Bounce (Dull thud impact) */
    playBounce() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.16);
      } catch (e) {}
    }

    /** Physics Magnet Snap (Metallic click) */
    playMagnetSnap() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) {}
    }

    /** Physics Magnet Repel (Wobbly hum) */
    playRepel() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(260, now + 0.08);
        osc.frequency.linearRampToValueAtTime(160, now + 0.18);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {}
    }

    /** Physics Circuit Sizzle (Electric spark) */
    playSizzle() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.13);
      } catch (e) {}
    }

    /** Retro Laser Sound */
    playLaser() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    /** Cartoon Explosion Rumble */
    playExplosion() {
      if (!this.soundEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx || !this.masterGain) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.36);
      } catch (e) {}
    }

    // =========================================================================
    // NATIVE TEXT-TO-SPEECH (Web Speech API)
    // =========================================================================

    speak(text, langOrStart = 'en-US', callbackOrEnd = null) {
      if (!text) return;

      let targetLang = 'en-US';
      let doneCb = callbackOrEnd;

      if (typeof langOrStart === 'string' && langOrStart.trim()) {
        targetLang = langOrStart.trim();
      } else if (typeof langOrStart === 'function') {
        doneCb = langOrStart;
      }

      // CRITICAL: Respect Mute / Bez Zvuk Mode!
      if (!this.soundEnabled || localStorage.getItem('kiddo_sound') === 'false' || localStorage.getItem('kiddo_muted') === 'true') {
        if (typeof doneCb === 'function') doneCb();
        return;
      }

      if (!this.speechSynth) {
        if (typeof doneCb === 'function') doneCb();
        return;
      }

      try {
        // Resume synthesis if paused on mobile
        if (this.speechSynth.paused) {
          try { this.speechSynth.resume(); } catch (e) {}
        }

        // Cancel previous speaking to prevent queue lock
        if (this.speechSynth.speaking) {
          try { this.speechSynth.cancel(); } catch (e) {}
        }

        const utterance = new SpeechSynthesisUtterance(String(text));
        utterance.lang = targetLang;
        // Turtle Mode: 0.52 for slow, ultra-clear pronunciation; Normal: 0.92
        utterance.rate = this.isTurtleMode ? 0.52 : 0.92;
        utterance.pitch = 1.15; // Friendly, slightly higher kid-pitch
        utterance.volume = 1.0; // Maximum audible clarity

        if (this.preferredVoice && typeof targetLang === 'string' && targetLang.startsWith('en')) {
          try {
            utterance.voice = this.preferredVoice;
          } catch (e) {}
        }

        // Keep persistent reference to prevent GC on iOS Safari & Android Chrome
        window._activeUtteranceQueue = window._activeUtteranceQueue || [];
        window._activeUtteranceQueue.push(utterance);
        if (window._activeUtteranceQueue.length > 8) window._activeUtteranceQueue.shift();

        this.currentUtterance = utterance;

        let finished = false;
        const cleanup = () => {
          if (finished) return;
          finished = true;
          if (this.currentUtterance === utterance) {
            this.currentUtterance = null;
          }
          const idx = (window._activeUtteranceQueue || []).indexOf(utterance);
          if (idx > -1) window._activeUtteranceQueue.splice(idx, 1);
          if (typeof doneCb === 'function') {
            try { doneCb(); } catch (err) {}
          }
        };

        utterance.onend = cleanup;
        utterance.onerror = (err) => {
          console.warn('SpeechSynthesis utterance event warning:', err);
          cleanup();
        };

        // Safety watchdog if onend never fires (e.g. background tab or mobile sleep)
        const charDuration = this.isTurtleMode ? 160 : 90;
        const estimatedMs = Math.max(3000, String(text).length * charDuration);
        setTimeout(() => {
          if (!finished && this.currentUtterance === utterance) {
            cleanup();
          }
        }, estimatedMs);

        // Synchronous speak call for mobile interaction preservation
        this.speechSynth.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error', e);
        if (typeof doneCb === 'function') doneCb();
      }
    }
  }

  // Instantiate Single Global Master Audio Engine
  const masterAudio = new UnifiedKiddoAudioEngine();

  // Export as universal and backwards-compatible objects
  window.kiddoAudio = masterAudio;
  window.soundEngine = masterAudio;
  window.mathAudio = masterAudio;
  window.physicsAudio = masterAudio;
  window.EnglishAudio = masterAudio;
  window.UnifiedKiddoAudioEngine = UnifiedKiddoAudioEngine;

  // Mobile User Interaction Audio Unlocker (iOS Safari & Android Chrome)
  const primeMobileAudio = () => {
    try {
      if (masterAudio.getAudioContext) {
        const ctx = masterAudio.getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        // iOS Safari hardware unlock buffer
        if (ctx && !window._webAudioUnlocked) {
          window._webAudioUnlocked = true;
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
        }
      }
      if (window.speechSynthesis && window.speechSynthesis.paused) {
        try { window.speechSynthesis.resume(); } catch (e) {}
      }
    } catch (e) {}
    window.removeEventListener('pointerdown', primeMobileAudio);
    window.removeEventListener('touchstart', primeMobileAudio);
    window.removeEventListener('click', primeMobileAudio);
  };
  window.addEventListener('pointerdown', primeMobileAudio, { passive: true });
  window.addEventListener('touchstart', primeMobileAudio, { passive: true });
  window.addEventListener('click', primeMobileAudio, { passive: true });
})();
