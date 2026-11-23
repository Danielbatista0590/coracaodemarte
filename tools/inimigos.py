# Gera a pixel art dos alienígenas (2 quadros de animação cada) como texto para o game.js
import json
def grade(w, h): return [['.'] * w for _ in range(h)]
def elipse(g, cx, cy, rx, ry, ch, so_cima=False):
    for y in range(len(g)):
        for x in range(len(g[0])):
            if ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1 and (not so_cima or y + .5 <= cy): g[y][x] = ch
def ret(g, x1, y1, x2, y2, ch):
    for y in range(max(0, y1), min(len(g), y2 + 1)):
        for x in range(max(0, x1), min(len(g[0]), x2 + 1)): g[y][x] = ch
def px(g, x, y, ch):
    if 0 <= y < len(g) and 0 <= x < len(g[0]): g[y][x] = ch
def sombrear(g, de_y, de='g', para='G'):
    for y in range(de_y, len(g)):
        for x in range(len(g[0])):
            if g[y][x] == de: g[y][x] = para
def contorno(g):
    h, w = len(g), len(g[0]); out = [r[:] for r in g]
    for y in range(h):
        for x in range(w):
            if g[y][x] != '.':
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    nx, ny = x + dx, y + dy
                    if not (0 <= nx < w and 0 <= ny < h) or g[ny][nx] == '.':
                        out[y][x] = 'o'; break
    return out
def olho(g, x, y, grande=False):
    ret(g, x, y, x + 1, y + 1, 'w'); px(g, x + 1, y + 1, 'k')
    if grande: ret(g, x - 1, y - 1, x + 2, y + 2, 'y'); ret(g, x, y, x + 1, y + 1, 'k')
def txt(g): return [''.join(r) for r in g]

R = {}
# gosmento comum
fr = []
for q in range(2):
    g = grade(20, 20)
    elipse(g, 10, 13 + q, 9 + q, 7 - q, 'g'); elipse(g, 10, 9 + q, 6 + (q * .5), 6 - q, 'g')
    sombrear(g, 15 + q)
    for (x, y) in [(5, 7), (9, 5), (13, 7)]: olho(g, x, y + q)
    px(g, 6, 4 + q, 'l'); px(g, 7, 3 + q, 'l')
    g = contorno(g)
    if q == 0: px(g, 4, 19, 'g'); px(g, 15, 19, 'g')
    fr.append(txt(g))
R['sombra'] = {'pal': {'g': 0x4fd16b, 'G': 0x2f9a4a, 'o': 0x174d26, 'l': 0xb8ffc6, 'w': 0xffffff, 'k': 0x111111}, 'frames': fr}

# água-viva
fr = []
for q in range(2):
    g = grade(20, 14)
    elipse(g, 10, 7, 9, 6, 'g', so_cima=True)
    for i, x in enumerate([3, 7, 12, 16]):
        for y in range(7, 13):
            px(g, x + ((y + i + q) % 2), y, 'G')
    olho(g, 6, 3); olho(g, 12, 3); px(g, 5, 2, 'l')
    fr.append(txt(contorno(g)))
R['morcego'] = {'pal': {'g': 0x6bd1ff, 'G': 0x3b8fc4, 'o': 0x1c4a6b, 'l': 0xe0f6ff, 'w': 0xffffff, 'k': 0x111111}, 'frames': fr}

# cogumelo cuspidor
fr = []
for q in range(2):
    g = grade(20, 20)
    ret(g, 6, 9, 13, 19, 's')
    elipse(g, 10, 8, 10 - (1 - q), 7 + q * .5, 'g', so_cima=True); ret(g, 1 - q + 1, 7, 18 + q - 1, 8, 'g')
    for (x, y) in [(5, 4), (11, 3), (14, 6), (8, 6)]: ret(g, x, y, x + 1, y + 1, 'l')
    elipse(g, 10, 14, 2 + q * .6, 2 + q * .6, 'k')
    fr.append(txt(contorno(g)))
R['cuspidor'] = {'pal': {'g': 0x8a4fd1, 'o': 0x3a1a5e, 'l': 0xd9b8ff, 's': 0xb6ff6b, 'k': 0x1a0a10}, 'frames': fr}

# comedor (bocão)
fr = []
for q in range(2):
    g = grade(30, 29)
    elipse(g, 15, 17, 14, 12 - q * .5, 'g'); sombrear(g, 22)
    elipse(g, 15, 20, 10, 5 - q * 2, 'm')
    for x in range(7, 23, 4):
        px(g, x, 16 + q, 'w'); px(g, x + 1, 16 + q, 'w'); px(g, x, 17 + q, 'w')
    px(g, 15, 3, 'a'); px(g, 15, 4, 'a'); px(g, 14, 2, 'a'); px(g, 16, 2, 'a')
    olho(g, 14, 7, grande=True)
    px(g, 7, 9, 'l'); px(g, 8, 8, 'l')
    fr.append(txt(contorno(g)))
R['comedor'] = {'pal': {'g': 0x3fbf5f, 'G': 0x2a8a43, 'o': 0x123d1e, 'm': 0x7a1f3d, 'w': 0xffffff, 'k': 0x111111, 'y': 0xfff36b, 'l': 0xa6ffbb, 'a': 0x9dff4a}, 'frames': fr}

# agarrador (tentáculos)
fr = []
for q in range(2):
    g = grade(24, 24)
    for i, x in enumerate([3, 7, 12, 16, 20]):
        for y in range(11, 23):
            off = ((y // 3 + i + q) % 2)
            px(g, x + off, y, 't'); px(g, x + off + 1, y, 't')
    elipse(g, 12, 8, 9, 7, 'g'); sombrear(g, 11)
    olho(g, 7, 6); olho(g, 15, 6)
    ret(g, 7, 6, 8, 7, 'p'); ret(g, 15, 6, 16, 7, 'p'); px(g, 8, 7, 'k'); px(g, 16, 7, 'k')
    px(g, 6, 3, 'l'); px(g, 7, 2, 'l')
    fr.append(txt(contorno(g)))
R['agarrador'] = {'pal': {'g': 0x2fa88a, 'G': 0x1f7a63, 'o': 0x0d3a2e, 't': 0x46c9a6, 'p': 0xff6bd5, 'k': 0x111111, 'l': 0xb5ffe9, 'w': 0xffffff}, 'frames': fr}

print('// pixel art dos alienígenas (gerado por tools/inimigos.py). "." = transparente')
print('const INIMIGOS_PIXEL = {')
for k, v in R.items():
    pal = ', '.join(f"{c}: 0x{n:06x}" for c, n in v['pal'].items())
    print(f"  {k}: {{ pal: {{ {pal} }}, frames: [")
    for f in v['frames']:
        print('    [' + ', '.join(f"'{r}'" for r in f) + '],')
    print('  ] },')
print('};')
