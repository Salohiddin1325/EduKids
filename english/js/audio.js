/**
 * KiddoLingo - Audio Engine
 * 1. Web Audio API Sound Effects Synthesizer (No external mp3 dependencies, 100% reliable)
 * 2. Web Speech API (Native English Text-To-Speech with kid-friendly pitch & speed modes)
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.isTurtleMode = false; // Turtle slow mode for kids
    this.speechSynth = window.speechSynthesis || null;
    this.voices = [];
    this.preferredVoice = null;
    this.initAudioContext();
    this.loadVoices();

    if (this.speechSynth && this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = () => this.loadVoices();
    }
  }

  initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported on this browser', e);
    }
  }

  ensureContextRunning() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadVoices() {
    if (!this.speechSynth) return;
    this.voices = this.speechSynth.getVoices();
    // Prefer friendly, high-quality US or UK English voices
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    const naturalVoice = englishVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Zira') ||
      v.name.includes('Jenny')
    );
    this.preferredVoice = naturalVoice || englishVoices[0] || null;
  }

  toggleSound(enable) {
    this.soundEnabled = enable !== undefined ? enable : !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleTurtleMode(enable) {
    this.isTurtleMode = enable !== undefined ? enable : !this.isTurtleMode;
    return this.isTurtleMode;
  }

  // --- Web Audio Synthesizer Sounds ---

  playPop() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContextRunning();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      const now = this.audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (err) {
      console.error(err);
    }
  }

  playSuccess() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContextRunning();
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.audioCtx.currentTime;
      
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = now + idx * 0.09;
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (err) {
      console.error(err);
    }
  }

  playError() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContextRunning();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (err) {
      console.error(err);
    }
  }

  playSparkle() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContextRunning();
    try {
      const freqs = [784, 988, 1175, 1318, 1568, 1760];
      const now = this.audioCtx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (err) {
      console.error(err);
    }
  }

  playFlip() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContextRunning();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (err) {
      console.error(err);
    }
  }

  playFanfare() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContextRunning();
    try {
      const fanfare = [
        { f: 523.25, d: 0.12 }, // C
        { f: 523.25, d: 0.12 }, // C
        { f: 523.25, d: 0.12 }, // C
        { f: 659.25, d: 0.35 }, // E
        { f: 783.99, d: 0.35 }, // G
        { f: 1046.50, d: 0.6 }  // High C
      ];
      let t = this.audioCtx.currentTime;
      fanfare.forEach(n => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + n.d);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(t);
        osc.stop(t + n.d);
        t += n.d * 0.95;
      });
    } catch (err) {
      console.error(err);
    }
  }

  // --- Web Speech API Pronunciation ---

  speak(text, onStart, onEnd) {
    if (!this.speechSynth) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel current speech to prevent queue buildup
    this.speechSynth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    // Adjust rate for kids (slow turtle or cheerful normal)
    utterance.rate = this.isTurtleMode ? 0.72 : 0.95;
    utterance.pitch = 1.15; // friendly, higher pitch suited for kids!

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    };

    this.speechSynth.speak(utterance);
  }
}

// Global sound manager instance
window.soundEngine = new SoundEngine();
