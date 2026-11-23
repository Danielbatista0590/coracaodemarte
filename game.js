// Coração de Marte — protótipo
// Nícolas e Theo contra os alienígenas gosmentos. Nada de sangue: os inimigos derretem!

const W = 960, H = 540, T = 32; // T = tamanho do bloco do mapa

// Mapa da fase (gerado por tools/mapa.py). Legenda:
// # bloco  - plataforma atravessável  H escada  P início  E saída  B chefe
// T baú com arma  g gosmento  v água-viva  c cuspidor  m comedor  a agarrador  (MAIÚSCULAS: só no "Quero a minha mãe!")
const MAPA = [
  '####################################################################################################',
  '#                                                                                                  #',
  '#                                                                                                  #',
  '#                                                                                                  #',
  '#                                                                                                  #',
  '#                                                                #                                 #',
  '#                                                                #                                 #',
  '#                                                                #                                 #',
  '#                                                                #                                 #',
  '#                                                                #                                 #',
  '#                                                 V              #                                 #',
  '#                                                                #                                 #',
  '#                                    v                           #         B                       #',
  '#                                                                #                               E #',
  '#                                                                 ##################-------#########',
  '#                                  T C                                                             #',
  '#                                 -------                                                          #',
  '#                                                                                    -------       #',
  '#                                                                                                  #',
  '#                     H       g         a       A c                                            T   #',
  '#                 ###-H-###################################                                ------- #',
  '#                     H                                                                            #',
  '#                     H                                                                            #',
  '#             ------  H     T                                                       -------        #',
  '#                     H   -------                                                                  #',
  '#                     H                                                                            #',
  '#        -------      H                                                         v           -------#',
  '#                     H             ---------                                                      #',
  '#                     H                                                                            #',
  '# -------             H                                                                  -------   #',
  '#           v         H                          c                                                 #',
  '#                     H                       ---------           H   T g             c            #',
  '#         -------     H                                         #-H-#####################          #',
  '#                     H                 G                         H                                #',
  '#                     H         ---------                         H                                #',
  '#  -------            H                                           H                                #',
  '#                     H                                           H                                #',
  '#                     H                   ---------               H                                #',
  '#          -------    H                                           H                                #',
  '#                     H                                           H                                #',
  '#                     H       ---------                           H                                #',
  '#   -------           H                                           H                                #',
  '#  P                  H                                           H                                #',
  '#       G     g  T    H            g         m         g    M  T  H        a         g      m  G   #',
  '####################################################################################################',
];

const MAPA_W = MAPA[0].length * T, MAPA_H = MAPA.length * T;
const TIPOS = { g: 'sombra', v: 'morcego', c: 'cuspidor', m: 'comedor', a: 'agarrador', b: 'chefao' };

// ---- personagens em pixel art (16x24, desenhado em dobro)
// h cabelo  s pele  d pele sombra  e olho  m boca  w camiseta  W camiseta sombra  j calça  J calça sombra  k tênis  o sola
const PIXEL_CORPO = [
  '....hhhhhhh.....',
  '...hhhhhhhhh....',
  '...hhhhhhhhhh...',
  '...hhsssssshh...',
  '...hssssesse....',
  '...dssssssss....',
  '....ssssmms.....',
  '.....ssssss.....',
  '......dsd.......',
  '....wwwwwwww....',
  '...wwwwwwwwww...',
  '..wwWwwwwwwWww..',
  '..sWwwwwwwwwWs..',
  '..s.wwwwwwww.s..',
  '..d.wwwwwwww.d..',
  '....wwwwwwww....',
  '....jjjjjjjj....',
  '....jjjjJjjj....',
];
const PIXEL_PERNAS = {
  parado: [
    '....jjj..jjj....',
    '....jjj..jjj....',
    '....jjJ..jJj....',
    '....jjj..jjj....',
    '...kkkk..kkkk...',
    '...oooo..oooo...',
  ],
  andando: [
    '...jjj....jjj...',
    '...jjj....jjj...',
    '..jjJ......jJj..',
    '..jjj......jjj..',
    '.kkkk......kkkk.',
    '.oooo......oooo.',
  ],
};

// pixel art dos alienígenas (gerado por tools/inimigos.py). "." = transparente
const INIMIGOS_PIXEL = {
  sombra: { pal: { g: 0x4fd16b, G: 0x2f9a4a, o: 0x174d26, l: 0xb8ffc6, w: 0xffffff, k: 0x111111 }, frames: [
    ['....................', '....................', '....................', '.......ooooo........', '......ogggggoo......', '.....ogggwwgggo.....', '.....ogggwkgggo.....', '....owwggggggwwo....', '...ogwkggggggwkgo...', '..oggggggggggggggo..', '..oggggggggggggggo..', '.oggggggggggggggggo.', '.oggggggggggggggggo.', '.oggggggggggggggggo.', '.oggggggggggggggggo.', '..oGGGGGGGGGGGGGGo..', '..oGGGGGGGGGGGGGGo..', '...oGGGGGGGGGGGGo...', '....oooGGGGGGooo....', '....g..oooooo..g....'],
    ['....................', '....................', '....................', '....................', '.......o............', '......ogooooo.......', '.....ogggwwggoo.....', '....oggggwkggggo....', '....owwggggggwwo....', '...ogwkggggggwkgo...', '..oggggggggggggggo..', '.oggggggggggggggggo.', 'oggggggggggggggggggo', 'oggggggggggggggggggo', 'oggggggggggggggggggo', 'oggggggggggggggggggo', '.oGGGGGGGGGGGGGGGGo.', '..oGGGGGGGGGGGGGGo..', '...oooGGGGGGGGooo...', '......oooooooo......'],
  ] },
  morcego: { pal: { g: 0x6bd1ff, G: 0x3b8fc4, o: 0x1c4a6b, l: 0xe0f6ff, w: 0xffffff, k: 0x111111 }, frames: [
    ['....................', '......oooooooo......', '....ooggggggggoo....', '...oggwwggggwwggo...', '..ogggwkggggwkgggo..', '.oggggggggggggggggo.', '.ooogoogooooogoogoo.', '....o..o.....o..o...', '...o....o...o....o..', '....o..o.....o..o...', '...o....o...o....o..', '....o..o.....o..o...', '...o....o...o....o..', '....................'],
    ['....................', '......oooooooo......', '....ooggggggggoo....', '...oggwwggggwwggo...', '..ogggwkggggwkgggo..', '.oggggggggggggggggo.', '.oogoooogooogoooogo.', '...o....o...o....o..', '....o..o.....o..o...', '...o....o...o....o..', '....o..o.....o..o...', '...o....o...o....o..', '....o..o.....o..o...', '....................'],
  ] },
  cuspidor: { pal: { g: 0x8a4fd1, o: 0x3a1a5e, l: 0xd9b8ff, s: 0xb6ff6b, k: 0x1a0a10 }, frames: [
    ['....................', '.......oooooo.......', '....oooggggggooo....', '...ogggggggllgggo...', '..oggllggggllggggo..', '..oggllggggggggggo..', '.oggggggllggggllggo.', '.oggggggllggggllggo.', '..ooooggggggggoooo..', '......osssssso......', '......osssssso......', '......osssssso......', '......osskksso......', '......oskkkkso......', '......oskkkkso......', '......osskksso......', '......osssssso......', '......osssssso......', '......osssssso......', '......oooooooo......'],
    ['....................', '.....oooooooooo.....', '...ooggggggggggoo...', '..oggggggggllggggo..', '.ogggllggggllgggggo.', '.ogggllgggggggggggo.', 'ogggggggllggggllgggo', 'ogggggggllggggllgggo', '.oooooggggggggooooo.', '......osssssso......', '......osssssso......', '......osskksso......', '......oskkkkso......', '......okkkkkko......', '......okkkkkko......', '......oskkkkso......', '......osskksso......', '......osssssso......', '......osssssso......', '......oooooooo......'],
  ] },
  comedor: { pal: { g: 0x3fbf5f, G: 0x2a8a43, o: 0x123d1e, m: 0x7a1f3d, w: 0xffffff, k: 0x111111, y: 0xfff36b, l: 0xa6ffbb, a: 0x9dff4a }, frames: [
    ['..............................', '..............................', '..............o.o.............', '...............o..............', '...............o..............', '...........oooogooo...........', '........oooggyyyyggooo........', '......oogggggykkygggggoo......', '.....ogglggggykkygggggggo.....', '....ogglgggggyyyyggggggggo....', '...oggggggggggggggggggggggo...', '...oggggggggggggggggggggggo...', '..oggggggggggggggggggggggggo..', '..oggggggggggggggggggggggggo..', '.oggggggggggggggggggggggggggo.', '.ogggggggggmmmmmmmmgggggggggo.', '.ogggggwwmmwwmmwwmmwwmggggggo.', '.oggggmwmmmwmmmwmmmwmmmmggggo.', '.ogggmmmmmmmmmmmmmmmmmmmmgggo.', '.ogggmmmmmmmmmmmmmmmmmmmmgggo.', '..oggmmmmmmmmmmmmmmmmmmmmggo..', '..oggmmmmmmmmmmmmmmmmmmmmggo..', '...oGGmmmmmmmmmmmmmmmmmmGGo...', '...oGGGGmmmmmmmmmmmmmmGGGGo...', '....oGGGGGGmmmmmmmmGGGGGGo....', '.....oGGGGGGGGGGGGGGGGGGo.....', '......ooGGGGGGGGGGGGGGoo......', '........oooGGGGGGGGooo........', '...........oooooooo...........'],
    ['..............................', '..............................', '..............o.o.............', '...............o..............', '...............o..............', '..............................', '.........oooooooooooo.........', '.......ooggggykkyggggoo.......', '......oglggggykkyggggggo......', '....ooglgggggyyyygggggggoo....', '...oggggggggggggggggggggggo...', '...oggggggggggggggggggggggo...', '..oggggggggggggggggggggggggo..', '..oggggggggggggggggggggggggo..', '.oggggggggggggggggggggggggggo.', '.oggggggggggggggggggggggggggo.', '.oggggggggggggggggggggggggggo.', '.ogggggwwmmwwmmwwmmwwgggggggo.', '.oggggmwmmmwmmmwmmmwmmmmggggo.', '.ogggmmmmmmmmmmmmmmmmmmmmgggo.', '..oggmmmmmmmmmmmmmmmmmmmmggo..', '..ogggmmmmmmmmmmmmmmmmmmgggo..', '...oGGGGGmmmmmmmmmmmmGGGGGo...', '...oGGGGGGGGGGGGGGGGGGGGGGo...', '....ooGGGGGGGGGGGGGGGGGGoo....', '......oGGGGGGGGGGGGGGGGo......', '.......ooGGGGGGGGGGGGoo.......', '.........oooooooooooo.........', '..............................'],
  ] },
  agarrador: { pal: { g: 0x2fa88a, G: 0x1f7a63, o: 0x0d3a2e, t: 0x46c9a6, p: 0xff6bd5, k: 0x111111, l: 0xb5ffe9, w: 0xffffff }, frames: [
    ['........................', '.........oooooo.........', '......oooggggggooo......', '.....olgggggggggggo.....', '....oggggggggggggggo....', '....oggggggggggggggo....', '...ogggppggggggppgggo...', '...ogggpkggggggpkgggo...', '...oggggggggggggggggo...', '...oggggggggggggggggo...', '....oggggggggggggggo....', '....oGGGGGGGGGGGGGGo.oo.', '...otoGGGGGGGGGGGGo.oo..', '...oo.ooGGGGGGGooGo.oo..', '...oo...oooooGo..oo.oo..', '....oo.oo....oo.oo...oo.', '....oo.oo....oo.oo...oo.', '....oo.oo....oo.oo...oo.', '...oo...oo..oo...oo.oo..', '...oo...oo..oo...oo.oo..', '...oo...oo..oo...oo.oo..', '....oo.oo....oo.oo...oo.', '....oo.oo....oo.oo...oo.', '........................'],
    ['........................', '.........oooooo.........', '......oooggggggooo......', '.....olgggggggggggo.....', '....oggggggggggggggo....', '....oggggggggggggggo....', '...ogggppggggggppgggo...', '...ogggpkggggggpkgggo...', '...oggggggggggggggggo...', '...oggggggggggggggggo...', '....oggggggggggggggo....', '...oGGGGGGGGGGGGGGGooo..', '....oGGGGGGGGGGGGGo..oo.', '....otoGGGGGGGGoGo...oo.', '....oo.otGooGGo.oo...oo.', '...oo...oo..oo...oo.oo..', '...oo...oo..oo...oo.oo..', '...oo...oo..oo...oo.oo..', '....oo.oo....oo.oo...oo.', '....oo.oo....oo.oo...oo.', '....oo.oo....oo.oo...oo.', '...oo...oo..oo...oo.oo..', '...oo...oo..oo...oo.oo..', '........................'],
  ] },
};

const CHARS = {
  // Nick: camiseta clara, calça jeans, tênis escuro de sola branca
  nicolas: { nome: 'Nícolas', habilidade: 'Casca de banana',
    paleta: { h: 0x2b1d14, s: 0xc58c5c, d: 0xa8714a, e: 0x1a1a1a, m: 0x7a3b2a, w: 0xe9e9ee, W: 0xc4c4cf, j: 0x7fa6cf, J: 0x5f86b0, k: 0x2a2a2a, o: 0xf2f2f2 } },
  // Theo: cabelo bem curtinho, camiseta bege, calça preta, tênis preto de sola branca
  theo:    { nome: 'Theo', habilidade: 'Mega pum',
    paleta: { h: 0x2e2118, s: 0xc9956a, d: 0xad7b52, e: 0x1a1a1a, m: 0x7a3b2a, w: 0xcbb89a, W: 0xa8957a, j: 0x1e1e22, J: 0x34343a, k: 0x151518, o: 0xf2f2f2 } },
};

// armas do botão 2 (o botão 1 é sempre o chinelo)
const ARMAS = {
  estilingue: { nome: 'Estilingue', icone: '🎯', recarga: 450 },
  bola:       { nome: 'Bola de futebol', icone: '⚽', recarga: 700 },
  drone:      { nome: 'Drone de purpurina', icone: '🚁', recarga: 1600 },
  agua:       { nome: "Pistola d'água", icone: '💦', recarga: 550 },
};

const CONTROLES = [
  { esq: 'A', dir: 'D', pulo: 'W', baixo: 'S', chinelo: 'F', estilingue: 'G', especial: 'H', texto: 'A/D andar · W pular/subir · S descer · F chinelo · G arma · H especial' },
  { esq: 'LEFT', dir: 'RIGHT', pulo: 'UP', baixo: 'DOWN', chinelo: 'K', estilingue: 'L', especial: 'J', texto: 'Setas andar/pular/subir/descer · K chinelo · L arma · J especial' },
];

// ---------------------------------------------------------------- MENU
const DIFICULDADES = [
  { nome: 'Molezinha',            cor: '#7cff6b', vidaJog: 8, vidaInim: 0.6, vel: 0.8,  apertos: 0.6, quantidade: 'menos' },
  { nome: 'Moleza',               cor: '#ffef5d', vidaJog: 6, vidaInim: 1,   vel: 1,    apertos: 1,   quantidade: 'normal' },
  { nome: 'Quero a minha mãe!',   cor: '#ff5d73', vidaJog: 4, vidaInim: 1.5, vel: 1.25, apertos: 1.4, quantidade: 'mais' },
];

class Menu extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    this.add.text(W / 2, 100, 'CORAÇÃO DE MARTE', { fontFamily: 'Arial Black', fontSize: 52, color: '#ff5d73' }).setOrigin(0.5);
    this.add.text(W / 2, 160, 'Nícolas e Theo contra os alienígenas gosmentos', { fontFamily: 'Arial', fontSize: 20, color: '#cfc8ff' }).setOrigin(0.5);
    this.add.text(W / 2, 470, 'Jogador 1: ' + CONTROLES[0].texto, { fontFamily: 'Arial', fontSize: 15, color: '#9a93c9' }).setOrigin(0.5);
    this.add.text(W / 2, 495, 'Jogador 2: ' + CONTROLES[1].texto, { fontFamily: 'Arial', fontSize: 15, color: '#9a93c9' }).setOrigin(0.5);
    SOM.pararMusica();
    this.itens = [];
    this.passo1();
  }

  telaCheia() {
    if (!this.sys.game.device.input.touch) return;
    try {
      if (!this.scale.isFullscreen) this.scale.startFullscreen();
      // trava em paisagem (funciona no Android/Chrome; no iPhone é ignorado)
      setTimeout(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (e) {} }, 300);
    } catch (e) {}
  }

  // mostra opções clicáveis/tocáveis e também pelas teclas 1, 2, 3
  opcoes(titulo, textos, cores, aoEscolher) {
    this.itens.forEach(i => i.destroy()); this.itens = [];
    this.input.keyboard.removeAllListeners();
    this.itens.push(this.add.text(W / 2, 215, titulo, { fontFamily: 'Arial Black', fontSize: 22, color: '#cfc8ff' }).setOrigin(0.5));
    textos.forEach((t, i) => {
      const op = this.add.text(W / 2, 270 + i * 58, `${i + 1}  —  ${t}`, { fontFamily: 'Arial', fontSize: 26, color: cores ? cores[i] : '#ffffff', backgroundColor: '#2b2350', padding: { x: 14, y: 8 } })
        .setOrigin(0.5).setInteractive({ useHandCursor: true });
      op.on('pointerdown', () => { SOM.iniciar(); SOM.tocar('menu'); this.telaCheia(); aoEscolher(i); });
      this.itens.push(op);
    });
    ['ONE', 'TWO', 'THREE'].forEach((k, i) => this.input.keyboard.once('keydown-' + k, () => { SOM.iniciar(); SOM.tocar('menu'); aoEscolher(i); }));
  }

  passo1() {
    const escolhas = [['nicolas'], ['theo'], ['nicolas', 'theo']];
    this.opcoes('Quem vai jogar?', ['Nícolas (casca de banana)', 'Theo (mega pum)', 'Os dois juntos (2 jogadores)'], null,
      i => this.time.delayedCall(50, () => this.passo2(escolhas[i])));
  }

  passo2(jogadores) {
    this.opcoes('Escolha a dificuldade', DIFICULDADES.map(d => d.nome), DIFICULDADES.map(d => d.cor),
      i => this.scene.start('Fase', { jogadores, dificuldade: i }));
  }
}

// ---------------------------------------------------------------- FASE
class Fase extends Phaser.Scene {
  constructor() { super('Fase'); }

  init(data) {
    if (data && data.jogadores) this.registry.set('config', data);
    const cfg = this.registry.get('config');
    this.escolha = cfg.jogadores; this.dif = DIFICULDADES[cfg.dificuldade ?? 1];
    this.acabou = false;
  }

  create() {
    this.criarTexturas();
    this.physics.world.setBounds(0, 0, MAPA_W, MAPA_H + 200);
    this.cameras.main.setBounds(0, 0, MAPA_W, MAPA_H);
    this.cameras.main.setBackgroundColor('#0f2418');

    // fundo: rochas escuras ao longe (parallax)
    for (let i = 0; i < 40; i++) {
      this.add.ellipse(Phaser.Math.Between(0, MAPA_W), Phaser.Math.Between(0, MAPA_H), Phaser.Math.Between(120, 320), Phaser.Math.Between(80, 220), 0x163626, 0.6)
        .setScrollFactor(0.3).setDepth(-10);
    }
    // fundo: bolhas de gosma flutuando ao longe
    for (let i = 0; i < 220; i++) {
      this.add.circle(Phaser.Math.Between(0, MAPA_W), Phaser.Math.Between(0, MAPA_H), Phaser.Math.Between(1, 3), 0x7dff95, 0.15).setScrollFactor(0.5);
    }

    // lê o mapa: junta blocos vizinhos da mesma linha em uma peça só
    this.chao = this.physics.add.staticGroup();
    this.pontes = this.physics.add.staticGroup();
    this.escadas = this.physics.add.staticGroup();
    const pecas = [];
    MAPA.forEach((linha, r) => {
      let c = 0;
      while (c < linha.length) {
        const ch = linha[c];
        if (ch === '#' || ch === '-') {
          let f = c; while (f + 1 < linha.length && linha[f + 1] === ch) f++;
          const larg = (f - c + 1) * T;
          const p = this.add.tileSprite(c * T, r * T, larg, ch === '#' ? T : 12, ch === '#' ? 'bloco' : 'ponte').setOrigin(0, 0);
          this.physics.add.existing(p, true);
          (ch === '#' ? this.chao : this.pontes).add(p);
          c = f + 1; continue;
        }
        if (ch === 'H') {
          const e = this.add.image(c * T + T / 2, r * T + T / 2, 'escada');
          this.physics.add.existing(e, true); this.escadas.add(e);
        } else if (ch !== ' ') pecas.push({ ch, x: c * T + T / 2, y: (r + 1) * T });
        c++;
      }
    });
    this.plataformas = [...this.chao.getChildren(), ...this.pontes.getChildren()];
    this.decorar();

    // jogadores
    const ini = pecas.find(p => p.ch === 'P');
    this.jogadores = this.escolha.map((id, i) => this.criarJogador(id, i, ini.x + i * 50, ini.y - 30));

    // saída
    const ex = pecas.find(p => p.ch === 'E');
    this.chegada = this.add.rectangle(ex.x, ex.y - 60, 20, 120, 0x7cff6b);
    this.physics.add.existing(this.chegada, true);
    this.add.text(ex.x, ex.y - 140, 'SAÍDA', { fontFamily: 'Arial Black', fontSize: 20, color: '#7cff6b' }).setOrigin(0.5);

    // baús
    this.baus = this.physics.add.staticGroup();
    this.itens = this.physics.add.group();
    const sorteio = Phaser.Utils.Array.Shuffle(['bola', 'drone', 'agua', 'bola', 'drone', 'agua']);
    pecas.filter(p => p.ch === 'T').forEach((p, i) => {
      const b = this.baus.create(p.x, p.y - 14, 'bau'); b.arma = sorteio[i % sorteio.length];
    });

    // inimigos — Molezinha: pula 1 a cada 3. Quero a minha mãe!: inclui os MAIÚSCULOS
    this.inimigos = this.physics.add.group();
    let n = 0;
    pecas.forEach(p => {
      if (p.ch === 'B') { this.chefao = this.criarInimigo(p.x, p.y - 60, 'chefao'); return; }
      const tipo = TIPOS[p.ch.toLowerCase()];
      if (!tipo) return;
      const extra = p.ch !== p.ch.toLowerCase();
      if (extra && this.dif.quantidade !== 'mais') return;
      if (this.dif.quantidade === 'menos' && (n++ % 3 === 2)) return;
      this.criarInimigo(p.x, p.y - 24, tipo);
    });
    this.gosmas = this.physics.add.group({ allowGravity: false });
    this.bananas = this.physics.add.group();

    // projéteis
    this.pedras = this.physics.add.group({ allowGravity: false });
    this.bolas = this.physics.add.group();
    this.bombas = this.physics.add.group();
    this.gotas = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.jogadores, this.chao);
    this.physics.add.collider(this.itens, this.chao);
    this.physics.add.collider(this.itens, this.pontes);
    this.physics.add.overlap(this.jogadores, this.baus, (j, b) => this.abrirBau(b));
    this.physics.add.overlap(this.jogadores, this.itens, (j, it) => this.pegarArma(j, it));
    this.physics.add.collider(this.bolas, this.chao);
    this.physics.add.collider(this.bolas, this.pontes, null, (b, p) => b.body.velocity.y >= 0 && b.body.bottom <= p.body.top + 12);
    this.physics.add.overlap(this.bolas, this.inimigos, (b, s) => this.bolaAcerta(b, s));
    this.physics.add.collider(this.bombas, this.chao, (b) => this.explodir(b));
    this.physics.add.collider(this.bombas, this.pontes, (b) => this.explodir(b));
    this.physics.add.overlap(this.bombas, this.inimigos, (b) => this.explodir(b));
    this.physics.add.overlap(this.gotas, this.inimigos, (g, s) => { if (!g.active) return; const d = g.body.velocity.x > 0 ? 1 : -1; g.destroy(); this.molhar(s, d); });
    this.physics.add.collider(this.gotas, this.chao, (g) => g.destroy());
    this.physics.add.collider(this.inimigos, this.chao);
    // plataformas atravessáveis: só seguram quem vem de cima
    const deCima = (o, p) => o.body.velocity.y >= 0 && o.body.bottom <= p.body.top + 12;
    this.physics.add.collider(this.jogadores, this.pontes, null, (j, p) => !j.descendo && !j.escalando && deCima(j, p));
    this.physics.add.collider(this.inimigos, this.pontes, null, (s, p) => s.tipo !== 'morcego' && deCima(s, p));
    this.physics.add.overlap(this.pedras, this.inimigos, (pedra, ini) => {
      if (!pedra.active || !ini.active) return;
      const dir = pedra.body.velocity.x > 0 ? 1 : -1; // ler a direção ANTES de destruir a pedra
      pedra.destroy();
      this.acertar(ini, 1, dir);
    });
    this.physics.add.collider(this.pedras, this.chao, (pedra) => pedra.destroy());
    this.physics.add.overlap(this.jogadores, this.inimigos, (j, ini) => this.levarDano(j, ini));
    this.physics.add.overlap(this.jogadores, this.chegada, () => {
      if (this.chefao.active) { if (!this.avisouChefao) { this.avisouChefao = true; this.texto(this.chegada.x, this.chegada.y - 110, 'Derrote o GOSMÃO primeiro!', '#ff5d73'); this.time.delayedCall(1500, () => this.avisouChefao = false); } return; }
      this.vitoria();
    });
    this.physics.add.overlap(this.jogadores, this.gosmas, (j, g) => { if (!g.active) return; g.destroy(); this.levarDano(j, g, true); });
    this.physics.add.collider(this.gosmas, this.chao, (g) => g.destroy());
    this.physics.add.collider(this.bananas, this.chao, (b) => { b.setAngularVelocity(0).setVelocityX(0); });
    this.physics.add.collider(this.bananas, this.pontes, (b) => { b.setAngularVelocity(0).setVelocityX(0); }, (b, p) => deCima(b, p));
    this.physics.add.overlap(this.inimigos, this.bananas, (s, b) => this.escorregar(s, b));

    // câmera segue o ponto médio entre os jogadores
    this.alvoCamera = this.add.zone(0, 0, 1, 1);
    this.cameras.main.startFollow(this.alvoCamera, true, 0.1, 0.1);

    SOM.musica('fase1');
    this.input.keyboard.on('keydown-M', () => SOM.alternarMudo());
    this.hud = this.add.text(16, 12, '', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setScrollFactor(0).setDepth(10);
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('Menu'));
    this.criarControlesToque();
  }

  // botões na tela para celular/tablet (controlam o Jogador 1)
  // plantas brilhantes, cristais e gosma pingando do teto
  decorar() {
    const vazio = (r, c) => MAPA[r] && (MAPA[r][c] === ' ' || 'gvcmaGVCMATPE'.includes(MAPA[r][c]));
    MAPA.forEach((linha, r) => [...linha].forEach((ch, c) => {
      if (ch !== '#') return;
      const x = c * T + T / 2;
      if (r > 0 && vazio(r - 1, c) && Math.random() < 0.22) {
        const tipo = Phaser.Utils.Array.GetRandom(['planta', 'planta', 'cristal', 'cogumelinho']);
        const d = this.add.image(x + Phaser.Math.Between(-8, 8), r * T + 2, tipo).setOrigin(0.5, 1).setDepth(-1).setFlipX(Math.random() < 0.5);
        if (tipo !== 'cogumelinho') this.tweens.add({ targets: d, alpha: 0.55, duration: Phaser.Math.Between(900, 1600), yoyo: true, repeat: -1 });
      }
      if (vazio(r + 1, c) && r > 0 && Math.random() < 0.1) {
        const e = this.add.image(x, (r + 1) * T, 'estalactite').setOrigin(0.5, 0).setDepth(-1);
        if (Math.random() < 0.4) this.time.addEvent({ delay: Phaser.Math.Between(1800, 4000), loop: true, callback: () => {
          if (!this.cameras.main.worldView.contains(x, e.y)) return;
          const gota = this.add.image(x, e.y + 14, 'gota_gosma').setDepth(-1);
          this.tweens.add({ targets: gota, y: e.y + 260, alpha: 0, duration: 900, ease: 'Quad.easeIn', onComplete: () => gota.destroy() });
        } });
      }
    }));
  }

  criarControlesToque() {
    this.toque = { esq: false, dir: false, cima: false, baixo: false, pulo: false, chinelo: false, estilingue: false, especial: false };
    this.botoes = [];
    if (!this.sys.game.device.input.touch) return;
    this.input.addPointer(4); // até 5 dedos ao mesmo tempo
    const botao = (x, y, r, rotulo, chave, segurar) => {
      const circ = this.add.circle(x, y, r, 0xffffff, 0.18).setStrokeStyle(3, 0xffffff, 0.5).setScrollFactor(0).setDepth(30);
      const tx = this.add.text(x, y, rotulo, { fontFamily: 'Arial Black', fontSize: r * 0.55, color: '#ffffff' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(31).setAlpha(0.8);
      this.botoes.push({ x, y, r: r * 1.25, chave, segurar, circ, rotulo: tx, antes: false });
    };
    botao(80, H - 80, 56, '◀', 'esq', true);
    botao(205, H - 80, 56, '▶', 'dir', true);
    botao(142, H - 200, 44, '▲', 'cima', true);
    botao(265, H - 190, 40, '▼', 'baixo', true);
    botao(W - 80, H - 80, 56, '⤒', 'pulo', false);
    botao(W - 200, H - 70, 46, '🩴', 'chinelo', false);
    botao(W - 160, H - 185, 42, '🎯', 'estilingue', false);
    botao(W - 55, H - 200, 40, '★', 'especial', false);
    const menu = this.add.text(W - 16, 12, '☰', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(30).setInteractive();
    menu.on('pointerdown', () => this.scene.start('Menu'));
    const som = this.add.text(W - 60, 12, SOM.mudo ? '🔇' : '🔊', { fontFamily: 'Arial', fontSize: 26 })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(30).setInteractive();
    som.on('pointerdown', () => som.setText(SOM.alternarMudo() ? '🔇' : '🔊'));
  }

  // lê todos os dedos na tela a cada quadro: vários botões ao mesmo tempo, e dá pra arrastar o dedo
  lerToque() {
    if (!this.botoes || !this.botoes.length) return;
    const dedos = this.input.manager.pointers.filter(p => p.isDown);
    this.botoes.forEach(b => {
      const agora = dedos.some(p => Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y) <= b.r);
      if (b.segurar) this.toque[b.chave] = agora;
      // toque duplo rápido em ◀ ou ▶ = cambalhota
      if ((b.chave === 'esq' || b.chave === 'dir') && agora && !b.antes) {
        const t = this.time.now;
        if (b.ultimo && t - b.ultimo < 300) { this.toque.rolar = b.chave === 'esq' ? -1 : 1; b.ultimo = 0; } else b.ultimo = t;
      }
      else if (agora && !b.antes) this.toque[b.chave] = true; // acabou de apertar
      b.antes = agora;
      b.circ.setFillStyle(0xffffff, agora ? 0.4 : 0.18);
      if (b.chave === 'estilingue' && this.jogadores[0]) b.rotulo.setText(ARMAS[this.jogadores[0].arma].icone);
    });
  }

  criarTexturas() {
    if (this.textures.exists('bloco')) return;
    const g = this.add.graphics();
    g.fillStyle(0x24453a).fillRect(0, 0, 32, 32).fillStyle(0x3d7a5a).fillRect(0, 0, 32, 6).fillStyle(0x1b3329).fillRect(6, 14, 8, 6).fillRect(20, 22, 7, 5);
    g.generateTexture('bloco', 32, 32).clear();
    g.fillStyle(0x6b5a3a).fillRect(0, 0, 32, 12).fillStyle(0x8a7550).fillRect(0, 0, 32, 4).fillStyle(0x4a3d26).fillRect(15, 0, 2, 12);
    g.generateTexture('ponte', 32, 12).clear();
    g.fillStyle(0xa8823f).fillRect(4, 0, 4, 32).fillRect(24, 0, 4, 32).fillRect(4, 6, 24, 4).fillRect(4, 22, 24, 4);
    g.generateTexture('escada', 32, 32).clear();
    g.fillStyle(0xffffff).fillRect(0, 0, 6, 6); g.generateTexture('confete', 6, 6).clear();
    g.fillStyle(0xd9d2c5).fillCircle(5, 5, 5); g.generateTexture('pedra', 10, 10).clear();
    // alienígenas em pixel art: tipo_0 e tipo_1 (animação); "tipo" = primeiro quadro
    Object.entries(INIMIGOS_PIXEL).forEach(([tipo, d]) => {
      d.frames.forEach((linhas, f) => {
        linhas.forEach((linha, y) => [...linha].forEach((ch, x) => {
          if (d.pal[ch] !== undefined) g.fillStyle(d.pal[ch]).fillRect(x * 2, y * 2, 2, 2);
        }));
        const larg = linhas[0].length * 2, alt = linhas.length * 2;
        g.generateTexture(tipo + '_' + f, larg, alt);
        if (f === 0) g.generateTexture(tipo, larg, alt);
        g.clear();
      });
    });
    g.fillStyle(0x9dff4a).fillCircle(7, 7, 7); g.generateTexture('gosma', 14, 14).clear();
    // decoração do cenário
    g.fillStyle(0x2f7a3e).fillRect(9, 8, 2, 16).fillRect(4, 14, 6, 2).fillRect(10, 11, 6, 2).fillStyle(0x9dff4a).fillCircle(10, 6, 5).fillStyle(0xe6ffd0).fillCircle(9, 5, 2);
    g.generateTexture('planta', 20, 24).clear();
    g.fillStyle(0x6bd1ff).fillTriangle(4, 22, 8, 4, 12, 22).fillTriangle(10, 22, 15, 10, 19, 22).fillStyle(0xd6f4ff).fillTriangle(7, 20, 8, 8, 9, 20);
    g.generateTexture('cristal', 22, 22).clear();
    g.fillStyle(0xe8e0c8).fillRect(6, 8, 4, 8).fillStyle(0xff6bd5).fillEllipse(8, 7, 16, 9).fillStyle(0xffffff).fillCircle(5, 6, 1.5).fillCircle(11, 5, 1.5);
    g.generateTexture('cogumelinho', 16, 16).clear();
    g.fillStyle(0x7dff95, 0.8).fillTriangle(4, 0, 20, 0, 12, 14).fillCircle(12, 13, 3);
    g.generateTexture('estalactite', 24, 18).clear();
    g.fillStyle(0x9dff4a).fillCircle(3, 4, 3).fillTriangle(0, 4, 6, 4, 3, 0); g.generateTexture('gota_gosma', 6, 8).clear();
    g.fillStyle(0xffffff).fillCircle(9, 9, 9).fillStyle(0x222222).fillCircle(9, 9, 3).fillCircle(3, 6, 2).fillCircle(15, 6, 2).fillCircle(5, 14, 2).fillCircle(13, 14, 2);
    g.generateTexture('bola', 18, 18).clear();
    g.fillStyle(0x8892a0).fillRect(6, 8, 20, 8).fillStyle(0x5a6270).fillRect(0, 4, 12, 2).fillRect(20, 4, 12, 2).fillRect(5, 4, 2, 5).fillRect(25, 4, 2, 5)
     .fillStyle(0xff3b3b).fillCircle(22, 12, 2);
    g.generateTexture('drone', 32, 18).clear();
    g.fillStyle(0xff6bd5).fillCircle(8, 8, 8).fillStyle(0xffffff).fillCircle(5, 5, 2).fillStyle(0xffef5d).fillRect(7, 0, 2, 3);
    g.generateTexture('bomba', 16, 16).clear();
    g.fillStyle(0x6bd1ff).fillCircle(4, 4, 4); g.generateTexture('gota', 8, 8).clear();
    g.fillStyle(0x8a5a2b).fillRect(0, 8, 32, 20).fillStyle(0xa8723a).fillRect(0, 0, 32, 10).fillStyle(0xffd23f).fillRect(0, 9, 32, 3).fillRect(13, 6, 6, 10);
    g.generateTexture('bau', 32, 28).clear();
    g.fillStyle(0x8a5a2b).fillRect(0, 8, 32, 20).fillStyle(0xa8723a).fillRect(0, 0, 32, 5).fillStyle(0x2a1a0a).fillRect(2, 8, 28, 4).fillStyle(0xffd23f).fillRect(0, 12, 32, 2);
    g.generateTexture('bau_aberto', 32, 28).clear();
    // ícones das armas no chão (com aura)
    const aura = () => g.fillStyle(0xffef5d, 0.35).fillCircle(14, 14, 14);
    aura(); g.fillStyle(0x8a5a2b).fillRect(12, 12, 4, 12).fillRect(6, 6, 4, 8).fillRect(18, 6, 4, 8).fillStyle(0xd9d2c5).fillCircle(14, 8, 3); g.generateTexture('item_estilingue', 28, 28).clear();
    aura(); g.fillStyle(0xffffff).fillCircle(14, 14, 8).fillStyle(0x222222).fillCircle(14, 14, 3); g.generateTexture('item_bola', 28, 28).clear();
    aura(); g.fillStyle(0x8892a0).fillRect(6, 12, 16, 6).fillStyle(0x5a6270).fillRect(2, 9, 10, 2).fillRect(16, 9, 10, 2); g.generateTexture('item_drone', 28, 28).clear();
    aura(); g.fillStyle(0x3fa9f5).fillRect(6, 10, 14, 6).fillRect(8, 14, 5, 8).fillStyle(0x6bd1ff).fillCircle(23, 13, 3); g.generateTexture('item_agua', 28, 28).clear();
    g.fillStyle(0xffe14d).fillEllipse(14, 10, 26, 10).fillTriangle(2, 10, 8, 2, 10, 10).fillTriangle(26, 10, 20, 2, 18, 10)
     .fillStyle(0x6b4a1f).fillCircle(14, 6, 2); g.generateTexture('banana', 28, 16).clear();
    g.fillStyle(0x7dff95).fillEllipse(30, 8, 60, 16); g.generateTexture('poca', 60, 16).clear();
    Object.entries(CHARS).forEach(([id, c]) => {
      ['parado', 'andando'].forEach(pose => {
        [...PIXEL_CORPO, ...PIXEL_PERNAS[pose]].forEach((linha, y) => [...linha].forEach((ch, x) => {
          if (c.paleta[ch] !== undefined) g.fillStyle(c.paleta[ch]).fillRect(x * 2, y * 2, 2, 2);
        }));
        g.generateTexture(pose === 'parado' ? id : id + '_andando', 32, 48).clear();
      });
    });
    g.fillStyle(0xff5d73).fillRoundedRect(0, 0, 26, 10, 4); g.generateTexture('chinelo', 26, 10).clear();
    g.destroy();
  }

  criarJogador(id, idx, x, y) {
    const j = this.physics.add.sprite(x, y, id);
    j.setCollideWorldBounds(true);
    j.body.setSize(20, 46).setOffset(6, 2);
    const c = CONTROLES[idx];
    const k = this.input.keyboard.addKeys(c);
    Object.assign(j, {
      id, idx, k, vida: this.dif.vidaJog, vidaMax: this.dif.vidaJog, direcao: 1, pulosExtras: 0,
      arma: 'estilingue', invencivel: 0, recargaChinelo: 0, recargaEstilingue: 0, recargaEspecial: 0, deslizando: 0, caido: false,
    });
    return j;
  }

  criarInimigo(x, y, tipo) {
    const s = this.inimigos.create(x, y, tipo === 'chefao' ? 'sombra' : tipo);
    s.tipo = tipo;
    s.setCollideWorldBounds(true).setBounce(0);
    if (tipo === 'sombra') {
      s.vida = 4; s.velocidade = Phaser.Math.Between(70, 110);
      s.setVelocityX(s.velocidade * (Math.random() < 0.5 ? -1 : 1));
      this.tweens.add({ targets: s, scaleY: 0.9, duration: 400, yoyo: true, repeat: -1 });
    } else if (tipo === 'morcego') {
      s.vida = 2; s.velocidade = 0; s.body.setAllowGravity(false);
      s.casaX = x; s.casaY = y; s.estado = 'voando'; s.relogio = Phaser.Math.Between(0, 1000);
    } else if (tipo === 'cuspidor') {
      s.vida = 3; s.velocidade = 0; s.recarga = Phaser.Math.Between(1000, 2000);
    } else if (tipo === 'comedor' || tipo === 'agarrador') {
      s.vida = tipo === 'comedor' ? 6 : 4; s.velocidade = tipo === 'comedor' ? 45 : 70;
      s.setVelocityX(s.velocidade * (Math.random() < 0.5 ? -1 : 1));
      if (tipo === 'comedor') s.body.setSize(50, 50).setOffset(5, 8);
      this.tweens.add({ targets: s, scaleX: 1.08, duration: 500, yoyo: true, repeat: -1 });
    } else if (tipo === 'chefao') {
      s.vida = s.vidaMax = 30; s.velocidade = 90; s.setScale(2.6).setTint(0x2e9e4a);
      s.body.setSize(36, 32).setOffset(2, 6); s.recarga = 2000; s.ativado = false;
    }
    s.vida = Math.max(1, Math.round(s.vida * this.dif.vidaInim));
    if (s.vidaMax) s.vidaMax = s.vida;
    s.velocidade *= this.dif.vel;
    if (s.body.velocity.x) s.setVelocityX(Math.sign(s.body.velocity.x) * s.velocidade);
    return s;
  }

  maisPerto(x, y) {
    let melhor = null, d = Infinity;
    this.jogadores.forEach(j => { if (j.caido) return; const dd = Phaser.Math.Distance.Between(x, y, j.x, j.y); if (dd < d) { d = dd; melhor = j; } });
    return melhor ? { j: melhor, d } : null;
  }

  cuspir(s, alvo, vel = 320) {
SOM.tocar('cuspe'); 
    const g = this.gosmas.create(s.x, s.y - 10, 'gosma');
    const ang = Phaser.Math.Angle.Between(s.x, s.y, alvo.x, alvo.y);
    g.setVelocity(Math.cos(ang) * vel, Math.sin(ang) * vel);
    this.time.delayedCall(2500, () => g.active && g.destroy());
  }

  pensarInimigo(s, delta) {
    // animação de 2 quadros (mais rápida quando está bravo/andando)
    if (!s.base) { s.base = s.tipo === 'chefao' ? 'sombra' : s.tipo; s.fase = Phaser.Math.Between(0, 600); }
    const ritmo = s.atordoado > 0 ? 700 : (s.tipo === 'comedor' && s.vitima ? 120 : 280);
    s.setTexture(s.base + '_' + (Math.floor((this.time.now + s.fase) / ritmo) % 2));
    if (s.atordoado > 0) {
      s.atordoado -= delta;
      if (s.empurrao > 0) s.empurrao -= delta; else s.setVelocityX(0);
      if (s.tipo === 'morcego') s.setVelocityY(s.body.blocked.down ? 0 : 200); // desmaiado cai
      if (s.zzz) s.zzz.setPosition(s.x, s.y - 40);
      if (s.atordoado <= 0) { s.setAngle(0); if (s.zzz) { s.zzz.destroy(); s.zzz = null; } }
      return;
    }
    if (s.vitima) { s.setVelocityX(0); return; }
    const alvo = this.maisPerto(s.x, s.y);
    if (s.tipo === 'sombra' || s.tipo === 'comedor' || s.tipo === 'agarrador') {
      // gosmento comum dá um bote saltitando — antes ele se espreme (aviso para desviar!)
      s.recSalto = (s.recSalto ?? Phaser.Math.Between(1000, 2500)) - delta;
      if (s.preparando) { s.setVelocityX(0); return; }
      if (s.tipo === 'sombra' && alvo && alvo.d < 230 && Math.abs(alvo.j.y - s.y) < 100 && s.body.blocked.down && s.recSalto <= 0) {
        s.preparando = true; s.setVelocityX(0);
        const alvoX = alvo.j.x;
        this.tweens.add({ targets: s, scaleY: 0.6, scaleX: 1.3, duration: 400, yoyo: true, onComplete: () => {
          s.preparando = false; s.recSalto = 2500;
          if (!s.active) return;
          SOM.tocar('bote'); s.setVelocity(Phaser.Math.Clamp((alvoX - s.x) * 1.6, -380, 380), -520);
        } });
        return;
      }
      if (!s.body.blocked.down && s.recSalto > 2000) return; // no ar durante o bote
      // persegue quem chegar perto
      if (alvo && alvo.d < 260 && Math.abs(alvo.j.y - s.y) < 80 && s.body.blocked.down) {
        s.setVelocityX(Math.sign(alvo.j.x - s.x) * s.velocidade * 1.6);
      } else if (Math.abs(s.body.velocity.x) < 10) s.setVelocityX(s.velocidade);
      if (s.body.blocked.left) s.setVelocityX(s.velocidade);
      if (s.body.blocked.right) s.setVelocityX(-s.velocidade);
      if (s.body.blocked.down) {
        const frente = s.x + (s.body.velocity.x > 0 ? 24 : -24);
        const temChao = this.plataformas.some(p => frente > p.x && frente < p.x + p.width && Math.abs(p.y - s.body.bottom) < 6);
        if (!temChao) s.setVelocityX(-s.body.velocity.x);
      }
      s.setFlipX(s.body.velocity.x < 0);
    } else if (s.tipo === 'morcego') {
      s.relogio += delta;
      if (s.estado === 'voando') {
        s.setVelocity(Math.cos(s.relogio / 500) * 80, Math.sin(s.relogio / 300) * 40 + (s.casaY - s.y));
        if (alvo && alvo.d < 300 && s.relogio > 1500) {
          s.estado = 'mergulho'; s.relogio = 0;
          const ang = Phaser.Math.Angle.Between(s.x, s.y, alvo.j.x, alvo.j.y);
          s.setVelocity(Math.cos(ang) * 380, Math.sin(ang) * 380);
        }
      } else if (s.relogio > 900 || s.body.blocked.down) {
        s.estado = 'voando'; s.relogio = 0; s.casaX = s.x;
      }
      s.setFlipX(s.body.velocity.x < 0);
    } else if (s.tipo === 'cuspidor') {
      s.recarga -= delta;
      if (alvo) s.setFlipX(alvo.j.x < s.x);
      if (alvo && alvo.d < 480 && s.recarga <= 0) {
        s.recarga = 1800; this.cuspir(s, alvo.j);
        this.tweens.add({ targets: s, scaleX: 1.2, scaleY: 0.8, duration: 100, yoyo: true });
      }
    } else if (s.tipo === 'chefao') {
      if (!s.ativado) {
        if (alvo && alvo.d < 500) { s.ativado = true; SOM.tocar('chefe'); SOM.musica('chefe'); this.texto(s.x, s.y - 90, 'O GOSMÃO ACORDOU!', '#ff5d73'); this.cameras.main.shake(300, 0.01); }
        return;
      }
      if (s.preparando) return;
      s.recarga -= delta;
      const raiva = s.vida < s.vidaMax / 2; // metade da vida: fica mais rápido
      if (alvo && s.body.blocked.down) s.setVelocityX(Math.sign(alvo.j.x - s.x) * s.velocidade * (raiva ? 1.7 : 1));
      if (alvo && s.recarga <= 0 && s.body.blocked.down) {
        s.recarga = raiva ? 1300 : 2000;
        if (Math.random() < 0.5) {
          // aviso: o Gosmão se espreme antes de pular
          s.setVelocityX(0); s.preparando = true;
          this.tweens.add({ targets: s, scaleY: 1.8, scaleX: 3.1, duration: 450, yoyo: true, onComplete: () => {
            s.preparando = false; if (!s.active) return;
            s.setVelocityY(-650); s.pulando = true;
          } });
        }
        else { for (let a = -1; a <= 1; a++) this.cuspir(s, { x: alvo.j.x, y: alvo.j.y + a * 90 }, 300); }
      }
      if (s.pulando && s.body.blocked.down && s.body.velocity.y >= 0) {
        s.pulando = false; SOM.tocar('tremor'); this.cameras.main.shake(200, 0.012);
        this.jogadores.forEach(j => { if (!j.caido && j.body.blocked.down && Math.abs(j.x - s.x) < 180) this.levarDano(j, s, true); });
      }
      s.setFlipX(s.body.velocity.x < 0);
    }
  }


  pad(j) {
    const p = this.input.gamepad && this.input.gamepad.getPad(j.idx);
    return p || null;
  }

  update(time, delta) {
    if (this.acabou) return;
    this.lerToque();
    const vivos = this.jogadores.filter(j => !j.caido);
    vivos.forEach(j => this.controlarJogador(j, delta));

    this.inimigos.getChildren().slice().forEach(s => s.active && this.pensarInimigo(s, delta));
    this.itens.getChildren().forEach(it => { if (it.bloqueado && !this.physics.overlap(it.bloqueado, it)) it.bloqueado = null; });

    // câmera
    if (vivos.length) {
      // a câmera segue o primeiro jogador vivo; o outro acompanha
      this.alvoCamera.x = vivos[0].x;
      this.alvoCamera.y = vivos[0].y;
    }
    // co-op: quem ficar fora da tela por 1,5 s é trazido para perto do parceiro
    if (vivos.length > 1) {
      const vista = this.cameras.main.worldView;
      vivos.slice(1).forEach(j => {
        const fora = !Phaser.Geom.Rectangle.Contains(vista, j.x, j.y);
        j.foraTela = fora ? (j.foraTela || 0) + delta : 0;
        if (j.foraTela > 1500 && !j.preso) {
          const amigo = vivos[0];
          j.foraTela = 0; j.escalando = false; j.body.setAllowGravity(true);
          j.setPosition(amigo.x, amigo.y - 40).setVelocity(0, 0);
          j.invencivel = 1000; this.poeira(j.x, j.y);
        }
      });
    }

    // caiu no buraco
    this.jogadores.forEach(j => { if (!j.caido && j.y > MAPA_H + 60) this.cair(j); });

    this.hud.setText(this.jogadores.map(j =>
      `${CHARS[j.id].nome}: ${j.caido ? '💫 voltando...' : '❤'.repeat(Math.max(0, j.vida)) + '♡'.repeat(Math.max(0, j.vidaMax - j.vida)) + '  🩴' + ARMAS[j.arma].icone}`
    ).join('     ') + (this.chefao.active && this.chefao.ativado ? `     GOSMÃO: ${'█'.repeat(Math.ceil(this.chefao.vida / 3))}` : ''));
  }

  controlarJogador(j, delta) {
    const k = j.k, p = this.pad(j);
    const esqK = k.esq.isDown || (p && (p.left || p.leftStick.x < -0.4));
    const dirK = k.dir.isDown || (p && (p.right || p.leftStick.x > 0.4));
    const esq0 = esqK, dir0 = dirK;
    const cimaK = k.pulo.isDown || (p && (p.up || p.leftStick.y < -0.5));
    const baixoK = k.baixo.isDown || (p && (p.down || p.leftStick.y > 0.5));
    const pulo = Phaser.Input.Keyboard.JustDown(k.pulo) || (p && p.A && !j.padA);
    const chinelo = Phaser.Input.Keyboard.JustDown(k.chinelo) || (p && p.X && !j.padX);
    const estilingue = Phaser.Input.Keyboard.JustDown(k.estilingue) || (p && p.Y && !j.padY);
    const especial = Phaser.Input.Keyboard.JustDown(k.especial) || (p && p.B && !j.padB);
    if (p) { j.padA = p.A; j.padX = p.X; j.padY = p.Y; j.padB = p.B; }
    let tEsq = false, tDir = false, tPulo = false, tChinelo = false, tEstilingue = false, tEspecial = false;
    if (j.idx === 0 && this.toque) {
      const t = this.toque;
      tEsq = t.esq; tDir = t.dir; tPulo = t.pulo; tChinelo = t.chinelo; tEstilingue = t.estilingue; tEspecial = t.especial;
      t.pulo = t.chinelo = t.estilingue = t.especial = false; // toques são "apertou agora"
    }

    ['invencivel', 'recargaChinelo', 'recargaEstilingue', 'recargaEspecial', 'deslizando'].forEach(c => j[c] = Math.max(0, j[c] - delta));
    j.setAlpha(j.invencivel > 0 && Math.floor(j.invencivel / 100) % 2 ? 0.4 : 1);

    const esq = esq0 || tEsq, dir = dir0 || tDir;
    const pulo2 = pulo || tPulo, chinelo2 = chinelo || tChinelo, estilingue2 = estilingue || tEstilingue, especial2 = especial || tEspecial;
    if (j.preso) {
      ['invencivel', 'recargaChinelo', 'recargaEstilingue', 'recargaEspecial', 'deslizando'].forEach(c => j[c] = 0);
      this.atualizarPreso(j, pulo2 || chinelo2 || estilingue2 || especial2, delta);
      return;
    }
    const noChao = j.body.blocked.down || j.body.touching.down;
    const cima = cimaK || (j.idx === 0 && this.toque && this.toque.cima);
    const baixo = baixoK || (j.idx === 0 && this.toque && this.toque.baixo);

    // escadas: segure ▲/pular para subir e ▼ para descer
    const naEscada = this.physics.overlap(j, this.escadas);
    if (!naEscada && j.escalando) { j.escalando = false; j.body.setAllowGravity(true); if (cima) j.setVelocityY(-330); }
    if (naEscada && !j.escalando && (cima || baixo)) {
      j.escalando = true; j.body.setAllowGravity(false);
    }
    if (j.escalando) {
      j.setVelocityY(cima ? -200 : baixo ? 200 : 0);
      j.setVelocityX(esq ? -100 : dir ? 100 : 0);
      if (esq) j.direcao = -1; else if (dir) j.direcao = 1; // virar na escada para mirar
      j.setFlipX(j.direcao < 0);
      if (pulo2 && (esq || dir)) { j.escalando = false; j.body.setAllowGravity(true); j.setVelocityY(-450); }
      if (chinelo2 && j.recargaChinelo === 0) this.chinelada(j);
      if (estilingue2 && j.recargaEstilingue === 0) this.usarArma(j);
      return;
    }
    // descer de plataforma atravessável: ▼ + pular, ou só ▼
    if (baixo && noChao && !j.descendo && this.pontes.getChildren().some(pt => Math.abs(pt.body.top - j.body.bottom) < 4 && j.x > pt.x && j.x < pt.x + pt.width)) {
      j.descendo = true; this.time.delayedCall(280, () => { j.descendo = false; });
    }
    if (noChao) j.pulosExtras = j.id === 'nicolas' ? 1 : 0;

    // cambalhota: toque duplo rápido em A/D (←/→, ◀/▶ ou LB/RB no controle)
    j.recargaRolar = Math.max(0, (j.recargaRolar || 0) - delta);
    let rolar = 0;
    const agora = this.time.now;
    [['esq', -1], ['dir', 1]].forEach(([tecla, d]) => {
      if (Phaser.Input.Keyboard.JustDown(k[tecla])) {
        if (j.ultimaTecla === d && agora - j.ultimoToque < 280) rolar = d;
        j.ultimaTecla = d; j.ultimoToque = agora;
      }
    });
    if (p && (p.L1 || p.R1) && !j.padOmbro) rolar = p.L1 ? -1 : 1;
    if (p) j.padOmbro = !!(p.L1 || p.R1);
    if (j.idx === 0 && this.toque && this.toque.rolar) { rolar = this.toque.rolar; this.toque.rolar = 0; }
    if (rolar && j.recargaRolar === 0 && j.deslizando === 0) {
      j.direcao = rolar; j.deslizando = 380; j.recargaRolar = 750;
      SOM.tocar('cambalhota'); j.invencivel = Math.max(j.invencivel, 420); // atravessa inimigos e ataques sem se machucar
      this.tweens.add({ targets: j, angle: 360 * rolar, duration: 380, onComplete: () => j.setAngle(0) });
      this.poeira(j.x, j.body.bottom);
    }

    if (j.deslizando > 0) {
      j.setVelocityX(430 * j.direcao);
    } else {
      if (esq) { j.setVelocityX(-220); j.direcao = -1; }
      else if (dir) { j.setVelocityX(220); j.direcao = 1; }
      else j.setVelocityX(0);
    }
    j.setFlipX(j.direcao < 0);
    // animação: alterna as pernas enquanto anda; no ar fica de pernas abertas
    const andandoAgora = noChao ? Math.abs(j.body.velocity.x) > 10 && Math.floor(this.time.now / 140) % 2 === 0 : true;
    j.setTexture(andandoAgora ? j.id + '_andando' : j.id);

    if (pulo2) {
      if (noChao) { j.setVelocityY(-560); SOM.tocar('pulo'); }
      else if (j.pulosExtras > 0) { j.pulosExtras--; j.setVelocityY(-500); SOM.tocar('pulo'); this.poeira(j.x, j.y + 20); }
    }

    // especiais para ganhar tempo: Nícolas joga casca de banana; Theo solta o MEGA PUM
    if (especial2 && j.recargaEspecial === 0) {
      if (j.id === 'nicolas') this.jogarBanana(j);
      else this.megaPum(j);
    }

    if (chinelo2 && j.recargaChinelo === 0) this.chinelada(j);
    if (estilingue2 && j.recargaEstilingue === 0) this.usarArma(j);
  }

  chinelada(j) {
    j.recargaChinelo = 300; SOM.tocar('chinelada');
    const c = this.add.image(j.x + 24 * j.direcao, j.y, 'chinelo').setAngle(-60 * j.direcao);
    this.tweens.add({ targets: c, angle: 60 * j.direcao, duration: 120, onComplete: () => c.destroy() });
    const area = new Phaser.Geom.Rectangle(j.x + (j.direcao > 0 ? 0 : -60), j.y - 30, 60, 60);
    this.inimigos.getChildren().slice().forEach(s => {
      if (s.active && Phaser.Geom.Rectangle.Overlaps(area, s.getBounds())) {
        const critico = Math.random() < 0.2;
        this.acertar(s, critico ? 3 : 1, j.direcao);
        if (critico) SOM.tocar('critico');
        if (critico) this.texto(s.x, s.y - 30, 'CHINELADA!', '#ffef5d');
      }
    });
  }

  // ---- armas do botão 2
  usarArma(j) {
    j.recargaEstilingue = ARMAS[j.arma].recarga;
    if (j.arma === 'estilingue') this.atirar(j);
    else if (j.arma === 'bola') this.chutarBola(j);
    else if (j.arma === 'drone') this.lancarDrone(j);
    else if (j.arma === 'agua') this.esguichar(j);
  }

  atirar(j) {
    SOM.tocar('pedra');
    const p = this.pedras.create(j.x + 16 * j.direcao, j.y - 6, 'pedra');
    p.setVelocityX(650 * j.direcao);
    this.time.delayedCall(900, () => p.active && p.destroy());
  }

  // bola: quica no chão e nas paredes, acerta vários inimigos
  chutarBola(j) {
    SOM.tocar('chute');
    const b = this.bolas.create(j.x + 18 * j.direcao, j.y + 4, 'bola');
    b.setCircle(9).setBounce(0.75, 0.75).setCollideWorldBounds(true).setVelocity(520 * j.direcao, -260).setAngularVelocity(600 * j.direcao);
    b.acertados = new Set();
    this.time.delayedCall(2600, () => { if (b.active) { this.poeira(b.x, b.y); b.destroy(); } });
  }
  bolaAcerta(b, s) {
    if (!b.active || !s.active || b.acertados.has(s)) return;
    b.acertados.add(s);
    this.acertar(s, 2, b.body.velocity.x >= 0 ? 1 : -1);
    b.setVelocity(-b.body.velocity.x * 0.8, -300);
    SOM.tocar('gol');
    this.texto(b.x, b.y - 20, 'GOL!', '#ffffff');
  }

  // drone: voa para frente e solta uma bomba de purpurina
  lancarDrone(j) {
    SOM.tocar('drone');
    const d = this.add.image(j.x, j.y - 30, 'drone').setDepth(8).setFlipX(j.direcao < 0);
    this.tweens.add({ targets: d, x: j.x + 170 * j.direcao, y: j.y - 110, duration: 550, ease: 'Sine.easeOut', onComplete: () => {
      const b = this.bombas.create(d.x, d.y + 10, 'bomba');
      b.setVelocity(0, 50);
      this.time.delayedCall(2000, () => b.active && this.explodir(b));
      this.tweens.add({ targets: d, y: d.y - 200, alpha: 0, duration: 600, onComplete: () => d.destroy() });
    } });
  }
  explodir(b) {
    if (!b.active) return;
    const x = b.x, y = b.y; b.destroy();
    const brilho = this.add.particles(x, y, 'confete', {
      speed: { min: 80, max: 300 }, lifespan: 900, gravityY: 300, scale: { start: 1.2, end: 0 },
      tint: [0xff6bd5, 0xffef5d, 0x6bd1ff, 0xc77dff, 0xffffff], emitting: false,
    });
    brilho.explode(60); this.time.delayedCall(1000, () => brilho.destroy());
    const onda = this.add.circle(x, y, 20, 0xff6bd5, 0.4);
    this.tweens.add({ targets: onda, radius: 100, alpha: 0, duration: 350, onComplete: () => onda.destroy() });
    this.cameras.main.shake(150, 0.006);
    SOM.tocar('explosao');
    this.texto(x, y - 30, 'PURPURINA!', '#ff6bd5');
    this.inimigos.getChildren().slice().forEach(s => {
      if (s.active && Phaser.Math.Distance.Between(s.x, s.y, x, y) < 100) this.acertar(s, 3, s.x >= x ? 1 : -1);
    });
  }

  // pistola d'água: rajada de gotas que empurra
  esguichar(j) {
    SOM.tocar('agua');
    for (let i = 0; i < 6; i++) {
      this.time.delayedCall(i * 55, () => {
        if (j.caido) return;
        const g = this.gotas.create(j.x + 16 * j.direcao, j.y - 4 + Phaser.Math.Between(-4, 4), 'gota');
        g.setVelocity(560 * j.direcao, Phaser.Math.Between(-30, 30));
        this.time.delayedCall(550, () => g.active && g.destroy());
      });
    }
  }
  molhar(s, d) {
    if (!s.active) return;
    s.vida -= 0.5;
    s.setTint(0x6bd1ff); this.time.delayedCall(80, () => s.active && s.clearTint());
    if (s.tipo !== 'chefao') { s.setVelocityX(260 * d); if (!(s.atordoado > 0)) { s.atordoado = 220; s.empurrao = 220; } }
    if (s.vida <= 0) this.confete(s);
  }

  // ---- baús e troca de arma
  abrirBau(b) {
    if (b.aberto) return;
    b.aberto = true; b.setTexture('bau_aberto'); SOM.tocar('bau');
    this.texto(b.x, b.y - 30, ARMAS[b.arma].nome + '!', '#ffe14d');
    this.soltarItem(b.x, b.y - 20, b.arma);
  }
  soltarItem(x, y, arma, largadoPor) {
    const it = this.itens.create(x, y, 'item_' + arma);
    it.bloqueado = largadoPor || null; // quem largou só pega de novo depois de sair de cima
    it.arma = arma; it.espera = this.time.now + 700; it.setVelocityY(-250);
    this.tweens.add({ targets: it, scale: 1.15, duration: 400, yoyo: true, repeat: -1 });
  }
  pegarArma(j, it) {
    if (!it.active || this.time.now < it.espera || j.caido || it.bloqueado === j) return;
    const velha = j.arma;
    j.arma = it.arma; it.destroy(); SOM.tocar('arma');
    this.texto(j.x, j.y - 40, ARMAS[j.arma].icone + ' ' + ARMAS[j.arma].nome, '#ffffff');
    if (velha !== j.arma) this.soltarItem(j.x - 20 * j.direcao, j.y - 10, velha, j); // larga a antiga no chão
  }


  acertar(s, dano, dir) {
    if (!s.active) return;
    s.vida -= dano; if (s.vida > 0) SOM.tocar('acerto');
    s.setTint(0xffffff);
    this.time.delayedCall(80, () => s.active && s.clearTint());
    if (s.tipo === 'chefao') { s.setVelocityX(80 * dir); }
    else if (s.tipo === 'morcego') { s.setVelocity(220 * dir, -120); s.estado = 'voando'; s.relogio = 0; }
    else { s.setVelocity(200 * dir, -180); this.time.delayedCall(250, () => s.active && s.setVelocityX(s.velocidade * dir)); }
    if (s.vida <= 0) this.confete(s);
  }

  // ---- especial do Nícolas: casca de banana
  jogarBanana(j) {
    j.recargaEspecial = 2500; SOM.tocar('banana');
    const b = this.bananas.create(j.x + 20 * j.direcao, j.y - 10, 'banana');
    b.setVelocity(260 * j.direcao, -280).setAngularVelocity(400 * j.direcao);
    b.usos = 3; b.dono = j;
    this.time.delayedCall(8000, () => b.active && b.destroy());
  }

  escorregar(s, b) {
    if (!b.active || !s.active || s.atordoado > 0 || s.tipo === 'chefao' || s.tipo === 'morcego' || s.vitima) return;
    const dir = s.x >= b.dono.x ? 1 : -1; // voa para LONGE do Nícolas
    s.setVelocity(420 * dir, -520);
    s.atordoado = 2200; s.empurrao = 900;
    this.tweens.add({ targets: s, angle: 360 * dir, duration: 700, onComplete: () => s.active && s.setAngle(180) });
    SOM.tocar('escorregar');
    this.texto(s.x, s.y - 40, 'ESCORREGOU!', '#ffe14d');
    this.desmaiar(s, 0);
    b.usos--; if (b.usos <= 0) b.destroy();
  }

  // ---- especial do Theo: MEGA PUM
  megaPum(j) {
    j.recargaEspecial = 5000;
    const nuvem = this.add.circle(j.x, j.y, 30, 0x9bd94a, 0.55).setDepth(6);
    this.tweens.add({ targets: nuvem, radius: 200, alpha: 0, duration: 1100, onComplete: () => nuvem.destroy() });
    const fumaca = this.add.particles(j.x - 10 * j.direcao, j.y + 10, 'confete', {
      speed: { min: 40, max: 180 }, lifespan: 1000, scale: { start: 3, end: 6 }, alpha: { start: 0.5, end: 0 }, tint: [0x9bd94a, 0xc4e86b, 0x7fa83a], emitting: false,
    });
    fumaca.explode(40); this.time.delayedCall(1100, () => fumaca.destroy());
    this.cameras.main.shake(250, 0.008);
    SOM.tocar('pum');
    this.texto(j.x, j.y - 60, 'PRRRRRUUUM!', '#c4e86b');
    this.inimigos.getChildren().slice().forEach(s => {
      if (!s.active || Phaser.Math.Distance.Between(s.x, s.y, j.x, j.y) > 200) return;
      if (s.vitima) this.soltar(s.vitima, true);
      if (s.tipo === 'chefao') { s.atordoado = 1200; s.empurrao = 0; }
      else { s.atordoado = 3500; s.empurrao = 0; s.setAngle(90); }
      this.desmaiar(s, 1);
    });
  }

  desmaiar(s, tipo) {
    if (s.zzz) s.zzz.destroy();
    s.zzz = this.add.text(s.x, s.y - 40, tipo ? '😵 zzz' : '💫', { fontFamily: 'Arial', fontSize: 18 }).setOrigin(0.5).setDepth(15);
  }

  // ---- capturas (estilo Heart of Darkness): aperte os botões rapidinho para se soltar
  capturar(j, s) {
    s.vitima = j;
    j.preso = { s, faltam: Math.max(3, Math.round((s.tipo === 'comedor' ? 12 : 8) * this.dif.apertos)), tempo: 0, dano: 0 };
    j.body.setAllowGravity(false); j.setVelocity(0, 0);
    if (s.tipo === 'comedor') {
      j.setVisible(false);
      this.tweens.add({ targets: s, scaleX: 1.4, scaleY: 1.25, duration: 150 });
      SOM.tocar('nhac');
      this.texto(s.x, s.y - 50, 'NHAC!', '#ffef5d');
    } else {
      SOM.tocar('pegou');
      this.texto(s.x, s.y - 40, 'PEGOU!', '#ff6bd5');
    }
    j.avisoPreso = this.add.text(s.x, s.y - 70, '', { fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff', stroke: '#000', strokeThickness: 5 }).setOrigin(0.5).setDepth(15);
    j.bracoPreso = this.add.graphics().setDepth(5);
  }

  atualizarPreso(j, apertou, delta) {
    const pr = j.preso, s = pr.s;
    if (!s.active) { this.soltar(j, false); return; }
    pr.tempo += delta;
    if (apertou) {
      pr.faltam--;
      this.tweens.add({ targets: s, x: s.x + Phaser.Math.Between(-4, 4), duration: 40, yoyo: true });
      if (pr.faltam <= 0) { this.soltar(j, true); return; }
    }
    if (s.tipo === 'comedor') {
      j.setPosition(s.x, s.y);
      if (pr.tempo > 4000) { // não conseguiu: é cuspido de volta, perdendo 2 corações
        j.vida -= 2; this.texto(s.x, s.y - 50, 'PTUI!', '#9dff4a');
        this.soltar(j, false);
        if (j.vida <= 0) { j.vida = 0; this.cair(j); }
        return;
      }
    } else {
      const lado = j.direcao >= 0 ? -1 : 1;
      j.setPosition(s.x + lado * 34, s.y - 4);
      pr.dano += delta;
      if (pr.dano > 1500) { pr.dano = 0; j.vida--; this.cameras.main.shake(80, 0.004); if (j.vida <= 0) { this.soltar(j, false); this.cair(j); return; } }
      j.bracoPreso.clear().lineStyle(6, 0x2fa88a).lineBetween(s.x, s.y + 6, j.x, j.y - 6);
    }
    j.avisoPreso.setPosition(s.x, s.y - 70).setText('APERTE! ' + '●'.repeat(pr.faltam));
  }

  soltar(j, escapou) {
    const s = j.preso && j.preso.s;
    j.preso = null;
    j.body.setAllowGravity(true); j.setVisible(true);
    if (j.avisoPreso) { j.avisoPreso.destroy(); j.avisoPreso = null; }
    if (j.bracoPreso) { j.bracoPreso.destroy(); j.bracoPreso = null; }
    j.invencivel = 1500;
    if (s && s.active) {
      s.vitima = null; s.atordoado = 1500;
      this.tweens.add({ targets: s, scaleX: 1, scaleY: 1, duration: 150 });
      j.setVelocity(j.x <= s.x ? -320 : 320, -420);
      if (escapou) { SOM.tocar('escapou'); this.texto(s.x, s.y - 50, 'ESCAPOU!', '#7cff6b'); this.acertar(s, 1, j.x <= s.x ? 1 : -1); }
    }
  }

  // ---- morte por derretimento
  confete(s) {
    if (s.zzz) { s.zzz.destroy(); s.zzz = null; }
    const vitima = s.vitima; s.vitima = null;
    const x = s.x, base = s.body ? s.body.bottom : s.y + 20, esc = s.scaleX;
    s.body.enable = false; s.setActive(false);
    if (vitima) { this.soltar(vitima, false); vitima.setVelocity(0, -420); }
    this.tweens.killTweensOf(s);
    s.setTint(0x7dff95);
    this.tweens.add({
      targets: s, scaleY: 0.08 * esc, scaleX: 1.7 * esc, y: base - 2, alpha: 0.85, duration: 700, ease: 'Quad.easeIn',
      onComplete: () => {
        s.destroy();
        const poca = this.add.image(x, base - 4, 'poca').setScale(esc * 0.9).setAlpha(0.8);
        this.tweens.add({ targets: poca, alpha: 0, scaleX: esc * 1.3, delay: 1200, duration: 1500, onComplete: () => poca.destroy() });
      },
    });
    const pingos = this.add.particles(x, base - 10, 'gosma', {
      speed: { min: 60, max: 160 }, angle: { min: 220, max: 320 }, gravityY: 500,
      lifespan: 700, scale: { start: 0.6, end: 0.1 }, emitting: false,
    });
    pingos.explode(14);
    this.time.delayedCall(800, () => pingos.destroy());
    SOM.tocar('splort');
    this.texto(x, base - 50, s.tipo === 'chefao' ? 'GOSMÃO DERRETEU!' : 'SPLORT!', '#7dff95');
  }


  levarDano(j, s, semPisao) {
    if (j.invencivel > 0 || j.caido) return;
    if (!semPisao && s.atordoado > 0 && s.tipo !== 'chefao') return; // tonto/desmaiado não machuca
    if (!semPisao && s.tipo !== 'chefao' && j.body.velocity.y > 100 && j.y < s.y - 15) { // pulou em cima
      j.setVelocityY(-400); this.acertar(s, 1, j.direcao); return;
    }
    if (!semPisao && (s.tipo === 'comedor' || s.tipo === 'agarrador') && !s.vitima && !(s.atordoado > 0) && !j.preso) {
      this.capturar(j, s); return;
    }
    j.vida--; j.invencivel = 1200; SOM.tocar('dano');
    j.setVelocity(j.x < s.x ? -250 : 250, -300);
    this.cameras.main.shake(100, 0.004);
    if (j.vida <= 0) this.cair(j);
  }

  cair(j) {
    j.caido = true; j.setVisible(false); j.body.enable = false;
    j.escalando = false; j.body.setAllowGravity(true);
    const outros = this.jogadores.filter(o => !o.caido);
    if (!outros.length) {
      this.acabou = true;
      SOM.pararMusica(); SOM.tocar('derrota');
      this.mensagem('Os gosmentos venceram desta vez...\nAperte R ou toque na tela para tentar de novo', '#ff5d73');
      this.esperarRecomeco();
      return;
    }
    // no co-op, volta ao lado do parceiro depois de 4 segundos
    this.time.delayedCall(4000, () => {
      if (this.acabou) return;
      const amigo = this.jogadores.find(o => !o.caido);
      if (!amigo) return;
      j.caido = false; j.vida = 3; j.invencivel = 2000;
      j.body.enable = true; j.setVisible(true);
      j.setPosition(amigo.x, amigo.y - 60); j.setVelocity(0, 0);
    });
  }

  vitoria() {
    if (this.acabou) return;
    this.acabou = true;
    this.physics.pause();
    SOM.pararMusica(); SOM.tocar('vitoria');
    this.mensagem('FASE CONCLUÍDA!\nAperte R ou toque na tela para jogar de novo', '#7cff6b');
    this.esperarRecomeco();
  }

  esperarRecomeco() {
    this.input.keyboard.once('keydown-R', () => this.scene.restart());
    this.time.delayedCall(800, () => this.input.once('pointerdown', () => this.scene.restart()));
  }

  mensagem(t, cor) {
    this.add.text(W / 2, H / 2, t, { fontFamily: 'Arial Black', fontSize: 30, color: cor, align: 'center', stroke: '#000', strokeThickness: 6 })
      .setOrigin(0.5).setScrollFactor(0).setDepth(20);
  }

  texto(x, y, t, cor) {
    const tx = this.add.text(x, y, t, { fontFamily: 'Arial Black', fontSize: 16, color: cor, stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
    this.tweens.add({ targets: tx, y: y - 40, alpha: 0, duration: 700, onComplete: () => tx.destroy() });
  }

  poeira(x, y) {
    const e = this.add.particles(x, y, 'confete', { speed: 80, lifespan: 300, scale: { start: 1, end: 0 }, tint: 0xbbbbbb, emitting: false });
    e.explode(8);
    this.time.delayedCall(400, () => e.destroy());
  }
}

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: W, height: H,
  pixelArt: true,
  input: { gamepad: true },
  physics: { default: 'arcade', arcade: { gravity: { y: 1400 }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Menu, Fase],
});
