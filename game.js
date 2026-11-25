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


// Mundo 2 (gerado por tools/mapa2.py). Novo: s saltador
const MAPA2 = [
  '############################################################',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#   P                                                      #',
  '################################################---------###',
  '#                             H                            #',
  '#                             H                            #',
  '#                           v H                            #',
  '#                 -------     H     -------                #',
  '#                             H                            #',
  '#                   g         H     s       G       T      #',
  '###---------##################H#############################',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H                            #',
  '#     T        s         c    H         a         S        #',
  '################################################---------###',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H v                          #',
  '#                 -------     H     -------                #',
  '#                             H                            #',
  '#           m         A       H     s     g                #',
  '###---------##################H#############################',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H                            #',
  '#                   s         H     c   M       g   T      #',
  '################################################---------###',
  '#                             H                            #',
  '#                             H                            #',
  '#                         v   H                            #',
  '#                 -------     H     -------                #',
  '#                             H                            #',
  '#       T a              s    H  G      s                  #',
  '###---------##################H#############################',
  '#                             H                            #',
  '#                             H                            #',
  '#                             H   V                        #',
  '#                             H                            #',
  '#                             H                            #',
  '#                 m       S   H    g         c             #',
  '################################################---------###',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                             B                            #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                          #',
  '#                                                        E #',
  '############################################################',
];

// Núcleo de Marte (gerado por tools/mapa3.py)
const MAPA3 = [
  '################################################################################',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                  #                                           #',
  '#                                                                              #',
  '#                                                                              #',
  '#                                                                              #',
  '#                                                        B                     #',
  '#           c                 Sv                                               #',
  '#       -------             ------                                             #',
  '#                                                    --------                  #',
  '#                                                                              #',
  '# -----               --H---                                                   #',
  '#                  s    H                                                      #',
  '#               ######  H               -------                     -------    #',
  '#        T -----######  H                                                      #',
  '#     #####     ######  H    m                                                 #',
  '#     #####     ######  H #####                                                #',
  '#  P  ##### g G ###### aH #####  A                                           E #',
  '################################################################################',
];

// Prólogo na Terra (gerado por tools/mapa0.py)
const MAPA0 = [
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                                                                            #',
  '#                                                 V                        v                                 #',
  '#                                                                                                            #',
  '#                                                                T                                           #',
  '#                                                         ----H------                                        #',
  '#                            -----                            H                     G                        #',
  '#                                                             H               -------                        #',
  '#                                                             H                                              #',
  '#                          --------                     ----- H       -------                                #',
  '#                 -------                     #####           H                               g              #',
  '#                                          ###########        H                            #######           #',
  '#     P                  G          g   ################# g   H                         #############    E   #',
  '##############################################################################################################',
];

const TIPOS = { g: 'sombra', v: 'morcego', c: 'cuspidor', m: 'comedor', a: 'agarrador', s: 'saltador' };

const FASES = [
  { nome: 'Prólogo: Terra', mapa: MAPA0, salvar: [[70, 20]], chefe: null, musica: 'fase1', semPoderes: true, saida: 'foguete', cenaDepois: 'nave',
    fundo: '#0b1030', rochas: 0x141e45, bolhas: 0xffffff, bloco: 'bloco0', decor: ['flor', 'tufo', 'tufo'], pingos: false,
    dicas: [
      { c: 9, r: 20, quem: 'anne', via: 'gritando da janela', texto: 'Meninos, cuidado! Andem com A/D (ou ◀ ▶) e pulem com W (ou ⤒)!' },
      { c: 21, r: 20, quem: 'daniel', via: 'gritando do quintal', texto: 'Chinelo no F (🩴) e estilingue no G (🎯)! Vão atrás do Lucca!' },
      { c: 37, r: 20, quem: 'ithalo', via: 'pelo celular', texto: 'Primo! Esses gosmentos ficaram para trás. Quando um deles se espreme, ele vai pular em vocês!' },
      { c: 60, r: 20, quem: 'daniel', via: 'gritando do quintal', texto: 'Subam a escada da casa da árvore segurando W (ou ▲). Tem um baú lá em cima!' },
      { c: 87, r: 20, quem: 'anne', via: 'gritando de longe', texto: 'A nave foi para o fim do pasto! Corram!' },
    ] },
  { nome: 'Mundo 1: Cavernas de Marte', mapa: MAPA, salvar: [[40, 19], [66, 31], [93, 13]], chefe: 'chefao', nomeChefe: 'GOSMÃO', musica: 'fase1', cenaDepois: 'centro',
    fundo: '#0f2418', rochas: 0x163626, bolhas: 0x7dff95, bloco: 'bloco', decor: ['planta', 'planta', 'cristal', 'cogumelinho'], pingos: true,
    dicas: [
      { c: 7, r: 43, quem: 'anne', texto: 'Agora vocês têm poderes! Especial no H (★) e cambalhota com dois toques rápidos para o lado.' },
      { c: 18, r: 43, quem: 'ithalo', texto: 'Abram os baús: tem armas novas! E peguem as moedas de gosma para a nossa loja.' },
      { c: 33, r: 43, quem: 'daniel', texto: 'Se o bocão engolir vocês, apertem os botões bem rápido para escapar!' },
      { c: 82, r: 13, quem: 'daniel', texto: 'É o Gosmão! Quando ele se espremer, deem cambalhota para escapar do tremor.' },
    ] },
  { nome: 'Mundo 2: Torre da Nave-Mãe', mapa: MAPA2, salvar: [[20, 28], [20, 42], [40, 49]], chefe: 'rainha', nomeChefe: 'RAINHA GOSMA', musica: 'fase2', cenaDepois: 'nucleo',
    fundo: '#16102b', rochas: 0x2a2050, bolhas: 0xc77dff, bloco: 'bloco2', decor: ['cristal', 'cogumelinho'], pingos: true,
    dicas: [
      { c: 8, r: 7, quem: 'anne', texto: 'Para descer pelas tábuas de madeira, fiquem em cima delas e apertem S (ou ▼).' },
      { c: 12, r: 21, quem: 'ithalo', texto: 'Esse sapo laranja se agacha antes de pular. Fiquem espertos!' },
      { c: 46, r: 49, quem: 'daniel', texto: 'Lá embaixo está a Rainha Gosma! Quando ela piscar vermelho, cambalhota! Depois do rasante ela cansa: chinelo nela!' },
    ] },
  { nome: 'Mundo 3: Núcleo de Marte', mapa: MAPA3, salvar: [[34, 34]], chefe: 'cerebro', nomeChefe: 'GRANDE CÉREBRO', musica: 'fase2', saida: 'lucca', cenaDepois: 'final',
    fundo: '#1f0a1c', rochas: 0x3a1238, bolhas: 0xff8fb8, bloco: 'bloco3', decor: ['cogumelinho', 'cristal', 'planta'], pingos: true,
    dicas: [
      { c: 4, r: 34, quem: 'anne', texto: 'Este é o centro de Marte, a cidade dos gosmentos. O Lucca está do outro lado!' },
      { c: 33, r: 34, quem: 'ithalo', texto: 'O Grande Cérebro tem um ESCUDO! Pulem as ondas, saiam das luzes vermelhas e ataquem quando ele descer cansado.' },
    ] },
];

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
  saltador: { pal: { g: 0xffa63d, G: 0xd9761f, o: 0x5e2a08, m: 0x5e2a08, w: 0xffffff, k: 0x111111 }, frames: [
    ['......................', '......................', '......................', '......................', '......................', '......................', '....oooo......oooo....', '...oggggo....oggggo...', '...ogwwggooooggwwgo...', '...ogwkggggggggwkgo...', '...oggggggggggggggo...', '..oggggggggggggggggo..', '.oggggggggggggggggggo.', '.oggggggggggggggggggo.', '.ogggggmmmmmmmmgggggo.', '.oGGGGGGGGGGGGGGGGGGo.', '..oGGGGGGGGGGGGGGGGo..', '.oGGGGGGGGGGGGGGGGGGo.', '.oGGGGoGGGGGGGGoGGGGo.', '.ooooo.oooooooo.ooooo.'],
    ['......................', '......................', '......................', '....oooooooooooooo....', '...oggggggggggggggo...', '...ogwwggggggggwwgo...', '...ogwkggggggggwkgo...', '...oggggggggggggggo...', '...oggggggggggggggo...', '...oggggggggggggggo...', '...oggggggggggggggo...', '...ogggmmmmmmmmgggo...', '...oggggggggggggggo...', '...oggggggggggggggo...', '....oggggggggggggo....', '....oGGGGGGGGGGGGo....', '...oGGGGGGGGGGGGGGo...', '...oGGGoGGGGGGoGGGo...', '...oGGo.oooooo.oGGo...', '...oooo........oooo...'],
  ] },
  rainha: { pal: { g: 0xc77dff, G: 0x9a4fd6, o: 0x3a1260, c: 0xffd23f, r: 0xff3b6b, w: 0xffffff, k: 0x111111, y: 0xfff36b, m: 0x3a1260, l: 0xf0d9ff }, frames: [
    ['........................................', '.................r..r..r................', '.............c...c..c..c...c............', '.............c...c..c..c...c............', '.............ccccccccccccccc............', '...........ooooggggggggggoooo...........', '.........ooggggggggggggggggggoo.........', '.......oolgggggggggggggggggggggoo.......', '......oglgggyyyyggggggggyyyygggggo......', '.....oggggggykkyggggggggykkyggggggo.....', '....ogggggggykkyggggggggykkygggggggo....', '...oggggggggyyyyggggggggyyyyggggggggo...', '...ogggggggggggmggggggggmgggggggggggo...', '..ogggggggggggggmmmmmmmmgggggggggggggo..', '..oggggggggggggggggggggggggggggggggggo..', '..oggggggggggggggggggggggggggggggggggo..', '..oooooooooooooooooooooooooooooooooooo..', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '........................................'],
    ['........................................', '.................r..r..r................', '.............c...c..c..c...c............', '.............c...c..c..c...c............', '.............ccccccccccccccc............', '...........ooooggggggggggoooo...........', '.........ooggggggggggggggggggoo.........', '.......oolgggggggggggggggggggggoo.......', '......oglgggyyyyggggggggyyyygggggo......', '.....oggggggykkyggggggggykkyggggggo.....', '....ogggggggykkyggggggggykkygggggggo....', '...oggggggggyyyyggggggggyyyyggggggggo...', '...ogggggggggggmggggggggmgggggggggggo...', '..ogggggggggggggmmmmmmmmgggggggggggggo..', '..oggggggggggggggggggggggggggggggggggo..', '..oggggggggggggggggggggggggggggggggggo..', '..oooooooooooooooooooooooooooooooooooo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '......GGo.GGo...GGo.GGo...GGo.GGo...GGo.', '.....GGo...GGo.GGo...GGo.GGo...GGo.GGo..', '........................................'],
  ] },
  cerebro: { pal: { v: 0x9fe8ff, b: 0xff8fb8, B: 0xd9577f, o: 0x2a1030, m: 0x8892a0, M: 0x5a6270, w: 0xffffff, k: 0x111111, y: 0xfff36b }, frames: [
    ['...............oooooooooo...............', '............ooovvvvvvvvvvooo............', '..........oovvvvvvvvvvvvvvvvoo..........', '........oovvvvvvvvvvvvvvvvvvvvoo........', '.......ovvvvvvvvbbbbbbbbvvvvvvvvo.......', '......ovvvvvvbbbbbbbbbbbbbbvvvvvvo......', '.....ovvvvvbbbbbbbbbbbbbbbbbbvvvvvo.....', '.....ovvvbbbbbbbbbbbbbBBbBBbBBbvvvo.....', '....ovvvbbbbbbbbbbbbbbbbBbbBbbbbvvvo....', '....ovvbbbBBbBBbbbbbbbbbbbbbbbbbbvvo....', '...ovvvbbBbbBbbbbbbbbbbbbbbbbbbbbvvvo...', '...ovvbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvo...', '...ovvbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvo...', '...ovvbbbbbbyyyybbbbbbbByyyyBBbbbbvvo...', '...ovvbbbbbbykkybbbbbbbbykkybbBbbbvvo...', '...ovvbbbbbBykkyBBbbbbbbykkybbbbbbvvo...', '....ovbbbbbbyyyybbBbbbbbyyyybbbbbbvo....', '....ovvbbbbbbbbbbbbbbbbbbbbbbbbbbvvo....', '.....ovbbbbbbbbbbbbbbbbbbbbbbbbbbvo.....', '.....ovvbbbbbbbbbbbbbbbbbbbbbbbbvvo.....', '......ovvbbbbbbbBBbBBbBBbbbbbbbvvo......', '.......ovvvbbbbBbbBbbBbbBbbbbvvvo.......', '........oovvvbbbbbbbbbbbbbbvvvoo........', '..........oovvvvbbbbbbbbvvvvoo..........', '............ovvvvvvvvvvvvvvo............', '..oooooooooommmmmmmmmmmmmmmmoooooooooo..', '..ommmwmmmmmmymmmmmmwmmmmmmymmmmmmwmmo..', '..ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmo..', '..oooommmmmmmmmmmmmmmmmmmmmmmmmmmmoooo..', '......oMMMMMMMMMMMMMMMMMMMMMMMMMMo......', '......oooooooooooooooooooooooooooo......', '........................................', '........................................', '........................................'],
    ['...............oooooooooo...............', '............ooovvvvvvvvvvooo............', '..........oovvvvvvvvvvvvvvvvoo..........', '........oovvvvvvvvvvvvvvvvvvvvoo........', '.......ovvvvvvvvbbbbbbbbvvvvvvvvo.......', '......ovvvvvvbbbbbbbbbbbbbbvvvvvvo......', '.....ovvvvvbbbbbbbbbbbbbbbbbbvvvvvo.....', '.....ovvvbbbbbbbbbbbbbBBbBBbBBbvvvo.....', '....ovvvbbbbbbbbbbbbbbbbBbbBbbbbvvvo....', '....ovvbbbBBbBBbbbbbbbbbbbbbbbbbbvvo....', '...ovvvbbBbbBbbbbbbbbbbbbbbbbbbbbvvvo...', '...ovvbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvo...', '...ovvbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvo...', '...ovvbbbbbbbbbbbbbbbbbBbBBbBBbbbbvvo...', '...ovvbbbbbbyyyybbbbbbbbyyyybbBbbbvvo...', '...ovvbbbbbBykkyBBbbbbbbykkybbbbbbvvo...', '....ovbbbbbbykkybbBbbbbbykkybbbbbbvo....', '....ovvbbbbbyyyybbbbbbbbyyyybbbbbvvo....', '.....ovbbbbbbbbbbbbbbbbbbbbbbbbbbvo.....', '.....ovvbbbbbbbbbbbbbbbbbbbbbbbbvvo.....', '......ovvbbbbbbbBBbBBbBBbbbbbbbvvo......', '.......ovvvbbbbBbbBbbBbbBbbbbvvvo.......', '........oovvvbbbbbbbbbbbbbbvvvoo........', '..........oovvvvbbbbbbbbvvvvoo..........', '............ovvvvvvvvvvvvvvo............', '..oooooooooommmmmmmmmmmmmmmmoooooooooo..', '..ommmymmmmmmwmmmmmmymmmmmmwmmmmmmymmo..', '..ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmo..', '..oooommmmmmmmmmmmmmmmmmmmmmmmmmmmoooo..', '......oMMMMMMMMMMMMMMMMMMMMMMMMMMo......', '......oooooooooooooooooooooooooooo......', '........................................', '........................................', '........................................'],
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

// o que pode sair de um baú (sorteado pelo peso)
const ITENS_BAU = {
  maca:       { peso: 12, nome: 'Maçã',              icone: '🍎', desc: '+1 coração' },
  pizza:      { peso: 9,  nome: 'Pizza',             icone: '🍕', desc: '+3 corações' },
  bolo:       { peso: 4,  nome: 'Bolo da vovó',      icone: '🎂', desc: 'enche todos os corações' },
  arma_bola:  { peso: 7,  arma: 'bola' },
  arma_drone: { peso: 6,  arma: 'drone' },
  arma_agua:  { peso: 7,  arma: 'agua' },
  arma_estilingue: { peso: 3, arma: 'estilingue' },
  turbo:      { peso: 10, nome: 'Turbo da arma',     icone: '⚡', desc: 'sua arma fica mais forte e mais rápida' },
  jetpack:    { peso: 6,  nome: 'Jetpack',           icone: '🚀', desc: 'no ar, segure PULAR para voar' },
  tenis:      { peso: 7,  nome: 'Tênis turbo',       icone: '👟', desc: 'corre muito mais rápido' },
  escudo:     { peso: 8,  nome: 'Escudo-bolha',      icone: '🫧', desc: 'aguenta 3 golpes sem perder coração' },
  capacete:   { peso: 5,  nome: 'Capacete',          icone: '⛑️', desc: '+2 corações a mais' },
  moedas:     { peso: 7,  nome: 'Saco de moedas',    icone: '💰', desc: '+15 moedas de gosma' },
};
function infoItem(id) {
  const it = ITENS_BAU[id];
  if (it.arma) return { nome: ARMAS[it.arma].nome, icone: ARMAS[it.arma].icone, desc: 'arma nova (a sua atual fica no chão)' };
  return it;
}
function sortearItem() {
  const lista = Object.entries(ITENS_BAU), total = lista.reduce((a, [, v]) => a + v.peso, 0);
  let r = Math.random() * total;
  for (const [id, v] of lista) { r -= v.peso; if (r <= 0) return id; }
  return 'maca';
}

const CONTROLES = [
  { esq: 'A', dir: 'D', pulo: 'W', baixo: 'S', chinelo: 'F', estilingue: 'G', especial: 'H', texto: 'A/D andar · W pular/subir · S descer/pegar · F chinelo · G arma · H especial' },
  { esq: 'LEFT', dir: 'RIGHT', pulo: 'UP', baixo: 'DOWN', chinelo: 'K', estilingue: 'L', especial: 'J', texto: 'Setas andar/pular/subir/descer · K chinelo · L arma · J especial' },
];

// ---------------------------------------------------------------- MENU
const DIFICULDADES = [
  { nome: 'Molezinha',            cor: '#7cff6b', vidaJog: 8, vidaInim: 0.6, vel: 0.8,  apertos: 0.6, quantidade: 'menos' },
  { nome: 'Moleza',               cor: '#ffef5d', vidaJog: 6, vidaInim: 1,   vel: 1,    apertos: 1,   quantidade: 'normal' },
  { nome: 'Quero a minha mãe!',   cor: '#ff5d73', vidaJog: 4, vidaInim: 1.5, vel: 1.25, apertos: 1.4, quantidade: 'mais' },
];

// ---- controle de videogame (Xbox e parecidos): botões no padrão do navegador
const BOTAO = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, VIEW: 8, START: 9, CIMA: 12, BAIXO: 13, ESQ: 14, DIR: 15 };
function controles(cena) {
  const gp = cena.input.gamepad;
  return gp ? gp.gamepads.filter(p => p && p.connected) : [];
}
// chama fn(indiceDoBotao, pad) quando qualquer controle aperta um botão; o analógico vira setas no menu
function ouvirControle(cena, fn) {
  if (!cena.input.gamepad) return;
  cena.input.gamepad.on('down', (pad, botao) => { SOM.iniciar(); fn(botao.index, pad); });
  let antes = 0;
  cena.events.on('update', () => {
    const p = controles(cena)[0]; if (!p) return;
    const y = p.leftStick.y, dir = y < -0.6 ? -1 : y > 0.6 ? 1 : 0;
    if (dir && dir !== antes) fn(dir < 0 ? BOTAO.CIMA : BOTAO.BAIXO, p);
    antes = dir;
  });
}

// ---- tela de pausa (por cima da fase)
class Pausa extends Phaser.Scene {
  constructor() { super('Pausa'); }
  create() {
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6);
    this.add.text(W / 2, 130, 'PAUSADO', { fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
    const ops = [['▶ Continuar', () => this.voltar()], ['↻ Recomeçar a fase', () => this.ir('Fase')], ['⌂ Menu principal', () => this.ir('Menu')]];
    this.sel = 0;
    this.botoes = ops.map(([t, f], i) => {
      const b = this.add.text(W / 2, 240 + i * 66, t, { fontFamily: 'Arial', fontSize: 28, color: '#ffffff', backgroundColor: '#2b2350', padding: { x: 18, y: 8 } })
        .setOrigin(0.5).setInteractive({ useHandCursor: true });
      b.on('pointerdown', f); b.acao = f; return b;
    });
    this.add.text(W / 2, H - 40, 'P / Esc / Start: continuar   ·   🎮 setas + A', { fontFamily: 'Arial', fontSize: 14, color: '#aaaaaa' }).setOrigin(0.5);
    this.marcar();
    ['P', 'ESC'].forEach(k => this.input.keyboard.on('keydown-' + k, () => this.voltar()));
    ouvirControle(this, b => {
      if (b === BOTAO.START || b === BOTAO.B) this.voltar();
      if (b === BOTAO.CIMA) { this.sel = (this.sel + 2) % 3; this.marcar(); }
      if (b === BOTAO.BAIXO) { this.sel = (this.sel + 1) % 3; this.marcar(); }
      if (b === BOTAO.A) this.botoes[this.sel].acao();
    });
  }
  marcar() { this.botoes.forEach((b, i) => b.setBackgroundColor(i === this.sel ? '#6b4fd1' : '#2b2350')); }
  voltar() { this.scene.resume('Fase'); this.scene.stop(); }
  ir(destino) { this.scene.stop('Fase'); this.scene.start(destino); }
}

// o que vem depois de vencer uma fase: cena da história → loja dos hologramas → próxima fase
function sequenciaDepois(nivel, cfg) {
  const prox = nivel + 1;
  const destinoFase = prox < FASES.length
    ? { cena: 'Loja', dados: { depois: { cena: 'Fase', dados: Object.assign({}, cfg, { nivel: prox }) } } }
    : { cena: 'Menu' };
  const id = FASES[nivel].cenaDepois;
  return id ? { cena: 'Cena', dados: { id, depois: destinoFase } } : destinoFase;
}

class Menu extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    this.add.text(W / 2, 100, 'CORAÇÃO DE MARTE', { fontFamily: 'Arial Black', fontSize: 52, color: '#ff5d73' }).setOrigin(0.5);
    this.add.text(W / 2, 160, 'Nícolas e Theo contra os alienígenas gosmentos', { fontFamily: 'Arial', fontSize: 20, color: '#cfc8ff' }).setOrigin(0.5);
    this.add.text(W / 2, 470, 'Jogador 1: ' + CONTROLES[0].texto, { fontFamily: 'Arial', fontSize: 15, color: '#9a93c9' }).setOrigin(0.5);
    this.add.text(W / 2, 495, 'Jogador 2: ' + CONTROLES[1].texto, { fontFamily: 'Arial', fontSize: 15, color: '#9a93c9' }).setOrigin(0.5);
    Fase.prototype.criarTexturas.call(this); // gera as texturas uma vez (usadas também nas cenas)
    SOM.pararMusica();
    this.itens = [];
    ouvirControle(this, b => {
      if (!this.botoesMenu) return;
      if (b === BOTAO.CIMA) { this.sel = (this.sel + this.botoesMenu.length - 1) % this.botoesMenu.length; SOM.tocar('menu'); this.marcarMenu(); }
      if (b === BOTAO.BAIXO) { this.sel = (this.sel + 1) % this.botoesMenu.length; SOM.tocar('menu'); this.marcarMenu(); }
      if (b === BOTAO.A || b === BOTAO.START) { const f = this.escolherMenu, i = this.sel; this.botoesMenu = null; SOM.tocar('menu'); f(i); }
    });
    this.dicaControle = this.add.text(W / 2, 520, '🎮 Controle: setas/analógico para escolher, A para confirmar', { fontFamily: 'Arial', fontSize: 13, color: '#7a73a9' }).setOrigin(0.5);
    this.passo1();
  }

  marcarMenu() {
    (this.botoesMenu || []).forEach((b, i) => b.setBackgroundColor(i === this.sel ? '#6b4fd1' : '#2b2350').setScale(i === this.sel ? 1.06 : 1));
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
    // seleção pelo controle: setas/analógico + A
    this.botoesMenu = this.itens.slice(1); this.sel = 0; this.escolherMenu = aoEscolher;
    this.marcarMenu();
    ['ONE', 'TWO', 'THREE', 'FOUR'].slice(0, textos.length).forEach((k, i) => this.input.keyboard.once('keydown-' + k, () => { SOM.iniciar(); SOM.tocar('menu'); aoEscolher(i); }));
  }

  passo1() {
    const escolhas = [['nicolas'], ['theo'], ['nicolas', 'theo']];
    this.opcoes('Quem vai jogar?', ['Nícolas (casca de banana)', 'Theo (mega pum)', 'Os dois juntos (2 jogadores)'], null,
      i => this.time.delayedCall(50, () => this.passo2(escolhas[i])));
  }

  passo2(jogadores) {
    this.opcoes('Escolha a dificuldade', DIFICULDADES.map(d => d.nome), DIFICULDADES.map(d => d.cor),
      i => this.time.delayedCall(50, () => this.passo3(jogadores, i)));
  }

  passo3(jogadores, dificuldade) {
    const comecar = nivel => {
      const cfg = { jogadores, dificuldade, nivel };
      if (nivel === 0) this.scene.start('Cena', { id: 'abertura', depois: { cena: 'Fase', dados: cfg } });
      else this.scene.start('Loja', { depois: { cena: 'Fase', dados: cfg } });
    };
    const liberado = PROGRESSO.mundo;
    if (liberado <= 0) { comecar(0); return; }
    this.opcoes('Onde começar?', FASES.slice(0, liberado + 1).map(f => f.nome), null, i => comecar(i));
  }
}

// ---------------------------------------------------------------- FASE
class Fase extends Phaser.Scene {
  constructor() { super('Fase'); }

  init(data) {
    if (data && data.jogadores) this.registry.set('config', data);
    const cfg = this.registry.get('config');
    this.escolha = cfg.jogadores; this.dif = DIFICULDADES[cfg.dificuldade ?? 1];
    this.nivel = cfg.nivel || 0; this.fase = FASES[this.nivel];
    this.mapa = this.fase.mapa; this.mapaW = this.mapa[0].length * T; this.mapaH = this.mapa.length * T;
    this.acabou = false;
  }

  create() {
    this.criarTexturas();
    this.physics.world.setBounds(0, 0, this.mapaW, this.mapaH + 200);
    this.cameras.main.setBounds(0, 0, this.mapaW, this.mapaH);
    this.cameras.main.setBackgroundColor(this.fase.fundo);

    // fundo: rochas escuras ao longe (parallax)
    for (let i = 0; i < 40; i++) {
      this.add.ellipse(Phaser.Math.Between(0, this.mapaW), Phaser.Math.Between(0, this.mapaH), Phaser.Math.Between(120, 320), Phaser.Math.Between(80, 220), this.fase.rochas, 0.6)
        .setScrollFactor(0.3).setDepth(-10);
    }
    // fundo: bolhas de gosma flutuando ao longe
    for (let i = 0; i < 220; i++) {
      this.add.circle(Phaser.Math.Between(0, this.mapaW), Phaser.Math.Between(0, this.mapaH), Phaser.Math.Between(1, 3), this.fase.bolhas, 0.15).setScrollFactor(0.5);
    }

    // lê o mapa: junta blocos vizinhos da mesma linha em uma peça só
    this.chao = this.physics.add.staticGroup();
    this.pontes = this.physics.add.staticGroup();
    this.escadas = this.physics.add.staticGroup();
    const pecas = [];
    this.mapa.forEach((linha, r) => {
      let c = 0;
      while (c < linha.length) {
        const ch = linha[c];
        if (ch === '#' || ch === '-') {
          let f = c; while (f + 1 < linha.length && linha[f + 1] === ch) f++;
          const larg = (f - c + 1) * T;
          const p = this.add.tileSprite(c * T, r * T, larg, ch === '#' ? T : 12, ch === '#' ? this.fase.bloco : 'ponte').setOrigin(0, 0);
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
    if (this.fase.saida === 'foguete') { this.chegada.setVisible(false); this.add.image(ex.x - 30, ex.y - 58, 'foguete').setDepth(-1); }
    else if (this.fase.saida === 'lucca') {
      this.chegada.setVisible(false);
      const l = this.add.image(ex.x, ex.y - 50, 'lucca').setScale(1.5);
      const b = this.add.circle(ex.x, ex.y - 50, 36, 0x6bd1ff, 0.25).setStrokeStyle(3, 0xbfeeff, 0.8);
      this.tweens.add({ targets: [l, b], y: ex.y - 60, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    this.add.text(ex.x, ex.y - 140, this.fase.saida === 'foguete' ? 'NAVE ESQUECIDA' : this.fase.saida === 'lucca' ? 'LUCCA!' : 'SAÍDA',
      { fontFamily: 'Arial Black', fontSize: 20, color: '#7cff6b', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

    // baús
    this.baus = this.physics.add.staticGroup();
    this.itens = this.physics.add.group();

    pecas.filter(p => p.ch === 'T').forEach((p, i) => {
      this.baus.create(p.x, p.y - 14, 'bau');
    });

    this.chefao = null;
    // pontos de salvamento (bandeiras): quem cair volta para a última bandeira tocada
    this.inicio = { x: this.jogadores[0].x, y: this.jogadores[0].y };
    this.ponto = null;
    this.bandeiras = (this.fase.salvar || []).map(([c, r]) => {
      const b = this.add.image(c * T + T / 2, (r + 1) * T, 'bandeira').setOrigin(0.5, 1).setDepth(-1);
      b.ativa = false; return b;
    });
    this.tempoInicio = this.time.now; this.derretidos = 0; this.tentativas = 3;
    // hologramas com dicas espalhados pela fase
    this.dicas = (this.fase.dicas || []).map(d => {
      const h = this.add.image(d.c * T + T / 2, (d.r + 1) * T - 24, 'holo_' + d.quem).setAlpha(d.via ? 0 : 0.7).setDepth(-1);
      this.tweens.add({ targets: h, alpha: 0.35, duration: 120, yoyo: true, repeat: -1, repeatDelay: Phaser.Math.Between(1200, 2400) });
      return Object.assign({ img: h, visto: false }, d);
    });
    // inimigos — Molezinha: pula 1 a cada 3. Quero a minha mãe!: inclui os MAIÚSCULOS
    this.inimigos = this.physics.add.group();
    let n = 0;
    pecas.forEach(p => {
      if (p.ch === 'B') { this.chefao = this.criarInimigo(p.x, p.y - 60, this.fase.chefe); return; }
      const tipo = TIPOS[p.ch.toLowerCase()];
      if (!tipo) return;
      const extra = p.ch !== p.ch.toLowerCase();
      if (extra && this.dif.quantidade !== 'mais') return;
      if (this.dif.quantidade === 'menos' && (n++ % 3 === 2)) return;
      this.criarInimigo(p.x, p.y - 24, tipo);
    });
    this.gosmas = this.physics.add.group({ allowGravity: false });
    this.bananas = this.physics.add.group();
    this.moedas = this.physics.add.group(); this.moedasFase = 0;

    // projéteis
    this.pedras = this.physics.add.group({ allowGravity: false });
    this.bolas = this.physics.add.group();
    this.bombas = this.physics.add.group();
    this.gotas = this.physics.add.group({ allowGravity: false });
    this.perigos = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.jogadores, this.chao);
    this.physics.add.collider(this.itens, this.chao);
    this.physics.add.collider(this.moedas, this.chao);
    this.physics.add.collider(this.moedas, this.pontes, null, (m, p) => m.body.velocity.y >= 0 && m.body.bottom <= p.body.top + 12);
    this.physics.add.collider(this.itens, this.pontes);
    this.physics.add.overlap(this.jogadores, this.baus, (j, b) => this.abrirBau(b));
    this.physics.add.collider(this.bolas, this.chao);
    this.physics.add.collider(this.bolas, this.pontes, null, (b, p) => b.body.velocity.y >= 0 && b.body.bottom <= p.body.top + 12);
    this.physics.add.overlap(this.bolas, this.inimigos, (b, s) => this.bolaAcerta(b, s));
    this.physics.add.collider(this.bombas, this.chao, (b) => this.explodir(b));
    this.physics.add.collider(this.bombas, this.pontes, (b) => this.explodir(b));
    this.physics.add.overlap(this.bombas, this.inimigos, (b) => this.explodir(b));
    this.physics.add.overlap(this.gotas, this.inimigos, (g, s) => { if (!g.active) return; const d = g.body.velocity.x > 0 ? 1 : -1, dn = g.dano; g.destroy(); this.molhar(s, d, dn); });
    this.physics.add.collider(this.gotas, this.chao, (g) => g.destroy());
    this.physics.add.overlap(this.jogadores, this.perigos, (j, o) => this.levarDano(j, o, true));
    this.physics.add.collider(this.perigos, this.chao, (o) => { if (o.body.blocked.left || o.body.blocked.right) o.destroy(); });
    this.physics.add.collider(this.inimigos, this.chao);
    // plataformas atravessáveis: só seguram quem vem de cima
    const deCima = (o, p) => o.body.velocity.y >= 0 && o.body.bottom <= p.body.top + 12;
    this.physics.add.collider(this.jogadores, this.pontes, null, (j, p) => !j.descendo && !j.escalando && deCima(j, p));
    this.physics.add.collider(this.inimigos, this.pontes, null, (s, p) => s.tipo !== 'morcego' && !s.voa && deCima(s, p));
    this.physics.add.overlap(this.pedras, this.inimigos, (pedra, ini) => {
      if (!pedra.active || !ini.active) return;
      const dir = pedra.body.velocity.x > 0 ? 1 : -1; // ler a direção ANTES de destruir a pedra
      pedra.destroy();
      this.acertar(ini, pedra.dano || 1, dir);
    });
    this.physics.add.collider(this.pedras, this.chao, (pedra) => pedra.destroy());
    this.physics.add.overlap(this.jogadores, this.inimigos, (j, ini) => this.levarDano(j, ini));
    this.physics.add.overlap(this.jogadores, this.chegada, () => {
      if (this.chefao && this.chefao.active) { if (!this.avisouChefao) { this.avisouChefao = true; this.texto(this.chegada.x, this.chegada.y - 110, 'Derrote ' + (this.fase.chefe === 'rainha' ? 'a ' : 'o ') + this.fase.nomeChefe + ' primeiro!', '#ff5d73'); this.time.delayedCall(1500, () => this.avisouChefao = false); } return; }
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
    // tela dividida no co-op: segunda câmera (metade direita) e uma câmera só para o painel (HUD, botões, mensagens)
    this.alvoCamera2 = this.add.zone(0, 0, 1, 1);
    this.cam2 = this.cameras.add(W / 2, 0, W / 2, H).setBounds(0, 0, this.mapaW, this.mapaH).setBackgroundColor(this.fase.fundo).setVisible(false);
    this.cam2.startFollow(this.alvoCamera2, true, 0.1, 0.1);
    this.camUI = this.cameras.add(0, 0, W, H);
    this.divisoria = this.add.rectangle(W / 2, H / 2 + 20, 4, H - 40, 0x000000).setScrollFactor(0).setDepth(50).setVisible(false);
    this.dividida = false;

    SOM.musica(this.fase.musica);
    this.mostrarTitulo();
    this.input.keyboard.on('keydown-M', () => SOM.alternarMudo());
    this.hud = this.add.text(16, 12, '', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setScrollFactor(0).setDepth(10);
    this.input.keyboard.on('keydown-ESC', () => this.pausar());
    this.input.keyboard.on('keydown-P', () => this.pausar());
    this.teclaE = this.input.keyboard.addKey('E');
    this.criarControlesToque();
    this.continuar = null;
    ouvirControle(this, b => {
      if (this.acabou && this.continuar && (b === BOTAO.A || b === BOTAO.START)) { const f = this.continuar; this.continuar = null; f(); }
      else if (!this.acabou && b === BOTAO.START) this.pausar();
      if (b === BOTAO.VIEW) this.pausar();
    });
  }

  // botões na tela para celular/tablet (controlam o Jogador 1)
  dividirTela(sim) {
    this.dividida = sim;
    const cam = this.cameras.main;
    if (sim) {
      cam.setViewport(0, 0, W / 2, H);
      this.cam2.setVisible(true);
      this.cam2.centerOn(this.alvoCamera2.x, this.alvoCamera2.y);
    } else {
      cam.setViewport(0, 0, W, H);
      this.cam2.setVisible(false);
    }
    this.divisoria.setVisible(sim);
  }

  // cada objeto aparece só nas câmeras certas: o painel (fixo na tela) só na câmera do painel
  separarCamadas() {
    const mundo = this.cameras.main.id | this.cam2.id, painel = this.camUI.id;
    this.children.list.forEach(o => {
      if (o._camada !== undefined) return;
      o._camada = o.scrollFactorX === 0 ? 1 : 0;
      o.cameraFilter |= o._camada ? mundo : painel;
    });
  }

  pausar() {
    if (this.acabou || this.scene.isPaused()) return;
    this.scene.pause();
    this.scene.launch('Pausa');
  }

  mostrarDica(d) {
    SOM.tocar('holograma');
    if (this.painelDica) this.painelDica.destroy();
    const f = FAMILIA[d.quem];
    const c = this.add.container(W / 2, 92).setScrollFactor(0).setDepth(45);
    const fundo = this.add.rectangle(0, 0, 700, 78, 0x06121f, 0.88).setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(f.cor).color);
    const rosto = this.add.image(-310, 0, 'holo_' + d.quem).setScale(1.3).setAlpha(0.9);
    const nome = this.add.text(-270, -30, f.nome + ' (' + (d.via || 'holograma') + '):', { fontFamily: 'Arial Black', fontSize: 15, color: f.cor });
    const t = this.add.text(-270, -8, d.texto, { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', wordWrap: { width: 600 } });
    c.add([fundo, rosto, nome, t]);
    this.painelDica = c;
    d.img.destroy();
    this.time.delayedCall(Math.max(4500, d.texto.length * 75), () => { if (this.painelDica === c) { this.tweens.add({ targets: c, alpha: 0, duration: 400, onComplete: () => c.destroy() }); this.painelDica = null; } });
  }

  mostrarTitulo() {
    const t = this.add.text(W / 2, 200, this.fase.nome, { fontFamily: 'Arial Black', fontSize: 34, color: '#ffffff', stroke: '#000', strokeThickness: 6 })
      .setOrigin(0.5).setScrollFactor(0).setDepth(40);
    this.tweens.add({ targets: t, alpha: 0, delay: 1800, duration: 800, onComplete: () => t.destroy() });
  }

  // plantas brilhantes, cristais e gosma pingando do teto
  decorar() {
    const M = this.mapa;
    const vazio = (r, c) => M[r] && (M[r][c] === ' ' || 'gvcmasGVCMASTPEBH-'.includes(M[r][c]));
    M.forEach((linha, r) => [...linha].forEach((ch, c) => {
      if (ch !== '#') return;
      const x = c * T + T / 2;
      if (r > 0 && vazio(r - 1, c) && Math.random() < 0.22) {
        const tipo = Phaser.Utils.Array.GetRandom(this.fase.decor);
        const d = this.add.image(x + Phaser.Math.Between(-8, 8), r * T + 2, tipo).setOrigin(0.5, 1).setDepth(-1).setFlipX(Math.random() < 0.5);
        if (tipo === 'planta' || tipo === 'cristal') this.tweens.add({ targets: d, alpha: 0.55, duration: Phaser.Math.Between(900, 1600), yoyo: true, repeat: -1 });
      }
      if (this.fase.pingos && vazio(r + 1, c) && r > 0 && Math.random() < 0.1) {
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
    this.toque = { pegar: false, esq: false, dir: false, cima: false, baixo: false, pulo: false, chinelo: false, estilingue: false, especial: false };
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
    this.botaoPegar = this.add.text(W / 2, H - 70, '✋ PEGAR', { fontFamily: 'Arial Black', fontSize: 26, color: '#000', backgroundColor: '#ffe14d', padding: { x: 16, y: 8 } })
      .setOrigin(0.5).setScrollFactor(0).setDepth(32).setInteractive().setVisible(false);
    this.botaoPegar.on('pointerdown', () => { this.toque.pegar = true; });
    botao(W - 80, H - 80, 56, '⤒', 'pulo', false);
    botao(W - 200, H - 70, 46, '🩴', 'chinelo', false);
    botao(W - 160, H - 185, 42, '🎯', 'estilingue', false);
    botao(W - 55, H - 200, 40, '★', 'especial', false);
    const menu = this.add.text(W - 16, 12, '☰', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(30).setInteractive();
    menu.on('pointerdown', () => this.pausar());
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
    gerarTexturasHistoria(this);
    if (this.textures.exists('bloco')) return;
    const g = this.add.graphics();
    g.fillStyle(0x24453a).fillRect(0, 0, 32, 32).fillStyle(0x3d7a5a).fillRect(0, 0, 32, 6).fillStyle(0x1b3329).fillRect(6, 14, 8, 6).fillRect(20, 22, 7, 5);
    g.generateTexture('bloco', 32, 32).clear();
    g.fillStyle(0x3a3a5a).fillRect(0, 0, 32, 32).fillStyle(0x5a5a8a).fillRect(0, 0, 32, 4).fillStyle(0x26263d).fillRect(0, 30, 32, 2)
     .fillStyle(0x8a8ac0).fillCircle(5, 9, 1.5).fillCircle(27, 9, 1.5).fillCircle(5, 25, 1.5).fillCircle(27, 25, 1.5).fillStyle(0xc77dff).fillRect(12, 15, 8, 2);
    g.generateTexture('bloco2', 32, 32).clear();
    g.fillStyle(0x5a3a1e).fillRect(0, 0, 32, 32).fillStyle(0x3fa83f).fillRect(0, 0, 32, 7).fillStyle(0x2f7a2f).fillRect(0, 7, 32, 2)
     .fillStyle(0x4a2e16).fillRect(6, 16, 5, 4).fillRect(20, 24, 6, 3);
    g.generateTexture('bloco0', 32, 32).clear();
    g.fillStyle(0x6b1f4f).fillRect(0, 0, 32, 32).fillStyle(0xa83a7a).fillRect(0, 0, 32, 5).fillStyle(0x4a1236).fillCircle(9, 16, 4).fillCircle(23, 24, 3)
     .fillStyle(0xff8fb8).fillCircle(22, 12, 2);
    g.generateTexture('bloco3', 32, 32).clear();
    g.fillStyle(0xff8fb8, 0.9).fillTriangle(0, 24, 20, 0, 40, 24).fillStyle(0xffd0e4).fillTriangle(12, 24, 20, 8, 28, 24);
    g.generateTexture('onda', 40, 24).clear();
    g.fillStyle(0xaaaaaa).fillRect(2, 0, 3, 48).fillStyle(0xff5d73).fillTriangle(5, 2, 26, 9, 5, 16);
    g.generateTexture('bandeira', 28, 48).clear();
    g.fillStyle(0xaaaaaa).fillRect(2, 0, 3, 48).fillStyle(0x7cff6b).fillTriangle(5, 2, 26, 9, 5, 16).fillStyle(0xffffff).fillCircle(12, 9, 2);
    g.generateTexture('bandeira_ok', 28, 48).clear();
    g.fillStyle(0x2f7a2f).fillRect(7, 6, 2, 10).fillStyle(0xffe14d).fillCircle(8, 5, 2).fillStyle(0xff9be8).fillCircle(5, 4, 2.5).fillCircle(11, 4, 2.5).fillCircle(8, 1.5, 2.5).fillCircle(8, 7, 2.5).fillStyle(0xffe14d).fillCircle(8, 4.5, 2);
    g.generateTexture('flor', 16, 16).clear();
    g.fillStyle(0x3fa83f).fillTriangle(0, 12, 3, 0, 6, 12).fillTriangle(5, 12, 9, 2, 12, 12).fillTriangle(10, 12, 14, 4, 16, 12);
    g.generateTexture('tufo', 16, 12).clear();
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
    g.fillStyle(0x2f9a4a).fillCircle(6, 6, 6).fillStyle(0x7dff95).fillCircle(6, 6, 4.5).fillStyle(0xe6ffd0).fillRect(4, 3, 2, 4);
    g.generateTexture('moeda', 12, 12).clear();
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
    g.fillStyle(0xffef5d, 0.35).fillCircle(16, 16, 16).fillStyle(0xffef5d, 0.25).fillCircle(16, 16, 11); g.generateTexture('item_base', 32, 32).clear();
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
      id, idx, k, vida: this.dif.vidaJog + PROGRESSO.nivel('coracao'), vidaMax: this.dif.vidaJog + PROGRESSO.nivel('coracao'), direcao: 1, pulosExtras: 0,
      arma: PROGRESSO.inicial, invencivel: 0, recargaChinelo: 0, recargaEstilingue: 0, recargaEspecial: 0, deslizando: 0, caido: false,
    });
    return j;
  }

  criarInimigo(x, y, tipo) {
    const s = this.inimigos.create(x, y, tipo === 'chefao' ? 'sombra' : tipo);
    s.tipo = tipo; s.chefe = tipo === 'chefao' || tipo === 'rainha' || tipo === 'cerebro'; s.voa = tipo === 'rainha' || tipo === 'cerebro';
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
    } else if (tipo === 'saltador') {
      s.vida = 3; s.velocidade = 0; s.recarga = Phaser.Math.Between(800, 2000);
      s.body.setSize(36, 26).setOffset(4, 12);
    } else if (tipo === 'cerebro') {
      s.vida = s.vidaMax = 60; s.velocidade = 80; s.setScale(2.4); s.body.setAllowGravity(false);
      s.body.setSize(66, 50).setOffset(7, 2); s.recarga = 2200; s.ativado = false; s.casaY = y; s.estado = 'flutuar';
      s.escudo = true; s.ataques = 0; s.relogio = 0;
      s.bolha = this.add.circle(x, y, 95, 0x6bd1ff, 0.18).setStrokeStyle(4, 0xbfeeff, 0.7).setDepth(5);
      this.tweens.add({ targets: s.bolha, scale: 1.06, duration: 600, yoyo: true, repeat: -1 });
    } else if (tipo === 'rainha') {
      s.vida = s.vidaMax = 55; s.velocidade = 130; s.setScale(2.2); s.body.setAllowGravity(false);
      s.body.setSize(60, 40).setOffset(10, 2); s.recarga = 2500; s.ativado = false; s.casaY = y; s.relogio = 0; s.estado = 'flutuar';
    } else if (tipo === 'chefao') {
      s.vida = s.vidaMax = 45; s.velocidade = 105; s.setScale(2.6).setTint(0x2e9e4a);
      s.body.setSize(36, 32).setOffset(2, 6); s.recarga = 2000; s.ativado = false;
    }
    s.vida = Math.max(1, Math.round(s.vida * this.dif.vidaInim));
    if (s.vidaMax) s.vidaMax = s.vida;
    s.velocidade *= this.dif.vel;
    if (s.body.velocity.x) s.setVelocityX(Math.sign(s.body.velocity.x) * s.velocidade);
    return s;
  }

  // ---- Rainha Gosma: voa de um lado para o outro, chove gosma, bota ovos e dá rasantes
  pensarRainha(s, delta, alvo) {
    if (!s.ativado) {
      if (alvo && alvo.d < 520) { s.ativado = true; SOM.tocar('chefe'); SOM.musica('chefe'); this.texto(s.x, s.y - 90, 'A RAINHA GOSMA ACORDOU!', '#ff5d73'); this.cameras.main.shake(300, 0.01); }
      s.setVelocity(0, 0); return;
    }
    s.relogio += delta;
    const raiva = s.vida < s.vidaMax / 2;
    if (s.estado === 'flutuar') {
      const centro = this.mapaW / 2, amp = this.mapaW / 2 - 140;
      const alvoX = centro + Math.sin(s.relogio / (raiva ? 1300 : 1800)) * amp;
      s.setVelocity((alvoX - s.x) * 2, (s.casaY + Math.sin(s.relogio / 400) * 20 - s.y) * 3);
      s.setFlipX(s.body.velocity.x < 0);
      s.recarga -= delta;
      if (s.recarga <= 0 && alvo) {
        s.recarga = raiva ? 1300 : 2000;
        const r = Math.random();
        if (r < 0.4) { // chuva de gosma
          for (let i = -2; i <= 2; i++) this.time.delayedCall((i + 2) * 120, () => s.active && this.cuspir(s, { x: s.x + i * 70, y: s.y + 300 }, 260));
        } else if (r < 0.65 && this.inimigos.countActive() < 8) { // ovos que viram gosmentos
          for (let i = 0; i < (raiva ? 3 : 2); i++) {
            const f = this.criarInimigo(s.x + Phaser.Math.Between(-40, 40), s.y + 30, 'sombra');
            f.vida = 2; f.setScale(0.75); this.texto(f.x, f.y, 'PLOP!', '#c77dff');
          }
          SOM.tocar('cuspe');
        } else { // rasante: avisa piscando, depois mergulha onde o jogador estava
          s.estado = 'aviso'; s.relogioEstado = 0; s.mira = { x: alvo.j.x, y: alvo.j.y };
          s.setTint(0xff6b6b);
        }
      }
    } else if (s.estado === 'aviso') {
      s.setVelocity(0, 0); s.relogioEstado += delta;
      s.setAlpha(Math.floor(s.relogioEstado / 100) % 2 ? 0.5 : 1);
      if (s.relogioEstado > 700) {
        s.estado = 'rasante'; s.relogioEstado = 0; s.setAlpha(1); s.clearTint();
        const ang = Phaser.Math.Angle.Between(s.x, s.y, s.mira.x, s.mira.y);
        s.setVelocity(Math.cos(ang) * 520, Math.sin(ang) * 520);
        SOM.tocar('bote');
      }
    } else if (s.estado === 'rasante') {
      s.relogioEstado += delta;
      if (s.body.blocked.down || s.relogioEstado > 1500) {
        if (s.body.blocked.down) { SOM.tocar('tremor'); this.cameras.main.shake(200, 0.01); }
        s.estado = 'cansada'; s.relogioEstado = 0; s.setVelocity(0, 0);
        this.texto(s.x, s.y - 60, 'Cansada! Ataquem!', '#ffe14d');
      }
    } else if (s.estado === 'cansada') { // parada perto do chão: hora do chinelo!
      s.relogioEstado += delta; s.setVelocity(0, 0);
      if (s.relogioEstado > (raiva ? 1100 : 1700)) { s.estado = 'voltar'; }
    } else if (s.estado === 'voltar') {
      s.setVelocity(0, -220);
      if (s.y <= s.casaY) s.estado = 'flutuar';
    }
  }

  // ---- Grande Cérebro: escudo, ondas no chão, raios do céu e ovos; depois de dois ataques desce cansado e sem escudo
  pensarCerebro(s, delta, alvo) {
    if (s.bolha) s.bolha.setPosition(s.x, s.y).setVisible(s.escudo);
    if (!s.ativado) {
      if (alvo && alvo.j.x > 37 * T) { s.ativado = true; SOM.tocar('chefe'); SOM.musica('chefe'); this.texto(s.x, s.y - 120, 'O GRANDE CÉREBRO ACORDOU!', '#ff5d73'); this.cameras.main.shake(300, 0.01); }
      s.setVelocity(0, 0); return;
    }
    const raiva = s.vida < s.vidaMax / 2;
    const chao = this.mapaH - T; // topo do chão da arena
    s.relogio += delta;
    if (s.estado === 'flutuar') {
      const minX = 38 * T, maxX = this.mapaW - 3 * T;
      const alvoX = (minX + maxX) / 2 + Math.sin(s.relogio / 2200) * (maxX - minX) / 2;
      s.setVelocity((alvoX - s.x) * 1.5, (s.casaY + Math.sin(s.relogio / 500) * 15 - s.y) * 3);
      s.recarga -= delta;
      if (s.recarga <= 0 && alvo) {
        s.recarga = raiva ? 1300 : 2000;
        if (s.ataques >= 2) { s.ataques = 0; s.estado = 'descer'; this.texto(s.x, s.y - 110, 'Ufa... cansei!', '#ffe14d'); return; }
        s.ataques++;
        const at = Phaser.Utils.Array.GetRandom(this.inimigos.countActive() < 7 ? ['onda', 'raios', 'ovos'] : ['onda', 'raios']);
        if (at === 'onda') {
          SOM.tocar('tremor');
          [-1, 1].forEach(d => {
            const o = this.perigos.create(s.x, chao - 14, 'onda'); o.setVelocityX(d * (raiva ? 330 : 260)).setFlipX(d < 0);
            this.time.delayedCall(5000, () => o.active && o.destroy());
          });
        } else if (at === 'raios') {
          const xs = [alvo.j.x, alvo.j.x + Phaser.Math.Between(150, 300) * (Math.random() < 0.5 ? -1 : 1)];
          xs.push(Phaser.Math.Between(38 * T, this.mapaW - 3 * T));
          if (raiva) xs.push(alvo.j.x + Phaser.Math.Between(-80, 80));
          xs.forEach(x => this.raio(x));
        } else {
          for (let i = 0; i < 2; i++) { const f = this.criarInimigo(s.x + (i ? 50 : -50), s.y + 60, Math.random() < 0.5 ? 'sombra' : 'saltador'); f.vida = 2; this.texto(f.x, f.y, 'PLOP!', '#ff8fb8'); }
          SOM.tocar('cuspe');
        }
      }
    } else if (s.estado === 'descer') {
      s.setVelocity(0, 200);
      if (s.y >= chao - 80) { s.estado = 'exposto'; s.relogioEstado = 0; s.escudo = false; s.setVelocity(0, 0); SOM.tocar('escapou'); this.texto(s.x, s.y - 110, 'SEM ESCUDO! ATAQUEM!', '#9dff4a'); }
    } else if (s.estado === 'exposto') {
      s.relogioEstado += delta; s.setVelocity(0, 0);
      if (s.relogioEstado > (raiva ? 2200 : 3000)) { s.escudo = true; s.estado = 'subir'; }
    } else if (s.estado === 'subir') {
      s.setVelocity(0, -200);
      if (s.y <= s.casaY) s.estado = 'flutuar';
    }
  }

  // coluna de luz: primeiro aviso vermelho, depois o raio
  raio(x) {
    const topo = 2 * T, alt = this.mapaH - 3 * T;
    const aviso = this.add.rectangle(x, topo + alt / 2, 44, alt, 0xff3b6b, 0.22).setDepth(4);
    this.tweens.add({ targets: aviso, alpha: 0.45, duration: 150, yoyo: true, repeat: 3 });
    this.time.delayedCall(850, () => {
      aviso.destroy(); if (this.acabou) return;
      const luz = this.add.rectangle(x, topo + alt / 2, 30, alt, 0xffef5d, 0.85).setDepth(4);
      SOM.tocar('explosao');
      this.jogadores.forEach(j => { if (!j.caido && Math.abs(j.x - x) < 26) this.levarDano(j, { x, y: j.y }, true); });
      this.tweens.add({ targets: luz, alpha: 0, scaleX: 0.2, duration: 350, onComplete: () => luz.destroy() });
    });
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
      if (s.voa) s.setVelocityY(0);
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
    } else if (s.tipo === 'saltador') {
      // pula na direção do jogador; antes se agacha (aviso)
      if (s.body.blocked.down) {
        s.setVelocityX(0);
        if (alvo) s.setFlipX(alvo.j.x < s.x);
        s.recarga -= delta;
        if (alvo && alvo.d < 420 && s.recarga <= 0 && !s.preparando) {
          s.preparando = true; const alvoX = alvo.j.x;
          s.setTint(0xffe0b0);
          this.time.delayedCall(450, () => {
            s.preparando = false; if (!s.active) return; s.clearTint();
            s.recarga = Phaser.Math.Between(1300, 2200);
            SOM.tocar('bote'); s.setVelocity(Phaser.Math.Clamp((alvoX - s.x) * 1.4, -300, 300), -620);
          });
        }
      }
      s.setTexture('saltador_' + (s.body.blocked.down ? 0 : 1));
      return;
    } else if (s.tipo === 'cerebro') {
      this.pensarCerebro(s, delta, alvo);
    } else if (s.tipo === 'rainha') {
      this.pensarRainha(s, delta, alvo);
    } else if (s.tipo === 'chefao') {
      if (!s.ativado) {
        if (alvo && alvo.d < 500) { s.ativado = true; SOM.tocar('chefe'); SOM.musica('chefe'); this.texto(s.x, s.y - 90, 'O ' + this.fase.nomeChefe + ' ACORDOU!', '#ff5d73'); this.cameras.main.shake(300, 0.01); }
        return;
      }
      if (s.preparando) return;
      s.recarga -= delta;
      const raiva = s.vida < s.vidaMax / 2; // metade da vida: fica mais rápido
      if (alvo && s.body.blocked.down) s.setVelocityX(Math.sign(alvo.j.x - s.x) * s.velocidade * (raiva ? 1.7 : 1));
      if (alvo && s.recarga <= 0 && s.body.blocked.down) {
        s.recarga = raiva ? 950 : 1600;
        if (Math.random() < 0.5) {
          // aviso: o Gosmão se espreme antes de pular
          s.setVelocityX(0); s.preparando = true;
          this.tweens.add({ targets: s, scaleY: 1.8, scaleX: 3.1, duration: 450, yoyo: true, onComplete: () => {
            s.preparando = false; if (!s.active) return;
            s.setVelocityY(-650); s.pulando = true;
          } });
        }
        else {
          const n = raiva ? 2 : 1; // com raiva cospe 5 gosmas
          for (let a = -n; a <= n; a++) this.cuspir(s, { x: alvo.j.x + a * 40, y: alvo.j.y + a * 80 }, raiva ? 380 : 320);
          if (raiva && this.inimigos.countActive() < 7) { const f = this.criarInimigo(s.x, s.y - 40, 'sombra'); f.vida = 2; f.setScale(0.8); }
        }
      }
      if (s.pulando && s.body.blocked.down && s.body.velocity.y >= 0) {
        s.pulando = false; SOM.tocar('tremor'); this.cameras.main.shake(200, 0.012);
        this.jogadores.forEach(j => { if (!j.caido && j.body.blocked.down && Math.abs(j.x - s.x) < 180) this.levarDano(j, s, true); });
      }
      s.setFlipX(s.body.velocity.x < 0);
    }
  }


  // qual controle cada jogador usa: com 2 jogadores e só 1 controle, o controle fica com o jogador 2
  // (o jogador 1 usa o teclado ou a tela); com 2 controles, um para cada
  pad(j) {
    const pads = controles(this);
    if (!pads.length) return null;
    if (this.jogadores.length === 1) return pads[0];
    if (pads.length === 1) return j.idx === 1 ? pads[0] : null;
    return pads[j.idx] || null;
  }

  update(time, delta) {
    if (this.acabou) return;
    this.lerToque();
    const vivos = this.jogadores.filter(j => !j.caido);
    vivos.forEach(j => this.controlarJogador(j, delta));
    this.jogadores.forEach(j => {
      if (j.escudo > 0 && !j.caido) {
        if (!j.bolhaEscudo) j.bolhaEscudo = this.add.circle(j.x, j.y, 30, 0x6bd1ff, 0.15).setStrokeStyle(2, 0xbfeeff, 0.8).setDepth(6);
        j.bolhaEscudo.setPosition(j.x, j.y).setVisible(true);
      } else if (j.bolhaEscudo) j.bolhaEscudo.setVisible(false);
    });

    this.inimigos.getChildren().slice().forEach(s => s.active && this.pensarInimigo(s, delta));
    this.atualizarMoedas();
    this.bandeiras.forEach(b => {
      if (b.ativa) return;
      if (vivos.some(j => Math.abs(j.x - b.x) < 40 && Math.abs(j.y - (b.y - 30)) < 70)) {
        this.bandeiras.forEach(o => o.setTexture('bandeira'));
        b.ativa = true; b.setTexture('bandeira_ok'); this.ponto = { x: b.x, y: b.y - 40 };
        SOM.tocar('escapou'); this.texto(b.x, b.y - 80, 'PONTO SALVO!', '#7cff6b');
        vivos.forEach(j => { j.vida = Math.max(j.vida, Math.ceil(j.vidaMax / 2)); });
      }
    });
    this.dicas.forEach(d => {
      if (d.visto) return;
      if (vivos.some(j => Math.abs(j.x - d.img.x) < 90 && Math.abs(j.y - d.img.y) < 120)) { d.visto = true; this.mostrarDica(d); }
    });
    this.atualizarItens();

    // câmera
    const olharCima = this.chefao && this.chefao.active && this.chefao.ativado && this.chefao.voa ? (this.chefao.tipo === 'cerebro' ? 170 : 110) : 0;
    if (vivos.length) {
      this.alvoCamera.x = vivos[0].x;
      this.alvoCamera.y = vivos[0].y - olharCima;
    }
    // co-op: se os dois se afastam, a tela se divide; quando se aproximam, junta de novo
    if (vivos.length > 1) {
      const [a, b] = vivos;
      const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
      if (!this.dividida && (dx > W * 0.8 || dy > H * 0.75)) this.dividirTela(true);
      else if (this.dividida && dx < W * 0.4 && dy < H * 0.4) this.dividirTela(false);
      if (this.dividida) {
        // quem está mais à esquerda fica na metade esquerda
        const [esq, dir] = a.x <= b.x ? [a, b] : [b, a];
        this.alvoCamera.x = esq.x; this.alvoCamera.y = esq.y - olharCima;
        this.alvoCamera2.x = dir.x; this.alvoCamera2.y = dir.y - olharCima;
      } else {
        this.alvoCamera.x = (a.x + b.x) / 2; this.alvoCamera.y = (a.y + b.y) / 2 - olharCima;
      }
    } else if (this.dividida) this.dividirTela(false);
    this.separarCamadas();

    // caiu no buraco
    this.jogadores.forEach(j => { if (!j.caido && j.y > this.mapaH + 60) this.cair(j); });

    this.hud.setText(this.jogadores.map(j =>
      `${CHARS[j.id].nome}: ${j.caido ? '💫 voltando...' : '❤'.repeat(Math.max(0, j.vida)) + '♡'.repeat(Math.max(0, j.vidaMax - j.vida)) + '  🩴' + ARMAS[j.arma].icone + (j.turbo ? '⚡' + j.turbo : '') + (j.jetpack ? ' 🚀' + Math.round(j.combustivel) + '%' : '') + (j.tenis ? ' 👟' : '') + (j.escudo ? ' 🫧' + j.escudo : '') + (j.capacete ? ' ⛑️' : '')}`
    ).join('     ') + `     🪙 ${PROGRESSO.moedas}` + (this.chefao && this.chefao.active && this.chefao.ativado ? `     ${this.fase.nomeChefe}: ${'█'.repeat(Math.max(0, Math.ceil(this.chefao.vida / 3)))}` : ''));
  }

  controlarJogador(j, delta) {
    const k = j.k, p = this.pad(j);
    const esqK = k.esq.isDown || (p && (p.left || p.leftStick.x < -0.4));
    const dirK = k.dir.isDown || (p && (p.right || p.leftStick.x > 0.4));
    const esq0 = esqK, dir0 = dirK;
    const cimaK = k.pulo.isDown || (p && (p.up || p.leftStick.y < -0.5));
    const baixoK = k.baixo.isDown || (p && (p.down || p.leftStick.y > 0.5));
    const baixoPad = !!(p && (p.down || p.leftStick.y > 0.5));
    const baixoAgora = Phaser.Input.Keyboard.JustDown(k.baixo) || (baixoPad && !j.baixoAntes); j.baixoAntes = baixoPad;
    const toqueP = j.idx === 0 && this.toque && this.toque.pegar; if (toqueP) this.toque.pegar = false;
    if ((baixoAgora || toqueP || (j.idx === 0 && Phaser.Input.Keyboard.JustDown(this.teclaE))) && !j.preso && this.pegarItem(j)) { j.baixoAntes = true; j.travaDescida = this.time.now + 400; }
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
    if (baixo && noChao && !j.descendo && this.time.now > (j.travaDescida || 0) && this.pontes.getChildren().some(pt => Math.abs(pt.body.top - j.body.bottom) < 4 && j.x > pt.x && j.x < pt.x + pt.width)) {
      j.descendo = true; this.time.delayedCall(280, () => { j.descendo = false; });
    }
    if (noChao) j.pulosExtras = !this.fase.semPoderes ? 1 : 0; // os dois gêmeos têm pulo duplo

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
    if (rolar && j.recargaRolar === 0 && j.deslizando === 0 && !this.fase.semPoderes) {
      j.direcao = rolar; j.deslizando = 380; j.recargaRolar = PROGRESSO.nivel('cambalhota') ? 350 : 750;
      SOM.tocar('cambalhota'); j.invencivel = Math.max(j.invencivel, 420); // atravessa inimigos e ataques sem se machucar
      this.tweens.add({ targets: j, angle: 360 * rolar, duration: 380, onComplete: () => j.setAngle(0) });
      this.poeira(j.x, j.body.bottom);
    }

    if (j.deslizando > 0) {
      j.setVelocityX(430 * j.direcao);
    } else {
      const vel = j.tenis ? 320 : 220;
      if (esq) { j.setVelocityX(-vel); j.direcao = -1; }
      else if (dir) { j.setVelocityX(vel); j.direcao = 1; }
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

    // jetpack: no ar, segurar pular faz voar enquanto tiver combustível
    if (j.jetpack) {
      const segurando = k.pulo.isDown || (p && p.A) || (j.idx === 0 && this.toque && this.toque.cima);
      if (noChao) j.combustivel = Math.min(100, j.combustivel + delta * 0.08);
      else if (segurando && j.combustivel > 0 && j.body.velocity.y > -120 && !pulo2) {
        j.setVelocityY(-240); j.combustivel = Math.max(0, j.combustivel - delta * 0.045);
        if (Math.random() < 0.5) { const f = this.add.circle(j.x - 8 * j.direcao, j.y + 20, 4, 0xffa63d, 0.9); this.tweens.add({ targets: f, y: f.y + 20, alpha: 0, duration: 250, onComplete: () => f.destroy() }); }
      }
    }
    // especiais para ganhar tempo: Nícolas joga casca de banana; Theo solta o MEGA PUM
    if (especial2 && j.recargaEspecial === 0 && this.fase.semPoderes) { if (!this.avisoPoder) { this.avisoPoder = true; this.texto(j.x, j.y - 50, 'Ainda sem superpoderes...', '#aaaaaa'); this.time.delayedCall(2000, () => this.avisoPoder = false); } }
    else if (especial2 && j.recargaEspecial === 0) {
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
        const forca = PROGRESSO.nivel('chinelo');
        this.acertar(s, (critico ? 3 : 1) + forca, j.direcao);
        if (s.active && !s.chefe && !s.vitima) {          // chinelada empurra para longe e deixa tonto um instante
          s.setVelocity(430 * j.direcao, -230);
          s.atordoado = Math.max(s.atordoado || 0, 550); s.empurrao = 550;
        }
        j.invencivel = Math.max(j.invencivel, 250);
        if (critico) SOM.tocar('critico');
        if (critico) this.texto(s.x, s.y - 30, 'CHINELADA!', '#ffef5d');
      }
    });
  }

  // ---- armas do botão 2
  usarArma(j) {
    j.recargaEstilingue = ARMAS[j.arma].recarga * (1 - 0.15 * (j.turbo || 0));
    if (j.arma === 'estilingue') this.atirar(j);
    else if (j.arma === 'bola') this.chutarBola(j);
    else if (j.arma === 'drone') this.lancarDrone(j);
    else if (j.arma === 'agua') this.esguichar(j);
  }

  atirar(j) {
    SOM.tocar('pedra');
    const p = this.pedras.create(j.x + 16 * j.direcao, j.y - 6, 'pedra'); p.dano = this.danoArma(j, 1);
    p.setVelocityX(650 * j.direcao);
    this.time.delayedCall(900, () => p.active && p.destroy());
  }

  // bola: quica no chão e nas paredes, acerta vários inimigos
  chutarBola(j) {
    SOM.tocar('chute');
    const b = this.bolas.create(j.x + 18 * j.direcao, j.y + 4, 'bola');
    b.setCircle(9).setBounce(0.75, 0.75).setCollideWorldBounds(true).setVelocity(520 * j.direcao, -260).setAngularVelocity(600 * j.direcao);
    b.acertados = new Set(); b.dano = this.danoArma(j, 2);
    this.time.delayedCall(2600, () => { if (b.active) { this.poeira(b.x, b.y); b.destroy(); } });
  }
  bolaAcerta(b, s) {
    if (!b.active || !s.active || b.acertados.has(s)) return;
    b.acertados.add(s);
    this.acertar(s, b.dano || 2, b.body.velocity.x >= 0 ? 1 : -1);
    b.setVelocity(-b.body.velocity.x * 0.8, -300);
    SOM.tocar('gol');
    this.texto(b.x, b.y - 20, 'GOL!', '#ffffff');
  }

  // drone: voa para frente e solta uma bomba de purpurina
  lancarDrone(j) {
    SOM.tocar('drone');
    const d = this.add.image(j.x, j.y - 30, 'drone').setDepth(8).setFlipX(j.direcao < 0);
    this.tweens.add({ targets: d, x: j.x + 170 * j.direcao, y: j.y - 110, duration: 550, ease: 'Sine.easeOut', onComplete: () => {
      const b = this.bombas.create(d.x, d.y + 10, 'bomba'); b.dano = this.danoArma(j, 3);
      b.setVelocity(0, 50);
      this.time.delayedCall(2000, () => b.active && this.explodir(b));
      this.tweens.add({ targets: d, y: d.y - 200, alpha: 0, duration: 600, onComplete: () => d.destroy() });
    } });
  }
  explodir(b) {
    if (!b.active) return;
    const x = b.x, y = b.y, danoB = b.dano || 3; b.destroy();
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
      if (s.active && Phaser.Math.Distance.Between(s.x, s.y, x, y) < 100) this.acertar(s, danoB, s.x >= x ? 1 : -1);
    });
  }

  // pistola d'água: rajada de gotas que empurra
  esguichar(j) {
    SOM.tocar('agua');
    for (let i = 0; i < 6; i++) {
      this.time.delayedCall(i * 55, () => {
        if (j.caido) return;
        const g = this.gotas.create(j.x + 16 * j.direcao, j.y - 4 + Phaser.Math.Between(-4, 4), 'gota'); g.dano = this.danoArma(j, 0.5);
        g.setVelocity(560 * j.direcao, Phaser.Math.Between(-30, 30));
        this.time.delayedCall(550, () => g.active && g.destroy());
      });
    }
  }
  molhar(s, d, dano = 0.5) {
    if (!s.active || s.escudo) return;
    s.vida -= dano;
    s.setTint(0x6bd1ff); this.time.delayedCall(80, () => s.active && s.clearTint());
    if (!s.chefe) { s.setVelocityX(260 * d); if (!(s.atordoado > 0)) { s.atordoado = 220; s.empurrao = 220; } }
    if (s.vida <= 0) this.confete(s);
  }

  // ---- baús: sai um item sorteado; o jogador decide se pega (▼ / S / E / botão PEGAR) ou deixa
  abrirBau(b) {
    if (b.aberto) return;
    b.aberto = true; b.setTexture('bau_aberto'); SOM.tocar('bau');
    this.soltarItem(b.x, b.y - 20, sortearItem());
  }
  soltarItem(x, y, id, largadoPor) {
    const it = this.itens.create(x, y, 'item_base');
    it.id = id; it.bloqueado = largadoPor || null;
    it.espera = this.time.now + 500; it.setVelocityY(-250);
    it.rotulo = this.add.text(x, y, infoItem(id).icone, { fontSize: 22 }).setOrigin(0.5).setDepth(3);
    this.tweens.add({ targets: it, scale: 1.15, duration: 400, yoyo: true, repeat: -1 });
    return it;
  }
  // mostra a placa "pegar?" para o item mais perto de cada jogador
  atualizarItens() {
    if (this.placaItem) { this.placaItem.destroy(); this.placaItem = null; }
    this.itemPerto = new Map();
    this.itens.getChildren().forEach(it => {
      it.rotulo.setPosition(it.x, it.y);
      if (it.bloqueado && !this.physics.overlap(it.bloqueado, it)) it.bloqueado = null;
    });
    this.jogadores.forEach(j => {
      if (j.caido) return;
      const perto = this.itens.getChildren().filter(i => i.active && this.time.now > i.espera && i.bloqueado !== j && Math.abs(i.x - j.x) < 36 && Math.abs(i.y - j.y) < 50);
      const it = perto.sort((a, b) => Math.abs(a.x - j.x) - Math.abs(b.x - j.x))[0];
      if (it) this.itemPerto.set(j, it);
    });
    const primeiro = [...this.itemPerto.values()][0];
    if (primeiro) {
      const inf = infoItem(primeiro.id);
      const toque = this.sys.game.device.input.touch;
      this.placaItem = this.add.text(primeiro.x, primeiro.y - 56, `${inf.icone} ${inf.nome}\n${inf.desc}\n${toque ? '✋ toque em PEGAR' : '▼ S / E / ↓ para pegar'}  ·  ou deixe aí`,
        { fontFamily: 'Arial', fontSize: 14, color: '#ffffff', backgroundColor: '#000000cc', padding: { x: 8, y: 5 }, align: 'center' }).setOrigin(0.5, 1).setDepth(20);
    }
    if (this.botaoPegar) this.botaoPegar.setVisible(!!primeiro);
  }
  pegarItem(j) {
    const it = this.itemPerto && this.itemPerto.get(j);
    if (!it || !it.active) return false;
    const id = it.id, inf = infoItem(id), dado = ITENS_BAU[id];
    it.rotulo.destroy(); it.destroy();
    SOM.tocar('arma');
    this.texto(j.x, j.y - 46, inf.icone + ' ' + inf.nome + '!', '#ffe14d');
    if (dado.arma) {
      const velha = j.arma; j.arma = dado.arma;
      if (velha !== j.arma) this.soltarItem(j.x - 20 * j.direcao, j.y - 10, 'arma_' + velha, j);
    } else if (id === 'maca' || id === 'pizza' || id === 'bolo') {
      j.vida = Math.min(j.vidaMax, j.vida + (id === 'maca' ? 1 : id === 'pizza' ? 3 : 99));
    } else if (id === 'turbo') { j.turbo = Math.min(3, (j.turbo || 0) + 1); this.texto(j.x, j.y - 70, 'Arma nível ' + (j.turbo + 1), '#ffef5d'); }
    else if (id === 'jetpack') { j.jetpack = true; j.combustivel = 100; }
    else if (id === 'tenis') { j.tenis = true; }
    else if (id === 'escudo') { j.escudo = 3; }
    else if (id === 'capacete') { j.vidaMax += 2; j.vida += 2; j.capacete = true; }
    else if (id === 'moedas') { PROGRESSO.ganhar(15); this.moedasFase += 15; SOM.tocar('moeda'); }
    return true;
  }
  danoArma(j, base) { return base * (1 + 0.5 * (j.turbo || 0)); }

  acertar(s, dano, dir) {
    if (!s.active) return;
    if (s.escudo) { if (!s.avisoEscudo) { s.avisoEscudo = true; this.texto(s.x, s.y - 110, 'ESCUDO!', '#bfeeff'); this.time.delayedCall(700, () => s.avisoEscudo = false); } return; }
    s.vida -= dano; if (s.vida > 0) SOM.tocar('acerto');
    s.setTint(0xffffff);
    this.time.delayedCall(80, () => s.active && s.clearTint());
    if (s.tipo === 'rainha') { /* não é empurrada */ }
    else if (s.chefe) { s.setVelocityX(80 * dir); }
    else if (s.tipo === 'morcego') { s.setVelocity(220 * dir, -120); s.estado = 'voando'; s.relogio = 0; }
    else { s.setVelocity(200 * dir, -180); this.time.delayedCall(250, () => s.active && s.setVelocityX(s.velocidade * dir)); }
    if (s.vida <= 0) this.confete(s);
  }

  // ---- especial do Nícolas: casca de banana
  jogarBanana(j) {
    j.recargaEspecial = 1800 * (1 - 0.25 * PROGRESSO.nivel('especial')); SOM.tocar('banana');
    const b = this.bananas.create(j.x + 20 * j.direcao, j.y - 10, 'banana');
    b.setVelocity(260 * j.direcao, -280).setAngularVelocity(400 * j.direcao);
    b.usos = 5; b.dono = j; b.body.setSize(44, 22);   // área maior para pisar
    this.time.delayedCall(14000, () => b.active && b.destroy());
  }

  escorregar(s, b) {
    if (!b.active || !s.active || s.atordoado > 0 || s.voa || s.tipo === 'morcego' || s.vitima) return;
    const dir = s.x >= b.dono.x ? 1 : -1; // voa para LONGE do Nícolas
    if (s.chefe) { // o Gosmão também escorrega (uma vez por casca), fica tonto um pouco
      if (b.chefeJaEscorregou) return; b.chefeJaEscorregou = true;
      s.atordoado = 1600; s.empurrao = 500; s.setVelocity(250 * dir, -300);
      SOM.tocar('escorregar'); this.texto(s.x, s.y - 90, 'O GOSMÃO ESCORREGOU!', '#ffe14d'); this.desmaiar(s, 0);
      this.acertar(s, 3, dir); s.atordoado = 1600;
      b.usos--; if (b.usos <= 0) b.destroy(); return;
    }
    s.setVelocity(480 * dir, -560);
    s.atordoado = 3200; s.empurrao = 1000;
    this.acertar(s, 1, dir); if (!s.active) { b.usos--; if (b.usos <= 0) b.destroy(); return; }
    s.atordoado = 3200; s.empurrao = 1000; s.setVelocity(480 * dir, -560);
    this.tweens.add({ targets: s, angle: 360 * dir, duration: 700, onComplete: () => s.active && s.setAngle(180) });
    SOM.tocar('escorregar');
    this.texto(s.x, s.y - 40, 'ESCORREGOU!', '#ffe14d');
    this.desmaiar(s, 0);
    b.usos--; if (b.usos <= 0) b.destroy();
  }

  // ---- especial do Theo: MEGA PUM
  megaPum(j) {
    j.recargaEspecial = 5000 * (1 - 0.25 * PROGRESSO.nivel('especial'));
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
      if (s.chefe) { s.atordoado = 1200; s.empurrao = 0; }
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
  // ---- moedas de gosma (ficam salvas e servem para a loja dos hologramas)
  soltarMoedas(x, y, n) {
    for (let i = 0; i < n; i++) {
      const m = this.moedas.create(x, y, 'moeda');
      m.setBounce(0.5).setVelocity(Phaser.Math.Between(-160, 160), Phaser.Math.Between(-380, -200)).setCollideWorldBounds(true);
      m.pegavel = this.time.now + 400;
    }
  }
  atualizarMoedas() {
    this.moedas.getChildren().slice().forEach(m => {
      if (this.time.now < m.pegavel) return;
      const perto = this.maisPerto(m.x, m.y);
      if (!perto) return;
      if (perto.d < 26) { m.destroy(); PROGRESSO.ganhar(1); this.moedasFase++; SOM.tocar('moeda'); return; }
      if (perto.d < 130) { // ímã
        m.body.setAllowGravity(false);
        const ang = Phaser.Math.Angle.Between(m.x, m.y, perto.j.x, perto.j.y);
        m.setVelocity(Math.cos(ang) * 420, Math.sin(ang) * 420);
      } else m.body.setAllowGravity(true);
    });
  }

  confete(s) {
    if (s.zzz) { s.zzz.destroy(); s.zzz = null; }
    if (s.bolha) { s.bolha.destroy(); s.bolha = null; }
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
    this.derretidos = (this.derretidos || 0) + 1;
    this.soltarMoedas(x, base - 20, s.chefe ? 25 : s.tipo === 'comedor' ? 4 : 2);
    this.texto(x, base - 50, s.chefe ? this.fase.nomeChefe + ' DERRETEU!' : 'SPLORT!', '#7dff95');
  }


  levarDano(j, s, semPisao) {
    if (j.invencivel > 0 || j.caido) return;
    if (!semPisao && s.atordoado > 0 && !s.chefe) return; // tonto/desmaiado não machuca
    if (j.escudo > 0 && !(!semPisao && !s.chefe && j.body.velocity.y > 100 && j.y < s.y - 15)) {
      j.escudo--; j.invencivel = 900; SOM.tocar('escapou');
      this.texto(j.x, j.y - 50, j.escudo ? `ESCUDO! (${j.escudo})` : 'O escudo estourou!', '#6bd1ff');
      j.setVelocity(j.x < s.x ? -200 : 200, -250);
      return;
    }
    if (!semPisao && !s.chefe && j.body.velocity.y > 100 && j.y < s.y - 15) { // pulou em cima
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
      // no "Quero a minha mãe!" são só 3 tentativas por fase; nos outros, sempre volta para a bandeira
      const dificil = this.dif.quantidade === 'mais';
      if (dificil) this.tentativas--;
      if (dificil && this.tentativas <= 0) {
        this.acabou = true;
        SOM.pararMusica(); SOM.tocar('derrota');
        this.mensagem('Os gosmentos venceram desta vez...\nAperte R ou toque na tela para recomeçar a fase', '#ff5d73');
        this.esperarRecomeco();
        return;
      }
      SOM.tocar('derrota');
      const aviso = this.mensagem((this.ponto ? 'Voltando para a bandeira...' : 'Voltando para o começo...') + (dificil ? `\nTentativas restantes: ${this.tentativas}` : ''), '#ffe14d');
      this.time.delayedCall(1800, () => {
        aviso.destroy();
        const p = this.ponto || this.inicio;
        this.jogadores.forEach((o, i) => {
          if (o.preso) this.soltar(o, false);
          o.caido = false; o.vida = o.vidaMax; o.invencivel = 2000;
          o.body.enable = true; o.setVisible(true);
          o.setPosition(p.x + i * 30, p.y).setVelocity(0, 0);
        });
      });
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
    this.indo = false;
    if (this.acabou) return;
    this.acabou = true;
    this.physics.pause();
    SOM.pararMusica(); SOM.tocar('vitoria');
    const cfg = this.registry.get('config');
    const proximo = this.nivel + 1;
    PROGRESSO.liberar(Math.min(proximo, FASES.length - 1));
    const destino = sequenciaDepois(this.nivel, cfg);
    const titulo = this.fase.nome.split(':')[0].toUpperCase();
    const seg = Math.round((this.time.now - this.tempoInicio) / 1000);
    const tempo = `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`;
    const placar = `⏱ ${tempo}   💧 ${this.derretidos} alienígenas derretidos   🪙 +${this.moedasFase}`;
    this.mensagem((proximo < FASES.length ? `${titulo} COMPLETO!` : 'VOCÊS RESGATARAM O LUCCA!') + `\n${placar}\nToque ou aperte R para continuar`, '#7cff6b');
    const ir = () => { if (this.indo) return; this.indo = true; this.scene.start(destino.cena, destino.dados); };
    this.input.keyboard.once('keydown-R', ir);
    this.time.delayedCall(800, () => { this.input.once('pointerdown', ir); this.continuar = ir; });
  }

  esperarRecomeco() {
    this.time.delayedCall(800, () => { this.continuar = () => this.scene.restart(); });
    this.input.keyboard.once('keydown-R', () => this.scene.restart());
    this.time.delayedCall(800, () => this.input.once('pointerdown', () => this.scene.restart()));
  }

  mensagem(t, cor) {
    return this.add.text(W / 2, H / 2, t, { fontFamily: 'Arial Black', fontSize: 30, color: cor, align: 'center', stroke: '#000', strokeThickness: 6 })
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
  scene: [Menu, Fase, Cena, Loja, Pausa],
});
