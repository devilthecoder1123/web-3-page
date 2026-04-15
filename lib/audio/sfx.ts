"use client";

type AudioState = {
  enabled: boolean;
  ctx: AudioContext | null;
  master: GainNode | null;
};

const audioState: AudioState = {
  enabled: false,
  ctx: null,
  master: null,
};

function getCtx() {
  if (audioState.ctx) return audioState.ctx;
  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctx) return null;
  audioState.ctx = new Ctx();
  audioState.master = audioState.ctx.createGain();
  audioState.master.gain.value = 0.22;
  audioState.master.connect(audioState.ctx.destination);
  return audioState.ctx;
}

export function enableAudio() {
  audioState.enabled = true;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
}

export function isAudioEnabled() {
  return audioState.enabled;
}

export function setMasterVolume(v: number) {
  const ctx = getCtx();
  if (!ctx || !audioState.master) return;
  audioState.master.gain.value = Math.max(0, Math.min(1, v));
}

export function beep({ freq = 880, durationMs = 55 }: { freq?: number; durationMs?: number }) {
  if (!audioState.enabled) return;
  const ctx = getCtx();
  const master = audioState.master;
  if (!ctx || !master) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = freq;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.34, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.01);
}

export function glitchBurst({ durationMs = 160 }: { durationMs?: number }) {
  if (!audioState.enabled) return;
  const ctx = getCtx();
  const master = audioState.master;
  if (!ctx || !master) return;

  const bufferSize = Math.max(1, Math.floor((ctx.sampleRate * durationMs) / 1000));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    // clipped noise with a quick decay
    const t = i / data.length;
    const env = Math.pow(1 - t, 2.2);
    data[i] = (Math.random() * 2 - 1) * env * 0.55;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const biquad = ctx.createBiquadFilter();
  biquad.type = "bandpass";
  biquad.frequency.value = 1200;
  biquad.Q.value = 0.9;

  const gain = ctx.createGain();
  gain.gain.value = 0.55;

  src.connect(biquad);
  biquad.connect(gain);
  gain.connect(master);

  src.start();
}

