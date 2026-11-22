// Coração de Marte — protótipo
// Nícolas e Theo contra os alienígenas gosmentos. Nada de sangue: os inimigos derretem!

const W = 960, H = 540, T = 32; // T = tamanho do bloco do mapa

// Mapa da fase (gerado por tools/mapa.py). Legenda:
// # bloco  - plataforma atravessável  H escada  P início  E saída  B chefe
// g gosmento  v água-viva  c cuspidor  m comedor  a agarrador  (MAIÚSCULAS: só no "Quero a minha mãe!")
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
  '#                                    C                                                             #',
  '#                                 -------                                                          #',
  '#                                                                                    -------       #',
  '#                                                                                                  #',
  '#                     H       g         a       A c                                                #',
  '#                 ###-H-###################################                                ------- #',
  '#                     H                                                                            #',
  '#                     H                                                                            #',
  '#             ------  H                                                             -------        #',
  '#                     H   -------                                                                  #',
  '#                     H                                                                            #',
  '#        -------      H                                                         v           -------#',
  '#                     H             ---------                                                      #',
  '#                     H                                                                            #',
  '# -------             H                                                                  -------   #',
  '#           v         H                          c                                                 #',
  '#                     H                       ---------           H     g             c            #',
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
  '#       G     g       H            g         m         g    M     H        a         g      m  G   #',
  '####################################################################################################',
];

const MAPA_W = MAPA[0].length * T, MAPA_H = MAPA.length * T;
const TIPOS = { g: 'sombra', v: 'morcego', c: 'cuspidor', m: 'comedor', a: 'agarrador', b: 'chefao' };

const CHARS = {
  nicolas: { nome: 'Nícolas', cor: 0x3fa9f5, habilidade: 'Casca de banana' },
  theo:    { nome: 'Theo',    cor: 0xff9f1c, habilidade: 'Mega pum' },
};

const CONTROLES = [
  { esq: 'A', dir: 'D', pulo: 'W', baixo: 'S', chinelo: 'F', estilingue: 'G', especial: 'H', texto: 'A/D andar · W pular/subir · S descer · F chinelo · G estilingue · H especial' },
  { esq: 'LEFT', dir: 'RIGHT', pulo: 'UP', baixo: 'DOWN', chinelo: 'K', estilingue: 'L', especial: 'J', texto: 'Setas andar/pular/subir/descer · K chinelo · L estilingue · J especial' },
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
      op.on('pointerdown', () => { this.telaCheia(); aoEscolher(i); });
      this.itens.push(op);
    });
    ['ONE', 'TWO', 'THREE'].forEach((k, i) => this.input.keyboard.once('keydown-' + k, () => aoEscolher(i)));
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

    // jogadores
    const ini = pecas.find(p => p.ch === 'P');
    this.jogadores = this.escolha.map((id, i) => this.criarJogador(id, i, ini.x + i * 50, ini.y - 30));

    // saída
    const ex = pecas.find(p => p.ch === 'E');
    this.chegada = this.add.rectangle(ex.x, ex.y - 60, 20, 120, 0x7cff6b);
    this.physics.add.existing(this.chegada, true);
    this.add.text(ex.x, ex.y - 140, 'SAÍDA', { fontFamily: 'Arial Black', fontSize: 20, color: '#7cff6b' }).setOrigin(0.5);

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

    this.physics.add.collider(this.jogadores, this.chao);
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

    this.hud = this.add.text(16, 12, '', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setScrollFactor(0).setDepth(10);
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('Menu'));
    this.criarControlesToque();
  }

  // botões na tela para celular/tablet (controlam o Jogador 1)
  criarControlesToque() {
    this.toque = { esq: false, dir: false, cima: false, baixo: false, pulo: false, chinelo: false, estilingue: false, especial: false };
    this.botoes = [];
    if (!this.sys.game.device.input.touch) return;
    this.input.addPointer(4); // até 5 dedos ao mesmo tempo
    const botao = (x, y, r, rotulo, chave, segurar) => {
      const circ = this.add.circle(x, y, r, 0xffffff, 0.18).setStrokeStyle(3, 0xffffff, 0.5).setScrollFactor(0).setDepth(30);
      this.add.text(x, y, rotulo, { fontFamily: 'Arial Black', fontSize: r * 0.55, color: '#ffffff' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(31).setAlpha(0.8);
      this.botoes.push({ x, y, r: r * 1.25, chave, segurar, circ, antes: false });
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
  }

  // lê todos os dedos na tela a cada quadro: vários botões ao mesmo tempo, e dá pra arrastar o dedo
  lerToque() {
    if (!this.botoes || !this.botoes.length) return;
    const dedos = this.input.manager.pointers.filter(p => p.isDown);
    this.botoes.forEach(b => {
      const agora = dedos.some(p => Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y) <= b.r);
      if (b.segurar) this.toque[b.chave] = agora;
      else if (agora && !b.antes) this.toque[b.chave] = true; // acabou de apertar
      b.antes = agora;
      b.circ.setFillStyle(0xffffff, agora ? 0.4 : 0.18);
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
    // alien gosmento comum: gota verde com 3 olhos
    g.fillStyle(0x4fd16b).fillEllipse(20, 26, 40, 28).fillCircle(20, 16, 14)
     .fillStyle(0x7dff95).fillCircle(14, 12, 4).fillStyle(0xffffff).fillCircle(10, 18, 4).fillCircle(20, 14, 4).fillCircle(30, 18, 4)
     .fillStyle(0x000000).fillCircle(10, 18, 2).fillCircle(20, 14, 2).fillCircle(30, 18, 2);
    g.generateTexture('sombra', 40, 40).clear();
    // alien voador: água-viva gosmenta
    g.fillStyle(0x6bd1ff).fillEllipse(20, 10, 34, 18).fillRect(8, 12, 4, 12).fillRect(18, 12, 4, 14).fillRect(28, 12, 4, 12)
     .fillStyle(0xffffff).fillCircle(14, 8, 3).fillCircle(26, 8, 3).fillStyle(0x000000).fillCircle(14, 8, 1.5).fillCircle(26, 8, 1.5);
    g.generateTexture('morcego', 40, 26).clear();
    // cuspidor: cogumelo alien
    g.fillStyle(0x8a4fd1).fillEllipse(20, 14, 40, 22).fillStyle(0xb6ff6b).fillRect(12, 20, 16, 18)
     .fillStyle(0x000000).fillCircle(20, 28, 4);
    g.generateTexture('cuspidor', 40, 40).clear();
    // comedor: bocão enorme
    g.fillStyle(0x3fbf5f).fillEllipse(30, 32, 60, 52).fillStyle(0x7a1f3d).fillEllipse(30, 38, 42, 22)
     .fillStyle(0xffffff).fillTriangle(12, 30, 18, 30, 15, 37).fillTriangle(24, 28, 30, 28, 27, 36).fillTriangle(36, 28, 42, 28, 39, 36)
     .fillStyle(0xfff36b).fillCircle(30, 12, 7).fillStyle(0x000000).fillCircle(30, 12, 3);
    g.generateTexture('comedor', 60, 58).clear();
    // agarrador: corpo com tentáculos longos
    g.fillStyle(0x2fa88a).fillEllipse(24, 18, 34, 30).fillRect(4, 22, 6, 24).fillRect(38, 22, 6, 24).fillRect(20, 28, 8, 20)
     .fillStyle(0xff6bd5).fillCircle(17, 15, 4).fillCircle(31, 15, 4);
    g.generateTexture('agarrador', 48, 48).clear();
    g.fillStyle(0x9dff4a).fillCircle(7, 7, 7); g.generateTexture('gosma', 14, 14).clear();
    g.fillStyle(0xffe14d).fillEllipse(14, 10, 26, 10).fillTriangle(2, 10, 8, 2, 10, 10).fillTriangle(26, 10, 20, 2, 18, 10)
     .fillStyle(0x6b4a1f).fillCircle(14, 6, 2); g.generateTexture('banana', 28, 16).clear();
    g.fillStyle(0x7dff95).fillEllipse(30, 8, 60, 16); g.generateTexture('poca', 60, 16).clear();
    Object.entries(CHARS).forEach(([id, c]) => {
      g.fillStyle(c.cor).fillRoundedRect(4, 14, 24, 30, 6);     // corpo
      g.fillStyle(0xf2c9a0).fillCircle(16, 10, 10);              // cabeça
      g.fillStyle(0x000000).fillCircle(20, 9, 2);                // olho
      g.generateTexture(id, 32, 46).clear();
    });
    g.fillStyle(0xff5d73).fillRoundedRect(0, 0, 26, 10, 4); g.generateTexture('chinelo', 26, 10).clear();
    g.destroy();
  }

  criarJogador(id, idx, x, y) {
    const j = this.physics.add.sprite(x, y, id);
    j.setCollideWorldBounds(true);
    j.body.setSize(24, 44).setOffset(4, 2);
    const c = CONTROLES[idx];
    const k = this.input.keyboard.addKeys(c);
    Object.assign(j, {
      id, idx, k, vida: this.dif.vidaJog, vidaMax: this.dif.vidaJog, direcao: 1, pulosExtras: 0,
      invencivel: 0, recargaChinelo: 0, recargaEstilingue: 0, recargaEspecial: 0, deslizando: 0, caido: false,
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
    const g = this.gosmas.create(s.x, s.y - 10, 'gosma');
    const ang = Phaser.Math.Angle.Between(s.x, s.y, alvo.x, alvo.y);
    g.setVelocity(Math.cos(ang) * vel, Math.sin(ang) * vel);
    this.time.delayedCall(2500, () => g.active && g.destroy());
  }

  pensarInimigo(s, delta) {
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
        if (alvo && alvo.d < 500) { s.ativado = true; this.texto(s.x, s.y - 90, 'O GOSMÃO ACORDOU!', '#ff5d73'); this.cameras.main.shake(300, 0.01); }
        return;
      }
      s.recarga -= delta;
      const raiva = s.vida < s.vidaMax / 2; // metade da vida: fica mais rápido
      if (alvo && s.body.blocked.down) s.setVelocityX(Math.sign(alvo.j.x - s.x) * s.velocidade * (raiva ? 1.7 : 1));
      if (alvo && s.recarga <= 0 && s.body.blocked.down) {
        s.recarga = raiva ? 1300 : 2000;
        if (Math.random() < 0.5) { s.setVelocityY(-650); s.pulando = true; }
        else { for (let a = -1; a <= 1; a++) this.cuspir(s, { x: alvo.j.x, y: alvo.j.y + a * 90 }, 300); }
      }
      if (s.pulando && s.body.blocked.down && s.body.velocity.y >= 0) {
        s.pulando = false; this.cameras.main.shake(200, 0.012);
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
      `${CHARS[j.id].nome}: ${j.caido ? '💫 voltando...' : '❤'.repeat(j.vida) + '♡'.repeat(j.vidaMax - j.vida)}`
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
      if (pulo2 && (esq || dir)) { j.escalando = false; j.body.setAllowGravity(true); j.setVelocityY(-450); }
      if (chinelo2 && j.recargaChinelo === 0) this.chinelada(j);
      if (estilingue2 && j.recargaEstilingue === 0) this.atirar(j);
      return;
    }
    // descer de plataforma atravessável: ▼ + pular, ou só ▼
    if (baixo && noChao && !j.descendo && this.pontes.getChildren().some(pt => Math.abs(pt.body.top - j.body.bottom) < 4 && j.x > pt.x && j.x < pt.x + pt.width)) {
      j.descendo = true; this.time.delayedCall(280, () => { j.descendo = false; });
    }
    if (noChao) j.pulosExtras = j.id === 'nicolas' ? 1 : 0;

    if (j.deslizando > 0) {
      j.setVelocityX(480 * j.direcao);
    } else {
      if (esq) { j.setVelocityX(-220); j.direcao = -1; }
      else if (dir) { j.setVelocityX(220); j.direcao = 1; }
      else j.setVelocityX(0);
    }
    j.setFlipX(j.direcao < 0);

    if (pulo2) {
      if (noChao) j.setVelocityY(-560);
      else if (j.pulosExtras > 0) { j.pulosExtras--; j.setVelocityY(-500); this.poeira(j.x, j.y + 20); }
    }

    // especiais para ganhar tempo: Nícolas joga casca de banana; Theo solta o MEGA PUM
    if (especial2 && j.recargaEspecial === 0) {
      if (j.id === 'nicolas') this.jogarBanana(j);
      else this.megaPum(j);
    }

    if (chinelo2 && j.recargaChinelo === 0) this.chinelada(j);
    if (estilingue2 && j.recargaEstilingue === 0) this.atirar(j);
  }

  chinelada(j) {
    j.recargaChinelo = 300;
    const c = this.add.image(j.x + 24 * j.direcao, j.y, 'chinelo').setAngle(-60 * j.direcao);
    this.tweens.add({ targets: c, angle: 60 * j.direcao, duration: 120, onComplete: () => c.destroy() });
    const area = new Phaser.Geom.Rectangle(j.x + (j.direcao > 0 ? 0 : -60), j.y - 30, 60, 60);
    this.inimigos.getChildren().slice().forEach(s => {
      if (s.active && Phaser.Geom.Rectangle.Overlaps(area, s.getBounds())) {
        const critico = Math.random() < 0.2;
        this.acertar(s, critico ? 3 : 1, j.direcao);
        if (critico) this.texto(s.x, s.y - 30, 'CHINELADA!', '#ffef5d');
      }
    });
  }

  atirar(j) {
    j.recargaEstilingue = 450;
    const p = this.pedras.create(j.x + 16 * j.direcao, j.y - 6, 'pedra');
    p.setVelocityX(650 * j.direcao);
    this.time.delayedCall(900, () => p.active && p.destroy());
  }

  acertar(s, dano, dir) {
    if (!s.active) return;
    s.vida -= dano;
    s.setTint(0xffffff);
    this.time.delayedCall(80, () => s.active && s.clearTint());
    if (s.tipo === 'chefao') { s.setVelocityX(80 * dir); }
    else if (s.tipo === 'morcego') { s.setVelocity(220 * dir, -120); s.estado = 'voando'; s.relogio = 0; }
    else { s.setVelocity(200 * dir, -180); this.time.delayedCall(250, () => s.active && s.setVelocityX(s.velocidade * dir)); }
    if (s.vida <= 0) this.confete(s);
  }

  // ---- especial do Nícolas: casca de banana
  jogarBanana(j) {
    j.recargaEspecial = 2500;
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
      this.texto(s.x, s.y - 50, 'NHAC!', '#ffef5d');
    } else {
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
      if (escapou) { this.texto(s.x, s.y - 50, 'ESCAPOU!', '#7cff6b'); this.acertar(s, 1, j.x <= s.x ? 1 : -1); }
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
    j.vida--; j.invencivel = 1200;
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
