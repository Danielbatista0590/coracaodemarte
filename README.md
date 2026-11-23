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
**Controle de Xbox (ou parecido):** analógico/setas andam e sobem escadas · A pula · X chinelo · Y arma · B especial · LB/RB cambalhota · Start confirma/pula cena · View volta ao menu.
Com 2 jogadores e 1 controle, o controle fica com o jogador 2 (Theo) e o jogador 1 usa o teclado. Com 2 controles, cada um usa o seu.
Dica: se o controle não responder, aperte qualquer botão dele com a página aberta (o navegador só "acorda" o controle depois disso).

O mapa é desenhado em texto no `game.js` (constante `MAPA`), gerado por `tools/mapa.py`. Legenda: `#` bloco, `-` plataforma atravessável, `H` escada, `P` início, `E` saída, `B` chefe, `g v c m a` inimigos (maiúsculas só no "Quero a minha mãe!").

**Armas:** abra os baús espalhados pelo mapa. A arma nova vai para o botão de arma e a antiga fica no chão (dá para pegar de volta). O chinelo está sempre no outro botão.

**Som:** efeitos e música são gerados por código (`som.js`). Tecla **M** ou o botão 🔊 liga/desliga.

**História:** Theo, Nícolas e o caçula Lucca moram na Terra. Alienígenas gosmentos abduzem o Lucca, porque no cérebro dele está a resposta para a vida, o universo e tudo mais. Os gêmeos acham uma nave esquecida, bebem uma substância que dá superpoderes e vão até Marte resgatar o irmão. Papai Daniel, mamãe Anne e o primo Ithalo ajudam como hologramas: dão dicas nas fases e vendem melhorias na loja.

**Fases:** Prólogo na Terra (sem poderes) → Mundo 1: Cavernas de Marte (Gosmão) → Mundo 2: Torre da Nave-Mãe, descendo (Rainha Gosma) → Mundo 3: Núcleo de Marte (Grande Cérebro) → final.
Entre as fases há cenas da história (`historia.js`) e a loja dos hologramas (`loja.js`). Moedas e melhorias ficam salvas no navegador (`progresso.js`).
Mapas: `tools/mapa0.py`, `tools/mapa.py`, `tools/mapa2.py`, `tools/mapa3.py`. Pixel art dos alienígenas: `tools/inimigos.py`.

**Pausa:** P, Esc, Start no controle ou o botão ☰ no celular.
**Bandeiras (pontos de salvamento):** tocar numa bandeira vermelha deixa ela verde. Se os dois caírem, voltam para a última bandeira com os corações cheios. No "Quero a minha mãe!" são só 3 tentativas por fase.
