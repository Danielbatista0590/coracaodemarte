// Sons e música feitos por código (Web Audio) — nenhum arquivo de áudio é necessário.
const SOM = (() => {
  let ctx = null, mestre = null, musicaGanho = null, musicaTimer = null, mudo = false;
  try { mudo = localStorage.getItem('cdm_mudo') === '1'; } catch (e) {}

  function iniciar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    mestre = ctx.createGain(); mestre.gain.value = mudo ? 0 : 0.5; mestre.connect(ctx.destination);
    musicaGanho = ctx.createGain(); musicaGanho.gain.value = 0.22; musicaGanho.connect(mestre);
  }

  // ---- blocos básicos
  function tom({ tipo = 'square', de = 440, ate = de, dur = 0.15, vol = 0.3, atraso = 0, saida = mestre }) {
    if (!ctx) return;
    const t = ctx.currentTime + atraso;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(de, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, ate), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(saida);
    o.start(t); o.stop(t + dur + 0.02);
  }
  let bufRuido = null;
  function ruido({ dur = 0.2, vol = 0.3, filtro = 'lowpass', de = 2000, ate = de, q = 1, atraso = 0 }) {
    if (!ctx) return;
    if (!bufRuido) {
      bufRuido = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = bufRuido.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = ctx.currentTime + atraso;
    const s = ctx.createBufferSource(); s.buffer = bufRuido;
    const f = ctx.createBiquadFilter(); f.type = filtro; f.Q.value = q;
    f.frequency.setValueAtTime(de, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, ate), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(mestre);
    s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }

  // ---- efeitos do jogo
  const efeitos = {
    pulo:       () => tom({ de: 300, ate: 620, dur: 0.12, vol: 0.12 }),
    chinelada:  () => { ruido({ dur: 0.08, vol: 0.5, filtro: 'bandpass', de: 1800, ate: 900, q: 2 }); tom({ tipo: 'triangle', de: 220, ate: 120, dur: 0.06, vol: 0.3 }); },
    critico:    () => { efeitos.chinelada(); tom({ de: 880, ate: 1320, dur: 0.15, vol: 0.12, atraso: 0.05 }); },
    pedra:      () => tom({ tipo: 'triangle', de: 900, ate: 500, dur: 0.07, vol: 0.18 }),
    acerto:     () => tom({ tipo: 'square', de: 200, ate: 90, dur: 0.08, vol: 0.18 }),
    splort:     () => { ruido({ dur: 0.45, vol: 0.4, de: 1200, ate: 150, q: 4 }); tom({ tipo: 'sine', de: 300, ate: 60, dur: 0.5, vol: 0.35 }); },
    pum:        () => { ruido({ dur: 1.1, vol: 0.6, de: 220, ate: 80, q: 8 }); tom({ tipo: 'sawtooth', de: 70, ate: 45, dur: 1.0, vol: 0.25 }); tom({ tipo: 'sawtooth', de: 90, ate: 55, dur: 0.6, vol: 0.15, atraso: 0.2 }); },
    banana:     () => tom({ tipo: 'sine', de: 500, ate: 900, dur: 0.15, vol: 0.2 }),
    escorregar: () => { tom({ tipo: 'sine', de: 400, ate: 1400, dur: 0.25, vol: 0.25 }); tom({ tipo: 'sine', de: 1400, ate: 300, dur: 0.35, vol: 0.25, atraso: 0.25 }); },
    nhac:       () => { ruido({ dur: 0.1, vol: 0.5, de: 600, ate: 200 }); ruido({ dur: 0.1, vol: 0.5, de: 600, ate: 200, atraso: 0.14 }); tom({ tipo: 'square', de: 120, ate: 60, dur: 0.25, vol: 0.2 }); },
    pegou:      () => { tom({ tipo: 'sawtooth', de: 160, ate: 120, dur: 0.3, vol: 0.2 }); ruido({ dur: 0.3, vol: 0.25, de: 500, ate: 300 }); },
    escapou:    () => [523, 659, 784].forEach((f, i) => tom({ de: f, dur: 0.1, vol: 0.15, atraso: i * 0.07 })),
    dano:       () => tom({ tipo: 'square', de: 400, ate: 100, dur: 0.25, vol: 0.25 }),
    cambalhota: () => ruido({ dur: 0.3, vol: 0.25, filtro: 'bandpass', de: 400, ate: 2500, q: 1.5 }),
    bau:        () => [523, 659, 784, 1047].forEach((f, i) => tom({ tipo: 'triangle', de: f, dur: 0.15, vol: 0.2, atraso: i * 0.08 })),
    arma:       () => { tom({ de: 660, dur: 0.08, vol: 0.15 }); tom({ de: 990, dur: 0.12, vol: 0.15, atraso: 0.08 }); },
    chute:      () => { ruido({ dur: 0.06, vol: 0.5, de: 900, ate: 300 }); tom({ tipo: 'sine', de: 150, ate: 70, dur: 0.1, vol: 0.4 }); },
    gol:        () => { tom({ tipo: 'sine', de: 2200, ate: 2400, dur: 0.12, vol: 0.12 }); tom({ tipo: 'sine', de: 2200, ate: 2600, dur: 0.25, vol: 0.12, atraso: 0.15 }); },
    drone:      () => tom({ tipo: 'sawtooth', de: 180, ate: 260, dur: 0.5, vol: 0.08 }),
    explosao:   () => { ruido({ dur: 0.6, vol: 0.6, de: 3000, ate: 100 }); [1200, 1600, 2000, 2400].forEach((f, i) => tom({ tipo: 'sine', de: f, dur: 0.1, vol: 0.06, atraso: 0.1 + i * 0.06 })); },
    agua:       () => ruido({ dur: 0.35, vol: 0.2, filtro: 'highpass', de: 3000, ate: 5000 }),
    cuspe:      () => { tom({ tipo: 'sine', de: 600, ate: 200, dur: 0.12, vol: 0.18 }); ruido({ dur: 0.08, vol: 0.15, de: 2000, ate: 800 }); },
    bote:       () => tom({ tipo: 'sine', de: 180, ate: 420, dur: 0.2, vol: 0.2 }),
    tremor:     () => { ruido({ dur: 0.5, vol: 0.6, de: 300, ate: 60 }); tom({ tipo: 'sine', de: 70, ate: 35, dur: 0.5, vol: 0.5 }); },
    chefe:      () => { tom({ tipo: 'sawtooth', de: 90, ate: 60, dur: 1.0, vol: 0.3 }); tom({ tipo: 'sawtooth', de: 95, ate: 62, dur: 1.0, vol: 0.2 }); ruido({ dur: 1.0, vol: 0.3, de: 500, ate: 150 }); },
    vitoria:    () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tom({ de: f, dur: i === 5 ? 0.5 : 0.14, vol: 0.2, atraso: i * 0.13 })),
    derrota:    () => [392, 349, 311, 262].forEach((f, i) => tom({ tipo: 'triangle', de: f, dur: 0.3, vol: 0.2, atraso: i * 0.25 })),
    menu:       () => tom({ tipo: 'triangle', de: 700, dur: 0.06, vol: 0.15 }),
  };

  // ---- música: sequência em loop agendada no relógio do áudio
  const MUSICAS = {
    // caverna gosmenta: baixo saltitante + melodia curiosa
    fase1: { bpm: 112, baixo: [45, 0, 45, 52, 43, 0, 43, 50, 41, 0, 41, 48, 40, 0, 47, 40],
             melodia: [69, 0, 72, 0, 71, 69, 0, 67, 65, 0, 69, 0, 64, 0, 0, 0, 69, 0, 72, 76, 74, 72, 0, 71, 72, 0, 71, 0, 69, 0, 0, 0] },
    // fase 2: mais rápida e tensa
    fase2: { bpm: 128, baixo: [38, 38, 50, 38, 41, 41, 53, 41, 36, 36, 48, 36, 37, 37, 49, 37],
             melodia: [74, 0, 77, 74, 0, 72, 70, 0, 69, 0, 70, 72, 0, 0, 0, 0, 74, 0, 77, 79, 0, 77, 74, 0, 73, 0, 0, 74, 0, 0, 0, 0] },
    chefe: { bpm: 140, baixo: [33, 33, 45, 33, 33, 45, 34, 46, 33, 33, 45, 33, 36, 48, 35, 47],
             melodia: [57, 0, 60, 0, 59, 0, 57, 0, 64, 0, 63, 0, 60, 0, 59, 0] },
  };
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  let tocando = null;
  function musica(nome) {
    if (!ctx || tocando === nome) return;
    pararMusica(); tocando = nome;
    const m = MUSICAS[nome]; if (!m) return;
    const passo = 60 / m.bpm / 2; // colcheias
    let i = 0, proximo = ctx.currentTime + 0.1;
    musicaTimer = setInterval(() => {
      while (proximo < ctx.currentTime + 0.3) {
        const at = proximo - ctx.currentTime;
        const b = m.baixo[i % m.baixo.length];
        if (b) tom({ tipo: 'triangle', de: hz(b), dur: passo * 0.9, vol: 0.5, atraso: at, saida: musicaGanho });
        const n = m.melodia[i % m.melodia.length];
        if (n) tom({ tipo: 'square', de: hz(n), dur: passo * 0.8, vol: 0.12, atraso: at, saida: musicaGanho });
        if (i % 4 === 0) tom({ tipo: 'sine', de: 120, ate: 40, dur: 0.08, vol: 0.5, atraso: at, saida: musicaGanho }); // bumbo
        if (i % 4 === 2) tom({ tipo: 'square', de: 6000, ate: 5000, dur: 0.02, vol: 0.03, atraso: at, saida: musicaGanho }); // chimbal
        proximo += passo; i++;
      }
    }, 100);
  }
  function pararMusica() { if (musicaTimer) clearInterval(musicaTimer); musicaTimer = null; tocando = null; }

  return {
    iniciar,
    tocar(nome) { if (ctx && !mudo && efeitos[nome]) try { efeitos[nome](); } catch (e) {} },
    musica, pararMusica,
    alternarMudo() {
      mudo = !mudo;
      try { localStorage.setItem('cdm_mudo', mudo ? '1' : '0'); } catch (e) {}
      if (mestre) mestre.gain.value = mudo ? 0 : 0.5;
      return mudo;
    },
    get mudo() { return mudo; },
  };
})();
