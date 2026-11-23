# Mundo 2: a Torre da Nave-Mãe — uma subida vertical até a Rainha Gosma
# Mesma legenda do mapa 1, mais: s saltador (S extra)
import random
random.seed(7)
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

andares = [63 - 6 * k for k in range(8)]      # 63, 57, ..., 21 (21 = chão da arena)
for k, y in enumerate(andares):
    solid(1, C - 2, y)
    if k % 2 == 0: one(48, 56, y); one(46, 54, y + 3)   # passagem à direita
    else:          one(3, 11, y);  one(5, 13, y + 3)    # passagem à esquerda
    if k in (1, 3, 5):                                  # escadas extras no meio
        lad(30, y - 1, y + 5)
    if k in (2, 4, 6):
        one(20, 26, y + 3); one(34, 40, y + 3)          # plataformas de respiro
put(4, 67, 'P')
put(56, 20, 'E'); put(30, 15, 'B')
inimigos = {
    0: [(20, 'g'), (36, 's'), (44, 'G')],
    1: [(15, 's'), (40, 'a'), (25, 'c'), (50, 'S')],
    2: [(12, 'm'), (30, 's'), (42, 'g'), (22, 'A')],
    3: [(20, 's'), (36, 'c'), (48, 'g'), (40, 'M')],
    4: [(10, 'a'), (25, 's'), (40, 's'), (33, 'G')],
    5: [(18, 'm'), (35, 'g'), (45, 'c'), (26, 'S')],
    6: [(14, 's'), (28, 'a'), (42, 'g'), (36, 'C')],
}
for k, lista in inimigos.items():
    y = andares[k] - 1
    for (x, ch) in lista: put(x, y, ch)
for (x, y) in [(8, 43), (14, 30), (6, 39)]: pass
# águas-vivas voando no poço central
for (x, y, ch) in [(28, 60, 'v'), (32, 47, 'v'), (26, 35, 'v'), (34, 29, 'V')]: put(x, y, ch)
# baús
for (x, k) in [(52, 0), (6, 2), (52, 3), (8, 5)]: put(x, andares[k] - 1, 'T')
print('const MAPA2 = [')
for row in g: print("  '" + ''.join(row) + "',")
print('];')
