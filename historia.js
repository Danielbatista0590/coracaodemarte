// História: cenas em quadros (estilo Heart of Darkness), Lucca e os hologramas da família.

// ---- Lucca (2 anos): cabelo cacheado dourado, camiseta cinza-escura e o copinho de amoras
const PIXEL_LUCCA = [
  '...HhHhHh.....',
  '..hHhhhhHh....',
  '.hhHhhhhhHh...',
  '.hHhssssshHh..',
  '.hhssssssshh..',
  '.hhsesssessh..',
  '.hhssssssssh..',
  '..hsssmmsssh..',
  '...ssssssss...',
  '....dsssd.....',
  '..yyyyyyyyy...',
  '.yyyyyyyyyyy..',
  'syyyyyyyyyyycc',
  'syyYYyyyyyysac',
  '.yyyyyyyyyy.cc',
  '..YYYYYYYYY...',
  '...ss...ss....',
  '...kk...kk....',
];
const PALETA_LUCCA = { h: 0xc9933f, H: 0xe8bd6a, s: 0xf2cfae, d: 0xd9b090, e: 0x2a1d14, m: 0xc0605a, y: 0x3d4148, Y: 0x2a2d33, c: 0xe6f0f5, a: 0x4a1238, k: 0x6b6b6b };

// ---- hologramas: mesmo desenho dos meninos, em azul, com um detalhe de cada um
const FAMILIA = {
  daniel: { nome: 'Papai Daniel', cor: '#6be4ff', detalhe: 'barba' },
  // Anne: cabelo na altura dos ombros com luzes, blusa florida e colar
  anne:   { nome: 'Mamãe Anne',   cor: '#ff9be8', detalhe: 'anne',
    pal: { h: 0x8a6038, H: 0xd9b47a, s: 0xe8c09a, d: 0xcfa27c, e: 0x2a1d14, m: 0xc0605a, w: 0xf2e8d2, W: 0xd9ccb0,
           f: 0xff8fb8, g: 0x3f9a4f, o: 0xf0a030, n: 0xffffff, j: 0x4a6fa0, J: 0x3a5a85, k: 0x8a5a3a } },
  ithalo: { nome: 'Primo Ithalo', cor: '#9bff9b', detalhe: 'bone' },
};

function gerarTexturasHistoria(cena) {
  if (cena.textures.exists('lucca')) return;
  const g = cena.add.graphics();
  const pintar = (linhas, pal, esc = 2) => linhas.forEach((l, y) => [...l].forEach((ch, x) => {
    if (pal[ch] !== undefined) g.fillStyle(pal[ch]).fillRect(x * esc, y * esc, esc, esc);
  }));
  pintar(PIXEL_LUCCA, PALETA_LUCCA); g.generateTexture('lucca', 28, 36).clear();

  // hologramas
  Object.entries(FAMILIA).forEach(([id, f]) => {
    const linhas = [...PIXEL_CORPO, ...PIXEL_PERNAS.parado].map(l => [...l]);
    if (f.detalhe === 'barba') { [5, 6, 7].forEach(y => { linhas[y][4] = 'h'; linhas[y][11] = 'h'; }); linhas[7][6] = linhas[7][7] = linhas[7][8] = linhas[7][9] = 'h'; }
    if (f.detalhe === 'anne') {
      for (let y = 1; y < 11; y++) { linhas[y][2] = y % 2 ? 'H' : 'h'; linhas[y][3] = 'h'; linhas[y][12] = 'h'; linhas[y][13] = y % 2 ? 'h' : 'H'; }
      [[5, 1], [7, 1], [9, 2]].forEach(([x, y]) => { linhas[y][x] = 'H'; });
      linhas[9][7] = linhas[9][8] = 'n'; linhas[10][6] = linhas[10][9] = 'n';        // colar
      const flores = [[5, 11, 'f'], [9, 11, 'g'], [6, 13, 'o'], [10, 13, 'f'], [4, 12, 'g'], [8, 14, 'f'], [5, 15, 'g'], [10, 15, 'o'], [7, 12, 'g']];
      flores.forEach(([x, y, c]) => { if (linhas[y][x] === 'w' || linhas[y][x] === 'W') linhas[y][x] = c; });
    }
    if (f.detalhe === 'bone') { for (let x = 3; x < 15; x++) linhas[2][x] = 'c'; linhas[3][13] = linhas[3][14] = 'c'; }
    const base = Phaser.Display.Color.HexStringToColor(f.cor).color;
    const pal = f.pal || { h: 0x1d5a7a, s: base, d: base, e: 0x0b2a3a, m: 0x0b2a3a, w: 0xffffff, W: base, j: base, J: 0x1d5a7a, k: 0x1d5a7a, o: 0xffffff, c: 0xffffff };
    pintar(linhas.map(l => l.join('')), pal);
    g.fillStyle(f.pal ? base : 0x000000, f.pal ? 0.18 : 0.25); for (let y = 0; y < 48; y += 4) g.fillRect(0, y, 32, 1); // linhas de holograma
    g.generateTexture('holo_' + id, 32, 48).clear();
  });

  // disco voador dos gosmentos
  g.fillStyle(0x9aa3b5).fillEllipse(60, 30, 120, 30).fillStyle(0x6b7385).fillEllipse(60, 36, 120, 16)
   .fillStyle(0x9dff4a, 0.8).fillEllipse(60, 16, 54, 34).fillStyle(0xe6ffd0, 0.7).fillEllipse(50, 10, 14, 8);
  [20, 45, 75, 100].forEach(x => g.fillStyle(0xffef5d).fillCircle(x, 33, 4));
  g.generateTexture('disco', 120, 46).clear();
  // nave esquecida (foguete velho)
  g.fillStyle(0xc0c6d0).fillRoundedRect(20, 20, 40, 90, 14).fillStyle(0xff5d73).fillTriangle(20, 30, 40, 0, 60, 30)
   .fillStyle(0xff5d73).fillTriangle(20, 80, 0, 115, 20, 110).fillTriangle(60, 80, 80, 115, 60, 110)
   .fillStyle(0x6bd1ff).fillCircle(40, 50, 10).fillStyle(0x8a5a2b, 0.6).fillRect(28, 70, 10, 6).fillRect(45, 88, 8, 5);
  g.generateTexture('foguete', 80, 116).clear();
  // frasco com a substância
  g.fillStyle(0xe6f4ff, 0.6).fillRect(8, 0, 8, 8).fillStyle(0xe6f4ff, 0.6).fillCircle(12, 20, 12).fillStyle(0x9dff4a).fillCircle(12, 22, 9)
   .fillStyle(0xffffff).fillCircle(9, 19, 2);
  g.generateTexture('frasco', 24, 32).clear();
  // Marte
  g.fillStyle(0xc1440e).fillCircle(60, 60, 60).fillStyle(0x9a330a).fillCircle(35, 45, 14).fillCircle(80, 80, 18).fillStyle(0xe2733a).fillCircle(70, 30, 9);
  g.generateTexture('marte', 120, 120).clear();
  // Terra
  g.fillStyle(0x2b6cd6).fillCircle(30, 30, 30).fillStyle(0x3fbf5f).fillCircle(20, 22, 10).fillCircle(40, 40, 12).fillCircle(38, 15, 6);
  g.generateTexture('terra', 60, 60).clear();
  // blocos de brinquedo 4 e 2
  [['4', 0xff5d73], ['2', 0x3fa9f5]].forEach(([n, c]) => { g.fillStyle(c).fillRect(0, 0, 40, 40).fillStyle(0xffffff, 0.3).fillRect(0, 0, 40, 6); g.generateTexture('bloquinho' + n, 40, 40).clear(); });
  // casa
  g.fillStyle(0xe8d9b5).fillRect(10, 60, 160, 100).fillStyle(0xb5442e).fillTriangle(0, 64, 90, 0, 180, 64)
   .fillStyle(0xffe9a0).fillRect(30, 85, 34, 30).fillRect(116, 85, 34, 30).fillStyle(0x7a4a2a).fillRect(75, 105, 30, 55);
  g.generateTexture('casa', 180, 160).clear();
  g.destroy();
}

// ---- roteiro das cenas
// cada quadro: fundo, montar(cena) para posicionar figuras, e o texto
const CENAS = {
  abertura: [
    { fundo: '#0b1030', montar: c => { c.ceu(); c.img('casa', 250, 330); c.img('theo', 520, 380, 2); c.img('nicolas', 590, 380, 2); c.img('lucca', 660, 388, 2); c.chao(0x2f6b2a); },
      texto: 'Theo, Nícolas e o pequeno Lucca são três irmãos que moram na Terra.' },
    { fundo: '#0b1030', montar: c => { c.ceu(); c.img('casa', 250, 330); c.flutuar(c.img('disco', 620, 110, 1.5)); c.img('theo', 520, 380, 2); c.img('nicolas', 590, 380, 2); c.img('lucca', 660, 388, 2); c.chao(0x2f6b2a); },
      texto: 'Um dia, alienígenas gosmentos vieram à Terra para sequestrar mentes brilhantes e roubar o conhecimento delas.' },
    { fundo: '#0b1030', montar: c => { c.ceu(); c.feixe(660, 140, 400); c.flutuar(c.img('disco', 660, 110, 1.5)); c.img('theo', 520, 380, 2); c.img('nicolas', 590, 380, 2); c.flutuar(c.img('lucca', 660, 330, 2)); c.chao(0x2f6b2a); },
      texto: 'E descobriram que no cérebro do Lucca está a resposta para a vida, o universo e tudo mais... mesmo ele ainda nem sabendo falar!' },
    { fundo: '#0b1030', montar: c => { c.ceu(); const d = c.img('disco', 660, 110, 1.5); c.tweens.add({ targets: d, x: 1100, y: 40, duration: 3000 }); c.img('theo', 480, 380, 2).setFlipX(false); c.img('nicolas', 400, 380, 2); c.chao(0x2f6b2a); c.balao('LUCCAAA!', 450, 300); },
      texto: 'Eles abduziram o Lucca! Theo e Nícolas saíram correndo atrás da nave!' },
  ],
  nave: [
    { fundo: '#1a2238', montar: c => { c.ceu(); c.img('foguete', 600, 330, 1.6); c.img('theo', 380, 380, 2); c.img('nicolas', 440, 380, 2); c.chao(0x6b5a2a); },
      texto: 'No fim do pasto, os gêmeos encontraram uma nave espacial velha e esquecida...' },
    { fundo: '#101820', montar: c => { [380, 480, 580].forEach((x, i) => c.flutuar(c.img('frasco', x, 260, 3), i * 200)); c.img('theo', 420, 400, 2); c.img('nicolas', 540, 400, 2); c.chao(0x3a3a5a); },
      texto: 'Lá dentro havia frascos de uma substância verde e borbulhante. Eles beberam tudo... e ganharam SUPERPODERES!' },
    { fundo: '#101820', montar: c => { c.img('nicolas', 330, 330, 2.5); c.img('banana', 400, 380, 2); c.img('theo', 630, 330, 2.5); c.nuvemPum(570, 380); c.chao(0x3a3a5a);
        c.legenda('Nícolas: pulo duplo e casca de banana', 330, 200, '#3fa9f5'); c.legenda('Theo: MEGA PUM (efeito colateral!)', 630, 200, '#ff9f1c'); c.legenda('Os dois: cambalhota (toque duplo para o lado)', 480, 440, '#ffffff'); },
      texto: 'Nícolas ganhou pulo duplo e a casca de banana. Theo ganhou... o mega pum. E os dois aprenderam a dar cambalhota!' },
    { fundo: '#06121f', montar: c => { ['daniel', 'anne', 'ithalo'].forEach((id, i) => { const h = c.img('holo_' + id, 300 + i * 180, 300, 3); h.setAlpha(0.85); c.tweens.add({ targets: h, alpha: 0.5, duration: 200, yoyo: true, repeat: -1, repeatDelay: 1500 + i * 300 }); c.legenda(FAMILIA[id].nome, 300 + i * 180, 400, FAMILIA[id].cor); }); },
      texto: 'O rádio da nave chiou e apareceram hologramas: papai Daniel, mamãe Anne e o primo Ithalo! "Nós vamos ajudar vocês daqui da Terra!"' },
    { fundo: '#02030a', montar: c => { c.ceu(); c.img('terra', 160, 380, 1.5); c.img('marte', 780, 160, 1.2); const f = c.img('foguete', 250, 330, 0.6).setAngle(60); c.tweens.add({ targets: f, x: 700, y: 200, duration: 3500 }); },
      texto: 'Os gêmeos ligaram a nave e seguiram o rastro dos gosmentos... rumo a MARTE!' },
  ],
  centro: [
    { fundo: '#2a0f08', montar: c => { c.chao(0xc1440e); c.img('theo', 380, 380, 2); c.img('nicolas', 450, 380, 2); c.buraco(700, 420); c.img('holo_ithalo', 230, 380, 2).setAlpha(0.8); c.balao('O sinal do Lucca vem lá de baixo!', 260, 290); },
      texto: 'Depois das cavernas, eles acharam um buraco gigante. O sinal do Lucca vem do centro de Marte. Hora de descer pela Torre da Nave-Mãe!' },
  ],
  nucleo: [
    { fundo: '#14081f', montar: c => { for (let i = 0; i < 8; i++) c.flutuar(c.img(Phaser.Utils.Array.GetRandom(['sombra', 'comedor', 'agarrador', 'saltador']), 120 + i * 100, 360 + (i % 2) * 30, 1.5), i * 150); },
      texto: 'No centro de Marte vive uma civilização maluca de gosmentos. Eles estão quase sendo extintos!' },
    { fundo: '#14081f', montar: c => { c.flutuar(c.img('cerebro', 480, 200, 3)); c.img('lucca', 480, 380, 2); c.bolha(480, 380); },
      texto: 'Por isso sequestram os seres mais inteligentes da galáxia. O Grande Cérebro Gosma acha que só o Lucca pode salvar o povo dele... e não quer devolver!' },
  ],
  final: [
    { fundo: '#14081f', montar: c => { c.img('cerebro', 480, 170, 2.5).setAlpha(0.9); c.img('theo', 380, 400, 2); c.img('nicolas', 580, 400, 2); c.img('lucca', 480, 388, 2); c.balao('Qual é a resposta para salvar nosso povo?', 480, 280); },
      texto: 'O Grande Cérebro, derrotado, perguntou ao Lucca: "Por favor... qual é a resposta para salvar nosso povo?"' },
    { fundo: '#14081f', montar: c => { c.img('lucca', 480, 368, 3); const a = c.img('bloquinho4', 400, 300, 1.5), b = c.img('bloquinho2', 560, 300, 1.5); [a, b].forEach((o, i) => { o.setAlpha(0); c.tweens.add({ targets: o, alpha: 1, y: 330, delay: 600 + i * 700, duration: 400 }); }); c.legenda('4', 400, 330, '#ffffff', 40); c.legenda('2', 560, 330, '#ffffff', 40); },
      texto: 'Lucca pegou seus bloquinhos de brinquedo e montou, com toda a calma do mundo... 42.' },
    { fundo: '#14081f', montar: c => { for (let i = 0; i < 7; i++) c.flutuar(c.img(Phaser.Utils.Array.GetRandom(['sombra', 'comedor', 'saltador']), 120 + i * 120, 360, 1.5), i * 100); c.img('cerebro', 480, 160, 2); c.balao('É ISSO!!!', 480, 260); c.legenda('Hã?', 200, 470, '#ffef5d'); c.legenda('Não entendi nada.', 760, 470, '#ffef5d'); },
      texto: '"É ISSO!!!" Os gosmentos choraram de alegria: a civilização deles estava salva! Theo e Nícolas se olharam... e não entenderam nada.' },
    { fundo: '#0b1030', montar: c => { c.ceu(); c.img('casa', 250, 330); c.img('theo', 470, 380, 2); c.img('nicolas', 530, 380, 2); c.img('lucca', 500, 388, 2);
        ['daniel', 'anne', 'ithalo'].forEach((id, i) => c.img('holo_' + id, 650 + i * 60, 380, 2).clearTint()); c.chao(0x2f6b2a); c.legenda('FIM', 480, 80, '#ffe14d', 48); },
      texto: 'Os gêmeos pegaram o Lucca de volta e voaram para casa, onde papai, mamãe e o primo Ithalo esperavam por eles. Obrigado por jogar!' },
  ],
};

class Cena extends Phaser.Scene {
  constructor() { super('Cena'); }
  init(data) { this.roteiro = CENAS[data.id] || []; this.depois = data.depois; this.i = -1; this.saindo = false; this.digitando = null; }

  create() {
    Fase.prototype.criarTexturas.call(this);
    gerarTexturasHistoria(this);
    SOM.pararMusica();
    this.camada = this.add.container(0, 0);
    this.caixa = this.add.rectangle(W / 2, H - 62, W - 40, 104, 0x000000, 0.75).setStrokeStyle(2, 0xffffff, 0.5).setDepth(10);
    this.txt = this.add.text(40, H - 104, '', { fontFamily: 'Arial', fontSize: 21, color: '#ffffff', wordWrap: { width: W - 80 }, lineSpacing: 4 }).setDepth(11);
    this.dica = this.add.text(W - 30, H - 22, '▶ toque / espaço', { fontFamily: 'Arial', fontSize: 13, color: '#aaaaaa' }).setOrigin(1, 0.5).setDepth(11);
    const pular = this.add.text(W - 16, 14, 'Pular ⏭', { fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff', backgroundColor: '#00000088', padding: { x: 10, y: 6 } })
      .setOrigin(1, 0).setDepth(12).setInteractive({ useHandCursor: true });
    pular.on('pointerdown', (p, x, y, ev) => { ev.stopPropagation(); this.terminar(); });
    this.input.on('pointerdown', () => this.avancar());
    this.input.keyboard.on('keydown-SPACE', () => this.avancar());
    this.input.keyboard.on('keydown-ENTER', () => this.avancar());
    this.input.keyboard.on('keydown-ESC', () => this.terminar());
    this.avancar();
  }

  avancar() {
    if (this.digitando) { this.digitando.remove(); this.digitando = null; this.txt.setText(this.textoAtual); return; }
    this.i++;
    if (this.i >= this.roteiro.length) { this.terminar(); return; }
    const q = this.roteiro[this.i];
    this.camada.removeAll(true);
    this.tweens.killAll();
    this.cameras.main.setBackgroundColor(q.fundo);
    q.montar(this);
    this.cameras.main.fadeIn(300);
    // texto letra por letra
    this.textoAtual = q.texto; this.txt.setText('');
    let n = 0;
    this.digitando = this.time.addEvent({ delay: 28, repeat: q.texto.length - 1, callback: () => {
      n++; this.txt.setText(q.texto.slice(0, n));
      if (n % 3 === 0) SOM.tocar('menu');
      if (n >= q.texto.length) this.digitando = null;
    } });
  }

  terminar() {
    if (this.saindo) return; this.saindo = true;
    const d = this.depois || { cena: 'Menu' };
    this.scene.start(d.cena, d.dados);
  }

  // ---- ajudantes de desenho
  img(chave, x, y, esc = 1) { const o = this.add.image(x, y, chave).setScale(esc); this.camada.add(o); return o; }
  ceu() { for (let i = 0; i < 60; i++) this.camada.add(this.add.circle(Phaser.Math.Between(0, W), Phaser.Math.Between(0, 300), Phaser.Math.Between(1, 2), 0xffffff, Math.random() * 0.8 + 0.2)); }
  chao(cor) { this.camada.add(this.add.rectangle(W / 2, 424, W, 16, cor)); }
  flutuar(o, atraso = 0) { this.tweens.add({ targets: o, y: o.y - 10, duration: 900, yoyo: true, repeat: -1, delay: atraso, ease: 'Sine.easeInOut' }); return o; }
  feixe(x, y1, y2) { const f = this.add.triangle(x, (y1 + y2) / 2, 0, 0, -60, y2 - y1, 60, y2 - y1, 0x9dff4a, 0.35); f.setOrigin(0.5, 0.5); this.camada.add(f); this.tweens.add({ targets: f, alpha: 0.15, duration: 300, yoyo: true, repeat: -1 }); }
  balao(t, x, y) { const b = this.add.text(x, y, t, { fontFamily: 'Arial Black', fontSize: 20, color: '#000000', backgroundColor: '#ffffff', padding: { x: 10, y: 6 } }).setOrigin(0.5); this.camada.add(b); return b; }
  legenda(t, x, y, cor = '#ffffff', tam = 18) { const l = this.add.text(x, y, t, { fontFamily: 'Arial Black', fontSize: tam, color: cor, stroke: '#000', strokeThickness: 4, align: 'center' }).setOrigin(0.5); this.camada.add(l); return l; }
  nuvemPum(x, y) { for (let i = 0; i < 6; i++) { const n = this.add.circle(x + Phaser.Math.Between(-30, 10), y + Phaser.Math.Between(-20, 20), Phaser.Math.Between(14, 26), 0x9bd94a, 0.5); this.camada.add(n); this.tweens.add({ targets: n, scale: 1.4, alpha: 0.2, duration: 800, yoyo: true, repeat: -1, delay: i * 120 }); } }
  buraco(x, y) { this.camada.add(this.add.ellipse(x, y, 260, 70, 0x000000)); this.camada.add(this.add.ellipse(x, y - 4, 230, 50, 0x1a0500)); }
  bolha(x, y) { const b = this.add.circle(x, y, 40, 0x6bd1ff, 0.25).setStrokeStyle(3, 0xbfeeff, 0.8); this.camada.add(b); this.tweens.add({ targets: b, scale: 1.08, duration: 700, yoyo: true, repeat: -1 }); }
}
