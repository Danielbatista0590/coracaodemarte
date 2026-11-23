# Prólogo: a Terra à noite — quintal, casa da árvore e o pasto onde está a nave esquecida
C, R = 110, 22
g = [[' '] * C for _ in range(R)]
def solid(x1, x2, y):
    for x in range(x1, x2 + 1): g[y][x] = '#'
def one(x1, x2, y):
    for x in range(x1, x2 + 1): g[y][x] = '-'
def lad(x, y1, y2):
    for y in range(y1, y2 + 1): g[y][x] = 'H'
def put(x, y, ch): g[y][x] = ch
for x in range(C): g[R-1][x] = '#'
for y in range(R): g[y][0] = g[y][C-1] = '#'
one(18, 24, 18)                                     # cerca
one(27, 34, 17); one(29, 33, 14)                    # árvore 1
solid(40, 56, 20); solid(43, 53, 19); solid(46, 50, 18)   # morro
one(58, 68, 13); lad(62, 13, 20); one(56, 60, 17)  # casa da árvore
one(70, 76, 17); one(78, 84, 15)
solid(88, 100, 20); solid(91, 97, 19)              # morrinho
put(6, 20, 'P'); put(105, 20, 'E')
for (x, y, ch) in [(36, 20, 'g'), (58, 20, 'g'), (75, 10, 'v'), (94, 18, 'g'), (25, 20, 'G'), (84, 14, 'G'), (50, 10, 'V')]: put(x, y, ch)
put(65, 12, 'T')
print('const MAPA0 = [')
for row in g: print("  '" + ''.join(row) + "',")
print('];')
