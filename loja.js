// Loja dos hologramas: entre um mundo e outro, a família vende corações e melhorias em troca de moedas de gosma.
const LOJA = [
  { id: 'coracao',    quem: 'daniel', nome: '❤ Coração extra',           desc: '+1 coração para os dois', precos: [20, 40, 70, 100] },
  { id: 'chinelo',    quem: 'anne',   nome: '🩴 Chinelo de mãe turbinado', desc: 'chinelada mais forte',     precos: [25, 55] },
  { id: 'especial',   quem: 'anne',   nome: '★ Especial mais rápido',     desc: 'banana e pum recarregam antes', precos: [30, 60] },
  { id: 'cambalhota', quem: 'anne',   nome: '🤸 Cambalhota ninja',         desc: 'cambalhota recarrega bem rápido', precos: [30] },
  { id: 'arma_bola',  quem: 'ithalo', nome: '⚽ Começar com a bola',      desc: 'a bola vira a arma inicial', precos: [35], arma: 'bola' },
  { id: 'arma_agua',  quem: 'ithalo', nome: "💦 Começar com a pistola",   desc: "a pistola d'água vira a arma inicial", precos: [35], arma: 'agua' },
  { id: 'arma_drone', quem: 'ithalo', nome: '🚁 Começar com o drone',     desc: 'o drone vira a arma inicial', precos: [60], arma: 'drone' },
];
const FALAS_LOJA = {
  daniel: ['Comprem corações, filhos! Cuidado com o bocão!', 'Juntem gosma que o papai transforma em coração.'],
  anne:   ['Esse chinelo é de mãe: não erra nunca!', 'Theo, segura esse pum perto do Lucca, hein!'],
  ithalo: ['Primo, essa bola quica em tudo, é muito roubada!', 'O drone de purpurina é o meu favorito!'],
};

class Loja extends Phaser.Scene {
  constructor() { super('Loja'); }
  init(data) { this.depois = data.depois; this.saindo = false; }

  create() {
    Fase.prototype.criarTexturas.call(this);
    gerarTexturasHistoria(this);
    SOM.pararMusica();
    this.cameras.main.setBackgroundColor('#06121f');
    for (let y = 0; y < H; y += 6) this.add.rectangle(W / 2, y, W, 1, 0x6be4ff, 0.05);
    this.add.text(W / 2, 30, 'LOJA DOS HOLOGRAMAS', { fontFamily: 'Arial Black', fontSize: 30, color: '#6be4ff' }).setOrigin(0.5);
    this.saldo = this.add.text(W / 2, 66, '', { fontFamily: 'Arial Black', fontSize: 20, color: '#9dff4a' }).setOrigin(0.5);
    // a família
    ['daniel', 'anne', 'ithalo'].forEach((id, i) => {
      const x = 150 + i * 330;
      const h = this.add.image(x - 95, 150, 'holo_' + id).setScale(2).setAlpha(0.85);
      this.tweens.add({ targets: h, alpha: 0.45, duration: 120, yoyo: true, repeat: -1, repeatDelay: 1800 + i * 400 });
      this.add.text(x - 95, 212, FAMILIA[id].nome, { fontFamily: 'Arial Black', fontSize: 13, color: FAMILIA[id].cor }).setOrigin(0.5);
      this.add.text(x - 50, 110, Phaser.Utils.Array.GetRandom(FALAS_LOJA[id]), { fontFamily: 'Arial', fontSize: 14, color: '#ffffff', backgroundColor: '#ffffff22', padding: { x: 6, y: 4 }, wordWrap: { width: 220 } });
    });
    // itens
    this.linhas = LOJA.map((it, i) => {
      const y = 250 + i * 34;
      const t = this.add.text(70, y, '', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', backgroundColor: '#1b2a40', padding: { x: 10, y: 4 }, fixedWidth: 820 })
        .setInteractive({ useHandCursor: true });
      t.on('pointerdown', () => this.comprar(i));
      return t;
    });
    const seguir = this.add.text(W / 2, H - 22, 'Continuar a aventura ▶  (Enter)', { fontFamily: 'Arial Black', fontSize: 20, color: '#000', backgroundColor: '#9dff4a', padding: { x: 14, y: 6 } })
      .setOrigin(0.5).setInteractive({ useHandCursor: true });
    seguir.on('pointerdown', () => this.sair());
    this.input.keyboard.on('keydown-ENTER', () => this.sair());
    this.input.keyboard.on('keydown', e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= LOJA.length) this.comprar(n - 1); });
    this.sel = 0;
    ouvirControle(this, b => {
      if (b === BOTAO.CIMA) this.sel = (this.sel + LOJA.length - 1) % LOJA.length;
      if (b === BOTAO.BAIXO) this.sel = (this.sel + 1) % LOJA.length;
      if (b === BOTAO.A) this.comprar(this.sel);
      if (b === BOTAO.START || b === BOTAO.B) this.sair();
      this.atualizar();
    });
    this.add.text(W / 2, H - 50, '🎮 setas: escolher · A: comprar · Start: continuar', { fontFamily: 'Arial', fontSize: 13, color: '#6b8aa0' }).setOrigin(0.5);
    this.atualizar();
  }

  atualizar() {
    this.saldo.setText(`Moedas de gosma: 🪙 ${PROGRESSO.moedas}`);
    LOJA.forEach((it, i) => {
      const nv = PROGRESSO.nivel(it.id), max = it.precos.length;
      const comprado = nv >= max;
      const usando = it.arma && PROGRESSO.inicial === it.arma;
      const preco = comprado ? (it.arma ? (usando ? 'EQUIPADA' : 'toque p/ usar') : 'MÁXIMO') : `🪙 ${it.precos[nv]}`;
      const nivelTxt = max > 1 ? ` [${'■'.repeat(nv)}${'□'.repeat(max - nv)}]` : '';
      this.linhas[i].setText(`${i + 1}. ${it.nome}${nivelTxt} — ${it.desc}   →   ${preco}`)
        .setColor(comprado ? '#9dff4a' : PROGRESSO.moedas >= it.precos[nv] ? '#ffffff' : '#7a8aa0')
        .setBackgroundColor(i === this.sel ? '#3a5a8a' : '#1b2a40');
    });
  }

  comprar(i) {
    const it = LOJA[i], nv = PROGRESSO.nivel(it.id);
    if (nv >= it.precos.length) {
      if (it.arma) { PROGRESSO.inicial = it.arma; SOM.tocar('arma'); this.atualizar(); }
      return;
    }
    if (!PROGRESSO.gastar(it.precos[nv])) { SOM.tocar('dano'); this.cameras.main.shake(100, 0.004); return; }
    PROGRESSO.subir(it.id);
    if (it.arma) PROGRESSO.inicial = it.arma;
    SOM.tocar('bau');
    this.atualizar();
  }

  sair() {
    if (this.saindo) return; this.saindo = true;
    const d = this.depois || { cena: 'Menu' };
    this.scene.start(d.cena, d.dados);
  }
}
