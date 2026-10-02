#!/usr/bin/env python3
"""Proceduralne tekstury PBR (kolor + normal) dla wizualizacji HK88.
Wyjście: site/tex/*.jpg  (1024x1024, kafelkowalne)"""
import numpy as np, os
from PIL import Image, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), 'site', 'tex')
os.makedirs(OUT, exist_ok=True)
N = 1024
rng = np.random.default_rng(7)

def smooth(t): return t*t*(3-2*t)

def value_noise(n, freq, seed, ax=1.0, ay=1.0):
    """kafelkowalny value-noise; ax/ay rozciągają ziarno (anizotropia)."""
    r = np.random.default_rng(seed)
    fx = max(1, int(round(freq*ax))); fy = max(1, int(round(freq*ay)))
    g = r.random((fy, fx))
    ys = np.linspace(0, fy, n, endpoint=False); xs = np.linspace(0, fx, n, endpoint=False)
    y0 = np.floor(ys).astype(int); x0 = np.floor(xs).astype(int)
    ty = smooth(ys - y0)[:, None]; tx = smooth(xs - x0)[None, :]
    y1 = (y0+1) % fy; x1 = (x0+1) % fx
    a = g[y0][:, x0]; b = g[y0][:, x1]; c = g[y1][:, x0]; d = g[y1][:, x1]
    return (a*(1-tx)+b*tx)*(1-ty) + (c*(1-tx)+d*tx)*ty

def fbm(n, base=4, oct=6, seed=1, ax=1.0, ay=1.0, gain=0.5):
    out = np.zeros((n, n)); amp = 1; tot = 0; f = base
    for i in range(oct):
        out += amp*value_noise(n, f, seed+i*13, ax, ay); tot += amp; amp *= gain; f *= 2
    return out/tot

def norm01(a):
    a = a - a.min(); return a/(a.max()+1e-9)

def save(name, rgb, q=88):
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=q, optimize=True)

def normal_from_height(h, strength=2.0):
    """mapa normalnych z wysokości (kafelkowalna)"""
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * strength
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * strength
    nz = np.ones_like(h)
    l = np.sqrt(dx*dx+dy*dy+nz*nz)
    n = np.stack([-dx/l, dy/l, nz/l], -1)   # OpenGL/three.js: +Y do góry tekstury
    return (n*0.5+0.5)*255

def col(a, c0, c1):
    """mieszanie koloru po masce a∈[0,1]"""
    a = a[..., None]; c0 = np.array(c0, float); c1 = np.array(c1, float)
    return c0*(1-a)+c1*a

# ---------------------------------------------------------------- terrazzo
def terrazzo():
    base = fbm(N, 8, 4, 11)*10 + 38          # ciemny grafitowy podkład
    img = np.stack([base+2, base+2, base+4], -1)
    yy, xx = np.mgrid[0:N, 0:N]
    r = np.random.default_rng(3)
    cols = [(225,222,214),(160,158,152),(118,116,112),(200,190,170),(90,90,92),(240,238,232)]
    for i in range(1700):
        cx, cy = r.random(2)*N; rad = r.gamma(1.5, 2.6)+1.0
        rot = r.random()*np.pi; ex = 1+r.random()*0.9
        c = np.clip(np.array(cols[r.integers(len(cols))], float)*(0.85+0.3*r.random()), 0, 255)
        # kafelkowalnie: rysuj również przesunięte kopie
        for ox in (-N, 0, N):
            for oy in (-N, 0, N):
                dx = xx-(cx+ox); dy = yy-(cy+oy)
                if abs(cx+ox-N/2) > N/2+40 or abs(cy+oy-N/2) > N/2+40: continue
                u = dx*np.cos(rot)+dy*np.sin(rot); v = -dx*np.sin(rot)+dy*np.cos(rot)
                m = (u*u/(ex*ex)+v*v) < rad*rad
                img[m] = c
    img = np.array(Image.fromarray(np.clip(img,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), float)
    save('terrazzo.jpg', img)
    h = fbm(N, 64, 3, 12)*0.6
    save('terrazzo_n.jpg', normal_from_height(h, 0.5))

# ---------------------------------------------------------------- deski dębowe (podłoga)
def planks(name, ncols, colA, colB, gap=0.08, grain_ax=18, grain_ay=1, seed=20, stagger=True, dark_gap=0.35, rough=False):
    """ncols desek w pionie (deski biegną wzdłuż X). Tekstura = 1 kafelek."""
    yy, xx = np.mgrid[0:N, 0:N]
    row = (yy*ncols)//N
    r = np.random.default_rng(seed)
    # słoje: silnie anizotropowy szum, przesunięty na każdą deskę
    img = np.zeros((N, N, 3)); h = np.zeros((N, N))
    for i in range(ncols):
        m = row == i
        g = fbm(N, 6, 5, seed+i*7, ax=grain_ay, ay=grain_ax)
        g2 = fbm(N, 40, 2, seed+i*7+3, ax=1, ay=grain_ax*2)
        tone = 0.9+0.25*r.random()
        c = col(norm01(g), colA, colB)*tone
        c *= (0.93+0.14*norm01(g2))[..., None]
        img[m] = c[m]; h[m] = (norm01(g)*0.15 + norm01(g2)*0.1)[m]
        # końce desek (przesunięcie)
        if stagger:
            off = int(r.random()*N)
            xe = (xx - off) % N
            edge = xe < 3
            img[m & edge] *= 0.55; h[m & edge] -= 0.6
            edge2 = (xe >= 3) & (xe < 12)
            img[m & edge2] *= 0.92
    # szczeliny między deskami
    ypos = (yy*ncols/N) % 1.0
    gapm = ypos < gap/8
    img[gapm] *= dark_gap; h[gapm] -= 1.0
    save(name+'.jpg', img)
    save(name+'_n.jpg', normal_from_height(h, 1.6))

# ---------------------------------------------------------------- orzech (fornir, pionowy słój)
def walnut():
    g = fbm(N, 4, 6, 31, ax=22, ay=1)
    g2 = fbm(N, 30, 2, 34, ax=40, ay=1)
    img = col(norm01(g), (66, 46, 34), (112, 84, 62))
    img *= (0.9+0.2*norm01(g2))[..., None]
    # panele pionowe co 1/6
    xx = np.mgrid[0:N, 0:N][1]
    xp = (xx*6/N) % 1.0
    img[xp < 0.012] *= 0.6
    save('walnut.jpg', img)
    h = norm01(g2)*0.08; h[xp < 0.012] -= 0.5
    save('walnut_n.jpg', normal_from_height(h, 1.2))
    # ryflowana wersja (lamele 3.5cm w kafelku 1m → ~28 na kafelek)
    xf = (xx*28/N) % 1.0
    ridge = np.sin(xf*np.pi)          # półwałek
    h2 = ridge*0.6 + norm01(g2)*0.05
    save('walnut_fluted_n.jpg', normal_from_height(h2, 2.2))
    img2 = img*(0.75+0.35*ridge)[..., None]
    save('walnut_fluted.jpg', img2)

# ---------------------------------------------------------------- marmur (białe tło, ciemne żyły)
def marble():
    # domain-warped fbm -> nieliczne, ukośne, organiczne żyły o zmiennej grubości
    n1 = fbm(N, 2, 6, 41, ax=2.2, ay=1)
    warp = fbm(N, 5, 5, 45)
    field = n1*1.3 + warp*0.55
    band = np.abs(np.sin(field*np.pi*1.0))
    wmod = norm01(fbm(N, 3, 3, 46))                    # zmienna grubość wzdłuż żyły
    main = np.clip(1 - band*(3.0+9*wmod), 0, 1)**1.3
    halo = np.clip(1 - band*(1.4+1.5*wmod), 0, 1)**3
    n2 = fbm(N, 3, 6, 43, ax=2.2, ay=1)
    field2 = n2*2.4 + warp*0.4
    fine = np.clip(1 - np.abs(np.sin(field2*np.pi*1.6))*(9+10*norm01(fbm(N, 4, 3, 47))), 0, 1)**1.5
    fine *= norm01(fbm(N, 4, 3, 48)) > 0.42
    bg = 238 - 8*norm01(fbm(N, 5, 4, 49))
    img = np.stack([bg+3, bg+2, bg+1], -1)
    def mix(img, a, c):
        a = np.clip(a, 0, 1)[..., None]; return img*(1-a) + np.array(c, float)*a
    img = mix(img, halo*0.3, (170,168,172))
    img = mix(img, fine*0.75, (78,76,82))
    img = mix(img, main, (32,30,36))
    save('marble.jpg', img, 92)

# ---------------------------------------------------------------- łupek (ciemny kamień)
def slate():
    g = fbm(N, 5, 7, 51, ax=3, ay=1)
    g2 = fbm(N, 40, 3, 55)
    img = col(norm01(g), (44, 42, 40), (78, 72, 66))
    img *= (0.85+0.3*norm01(g2))[..., None]
    # płyty 60x60 w kafelku 1.2m → 2x2
    yy, xx = np.mgrid[0:N, 0:N]
    xp = (xx*2/N) % 1.0; yp = (yy*2/N) % 1.0
    gm = (xp < 0.006) | (yp < 0.006)
    img[gm] *= 0.5
    save('slate.jpg', img)
    h = norm01(g)*0.5 + norm01(g2)*0.3; h[gm] -= 1
    save('slate_n.jpg', normal_from_height(h, 1.4))

# ---------------------------------------------------------------- tynk (subtelny)
def plaster():
    g = fbm(N, 16, 4, 61)
    img = np.ones((N, N, 3))*np.array((232, 228, 220)) * (0.97+0.05*norm01(g))[..., None]
    save('plaster.jpg', img, 80)
    save('plaster_n.jpg', normal_from_height(norm01(fbm(N, 90, 3, 63))*0.25, 0.8), 80)

# ---------------------------------------------------------------- kostka / płyty betonowe (podjazd)
def pavers():
    g = fbm(N, 6, 5, 71)
    g2 = fbm(N, 60, 3, 72)
    img = col(norm01(g), (150, 148, 144), (178, 175, 170))*(0.9+0.2*norm01(g2))[..., None]
    yy, xx = np.mgrid[0:N, 0:N]
    # płyty 40x80 (kafelek 1.6m: 4 kolumny x 2 rzędy, przesunięte)
    ry = (yy*2/N)
    xoff = np.where(np.floor(ry) % 2 == 0, 0, 0.5)
    xp = ((xx*4/N)+xoff) % 1.0; yp = ry % 1.0
    gm = (xp < 0.02) | (yp < 0.04)
    img[gm] = np.array((110, 108, 104))
    save('pavers.jpg', img)
    h = norm01(g2)*0.2; h[gm] -= 1.0
    save('pavers_n.jpg', normal_from_height(h, 1.2))

# ---------------------------------------------------------------- trawa
def grass():
    g = fbm(N, 8, 6, 81); g2 = fbm(N, 120, 2, 82)
    img = col(norm01(g), (58, 92, 34), (104, 138, 52))*(0.8+0.4*norm01(g2))[..., None]
    save('grass.jpg', img)

# ---------------------------------------------------------------- dywan (kremowy, falisty wzór)
def rug():
    yy, xx = np.mgrid[0:N, 0:N]
    w = fbm(N, 3, 4, 91)
    stripes = np.sin((yy/N*22 + w*4)*2*np.pi)
    fuzz = norm01(fbm(N, 200, 2, 93))
    img = col(norm01(stripes)*0.6+fuzz*0.4, (196, 190, 178), (228, 224, 214))
    save('rug.jpg', img)

# ---------------------------------------------------------------- spiek kwarcowy (szare płyty elewacyjne)
def sinter():
    g = fbm(N, 4, 6, 101); g2 = fbm(N, 50, 3, 103)
    img = col(norm01(g), (118, 116, 112), (150, 148, 142))*(0.92+0.16*norm01(g2))[..., None]
    yy, xx = np.mgrid[0:N, 0:N]
    xp = (xx*2/N) % 1.0; yp = (yy*1/N) % 1.0     # płyty 120x240 w kafelku 2.4m
    gm = (xp < 0.005) | (yp < 0.0025)
    img[gm] *= 0.55
    save('sinter.jpg', img)
    h = norm01(g2)*0.1; h[gm] -= 1
    save('sinter_n.jpg', normal_from_height(h, 1.2))

# ---------------------------------------------------------------- deska elewacyjna / sufit tarasu (jasne drewno, pionowe)
def lightwood(name, colA, colB, n=14, seed=111):
    g = fbm(N, 4, 6, seed, ax=18, ay=1)
    g2 = fbm(N, 30, 2, seed+2, ax=30, ay=1)
    img = col(norm01(g), colA, colB)*(0.9+0.2*norm01(g2))[..., None]
    xx = np.mgrid[0:N, 0:N][1]
    xp = (xx*n/N) % 1.0
    r = np.random.default_rng(seed)
    for i in range(n):
        m = (xx*n//N) == i
        img[m] *= 0.92+0.16*r.random()
    gm = xp < 0.05
    img[gm] *= 0.62
    save(name+'.jpg', img)
    h = norm01(g2)*0.1; h[gm] -= 0.8
    save(name+'_n.jpg', normal_from_height(h, 1.5))

# ---------------------------------------------------------------- tkanina (sofa) - drobny splot
def fabric():
    g = fbm(N, 220, 2, 121); g2 = fbm(N, 6, 4, 123)
    img = np.ones((N, N, 3))*np.array((214, 205, 190))*(0.9+0.15*norm01(g)+0.05*norm01(g2))[..., None]
    save('fabric.jpg', img, 80)
    save('fabric_n.jpg', normal_from_height(norm01(g)*0.5, 0.8), 80)

# ---------------------------------------------------------------- beton (garaż)
def concrete():
    g = fbm(N, 5, 6, 131); g2 = fbm(N, 80, 3, 133)
    img = col(norm01(g), (150, 150, 148), (176, 174, 170))*(0.92+0.16*norm01(g2))[..., None]
    save('concrete.jpg', img)

# ---------------------------------------------------------------- zielona ściana (mech/paprocie)
def moss():
    g = fbm(N, 12, 6, 141); g2 = fbm(N, 90, 3, 143)
    img = col(norm01(g), (34, 62, 26), (96, 134, 46))*(0.7+0.6*norm01(g2))[..., None]
    save('moss.jpg', img)
    save('moss_n.jpg', normal_from_height(norm01(g2)*0.8+norm01(g)*0.4, 2.0))

# ---------------------------------------------------------------- liście drzew (alpha)
def leaves():
    yy, xx = np.mgrid[0:512, 0:512]
    r = np.random.default_rng(151)
    a = np.zeros((512, 512)); c = np.zeros((512, 512, 3))
    for i in range(260):
        cx, cy = r.random(2)*512; rad = 14+r.random()*22
        rot = r.random()*np.pi
        dx = xx-cx; dy = yy-cy
        u = dx*np.cos(rot)+dy*np.sin(rot); v = -dx*np.sin(rot)+dy*np.cos(rot)
        m = (u*u/(1.9*1.9)+v*v) < rad*rad
        d = np.sqrt(((xx-256)**2+(yy-256)**2))/256
        if d[int(cy), int(cx)] > 0.95: continue
        col_ = np.array((60+r.random()*50, 105+r.random()*60, 40+r.random()*30))
        c[m] = col_; a[m] = 1
    rgba = np.concatenate([c, a[..., None]*255], -1)
    Image.fromarray(rgba.astype(np.uint8)).save(os.path.join(OUT, 'leaves.png'), optimize=True)

if __name__ == '__main__':
    terrazzo(); print('terrazzo')
    planks('oak', 6, (196, 168, 122), (222, 200, 158), seed=20); print('oak')
    planks('deck', 8, (128, 112, 92), (160, 142, 118), seed=25, dark_gap=0.3); print('deck')
    walnut(); print('walnut')
    marble(); print('marble')
    slate(); print('slate')
    plaster(); print('plaster')
    pavers(); print('pavers')
    grass(); print('grass')
    rug(); print('rug')
    sinter(); print('sinter')
    lightwood('cladding', (186, 150, 100), (214, 180, 128), n=16, seed=111); print('cladding')
    lightwood('soffit', (212, 196, 168), (236, 222, 196), n=12, seed=117); print('soffit')
    lightwood('sauna', (222, 196, 150), (240, 218, 172), n=8, seed=119); print('sauna')
    fabric(); print('fabric')
    concrete(); print('concrete')
    moss(); print('moss')
    leaves(); print('leaves')

# ---------------------------------------------------------------- płytki wielkoformatowe jasnoszare (60x120, kafelek 2.4m)
def tiles_light():
    g = fbm(N, 5, 6, 161); g2 = fbm(N, 70, 3, 163)
    img = col(norm01(g), (196, 194, 190), (222, 220, 216))*(0.95+0.1*norm01(g2))[..., None]
    yy, xx = np.mgrid[0:N, 0:N]
    ry = yy*4/N; xoff = np.where(np.floor(ry) % 2 == 0, 0, 0.5)
    xp = ((xx*2/N)+xoff) % 1.0; yp = ry % 1.0
    gm = (xp < 0.006) | (yp < 0.012)
    img[gm] = np.array((150, 148, 145))
    save('tiles_light.jpg', img)
    h = norm01(g2)*0.05; h[gm] -= 0.6
    save('tiles_light_n.jpg', normal_from_height(h, 1.0))

# ---------------------------------------------------------------- dachówka antracytowa (kafelek 1.2m: 4 rzędy x 4 szt.)
def rooftile():
    yy, xx = np.mgrid[0:N, 0:N]
    rows = 4; cols = 4
    ry = yy*rows/N; xoff = np.where(np.floor(ry) % 2 == 0, 0, 0.5)
    xp = ((xx*cols/N)+xoff) % 1.0; yp = ry % 1.0
    # profil: zaokrąglona fala w poprzek + schodek u dołu rzędu
    h = 0.5*np.sin(xp*np.pi)**2 * (1-0.35*yp) + (yp < 0.08)*(-0.9)
    g = fbm(N, 30, 3, 171)
    img = np.ones((N, N, 3))*np.array((58, 60, 64))*(0.75+0.5*norm01(g)*0.5 + 0.35*np.sin(xp*np.pi)**2)[..., None]
    img[yp < 0.08] *= 0.55
    save('rooftile.jpg', img)
    save('rooftile_n.jpg', normal_from_height(h+norm01(g)*0.05, 1.6))

if __name__ == '__main__':
    tiles_light(); rooftile(); print('tiles, rooftile')


# ---------------------------------------------------------------- marmur Patagonia (kremowy, brązowo-fioletowe żyły)
def patagonia():
    # ciepły kwarcyt (Patagonia): wyraziste brązowo-szare żyły z beżową poświatą na kremowym tle
    n1 = fbm(N, 2, 6, 201, ax=2.2, ay=1)
    warp = fbm(N, 5, 5, 203)
    field = n1*1.3 + warp*0.55
    band = np.abs(np.sin(field*np.pi*1.0))
    wmod = norm01(fbm(N, 3, 3, 205))
    main = np.clip(1 - band*(3.0 + 9*wmod), 0, 1)**1.3
    halo = np.clip(1 - band*(1.1 + 1.2*wmod), 0, 1)**2.4
    n2 = fbm(N, 3, 6, 207, ax=2.2, ay=1)
    fine = np.clip(1 - np.abs(np.sin((n2*2.4 + warp*0.4)*np.pi*1.6))*(9+10*norm01(fbm(N, 4, 3, 209))), 0, 1)**1.5
    fine *= norm01(fbm(N, 4, 3, 210)) > 0.4
    bg = 238 - 8*norm01(fbm(N, 5, 4, 211))
    img = np.stack([bg+5, bg+1, bg-5], -1)
    def mix(im, a, c):
        a = np.clip(a, 0, 1)[..., None]; return im*(1-a) + np.array(c, float)*a
    img = mix(img, halo*0.38, (204, 186, 164))
    img = mix(img, fine*0.72, (128, 100, 84))
    img = mix(img, main*0.95, (78, 62, 58))
    save('patagonia.jpg', img, 92)

# ---------------------------------------------------------------- wenge / dąb barwiony (panele pionowe + ryflowane)
def wenge():
    g = fbm(N, 4, 6, 221, ax=26, ay=1); g2 = fbm(N, 28, 2, 223, ax=44, ay=1)
    img = col(norm01(g), (38, 28, 24), (82, 62, 48))
    img *= (0.88+0.24*norm01(g2))[..., None]
    xx = np.mgrid[0:N, 0:N][1]
    xp = (xx*5/N) % 1.0
    img[xp < 0.01] *= 0.55
    save('wenge.jpg', img)
    h = norm01(g2)*0.1; h[xp < 0.01] -= 0.5
    save('wenge_n.jpg', normal_from_height(h, 1.2))
    xf = (xx*22/N) % 1.0; ridge = np.sin(xf*np.pi)
    save('wenge_fluted.jpg', img*(0.7+0.45*ridge)[..., None])
    save('wenge_fluted_n.jpg', normal_from_height(ridge*0.6 + norm01(g2)*0.05, 2.2))

# ---------------------------------------------------------------- kremowy kamień wielkoformatowy (podłoga 120x120)
def limestone():
    g = fbm(N, 4, 6, 231); g2 = fbm(N, 60, 3, 233); g3 = fbm(N, 14, 4, 235)
    img = col(norm01(g), (214, 203, 186), (236, 228, 214))*(0.96+0.09*norm01(g2))[..., None]
    img = img*(0.97+0.06*norm01(g3))[..., None]
    yy, xx = np.mgrid[0:N, 0:N]
    xp = (xx*2/N) % 1.0; yp = (yy*2/N) % 1.0          # kafelek 2.4 m → płyty 120x120
    gm = (xp < 0.004) | (yp < 0.004)
    img[gm] = np.array((196, 186, 172))
    save('limestone.jpg', img)
    h = norm01(g2)*0.05; h[gm] -= 0.5
    save('limestone_n.jpg', normal_from_height(h, 0.9))

# ---------------------------------------------------------------- cedr elewacyjny (ciepły, pionowe deski)
def cedar():
    g = fbm(N, 4, 6, 241, ax=20, ay=1); g2 = fbm(N, 30, 2, 243, ax=36, ay=1)
    img = col(norm01(g), (104, 62, 36), (156, 100, 58))*(0.9+0.2*norm01(g2))[..., None]
    xx = np.mgrid[0:N, 0:N][1]
    n = 12; xp = (xx*n/N) % 1.0
    r = np.random.default_rng(244)
    for i in range(n):
        m = (xx*n//N) == i
        img[m] *= 0.9+0.2*r.random()
    gm = xp < 0.05
    img[gm] *= 0.55
    save('cedar.jpg', img)
    h = norm01(g2)*0.1; h[gm] -= 0.8
    save('cedar_n.jpg', normal_from_height(h, 1.6))

# ---------------------------------------------------------------- ciemny tynk elewacyjny (antracyt)
def plaster_dark():
    g = fbm(N, 16, 4, 251); g2 = fbm(N, 80, 3, 253)
    img = np.ones((N, N, 3))*np.array((62, 60, 58)) * (0.9+0.2*norm01(g))[..., None] * (0.95+0.1*norm01(g2))[..., None]
    save('plaster_dark.jpg', img, 85)

if __name__ == '__main__':
    patagonia(); wenge(); limestone(); cedar(); plaster_dark(); print('hk168 tex')
