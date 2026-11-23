# Gera o mapa da fase 1 em texto. Legenda:
# # bloco sólido   - plataforma atravessável (sobe por baixo, desce com ▼)   H escada
# P início  E saída  B chefe   g gosmento  v água-viva  c cuspidor  m comedor  a agarrador
# T baú com arma   MAIÚSCULAS = inimigos extras só no "Quero a minha mãe!"
C, R = 100, 45
g = [[' '] * C for _ in range(R)]
def solid(x1, x2, y):
    for x in range(x1, x2 + 1): g[y][x] = '#'
def one(x1, x2, y):
    for x in range(x1, x2 + 1): g[y][x] = '-'
def lad(x, y1, y2):
    for y in range(y1, y2 + 1):
        if g[y][x] == ' ' or g[y][x] == '-': g[y][x] = 'H'
def put(x, y, ch): g[y][x] = ch
for x in range(C): g[0][x] = g[R-1][x] = '#'
for y in range(R): g[y][0] = g[y][C-1] = '#'
# A: subida em zigue-zague à esquerda
for (a, b, y) in [(4,10,41),(11,17,38),(3,9,35),(10,16,32),(2,8,29),(9,15,26),(14,19,23)]: one(a, b, y)
# B: corredor de cima (sólido) com passagem da escada
solid(18, 58, 20); one(21, 23, 20); lad(22, 19, 43)
one(34, 40, 16)
# caverna de baixo
for (a, b, y) in [(30,38,40),(42,50,37),(32,40,34),(46,54,31),(36,44,27),(26,32,24)]: one(a, b, y)
# área da direita: prateleira do meio com escada
solid(64, 88, 32); one(65, 67, 32); lad(66, 31, 43)
for (a, b, y) in [(89,95,29),(92,98,26),(84,90,23),(91,97,20),(85,91,17)]: one(a, b, y)
# arena do chefe lá em cima
solid(66, 98, 14); one(84, 90, 14)
for y in range(5, 14): g[y][65] = '#'
put(3, 42, 'P'); put(97, 13, 'E'); put(75, 12, 'B')
for (x, y, ch) in [(14,43,'g'),(12,30,'v'),(30,19,'g'),(40,19,'a'),(50,19,'c'),(37,12,'v'),
                   (35,43,'g'),(45,43,'m'),(55,43,'g'),(49,30,'c'),
                   (75,43,'a'),(85,43,'g'),(92,43,'m'),(72,31,'g'),(80,26,'v'),(86,31,'c'),
                   (8,43,'G'),(50,10,'V'),(37,15,'C'),(60,43,'M'),(48,19,'A'),(95,43,'G'),(40,33,'G')]:
    put(x, y, ch)
for (x, y) in [(17,43),(35,15),(28,23),(70,31),(95,19),(63,43)]: put(x, y, 'T')
print('const MAPA = [')
for row in g: print("  '" + ''.join(row) + "',")
print('];')
