# Coração de Marte

Jogo de ação e plataforma (inspirado em Dead Cells e Heart of Darkness) com Nícolas e Theo, de 8 anos. Ninguém se machuca: as criaturas de sombra viram confete.

**Jogar:** abra `index.html` no navegador ou ative o GitHub Pages (Settings → Pages → branch `main`).

| | Jogador 1 | Jogador 2 |
|---|---|---|
| Andar | A / D | ← / → |
| Pular / subir escada | W | ↑ |
| Descer (escada ou plataforma de madeira) | S | ↓ |
| Cambalhota (desvia de tudo) | A A ou D D rápido | ← ← ou → → rápido |
| Chinelo | F | K |
| Arma (estilingue, bola, drone ou pistola d'água) | G | L |
| Especial | H | J |

Nícolas tem pulo duplo. Especiais: **Nícolas** joga uma casca de banana, e os alienígenas que pisam nela escorregam para longe e ficam tontos. **Theo** solta um MEGA PUM, e os alienígenas em volta desmaiam por alguns segundos.
Também funciona com controle: A pula, X dá chinelada, Y atira com o estilingue e B usa o especial.

O mapa é desenhado em texto no `game.js` (constante `MAPA`), gerado por `tools/mapa.py`. Legenda: `#` bloco, `-` plataforma atravessável, `H` escada, `P` início, `E` saída, `B` chefe, `g v c m a` inimigos (maiúsculas só no "Quero a minha mãe!").

**Armas:** abra os baús espalhados pelo mapa. A arma nova vai para o botão de arma e a antiga fica no chão (dá para pegar de volta). O chinelo está sempre no outro botão.

**Som:** efeitos e música são gerados por código (`som.js`). Tecla **M** ou o botão 🔊 liga/desliga.

**Mundos:** Mundo 1 (Cavernas Gosmentas, chefe Gosmão) e Mundo 2 (Torre da Nave-Mãe, subida vertical com o novo saltador e a chefe Rainha Gosma). Ao vencer um mundo, o próximo fica liberado no menu.
Mapas: `tools/mapa.py` e `tools/mapa2.py`. Pixel art dos alienígenas: `tools/inimigos.py`.
