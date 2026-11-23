# Mundo 3: a Torre da Nave-Mãe — agora DESCENDO até a Rainha Gosma, rumo ao centro de Marte
# Para descer pelas tábuas (-): aperte ▼. Mesma legenda do mapa 1, mais: s saltador (S extra)
C, R = 60, 70
g = [[' '] * C for _ in range(R)]
def solid(x1, x2, y):
    for x in range(x1, x2 + 1): g[y][x] = '#'
def one(x1, x2, y):
    for x in range(x1, x2 + 1): g[y][x] = '-'
def lad(x, y1, y2):
    for y in range(y1, y2 + 1): g[y][x] = 'H'
def put(x, y, ch): g[y][x] = ch
for x in range(C): g[0][x] = g[R-1][x] = '#'
for y in range(R): g[y][0] = g[y][C-1] = '#'
andares = [8 + 7 * k for k in range(7)]      # 8, 15, ..., 50 (50 = teto da arena)
for k, y in enumerate(andares):
    solid(1, C - 2, y)
    if k % 2 == 0: one(48, 56, y)             # tábua para descer à direita
    else:          one(3, 11, y)              # ... ou à esquerda
    if k in (1, 3, 5): lad(30, y - 6, y + 6)  # escadas pelo meio
    if k in (0, 2, 4): one(18, 24, y + 4); one(36, 42, y + 4)
put(4, 7, 'P')
put(57, 68, 'E'); put(30, 58, 'B')
inimigos = {
    1: [(20, 'g'), (36, 's'), (44, 'G')],
    2: [(15, 's'), (40, 'a'), (25, 'c'), (50, 'S')],
    3: [(12, 'm'), (36, 's'), (42, 'g'), (22, 'A')],
    4: [(20, 's'), (36, 'c'), (48, 'g'), (40, 'M')],
    5: [(10, 'a'), (25, 's'), (40, 's'), (33, 'G')],
    6: [(18, 'm'), (35, 'g'), (45, 'c'), (26, 'S')],
}
for k, lista in inimigos.items():
    y = andares[k - 1] + 6        # chão de cada andar = andar de baixo; inimigos ficam em cima dele
    for (x, ch) in lista:
        if g[y][x] == ' ': put(x, y, ch)
for (x, y, ch) in [(28, 11, 'v'), (32, 25, 'v'), (26, 39, 'v'), (34, 46, 'V')]: put(x, y, ch)
for (x, k) in [(52, 1), (6, 2), (52, 4), (8, 5)]: put(x, andares[k - 1] + 6, 'T')
print('const MAPA2 = [')
for row in g: print("  '" + ''.join(row) + "',")
print('];')
