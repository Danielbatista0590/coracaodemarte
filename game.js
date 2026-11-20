// Coração de Marte — protótipo
// Nícolas e Theo contra as criaturas de sombra. Nada de sangue: inimigos viram confete!

const W = 960, H = 540, WORLD_W = 3200;

const CHARS = {
  nicolas: { nome: 'Nícolas', cor: 0x3fa9f5, habilidade: 'Pulo duplo' },
  theo:    { nome: 'Theo',    cor: 0xff9f1c, habilidade: 'Deslizada' },
};

const CONTROLES = [
  { esq: 'A', dir: 'D', pulo: 'W', chinelo: 'F', estilingue: 'G', especial: 'H', texto: 'A/D andar · W pular · F chinelo · G estilingue · H especial' },
  { esq: 'LEFT', dir: 'RIGHT', pulo: 'UP', chinelo: 'K', estilingue: 'L', especial: 'J', texto: 'Setas andar/pular · K chinelo · L estilingue · J especial' },
];

// ---------------------------------------------------------------- MENU
class Menu extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    this.add.text(W / 2, 110, 'CORAÇÃO DE MARTE', { fontFamily: 'Arial Black', fontSize: 52, color: '#ff5d73' }).setOrigin(0.5);
    this.add.text(W / 2, 170, 'Nícolas e Theo contra as criaturas de sombra', { fontFamily: 'Arial', fontSize: 20, color: '#cfc8ff' }).setOrigin(0.5);
    const opcoes = [
      '1  —  Jogar com o Nícolas (pulo duplo)',
      '2  —  Jogar com o Theo (deslizada)',
      '3  —  Os dois juntos (2 jogadores)',
    ];
    const escolhas = [['nicolas'], ['theo'], ['nicolas', 'theo']];
    opcoes.forEach((t, i) => {
      const op = this.add.text(W / 2, 260 + i * 56, t, { fontFamily: 'Arial', fontSize: 26, color: '#ffffff', backgroundColor: '#2b2350', padding: { x: 14, y: 8 } })
        .setOrigin(0.5).setInteractive({ useHandCursor: true });
      op.on('pointerdown', () => {
        if (this.sys.game.device.input.touch) {
          try {
            if (!this.scale.isFullscreen) this.scale.startFullscreen();
            // trava em paisagem (funciona no Android/Chrome; no iPhone é ignorado)
            setTimeout(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (e) {} }, 300);
          } catch (e) {}
        }
        this.scene.start('Fase', { jogadores: escolhas[i] });
      });
    });
    this.add.text(W / 2, 470, 'Jogador 1: ' + CONTROLES[0].texto, { fontFamily: 'Arial', fontSize: 15, color: '#9a93c9' }).setOrigin(0.5);
    this.add.text(W / 2, 495, 'Jogador 2: ' + CONTROLES[1].texto, { fontFamily: 'Arial', fontSize: 15, color: '#9a93c9' }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ONE', () => this.scene.start('Fase', { jogadores: ['nicolas'] }));
    this.input.keyboard.on('keydown-TWO', () => this.scene.start('Fase', { jogadores: ['theo'] }));
    this.input.keyboard.on('keydown-THREE', () => this.scene.start('Fase', { jogadores: ['nicolas', 'theo'] }));
  }
}

// ---------------------------------------------------------------- FASE
class Fase extends Phaser.Scene {
  constructor() { super('Fase'); }

  init(data) { this.escolha = data.jogadores; this.acabou = false; }

  create() {
    this.criarTexturas();
    this.physics.world.setBounds(0, 0, WORLD_W, H + 200);
    this.cameras.main.setBounds(0, 0, WORLD_W, H);
    this.cameras.main.setBackgroundColor('#1a1433');

    // fundo com "estrelas"
    for (let i = 0; i < 120; i++) {
      this.add.circle(Phaser.Math.Between(0, WORLD_W), Phaser.Math.Between(0, H - 100), Phaser.Math.Between(1, 2), 0xffffff, 0.4).setScrollFactor(0.4);
    }

    // plataformas
    this.chao = this.physics.add.staticGroup();
    const plat = (x, y, w, h = 24) => {
      const p = this.add.tileSprite(x, y, w, h, 'bloco').setOrigin(0, 0);
      this.physics.add.existing(p, true);
      this.chao.add(p);
    };
    plat(0, H - 40, 900, 40);
    plat(1000, H - 40, 700, 40);
    plat(1820, H - 40, 600, 40);
    plat(2520, H - 40, 680, 40);
    plat(350, 380, 180); plat(620, 300, 160); plat(1150, 360, 200);
    plat(1450, 270, 160); plat(1700, 360, 140); plat(2050, 320, 200);
    plat(2350, 250, 140); plat(2700, 340, 200);

    // bandeira de chegada
    this.chegada = this.add.rectangle(3100, H - 100, 20, 120, 0x7cff6b);
    this.physics.add.existing(this.chegada, true);
    this.add.text(3060, H - 190, 'SAÍDA', { fontFamily: 'Arial Black', fontSize: 20, color: '#7cff6b' });

    // jogadores
    this.jogadores = this.escolha.map((id, i) => this.criarJogador(id, i, 120 + i * 60));

    // inimigos
    this.inimigos = this.physics.add.group();
    [[700, H - 80], [1200, H - 80], [1250, 320], [1500, H - 80], [1900, H - 80], [2100, 280], [2300, H - 80], [2600, H - 80], [2800, H - 80], [2750, 300]]
      .forEach(([x, y]) => this.criarInimigo(x, y));

    // projéteis
    this.pedras = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.jogadores, this.chao);
    this.physics.add.collider(this.inimigos, this.chao);
    this.physics.add.overlap(this.pedras, this.inimigos, (pedra, ini) => {
      if (!pedra.active || !ini.active) return;
      const dir = pedra.body.velocity.x > 0 ? 1 : -1; // ler a direção ANTES de destruir a pedra
      pedra.destroy();
      this.acertar(ini, 1, dir);
    });
    this.physics.add.collider(this.pedras, this.chao, (pedra) => pedra.destroy());
    this.physics.add.overlap(this.jogadores, this.inimigos, (j, ini) => this.levarDano(j, ini));
    this.physics.add.overlap(this.jogadores, this.chegada, () => this.vitoria());

    // câmera segue o ponto médio entre os jogadores
    this.alvoCamera = this.add.zone(0, 0, 1, 1);
    this.cameras.main.startFollow(this.alvoCamera, true, 0.1, 0.1);

    this.hud = this.add.text(16, 12, '', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setScrollFactor(0).setDepth(10);
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('Menu'));
    this.criarControlesToque();
  }

  // botões na tela para celular/tablet (controlam o Jogador 1)
  criarControlesToque() {
    this.toque = { esq: false, dir: false, pulo: false, chinelo: false, estilingue: false, especial: false };
    if (!this.sys.game.device.input.touch) return;
    this.input.addPointer(3); // até 4 dedos ao mesmo tempo
    const botao = (x, y, r, rotulo, chave, segurar) => {
      const b = this.add.circle(x, y, r, 0xffffff, 0.18).setStrokeStyle(3, 0xffffff, 0.5)
        .setScrollFactor(0).setDepth(30).setInteractive();
      this.add.text(x, y, rotulo, { fontFamily: 'Arial Black', fontSize: r * 0.55, color: '#ffffff' })
        .setOrigin(0.5).setScrollFactor(0).setDepth(31).setAlpha(0.8);
      const soltar = () => { if (segurar) this.toque[chave] = false; b.setFillStyle(0xffffff, 0.18); };
      b.on('pointerdown', () => { this.toque[chave] = true; b.setFillStyle(0xffffff, 0.4); });
      b.on('pointerup', soltar); b.on('pointerout', soltar);
    };
    botao(80, H - 80, 52, '◀', 'esq', true);
    botao(200, H - 80, 52, '▶', 'dir', true);
    botao(W - 80, H - 80, 52, '⤒', 'pulo', false);
    botao(W - 190, H - 70, 44, '🩴', 'chinelo', false);
    botao(W - 150, H - 175, 40, '🎯', 'estilingue', false);
    botao(W - 50, H - 190, 38, '★', 'especial', false);
    const menu = this.add.text(W - 16, 12, '☰', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(30).setInteractive();
    menu.on('pointerdown', () => this.scene.start('Menu'));
  }

  criarTexturas() {
    if (this.textures.exists('bloco')) return;
    const g = this.add.graphics();
    g.fillStyle(0x3b2f6b).fillRect(0, 0, 32, 32).fillStyle(0x52449a).fillRect(0, 0, 32, 6);
    g.generateTexture('bloco', 32, 32).clear();
    g.fillStyle(0xffffff).fillRect(0, 0, 6, 6); g.generateTexture('confete', 6, 6).clear();
    g.fillStyle(0xd9d2c5).fillCircle(5, 5, 5); g.generateTexture('pedra', 10, 10).clear();
    // sombra: bolha roxa com olhinhos
    g.fillStyle(0x2a1f3d).fillEllipse(20, 22, 40, 36).fillStyle(0xfff36b).fillCircle(13, 18, 4).fillCircle(27, 18, 4);
    g.generateTexture('sombra', 40, 40).clear();
    Object.entries(CHARS).forEach(([id, c]) => {
      g.fillStyle(c.cor).fillRoundedRect(4, 14, 24, 30, 6);     // corpo
      g.fillStyle(0xf2c9a0).fillCircle(16, 10, 10);              // cabeça
      g.fillStyle(0x000000).fillCircle(20, 9, 2);                // olho
      g.generateTexture(id, 32, 46).clear();
    });
    g.fillStyle(0xff5d73).fillRoundedRect(0, 0, 26, 10, 4); g.generateTexture('chinelo', 26, 10).clear();
    g.destroy();
  }

  criarJogador(id, idx, x) {
    const j = this.physics.add.sprite(x, H - 120, id);
    j.setCollideWorldBounds(true);
    j.body.setSize(24, 44).setOffset(4, 2);
    const c = CONTROLES[idx];
    const k = this.input.keyboard.addKeys(c);
    Object.assign(j, {
      id, idx, k, vida: 5, vidaMax: 5, direcao: 1, pulosExtras: 0,
      invencivel: 0, recargaChinelo: 0, recargaEstilingue: 0, recargaEspecial: 0, deslizando: 0, caido: false,
    });
    return j;
  }

  criarInimigo(x, y) {
    const s = this.inimigos.create(x, y, 'sombra');
    s.vida = 3; s.velocidade = Phaser.Math.Between(50, 90);
    s.setVelocityX(s.velocidade * (Math.random() < 0.5 ? -1 : 1));
    s.setCollideWorldBounds(true).setBounce(0);
    this.tweens.add({ targets: s, scaleY: 0.9, duration: 400, yoyo: true, repeat: -1 });
  }

  pad(j) {
    const p = this.input.gamepad && this.input.gamepad.getPad(j.idx);
    return p || null;
  }

  update(time, delta) {
    if (this.acabou) return;
    const vivos = this.jogadores.filter(j => !j.caido);
    vivos.forEach(j => this.controlarJogador(j, delta));

    // inimigos patrulham e viram na borda/parede
    this.inimigos.children.each(s => {
      if (!s.active) return;
      if (s.body.blocked.left) s.setVelocityX(s.velocidade);
      if (s.body.blocked.right) s.setVelocityX(-s.velocidade);
      if (s.body.blocked.down) {
        const frente = s.x + (s.body.velocity.x > 0 ? 24 : -24);
        const temChao = this.chao.getChildren().some(p => frente > p.x && frente < p.x + p.width && Math.abs(p.y - s.body.bottom) < 6);
        if (!temChao) s.setVelocityX(-s.body.velocity.x);
      }
      s.setFlipX(s.body.velocity.x < 0);
    });

    // câmera
    if (vivos.length) {
      this.alvoCamera.x = vivos.reduce((a, j) => a + j.x, 0) / vivos.length;
      this.alvoCamera.y = H / 2;
    }

    // caiu no buraco
    this.jogadores.forEach(j => { if (!j.caido && j.y > H + 60) this.cair(j); });

    this.hud.setText(this.jogadores.map(j =>
      `${CHARS[j.id].nome}: ${j.caido ? '💫 voltando...' : '❤'.repeat(j.vida) + '♡'.repeat(j.vidaMax - j.vida)}`
    ).join('     ') + `     Sombras: ${this.inimigos.countActive()}`);
  }

  controlarJogador(j, delta) {
    const k = j.k, p = this.pad(j);
    const esqK = k.esq.isDown || (p && (p.left || p.leftStick.x < -0.4));
    const dirK = k.dir.isDown || (p && (p.right || p.leftStick.x > 0.4));
    const esq0 = esqK, dir0 = dirK;
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
    const noChao = j.body.blocked.down;
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

    // especial: Nícolas = super pulo para baixo (pisão); Theo = deslizada invencível
    if (especial2 && j.recargaEspecial === 0) {
      if (j.id === 'theo') {
        j.deslizando = 260; j.invencivel = Math.max(j.invencivel, 300); j.recargaEspecial = 800;
        this.poeira(j.x, j.y + 20);
      } else if (!noChao) {
        j.setVelocityY(800); j.pisando = true; j.recargaEspecial = 800;
      }
    }
    if (j.pisando && noChao) {
      j.pisando = false;
      this.cameras.main.shake(120, 0.006);
      this.inimigos.getChildren().slice().forEach(s => { if (s.active && Math.abs(s.x - j.x) < 110 && Math.abs(s.y - j.y) < 60) this.acertar(s, 2, Math.sign(s.x - j.x) || 1); });
      this.poeira(j.x, j.y + 20);
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
    s.setVelocity(200 * dir, -180);
    this.time.delayedCall(250, () => s.active && s.setVelocityX(s.velocidade * dir));
    if (s.vida <= 0) this.confete(s);
  }

  confete(s) {
    const cores = [0xff5d73, 0xffef5d, 0x7cff6b, 0x3fa9f5, 0xc77dff];
    const e = this.add.particles(s.x, s.y, 'confete', {
      speed: { min: 120, max: 320 }, angle: { min: 200, max: 340 }, gravityY: 600,
      lifespan: 900, tint: cores, rotate: { start: 0, end: 360 }, emitting: false,
    });
    e.explode(30);
    this.time.delayedCall(1000, () => e.destroy());
    this.texto(s.x, s.y - 20, 'POF!', '#ffffff');
    s.destroy();
  }

  levarDano(j, s) {
    if (j.invencivel > 0 || j.caido) return;
    if (j.body.velocity.y > 100 && j.y < s.y - 15) { // pulou em cima
      j.setVelocityY(-400); this.acertar(s, 1, j.direcao); return;
    }
    j.vida--; j.invencivel = 1200;
    j.setVelocity(j.x < s.x ? -250 : 250, -300);
    this.cameras.main.shake(100, 0.004);
    if (j.vida <= 0) this.cair(j);
  }

  cair(j) {
    j.caido = true; j.setVisible(false); j.body.enable = false;
    const outros = this.jogadores.filter(o => !o.caido);
    if (!outros.length) {
      this.acabou = true;
      this.mensagem('As sombras venceram desta vez...\nAperte R ou toque na tela para tentar de novo', '#ff5d73');
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

new Phaser.Game({
  type: Phaser.AUTO,
  width: W, height: H,
  pixelArt: true,
  input: { gamepad: true },
  physics: { default: 'arcade', arcade: { gravity: { y: 1400 }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Menu, Fase],
});
