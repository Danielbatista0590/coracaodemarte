# Mundo 3: o Núcleo de Marte — a cidade dos gosmentos e a arena do Grande Cérebro (o Lucca está no fim!)
C, R = 80, 36
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
# cidade gosmenta: prédios (blocos) e passarelas
solid(6, 10, 32); solid(6, 10, 33); solid(6, 10, 34)
solid(16, 21, 30); solid(16, 21, 31); solid(16, 21, 32); solid(16, 21, 33); solid(16, 21, 34)
one(11, 15, 31); one(22, 27, 28); one(28, 33, 25)
solid(26, 30, 34); solid(26, 30, 33)
lad(24, 28, 34)
one(2, 6, 28); one(8, 14, 25)
# arena (a partir da coluna 36)
for y in range(1, 20): g[y][35] = '#'
one(40, 46, 30); one(68, 74, 30); one(53, 60, 26)
put(3, 34, 'P'); put(77, 34, 'E'); put(57, 23, 'B')
for (x, y, ch) in [(12, 34, 'g'), (19, 29, 's'), (29, 32, 'm'), (23, 34, 'a'), (12, 24, 'c'), (31, 24, 'v'),
                   (14, 34, 'G'), (30, 24, 'S'), (33, 34, 'A')]: put(x, y, ch)
put(9, 31, 'T')
print('const MAPA3 = [')
for row in g: print("  '" + ''.join(row) + "',")
print('];')
