// Silnik wizualizacji wnętrz — niezależny od projektu (dane domu: ./<id>.js)
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const $ = (s) => document.querySelector(s);
const DEG = Math.PI / 180;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

// ======================================================================= renderer / scena
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const MAX_ANISO = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xbfd0e0, 0.0028);
const camera = new THREE.PerspectiveCamera(72, 1, 0.05, 900);
const house = new THREE.Group();     // cały projekt (obracany wg orientacji wejścia)
scene.add(house);

// ======================================================================= tekstury i materiały
const texLoader = new THREE.TextureLoader();
const texCache = new Map();
function tex(name, { srgb = true, tile = 1, rot = 0 } = {}) {
  const key = `${name}|${tile}|${rot}`;
  if (texCache.has(key)) return texCache.get(key);
  const t = texLoader.load(`tex/${name}`);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / tile, 1 / tile);
  t.rotation = rot; t.center.set(0.5, 0.5);
  t.anisotropy = MAX_ANISO;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, t);
  return t;
}
const M = {};   // rejestr materiałów
function std(p) { return new THREE.MeshStandardMaterial(p); }
function defineMaterials() {
  const pl = (color, rough = 0.9, tile = 2.0) => std({ color, roughness: rough, map: tex('plaster.jpg', { tile }), normalMap: tex('plaster_n.jpg', { srgb: false, tile }), normalScale: new THREE.Vector2(0.35, 0.35) });
  M.plaster = pl(0xe9e5dd);
  M.ext_white = pl(0xf3f1ec, 0.8, 2.5);
  M.graphite = std({ color: 0x3a3937, roughness: 0.9, normalMap: tex('plaster_n.jpg', { srgb: false, tile: 2 }), normalScale: new THREE.Vector2(0.4, 0.4) });
  M.garage_wall = std({ color: 0xb9b7b1, roughness: 0.95 });
  M.ceiling = std({ color: 0xf3f1ed, roughness: 0.96 });
  M.ceiling_dark = std({ color: 0x232325, roughness: 0.9 });
  M.ceiling_garage = std({ color: 0xc9c9c5, roughness: 0.95 });
  M.terrazzo = std({ map: tex('terrazzo.jpg', { tile: 1.2 }), normalMap: tex('terrazzo_n.jpg', { srgb: false, tile: 1.2 }), normalScale: new THREE.Vector2(0.3, 0.3), roughness: 0.32, envMapIntensity: 0.7 });
  M.oak = std({ map: tex('oak.jpg', { tile: 1.4 }), normalMap: tex('oak_n.jpg', { srgb: false, tile: 1.4 }), normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.55, envMapIntensity: 0.5 });
  M.walnut = std({ map: tex('walnut.jpg', { tile: 1.0 }), normalMap: tex('walnut_n.jpg', { srgb: false, tile: 1.0 }), normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.45, envMapIntensity: 0.6 });
  M.walnut_fluted = std({ map: tex('walnut_fluted.jpg', { tile: 1.0 }), normalMap: tex('walnut_fluted_n.jpg', { srgb: false, tile: 1.0 }), normalScale: new THREE.Vector2(1.0, 1.0), roughness: 0.5, envMapIntensity: 0.5 });
  M.marble = std({ map: tex('marble.jpg', { tile: 2.4 }), roughness: 0.14, envMapIntensity: 0.9 });
  M.slate = std({ map: tex('slate.jpg', { tile: 1.2 }), normalMap: tex('slate_n.jpg', { srgb: false, tile: 1.2 }), normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.6, envMapIntensity: 0.5 });
  M.soffit = std({ map: tex('soffit.jpg', { tile: 1.2 }), normalMap: tex('soffit_n.jpg', { srgb: false, tile: 1.2 }), normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.7 });
  M.deck = std({ map: tex('deck.jpg', { tile: 1.6 }), normalMap: tex('deck_n.jpg', { srgb: false, tile: 1.6 }), normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.75 });
  M.pavers = std({ map: tex('pavers.jpg', { tile: 1.6 }), normalMap: tex('pavers_n.jpg', { srgb: false, tile: 1.6 }), normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.85 });
  M.sinter = std({ map: tex('sinter.jpg', { tile: 2.4 }), normalMap: tex('sinter_n.jpg', { srgb: false, tile: 2.4 }), normalScale: new THREE.Vector2(0.5, 0.5), roughness: 0.5, envMapIntensity: 0.6 });
  M.cladding = std({ map: tex('cladding.jpg', { tile: 1.2 }), normalMap: tex('cladding_n.jpg', { srgb: false, tile: 1.2 }), normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.7 });
  M.sauna = std({ map: tex('sauna.jpg', { tile: 1.0 }), normalMap: tex('sauna_n.jpg', { srgb: false, tile: 1.0 }), normalScale: new THREE.Vector2(0.4, 0.4), roughness: 0.65 });
  M.grass = std({ map: tex('grass.jpg', { tile: 3.0 }), roughness: 1.0 });
  M.rug = std({ map: tex('rug.jpg', { tile: 3.0 }), roughness: 1.0 });
  M.moss = std({ map: tex('moss.jpg', { tile: 1.0 }), normalMap: tex('moss_n.jpg', { srgb: false, tile: 1.0 }), normalScale: new THREE.Vector2(1, 1), roughness: 1.0 });
  M.concrete = std({ map: tex('concrete.jpg', { tile: 2.0 }), roughness: 0.9 });
  M.tiles_light = std({ map: tex('tiles_light.jpg', { tile: 2.4 }), normalMap: tex('tiles_light_n.jpg', { srgb: false, tile: 2.4 }), normalScale: new THREE.Vector2(0.4, 0.4), roughness: 0.3, envMapIntensity: 0.6 });
  M.limestone = std({ map: tex('limestone.jpg', { tile: 2.4 }), normalMap: tex('limestone_n.jpg', { srgb: false, tile: 2.4 }), normalScale: new THREE.Vector2(0.3, 0.3), roughness: 0.42, envMapIntensity: 0.5 });
  M.patagonia = std({ map: tex('patagonia.jpg', { tile: 2.0 }), roughness: 0.16, envMapIntensity: 0.9 });
  M.patagonia_s = std({ map: tex('patagonia.jpg', { tile: 1.9 }), roughness: 0.14, envMapIntensity: 1.0 });
  M.wenge = std({ map: tex('wenge.jpg', { tile: 1.1 }), normalMap: tex('wenge_n.jpg', { srgb: false, tile: 1.1 }), normalScale: new THREE.Vector2(0.45, 0.45), roughness: 0.42, envMapIntensity: 0.5 });
  M.wenge_fluted = std({ map: tex('wenge_fluted.jpg', { tile: 1.1 }), normalMap: tex('wenge_fluted_n.jpg', { srgb: false, tile: 1.1 }), normalScale: new THREE.Vector2(1.0, 1.0), roughness: 0.48, envMapIntensity: 0.45 });
  M.cedar = std({ map: tex('cedar.jpg', { tile: 1.2 }), normalMap: tex('cedar_n.jpg', { srgb: false, tile: 1.2 }), normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.62 });
  M.plaster_dark = std({ map: tex('plaster_dark.jpg', { tile: 2.5 }), normalMap: tex('plaster_n.jpg', { srgb: false, tile: 2 }), normalScale: new THREE.Vector2(0.35, 0.35), roughness: 0.85 });
  M.plaster_warm = std({ color: 0xece4d6, roughness: 0.92, map: tex('plaster.jpg', { tile: 2 }), normalMap: tex('plaster_n.jpg', { srgb: false, tile: 2 }), normalScale: new THREE.Vector2(0.3, 0.3) });
  M.ceiling_warm = std({ color: 0xf6f1e7, roughness: 0.96 });
  M.stone_beige = std({ color: 0xd9cdb8, roughness: 0.35, envMapIntensity: 0.6 });
  M.brass = std({ color: 0xb08a52, roughness: 0.28, metalness: 0.95, envMapIntensity: 1.2 });
  M.fabric_cream = std({ map: tex('fabric.jpg', { tile: 0.45 }), normalMap: tex('fabric_n.jpg', { srgb: false, tile: 0.45 }), normalScale: new THREE.Vector2(0.6, 0.6), roughness: 1.0, color: 0xeee6d6 });
  M.fabric_sand = std({ map: tex('fabric.jpg', { tile: 0.45 }), roughness: 1.0, color: 0xcdbda4 });
  M.rooftile = std({ map: tex('rooftile.jpg', { tile: 1.2 }), normalMap: tex('rooftile_n.jpg', { srgb: false, tile: 1.2 }), normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.75 });
  M.marble_wall = std({ map: tex('marble.jpg', { tile: 1.6 }), roughness: 0.2, envMapIntensity: 0.7 });
  M.white_gloss = std({ color: 0xf2f1ee, roughness: 0.25, envMapIntensity: 0.8 });
  M.stone_top = std({ color: 0x2a2b2d, roughness: 0.35, envMapIntensity: 0.6 });
  M.fabric = std({ map: tex('fabric.jpg', { tile: 0.5 }), normalMap: tex('fabric_n.jpg', { srgb: false, tile: 0.5 }), normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, color: 0xf2ece2 });
  M.fabric_grey = std({ map: tex('fabric.jpg', { tile: 0.5 }), normalMap: tex('fabric_n.jpg', { srgb: false, tile: 0.5 }), normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0, color: 0x8a8890 });
  M.fabric_brown = std({ map: tex('fabric.jpg', { tile: 0.5 }), roughness: 1.0, color: 0x6a5548 });
  M.fabric_light = std({ map: tex('fabric.jpg', { tile: 0.5 }), roughness: 1.0, color: 0xd9d3c6 });
  M.bedding = std({ map: tex('fabric.jpg', { tile: 0.6 }), roughness: 1.0, color: 0xd8d4cc });
  M.leather = std({ color: 0x7a4a2e, roughness: 0.38, envMapIntensity: 0.6 });
  M.wardrobe_dark = std({ color: 0x2d2c2b, roughness: 0.55, envMapIntensity: 0.5 });
  M.wardrobe_glass = std({ color: 0x141416, roughness: 0.08, metalness: 0.35, envMapIntensity: 1.0 });
  M.bookcase = std({ color: 0x222222, roughness: 0.6 });
  M.frame = std({ color: 0x24262a, roughness: 0.45, metalness: 0.4 });
  M.steel = std({ color: 0xb4b8bc, roughness: 0.25, metalness: 1.0 });
  M.black_metal = std({ color: 0x1a1b1d, roughness: 0.5, metalness: 0.6 });
  M.white_matte = std({ color: 0xf4f2ee, roughness: 0.85 });
  M.door_white = std({ color: 0xefede8, roughness: 0.6 });
  M.door_entry = std({ color: 0x26282a, roughness: 0.5, metalness: 0.2 });
  M.ceramic = std({ color: 0xf8f7f3, roughness: 0.18, envMapIntensity: 0.8 });
  M.stone_dark = std({ color: 0x1e1e20, roughness: 0.3, envMapIntensity: 0.6 });
  M.appliance = std({ color: 0xe4e4e2, roughness: 0.4, metalness: 0.1 });
  M.appliance_black = std({ color: 0x141414, roughness: 0.12, metalness: 0.3, envMapIntensity: 1.0 });
  M.tv = std({ color: 0x08080a, roughness: 0.08, metalness: 0.4, envMapIntensity: 1.2 });
  M.roof_top = std({ color: 0x4c4c4e, roughness: 0.95 });
  M.water = new THREE.MeshPhysicalMaterial({ color: 0x2c8aa3, roughness: 0.03, metalness: 0.0, transparent: true, opacity: 0.72, envMapIntensity: 1.4 });
  M.pool_floor = std({ color: 0x8dcbe0, roughness: 0.5 });
  M.glass = new THREE.MeshPhysicalMaterial({ color: 0xd8e4e8, roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.16, envMapIntensity: 1.0, side: THREE.DoubleSide, depthWrite: false });
  M.glass_panel = M.glass;
  M.glass_dark = new THREE.MeshPhysicalMaterial({ color: 0x40464c, roughness: 0.05, transparent: true, opacity: 0.55, envMapIntensity: 1.0, side: THREE.DoubleSide, depthWrite: false });
  M.mirror = std({ color: 0xdfe6ea, roughness: 0.02, metalness: 1.0, envMapIntensity: 1.5 });
  M.bark = std({ color: 0x5a4a3c, roughness: 1 });
  M.leaf = std({ color: 0x4b7a2e, roughness: 0.9 });
  M.leaf2 = std({ color: 0x5e8a35, roughness: 0.9 });
  M.plant = std({ color: 0x3d6b2c, roughness: 0.8, side: THREE.DoubleSide });
  M.pot = std({ color: 0x2b2b2d, roughness: 0.7 });
  M.curtain_light = std({ color: 0xe8e2d6, roughness: 1.0, side: THREE.DoubleSide, transparent: true, opacity: 0.86 });
  M.curtain_dark = std({ color: 0x2c2a29, roughness: 1.0, side: THREE.DoubleSide });
  M.canvas = std({ color: 0xd8d2c8, roughness: 1.0, map: tex('plaster.jpg', { tile: 0.8 }), normalMap: tex('slate_n.jpg', { srgb: false, tile: 0.7 }), normalScale: new THREE.Vector2(0.5, 0.5) });
  M.car = std({ color: 0x2a2d31, roughness: 0.25, metalness: 0.7, envMapIntensity: 1.0 });
  M.car_glass = std({ color: 0x1c2126, roughness: 0.1, metalness: 0.5 });
  M.tyre = std({ color: 0x121212, roughness: 0.9 });
  M.outdoor_frame = std({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.5 });
  M.outdoor_seat = std({ color: 0xc9c2b4, roughness: 0.9 });
  M.fire = new THREE.MeshBasicMaterial({ color: 0xff6a1a });
  for (const m of Object.values(M)) if (m.isMeshStandardMaterial && m.envMapIntensity === 1 && !m.transparent && m.metalness < 0.9) m.envMapIntensity = 0.22;
  M.ember = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, emissive: 0xff4400, emissiveIntensity: 0.6, roughness: 1 });
}
function emissive(color, intensity = 1) { return new THREE.MeshStandardMaterial({ color: 0x111111, emissive: color, emissiveIntensity: intensity, roughness: 0.6 }); }
const EM = {};
EM.warm = emissive(0xffd9a0, 4); EM.warmSoft = emissive(0xffe4b8, 2.2); EM.white = emissive(0xffffff, 3.5); EM.led = emissive(0xffc27a, 5);
const lampFactor = { v: 1 };           // globalny mnożnik światła sztucznego (0..1)
const emissives = [];                  // [material, baseIntensity]
function E(name) { const m = EM[name].clone(); emissives.push([m, m.emissiveIntensity]); return m; }

// ======================================================================= geometria
function boxGeo(w, h, d, off = [0, 0, 0]) {
  // BoxGeometry z UV w metrach (ciągłość tekstur między segmentami dzięki off)
  const g = new THREE.BoxGeometry(w, h, d);
  const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + off[0], y = p.getY(i) + off[1], z = p.getZ(i) + off[2];
    const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i));
    if (nx > 0.5) uv.setXY(i, z, y); else if (ny > 0.5) uv.setXY(i, x, z); else uv.setXY(i, x, y);
  }
  return g;
}
function planeGeo(w, d) { const g = new THREE.PlaneGeometry(w, d); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w, uv.getY(i) * d); return g; }
function mesh(geo, mat, { cast = true, receive = true } = {}) { const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = receive; return m; }
function box(w, h, d, mat, x = 0, y = 0, z = 0, o) { const m = mesh(boxGeo(w, h, d, [x, y, z]), mat, o); m.position.set(x, y, z); return m; }
function rbox(w, h, d, mat, x = 0, y = 0, z = 0, r = 0.04) { const m = mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat); m.position.set(x, y, z); return m; }
function cyl(rt, rb, h, mat, x = 0, y = 0, z = 0, seg = 32) { const m = mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y, z); return m; }
// współrzędne rzutu (X,Y) -> lokalne domu (x, z)
const P = (x, y) => new THREE.Vector3(x, 0, -y);
const rc = (r) => ({ x: (r[0] + r[2]) / 2, y: (r[1] + r[3]) / 2, w: r[2] - r[0], d: r[3] - r[1] });

// ======================================================================= kolizje (w układzie rzutu)
const colSegs = [];    // {ax,ay,bx,by,r}  odcinki ścian z „promieniem” (półgrubość)
const colRects = [];   // [x0,y0,x1,y1]
const passages = [];   // przejścia (drzwi/otwory) – kontrola czy meble ich nie blokują
function addSeg(ax, ay, bx, by, r) { colSegs.push({ ax, ay, bx, by, r }); }

// ======================================================================= budowa domu
let HOUSE, H;
const roofGroup = new THREE.Group(), ceilGroup = new THREE.Group();
const lights = [];      // sztuczne światła {light, base}
const shadowCasters = [];

function buildFloors() {
  for (const f of HOUSE.floors) {
    const r = rc(f.rect);
    const g = planeGeo(r.w, r.d);
    if (f.rot) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) { const u = uv.getX(i), v = uv.getY(i); uv.setXY(i, v, u); } }
    const m = mesh(g, M[f.mat], { cast: false });
    m.rotation.x = -Math.PI / 2; m.position.set(r.x, f.z ?? 0, -r.y);
    house.add(m);
  }
}
function buildCeilings() {
  for (const c of HOUSE.ceilings) {
    const r = rc(c.rect);
    const m = mesh(planeGeo(r.w, r.d), M[c.mat], { cast: false });
    m.rotation.x = Math.PI / 2; m.position.set(r.x, (c.z ?? H) - 0.012, -r.y);
    ceilGroup.add(m);
  }
  house.add(ceilGroup);
}

function faceMats(mat, matR, matL) { const a = M[mat || 'plaster']; return [a, a, a, a, M[matR || mat || 'plaster'], M[matL || mat || 'plaster']]; }

function buildWall(w) {
  const [ax, ay] = w.a, [bx, by] = w.b; const dx = bx - ax, dy = by - ay;
  const L = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
  const t = w.t, h = w.h ?? H, base = w.ext ? -0.5 : 0;
  const g = new THREE.Group(); g.position.set(ax, 0, -ay); g.rotation.y = ang;
  const mats = faceMats(w.mat, w.matR, w.matL);
  const ux = dx / L, uy = dy / L;                     // wersor wzdłuż ściany (rzut)
  const seg = (x0, x1, solid = true) => { if (solid) addSeg(ax + ux * x0, ay + uy * x0, ax + ux * x1, ay + uy * x1, t / 2); };
  const solid = (x0, x1, y0, y1) => { const m = mesh(boxGeo(x1 - x0, y1 - y0, t, [(x0 + x1) / 2, (y0 + y1) / 2, 0]), mats); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); g.add(m);
    if (y0 <= 0.001 && x1 - x0 > 0.12 && !w.noSkirting) { const sk = w.skirting || 'door_white'; const sides = w.ext ? [1] : [1, -1];
      for (const s of sides) { const sm = mesh(new THREE.BoxGeometry(x1 - x0, 0.08, 0.012), M[sk], { cast: false }); sm.position.set((x0 + x1) / 2, 0.04, s * (t / 2 + 0.006)); g.add(sm); } } };
  const ops = [...(w.openings || [])].sort((p, q) => p.at - q.at);
  for (const op of ops) if (op.kind === 'door') { if ((op.open || 0) < 70) op.open = 80; if (op.leaf !== 'entry' && op.leaf !== 'glass') { op.h = Math.max(op.h, HOUSE.doorH || 2.2); if (op.w < 0.9) op.w = 0.9; } }
  let cur = 0;
  for (const op of ops) {
    if (op.at > cur + 0.001) { solid(cur, op.at, base, h); seg(cur, op.at); }
    const sill = op.sill || 0, top = sill + op.h;
    if (top < h - 0.001) solid(op.at, op.at + op.w, top, h);
    if (sill > 0.001) solid(op.at, op.at + op.w, base, sill);
    buildOpening(g, op, t, w, h);
    const passable = op.kind === 'opening' || op.kind === 'glassdoor' || op.kind === 'slider' || (op.kind === 'door' && (op.open || 0) > 30);
    if (passable) passages.push({ x: ax + ux * (op.at + op.w / 2), y: ay + uy * (op.at + op.w / 2), ux, uy, w: op.w, wall: w });
    seg(op.at, op.at + op.w, !passable);
    cur = op.at + op.w;
  }
  if (cur < L - 0.001) { solid(cur, L, base, h); seg(cur, L); }
  house.add(g);
}

function buildOpening(g, op, t, w, h) {
  const x0 = op.at, x1 = op.at + op.w, sill = op.sill || 0, top = sill + op.h, cx = (x0 + x1) / 2, cy = (sill + top) / 2;
  const fr = M.frame, prof = op.frame === 'thin' ? 0.03 : 0.06, depth = op.frame === 'thin' ? 0.05 : Math.max(0.08, t * 0.5);
  const frame = (kind) => {
    if (op.frame === 'none') return;
    g.add(box(prof, op.h, depth, fr, x0 + prof / 2, cy, 0));
    g.add(box(prof, op.h, depth, fr, x1 - prof / 2, cy, 0));
    g.add(box(op.w, prof, depth, fr, cx, top - prof / 2, 0));
    g.add(box(op.w, kind === 'glass' && sill > 0 ? prof : 0.02, depth, fr, cx, sill + (kind === 'glass' && sill > 0 ? prof / 2 : 0.01), 0));
    for (const mx of op.mullions || []) g.add(box(0.05, op.h, depth, fr, x0 + mx, cy, 0));
  };
  if (['door', 'glassdoor', 'opening', 'slider'].includes(op.kind)) { const th = mesh(new THREE.BoxGeometry(op.w, 0.03, t + 0.02), M.frame, { cast: false }); th.position.set(cx, 0.005, 0); g.add(th); }
  if (op.kind === 'glass' && sill > 0.2) {
    g.add(box(op.w + 0.1, 0.035, t / 2 + 0.06, M.white_matte, cx, sill - 0.0175, t / 4 + 0.03));      // parapet wewnętrzny (prawa strona)
    g.add(box(op.w + 0.06, 0.02, 0.1, M.frame, cx, sill - 0.01, -t / 2 - 0.03));                        // parapet zewnętrzny (lewa)
  }
  if (op.kind === 'glass') {
    frame('glass');
    const pane = mesh(new THREE.PlaneGeometry(op.w - 0.02, op.h - 0.02), M.glass, { cast: false, receive: false });
    pane.position.set(cx, cy, 0); g.add(pane);
  } else if (op.kind === 'slider') {
    frame('glass');
    const half = op.w / 2 - prof; const px0 = op.fixed === 'R' ? x1 - prof - half : x0 + prof; const pcx = px0 + half / 2;
    const pane = mesh(new THREE.PlaneGeometry(half, op.h - 0.04), M.glass, { cast: false, receive: false }); pane.position.set(pcx, cy, -0.02); g.add(pane);
    const pane2 = pane.clone(); pane2.position.z = 0.045; g.add(pane2);
    g.add(box(0.05, op.h - 0.02, 0.05, fr, px0 + half - 0.025, cy, 0.045)); g.add(box(0.05, op.h - 0.02, 0.05, fr, px0 + 0.025, cy, 0.045));
    g.add(box(half, 0.06, 0.05, fr, pcx, top - 0.05, 0.045)); g.add(box(half, 0.06, 0.05, fr, pcx, sill + 0.05, 0.045));
  } else if (op.kind === 'glassdoor') {
    frame('glass');
    // skrzydło otwarte 90° do wnętrza (strona prawa = +z)
    const leaf = new THREE.Group(); leaf.position.set(x0 + prof, 0, 0); leaf.rotation.y = -Math.PI / 2;
    const lw = op.w - 2 * prof, lh = op.h - 0.02, lb = 0.07;
    leaf.add(box(lb, lh, 0.06, fr, lb / 2, cy, 0)); leaf.add(box(lb, lh, 0.06, fr, lw - lb / 2, cy, 0));
    leaf.add(box(lw, lb, 0.06, fr, lw / 2, top - lb / 2, 0)); leaf.add(box(lw, lb, 0.06, fr, lw / 2, sill + lb / 2, 0));
    const pane = mesh(new THREE.PlaneGeometry(lw - 2 * lb, lh - 2 * lb), M.glass, { cast: false, receive: false });
    pane.position.set(lw / 2, cy, 0); g.add(leaf); leaf.add(pane);
    leaf.add(cyl(0.012, 0.012, 0.9, M.steel, lw - 0.1, cy, 0.06));
  } else if (op.kind === 'door') {
    const jamb = 0.04, pdepth = t + 0.02;
    g.add(box(jamb, op.h, pdepth, op.leaf === 'entry' ? M.door_entry : M.door_white, x0 + jamb / 2, cy, 0));
    g.add(box(jamb, op.h, pdepth, op.leaf === 'entry' ? M.door_entry : M.door_white, x1 - jamb / 2, cy, 0));
    g.add(box(op.w, jamb, pdepth, op.leaf === 'entry' ? M.door_entry : M.door_white, cx, top - jamb / 2, 0));
    const lw = op.w - 2 * jamb, lh = op.h - jamb - 0.01;
    const leafMat = op.leaf === 'white' ? M.door_white : op.leaf === 'entry' ? M.door_entry : op.leaf === 'glass' ? M.glass_dark : M.walnut;
    const hingeRight = op.swing === 'R';
    const pivot = new THREE.Group(); pivot.position.set(hingeRight ? x1 - jamb : x0 + jamb, 0, 0);
    const dir = hingeRight ? -1 : 1;
    const into = (op.into || 'R') === 'R' ? 1 : -1;
    pivot.rotation.y = -dir * into * (op.open || 0) * DEG;
    const leaf = box(lw, lh, 0.045, leafMat, dir * lw / 2, lh / 2, 0);
    if (op.leaf === 'glass') { leaf.castShadow = false; }
    pivot.add(leaf);
    // klamka
    pivot.add(box(0.12, 0.02, 0.02, M.black_metal, dir * (lw - 0.1), 1.02, 0.035));
    pivot.add(box(0.12, 0.02, 0.02, M.black_metal, dir * (lw - 0.1), 1.02, -0.035));
    if (op.leaf === 'entry') { // pochwyt pionowy
      pivot.add(cyl(0.012, 0.012, 1.2, M.steel, dir * (lw - 0.12), 1.1, -0.06));
      pivot.add(box(0.06, 0.02, 0.02, M.steel, dir * (lw - 0.12), 0.55, -0.045)); pivot.add(box(0.06, 0.02, 0.02, M.steel, dir * (lw - 0.12), 1.65, -0.045));
    }
    g.add(pivot);
    if (op.leaf !== 'entry' && op.leaf !== 'glass') { // włączniki po obu stronach ściany
      const sx = hingeRight ? x1 + 0.18 : x0 - 0.18;
      for (const z of [t / 2 + 0.006, -t / 2 - 0.006]) { g.add(box(0.08, 0.08, 0.01, M.white_matte, sx, 1.1, z)); g.add(box(0.05, 0.05, 0.006, M.door_white, sx, 1.1, z + Math.sign(z) * 0.006)); }
    }
  } else if (op.kind === 'garagedoor') {
    const panel = box(op.w, op.h, 0.06, M[op.mat || 'cladding'], cx, cy, -t / 2 + 0.02);
    g.add(panel);
    for (let k = 1; k < 4; k++) g.add(box(op.w, 0.012, 0.02, M.black_metal, cx, sill + op.h * k / 4, -t / 2 + 0.06));
  }
}

function buildBoxes() {
  for (const b of HOUSE.boxes) {
    const r = rc(b.rect), z0 = b.z ?? 0;
    const mat = M[b.mat] || M.plaster;
    const m = box(r.w, b.h, r.d, mat, r.x, z0 + b.h / 2, -r.y);
    if (mat === M.glass) m.castShadow = false;
    house.add(m);
    if (b.mat === 'bookcase') buildBookcase(b);
    if (b.z == null && b.h > 1) colRects.push(b.rect);
    // linie frontów szaf
    const lineMat = M.wardrobe_dark;
    const grooves = (face) => {
      const along = face[0] === 'x' ? r.d : r.w, n = Math.max(1, Math.round(along / 0.6));
      for (let i = 1; i < n; i++) {
        const f = i / n;
        if (face[0] === 'x') { const x = face[1] === '1' ? b.rect[2] : b.rect[0]; house.add(box(0.012, b.h - 0.04, 0.012, lineMat, x, z0 + b.h / 2, -(b.rect[1] + f * r.d))); }
        else { const y = face[1] === '1' ? b.rect[3] : b.rect[1]; house.add(box(0.012, b.h - 0.04, 0.012, lineMat, b.rect[0] + f * r.w, z0 + b.h / 2, -y)); }
      }
    };
    if (b.doors && b.doors !== 'none') grooves(b.doors);
    if (b.slats) { // pionowe rowki paneli (obie strony)
      const n = Math.round(r.w / b.slats);
      for (let i = 1; i < n; i++) { house.add(box(0.008, b.h, r.d + 0.012, M.wardrobe_dark, b.rect[0] + i * r.w / n, z0 + b.h / 2, -r.y)); }
    }
    if (b.ovens) for (const [xa, xb] of b.ovens) {
      const face = b.ovenFace || 'y1'; const len = xb - xa, c = (xa + xb) / 2;
      const place = (w_, h_, d_, mat, y, off) => { if (face[0] === 'y') { const yy = face === 'y1' ? b.rect[3] + off : b.rect[1] - off; house.add(box(w_, h_, d_, mat, c, y, -yy)); } else { const xx = face === 'x1' ? b.rect[2] + off : b.rect[0] - off; house.add(box(d_, h_, w_, mat, xx, y, -c)); } };
      place(len, 0.45, 0.02, M.appliance_black, 1.0, 0.01); place(len, 0.45, 0.02, M.appliance_black, 1.5, 0.01);
      place(len - 0.1, 0.02, 0.03, M.steel, 0.83, 0.03); place(len - 0.1, 0.02, 0.03, M.steel, 1.33, 0.03);
    }
    if (b.led) for (const side of b.led) {   // pasek LED na górnej krawędzi opuszczonego sufitu (gzyms)
      const y = side === 'y0' ? b.rect[1] : b.rect[3];
      const s = mesh(new THREE.BoxGeometry(r.w - 0.05, 0.02, 0.04), E('led'), { cast: false, receive: false });
      s.position.set(r.x, z0 + b.h - 0.02, -(y + (side === 'y0' ? -0.03 : 0.03))); house.add(s);
    }
  }
}
function buildBookcase(b) {
  const r = rc(b.rect); const x = b.rect[2] + 0.005;     // front na +x
  const shelves = 6;
  for (let i = 1; i < shelves; i++) house.add(box(r.w, 0.025, r.d - 0.02, M.bookcase, r.x, i * b.h / shelves, -r.y));
  const rnd = mulberry(5);
  for (let i = 0; i < shelves; i++) {
    let yy = b.rect[1] + 0.06;
    while (yy < b.rect[3] - 0.15) { const bw = 0.03 + rnd() * 0.03, bh = 0.18 + rnd() * 0.12; const col = new THREE.Color().setHSL(rnd(), 0.25, 0.25 + rnd() * 0.3);
      house.add(box(r.w - 0.08, bh, bw, std({ color: col, roughness: 0.8 }), r.x + 0.02, i * b.h / shelves + 0.03 + bh / 2, -(yy + bw / 2))); yy += bw + 0.01 + rnd() * 0.03; }
    const s = mesh(new THREE.BoxGeometry(0.01, 0.01, r.d - 0.1), E('warmSoft'), { cast: false, receive: false }); s.position.set(b.rect[0] + 0.03, (i + 1) * b.h / shelves - 0.04, -r.y); house.add(s);
  }
  const pane = mesh(new THREE.PlaneGeometry(r.d, b.h), M.glass_dark, { cast: false, receive: false }); pane.rotation.y = Math.PI / 2; pane.position.set(x, b.h / 2, -r.y); house.add(pane);
  for (let i = 0; i <= 2; i++) house.add(box(0.03, b.h, 0.03, M.frame, x, b.h / 2, -(b.rect[1] + i * r.d / 2)));
}
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function hipRoof(p) {
  const [x0, y0, x1, y1] = p.rect; const w = x1 - x0, d = y1 - y0; const pitch = (p.pitch || 25) * DEG; const h0 = p.eave ?? 3.0;
  const along = p.axis || (w >= d ? 'x' : 'y'); const short = along === 'x' ? d : w; const hr = h0 + (short / 2) * Math.tan(pitch);
  const A = [x0, y0], B = [x1, y0], C = [x1, y1], D = [x0, y1];
  let R0, R1, faces;
  if (along === 'x') { R0 = [x0 + short / 2, (y0 + y1) / 2]; R1 = [x1 - short / 2, (y0 + y1) / 2]; faces = [[A, B, R1, R0], [C, D, R0, R1], [D, A, R0], [B, C, R1]]; }
  else { R0 = [(x0 + x1) / 2, y0 + short / 2]; R1 = [(x0 + x1) / 2, y1 - short / 2]; faces = [[A, B, R0], [C, D, R1], [D, A, R0, R1], [B, C, R1, R0]]; }
  const isRidge = (v) => v === R0 || v === R1;
  const pos = [], uv = [], idx = [];
  for (const f of faces) {
    const base = pos.length / 3;
    const vs = f.map((v) => [v[0], isRidge(v) ? hr : h0, -v[1]]);
    // normalna: (v1-v0)x(v2-v0); odwróć jeśli w dół
    const e1 = [vs[1][0] - vs[0][0], vs[1][1] - vs[0][1], vs[1][2] - vs[0][2]], e2 = [vs[2][0] - vs[0][0], vs[2][1] - vs[0][1], vs[2][2] - vs[0][2]];
    const ny = e1[2] * e2[0] - e1[0] * e2[2];
    const order = ny < 0 ? [...vs].reverse() : vs;
    for (const v of order) { pos.push(...v); const slope = (v[1] - h0) / Math.sin(pitch); uv.push(along === 'x' ? v[0] : -v[2], slope); }
    if (order.length === 3) idx.push(base, base + 1, base + 2); else idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  const m = mesh(g, M[p.mat || 'rooftile']); roofGroup.add(m);
  // podbitka + pas okapowy
  const soff = mesh(planeGeo(w, d), M[p.soffit || 'soffit'], { cast: true }); soff.rotation.x = Math.PI / 2; soff.position.set((x0 + x1) / 2, h0 - 0.002, -(y0 + y1) / 2); roofGroup.add(soff);
  const fh = 0.22, fm = M[p.fascia || 'ext_white'];
  roofGroup.add(box(w + 0.04, fh, 0.04, fm, (x0 + x1) / 2, h0 + fh / 2 - 0.01, -y0)); roofGroup.add(box(w + 0.04, fh, 0.04, fm, (x0 + x1) / 2, h0 + fh / 2 - 0.01, -y1));
  roofGroup.add(box(0.04, fh, d, fm, x0, h0 + fh / 2 - 0.01, -(y0 + y1) / 2)); roofGroup.add(box(0.04, fh, d, fm, x1, h0 + fh / 2 - 0.01, -(y0 + y1) / 2));
}
function buildRoof() {
  for (const p of HOUSE.roofHip || []) hipRoof(p);
  for (const p of HOUSE.roof || []) {
    const r = rc(p.rect); const h = p.z1 - p.z0;
    const mats = p.mat ? M[p.mat] : [M.ext_white, M.ext_white, M.roof_top, M[p.soffit || 'soffit'], M.ext_white, M.ext_white];
    const m = box(r.w, h, r.d, mats, r.x, p.z0 + h / 2, -r.y);
    roofGroup.add(m);
  }
  if (HOUSE.roofHole && HOUSE.roof) {  // szklana balustrada wokół otworu na schody
    const r = rc(HOUSE.roofHole), z = HOUSE.roof[0].z1;
    const rail = (w, d, x, y) => { const g = mesh(new THREE.BoxGeometry(w, 1.1, d), M.glass, { cast: false }); g.position.set(x, z + 0.55, -y); roofGroup.add(g); const h = box(w, 0.04, d + 0.02, M.steel, x, z + 1.1, -y); roofGroup.add(h); };
    rail(r.w + 0.1, 0.02, r.x, HOUSE.roofHole[1]); rail(r.w + 0.1, 0.02, r.x, HOUSE.roofHole[3]); rail(0.02, r.d, HOUSE.roofHole[0], r.y);
  }
  house.add(roofGroup);
}

// ======================================================================= biblioteka mebli
const F = {};
F.island = ({ w, d, body, top }) => { const g = new THREE.Group(); g.add(box(w, body ? 0.86 : 0.9, d, M[body || 'marble'], 0, body ? 0.43 : 0.45, 0)); if (top) g.add(box(w + 0.04, 0.04, d + 0.04, M[top], 0, 0.88, 0));
  g.add(box(0.75, 0.012, 0.45, M.stone_dark, w * 0.25, 0.905, 0));                      // zlew
  g.add(box(0.8, 0.006, 0.5, M.appliance_black, -w * 0.22, 0.904, 0));                  // płyta indukcyjna
  g.add(cyl(0.015, 0.015, 0.32, M.steel, w * 0.25 + 0.3, 1.06, -0.18)); const sp = cyl(0.012, 0.012, 0.22, M.steel, w * 0.25 + 0.19, 1.22, -0.18); sp.rotation.z = Math.PI / 2; g.add(sp);
  g.userData.collide = [w, d]; return g; };
F.hood = () => { const g = new THREE.Group(); g.add(box(0.35, 1.05, 0.35, M.white_matte, 0, H - 0.52, 0)); g.add(box(2.2, 0.12, 0.38, M.white_matte, 0, 1.68, 0));
  const s = mesh(new THREE.BoxGeometry(2.0, 0.01, 0.06), E('white'), { cast: false, receive: false }); s.position.set(0, 1.615, 0); g.add(s); return g; };
F.stools = ({ n }) => { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 0.7; g.add(rbox(0.42, 0.06, 0.38, M.fabric_grey, x, 0.68, 0, 0.03)); g.add(cyl(0.02, 0.02, 0.65, M.black_metal, x, 0.33, 0)); g.add(cyl(0.2, 0.2, 0.015, M.black_metal, x, 0.01, 0)); g.add(rbox(0.42, 0.28, 0.06, M.fabric_grey, x, 0.86, 0.17, 0.03)); } return g; };
F.diningTable = ({ w, d }) => { const g = new THREE.Group(); g.add(box(w, 0.03, d, M.stone_dark, 0, 0.74, 0));
  for (const s of [-1, 1]) { const a = box(0.06, 0.74, 0.06, M.black_metal, s * (w / 2 - 0.5), 0.37, 0); a.rotation.z = s * 0.35; g.add(a); const b = box(0.06, 0.74, 0.06, M.black_metal, s * (w / 2 - 0.5), 0.37, 0); b.rotation.z = -s * 0.35; g.add(b); }
  g.add(cyl(0.16, 0.16, 0.02, M.stone_dark, 0, 0.77, 0)); g.userData.collide = [w, d]; return g; };
F.chair = () => { const g = new THREE.Group(); g.add(rbox(0.5, 0.07, 0.48, M.fabric_grey, 0, 0.46, 0, 0.03)); g.add(rbox(0.5, 0.42, 0.07, M.fabric_grey, 0, 0.7, -0.21, 0.03));
  for (const [x, z] of [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]]) g.add(cyl(0.012, 0.012, 0.45, M.black_metal, x, 0.22, z, 8)); return g; };
F.pendantBlack = ({ r = 0.1, z = 1.9, h = 0.28 }) => { const g = new THREE.Group(); const shade = mesh(new THREE.CylinderGeometry(r, r, h, 32, 1, true), std({ color: 0x141414, roughness: 0.5, metalness: 0.4, side: THREE.DoubleSide })); shade.position.y = z; g.add(shade);
  g.add(cyl(r, r, 0.01, M.black_metal, 0, z + h / 2, 0)); g.add(cyl(0.003, 0.003, H - z - h / 2, M.black_metal, 0, (H + z + h / 2) / 2, 0, 6)); g.add(cyl(0.05, 0.05, 0.02, M.black_metal, 0, H - 0.01, 0));
  const bulb = mesh(new THREE.SphereGeometry(0.03, 12, 10), E('warm'), { cast: false, receive: false }); bulb.position.y = z - h / 2 + 0.03; g.add(bulb); return g; };
F.columnSq = ({ w = 0.4, mat = 'ext_white', h = 3.0 }) => { const g = new THREE.Group(); g.add(box(w, h + 0.2, w, M[mat], 0, h / 2 - 0.1, 0)); g.userData.collide = [w, w]; return g; };
F.bookshelf = ({ w = 2.0, d = 0.35, h = 2.6 }) => { const g = new THREE.Group(); g.add(box(0.03, h, d, M.walnut, -w / 2, h / 2, 0)); g.add(box(0.03, h, d, M.walnut, w / 2, h / 2, 0)); const n = 5; for (let i = 0; i <= n; i++) g.add(box(w, 0.03, d, M.walnut, 0, i * h / n + 0.015, 0));
  const rnd = mulberry(17); for (let i = 0; i < n; i++) { let x = -w / 2 + 0.06; while (x < w / 2 - 0.2) { const bw = 0.03 + rnd() * 0.03, bh = 0.2 + rnd() * 0.1; if (rnd() < 0.7) g.add(box(bw, bh, d - 0.1, std({ color: new THREE.Color().setHSL(rnd(), 0.2, 0.3 + rnd() * 0.3), roughness: 0.8 }), x + bw / 2, i * h / n + 0.03 + bh / 2, 0)); x += bw + 0.01 + rnd() * 0.08; } }
  g.userData.collide = [w, d]; return g; };
F.bathtub = ({ w = 1.7, d = 0.75 }) => { const g = new THREE.Group(); g.add(rbox(w, 0.58, d, M.marble_wall, 0, 0.29, 0, 0.01)); g.add(rbox(w - 0.16, 0.5, d - 0.16, std({ color: 0xe6ecee, roughness: 0.2 }), 0, 0.36, 0, 0.1)); g.add(cyl(0.01, 0.01, 0.25, M.steel, -w / 2 + 0.2, 0.7, -d / 2 + 0.05, 8)); g.userData.collide = [w, d]; return g; };
F.washer = () => { const g = new THREE.Group(); g.add(box(0.6, 0.85, 0.6, M.appliance, 0, 0.425, 0)); g.add(cyl(0.2, 0.2, 0.03, M.appliance_black, 0, 0.42, 0.3).rotateX(Math.PI / 2)); return g; };
F.decorIsland = () => { const g = new THREE.Group(); g.add(cyl(0.16, 0.12, 0.08, std({ color: 0x2a2a2a, roughness: 0.5 }), 0.3, 0.94, 0, 32)); for (let i = 0; i < 7; i++) g.add(mesh(new THREE.SphereGeometry(0.035, 12, 10), std({ color: [0x7cb342, 0xd84315, 0xf9a825][i % 3], roughness: 0.6 })).translateX(0.3 + Math.cos(i) * 0.07).translateY(0.99 + (i % 2) * 0.03).translateZ(Math.sin(i * 1.7) * 0.07));
  g.add(box(0.4, 0.02, 0.28, M.oak, -0.4, 0.91, 0.05)); g.add(cyl(0.02, 0.02, 0.24, M.steel, -0.55, 1.02, -0.02, 8)); g.add(cyl(0.09, 0.07, 0.2, M.steel, 0.9, 1.0, -0.15, 24)); return g; };
F.books = ({ n = 3 }) => { const g = new THREE.Group(); const rnd = mulberry(23); let y = 0; for (let i = 0; i < n; i++) { const h = 0.025 + rnd() * 0.02; g.add(box(0.24 - i * 0.02, h, 0.17 - i * 0.01, std({ color: new THREE.Color().setHSL(rnd(), 0.25, 0.35 + rnd() * 0.35), roughness: 0.8 }), rnd() * 0.02, y + h / 2, rnd() * 0.02)); y += h; } return g; };
F.laptop = () => { const g = new THREE.Group(); g.add(box(0.32, 0.015, 0.22, std({ color: 0xb8bcc0, roughness: 0.35, metalness: 0.6 }), 0, 0.0075, 0)); const s = box(0.32, 0.21, 0.008, M.tv, 0, 0.105, -0.11); s.rotation.x = -0.25; s.position.y = 0.11; g.add(s); return g; };
F.towels = ({ n = 2 }) => { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const t = cyl(0.06, 0.06, 0.32, std({ color: i % 2 ? 0xe8e4dc : 0x8a8f96, roughness: 1 }), 0, 0.06, i * 0.14 - 0.07, 16); t.rotation.z = Math.PI / 2; g.add(t); } return g; };
F.bottles = () => { const g = new THREE.Group(); const cols = [0x1f1f1f, 0xf2efe8, 0x6b4a2e]; for (let i = 0; i < 3; i++) { g.add(cyl(0.028, 0.028, 0.16, std({ color: cols[i], roughness: 0.3 }), i * 0.08 - 0.08, 0.08, 0, 16)); g.add(cyl(0.012, 0.012, 0.03, M.black_metal, i * 0.08 - 0.08, 0.175, 0, 8)); } return g; };
F.wallLamp = ({ z = 2.2 }) => { const g = new THREE.Group(); g.add(box(0.1, 0.22, 0.1, M.black_metal, 0, z, 0.05)); const e = mesh(new THREE.BoxGeometry(0.08, 0.005, 0.08), E('warmSoft'), { cast: false, receive: false }); e.position.set(0, z - 0.113, 0.05); g.add(e); const e2 = e.clone(); e2.position.y = z + 0.113; g.add(e2); return g; };
F.doormat = () => { const g = new THREE.Group(); g.add(box(0.8, 0.02, 0.5, std({ color: 0x4a4540, roughness: 1 }), 0, 0.01, 0)); return g; };
F.bench = ({ w = 1.2 }) => { const g = new THREE.Group(); g.add(rbox(w, 0.06, 0.4, M.oak, 0, 0.42, 0, 0.01)); for (const s of [-1, 1]) g.add(box(0.04, 0.4, 0.36, M.black_metal, s * (w / 2 - 0.1), 0.2, 0)); g.add(rbox(w - 0.1, 0.05, 0.36, M.fabric_light, 0, 0.475, 0, 0.02)); g.userData.collide = [w, 0.4]; return g; };
F.coatRack = ({ w = 0.9 }) => { const g = new THREE.Group(); g.add(box(w, 0.06, 0.03, M.oak, 0, 1.7, 0.015)); for (let i = 0; i < 4; i++) g.add(cyl(0.008, 0.008, 0.08, M.black_metal, -w / 2 + 0.15 + i * (w - 0.3) / 3, 1.67, 0.06, 8).rotateX(Math.PI / 2)); g.add(rbox(0.3, 0.6, 0.12, std({ color: 0x3a3f4a, roughness: 1 }), -w / 2 + 0.15, 1.35, 0.1, 0.04)); g.add(rbox(0.28, 0.55, 0.1, std({ color: 0xb59a7a, roughness: 1 }), w / 2 - 0.15, 1.37, 0.1, 0.04)); return g; };
F.mirrorTall = ({ w = 0.6, h = 1.8 }) => { const g = new THREE.Group(); g.add(box(w + 0.04, h + 0.04, 0.02, M.frame, 0, h / 2 + 0.1, 0.01)); g.add(box(w, h, 0.01, M.mirror, 0, h / 2 + 0.1, 0.026)); return g; };
F.shelfWall = ({ w = 0.8, z = 1.5 }) => { const g = new THREE.Group(); g.add(box(w, 0.03, 0.22, M.oak, 0, z, 0.11)); const b = F.books({ n: 4 }); b.rotation.z = Math.PI / 2; b.position.set(-w / 2 + 0.15, z + 0.135, 0.11); g.add(b); g.add(cyl(0.05, 0.04, 0.14, std({ color: 0xd9d4ca, roughness: 0.8 }), w / 2 - 0.12, z + 0.085, 0.11, 16)); return g; };
F.clock = ({ z = 1.9 }) => { const g = new THREE.Group(); g.add(cyl(0.15, 0.15, 0.03, M.black_metal, 0, z, 0.015, 32).rotateX(Math.PI / 2)); g.add(cyl(0.135, 0.135, 0.01, M.white_matte, 0, z, 0.032, 32).rotateX(Math.PI / 2)); g.add(box(0.01, 0.1, 0.005, M.black_metal, 0, z + 0.05, 0.04)); g.add(box(0.07, 0.01, 0.005, M.black_metal, 0.035, z, 0.04)); return g; };
F.grassClump = ({ s = 1 }) => { const g = new THREE.Group(); const rnd = mulberry(31); for (let i = 0; i < 14; i++) { const h = (0.5 + rnd() * 0.5) * s; const c = mesh(new THREE.ConeGeometry(0.03 * s, h, 5), std({ color: 0x9aa374, roughness: 1 })); c.position.set((rnd() - 0.5) * 0.35 * s, h / 2, (rnd() - 0.5) * 0.35 * s); c.rotation.set((rnd() - 0.5) * 0.5, 0, (rnd() - 0.5) * 0.5); g.add(c); } return g; };
F.downpipe = ({ h = 3.0 }) => { const g = new THREE.Group(); g.add(cyl(0.045, 0.045, h, std({ color: 0x3a3a3c, roughness: 0.5, metalness: 0.4 }), 0, h / 2 - 0.1, 0, 12)); return g; };
F.tvPanel = ({ w = 1.4, z = 1.25 }) => { const g = new THREE.Group(); g.add(box(w + 0.6, 2.2, 0.04, M.walnut_fluted, 0, 1.2, 0.02)); g.add(box(w, w * 0.56, 0.03, M.tv, 0, z, 0.06)); return g; };
F.wardrobeRods = ({ w = 1.5 }) => { const g = new THREE.Group(); g.add(cyl(0.012, 0.012, w, M.steel, 0, 1.8, 0, 8).rotateZ(Math.PI / 2)); const rnd = mulberry(41); for (let i = 0; i < Math.floor(w / 0.12); i++) { const c = rbox(0.02, 0.9 + rnd() * 0.3, 0.42, std({ color: new THREE.Color().setHSL(rnd(), 0.15, 0.2 + rnd() * 0.5), roughness: 1 }), -w / 2 + 0.08 + i * 0.12, 1.25, 0, 0.01); g.add(c); } g.add(box(w, 0.025, 0.5, M.oak, 0, 2.05, 0)); g.add(box(w, 0.025, 0.5, M.oak, 0, 0.4, 0)); return g; };
F.pantryShelves = ({ w = 1.5, h = 2.2 }) => { const g = new THREE.Group(); const rnd = mulberry(47); for (let i = 0; i < 5; i++) { g.add(box(w, 0.025, 0.35, M.oak, 0, 0.3 + i * (h - 0.4) / 4, 0)); for (let k = 0; k < 6; k++) if (rnd() < 0.75) g.add(cyl(0.04 + rnd() * 0.03, 0.04 + rnd() * 0.03, 0.12 + rnd() * 0.16, std({ color: new THREE.Color().setHSL(rnd(), 0.4, 0.5), roughness: 0.6 }), -w / 2 + 0.12 + k * (w - 0.24) / 5, 0.3 + i * (h - 0.4) / 4 + 0.1, 0, 12)); } return g; };
F.ringLight = ({ r = 0.45, z = 2.1, n = 1 }) => { const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const rr = r * (1 - i * 0.28), zz = z + i * 0.22;
    const ring = mesh(new THREE.TorusGeometry(rr, 0.035, 10, 60), M.brass); ring.rotation.x = Math.PI / 2; ring.position.y = zz; g.add(ring);
    const em = mesh(new THREE.TorusGeometry(rr, 0.022, 8, 60), E('warm'), { cast: false, receive: false }); em.rotation.x = Math.PI / 2; em.position.y = zz - 0.03; g.add(em);
    for (const s of [-1, 1]) g.add(cyl(0.002, 0.002, H - zz, M.brass, s * rr * 0.7, (H + zz) / 2, 0, 5)); }
  g.add(cyl(0.05, 0.05, 0.015, M.brass, 0, H - 0.008, 0)); return g; };
F.curvedSofa = ({ w = 3.2, d = 1.1, mat = 'fabric_cream' }) => { const g = new THREE.Group(); const m = M[mat];
  g.add(rbox(w, 0.42, d, m, 0, 0.21, 0, 0.14));
  const n = Math.max(3, Math.round(w / 0.85));
  for (let i = 0; i < n; i++) g.add(rbox(w / n - 0.02, 0.2, d - 0.3, m, (i - (n - 1) / 2) * w / n, 0.52, 0.06, 0.08));
  for (let i = 0; i < n; i++) { const b = rbox(w / n - 0.04, 0.5, 0.3, m, (i - (n - 1) / 2) * w / n, 0.72, -d / 2 + 0.18, 0.13); g.add(b); }
  for (const s of [-1, 1]) g.add(rbox(0.26, 0.32, d - 0.1, m, s * (w / 2 - 0.13), 0.56, 0.02, 0.13));
  const pil = (x, mm) => { const p = rbox(0.52, 0.52, 0.16, mm, x, 0.72, -d / 2 + 0.42, 0.08); p.rotation.x = -0.22; g.add(p); };
  pil(-w / 4, M.fabric_sand); pil(w / 4, M.fabric_light);
  g.userData.collide = [w, d]; return g; };
F.marbleTable = ({ w = 1.3, d = 0.85 }) => { const g = new THREE.Group();
  g.add(box(w, 0.1, d, M.patagonia_s, 0, 0.42, 0));
  g.add(box(w * 0.3, 0.37, d * 0.75, M.patagonia_s, -w * 0.25, 0.185, 0)); g.add(box(w * 0.26, 0.37, d * 0.6, M.patagonia_s, w * 0.28, 0.185, 0.05));
  g.add(cyl(0.11, 0.1, 0.09, M.brass, w * 0.15, 0.515, -0.1, 24)); g.userData.collide = [w, d]; return g; };
F.ovalTable = ({ w = 2.6, d = 1.2 }) => { const g = new THREE.Group();
  const top = mesh(new THREE.CylinderGeometry(1, 1, 0.06, 56), M.patagonia_s); top.scale.set(w / 2, 1, d / 2); top.position.y = 0.74; g.add(top);
  const base = mesh(new THREE.CylinderGeometry(0.34, 0.46, 0.7, 40), M.brass); base.position.y = 0.36; g.add(base);
  g.userData.collide = [w, d]; return g; };
F.diningChair = ({ mat = 'fabric_sand' }) => { const g = new THREE.Group();
  g.add(rbox(0.5, 0.12, 0.48, M[mat], 0, 0.44, 0, 0.06));
  const b = rbox(0.5, 0.46, 0.14, M[mat], 0, 0.68, -0.2, 0.07); b.rotation.x = -0.1; g.add(b);
  g.add(cyl(0.2, 0.24, 0.38, std({ color: 0xc9b89c, roughness: 0.8 }), 0, 0.19, 0, 24)); return g; };
F.barIsland = ({ w = 3.2, d = 1.1 }) => { const g = new THREE.Group();
  g.add(box(w, 0.86, d, M.stone_beige, 0, 0.43, 0));
  g.add(box(w + 0.06, 0.06, d + 0.06, M.stone_beige, 0, 0.89, 0));
  g.add(box(w - 0.3, 0.26, 0.04, M.brass, 0, 0.5, d / 2 + 0.02));                  // mosiężny cokół baru
  g.add(box(0.8, 0.008, 0.46, M.appliance_black, -w * 0.18, 0.925, -0.1));          // płyta indukcyjna
  g.add(cyl(0.02, 0.02, 0.3, M.brass, w * 0.3, 1.05, -0.2, 12)); const sp = cyl(0.016, 0.016, 0.22, M.brass, w * 0.3 - 0.11, 1.2, -0.2, 10); sp.rotation.z = Math.PI / 2; g.add(sp);
  g.userData.collide = [w, d]; return g; };
F.barStools = ({ n = 3, gap = 0.62 }) => { const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * gap;
    g.add(cyl(0.21, 0.21, 0.08, M.fabric_cream, x, 0.68, 0, 28));
    const b = mesh(new THREE.TorusGeometry(0.2, 0.022, 8, 24, Math.PI), M.black_metal); b.position.set(x, 0.92, -0.08); b.rotation.set(Math.PI / 2, 0, 0); g.add(b);
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.78; g.add(cyl(0.011, 0.011, 0.68, M.black_metal, x + Math.cos(a) * 0.16, 0.34, Math.sin(a) * 0.16, 6)); } }
  return g; };
F.freeTub = ({ w = 1.75, d = 0.8 }) => { const g = new THREE.Group();
  const o = mesh(new THREE.CylinderGeometry(1, 0.86, 0.58, 48), M.ceramic); o.scale.set(w / 2, 1, d / 2); o.position.y = 0.29; g.add(o);
  const i2 = mesh(new THREE.CylinderGeometry(0.92, 0.78, 0.5, 48), std({ color: 0xf2efe9, roughness: 0.15 })); i2.scale.set(w / 2 - 0.05, 1, d / 2 - 0.05); i2.position.y = 0.35; g.add(i2);
  g.userData.collide = [w, d]; return g; };
F.vanityStone = ({ w = 2.0, basins = 2 }) => { const g = new THREE.Group();
  g.add(rbox(w, 0.42, 0.52, M.wenge, 0, 0.72, 0.26, 0.01));                       // podwieszana szafka wenge
  g.add(box(w * 0.62, 0.16, 0.5, M.patagonia_s, 0, 1.0, 0.26));                    // marmurowa misa-blat
  for (let i = 0; i < basins; i++) { const x = basins === 1 ? 0 : (i - 0.5) * w * 0.34;
    g.add(cyl(0.17, 0.15, 0.02, std({ color: 0xece7df, roughness: 0.2 }), x, 1.075, 0.26, 32));
    const t = cyl(0.012, 0.012, 0.16, M.brass, x, 1.22, 0.1, 10); t.rotation.x = Math.PI / 2; g.add(t);
    g.add(cyl(0.025, 0.025, 0.03, M.brass, x, 1.22, 0.03, 12).rotateX(Math.PI / 2)); }
  g.add(box(w - 0.2, 0.02, 0.04, M.wenge, 0, 0.5, 0.5));
  g.userData.collide = [w, 0.55]; return g; };
F.mirrorLed = ({ w = 2.0, h = 0.9, z = 1.75 }) => { const g = new THREE.Group();
  g.add(box(w, h, 0.02, M.mirror, 0, z, 0.012));
  for (const s of [-1, 1]) { const e = mesh(new THREE.BoxGeometry(w + 0.06, 0.012, 0.012), E('warmSoft'), { cast: false, receive: false }); e.position.set(0, z + s * (h / 2 + 0.02), 0.012); g.add(e); }
  return g; };
F.towelRail = ({ z = 1.05 }) => { const g = new THREE.Group(); for (let i = 0; i < 6; i++) g.add(cyl(0.011, 0.011, 0.44, M.brass, 0, z - 0.33 + i * 0.13, 0.045, 8).rotateZ(Math.PI / 2)); for (const s of [-1, 1]) g.add(box(0.026, 0.8, 0.026, M.brass, s * 0.22, z, 0.03)); const t = cyl(0.05, 0.05, 0.28, std({ color: 0xe8e4dc, roughness: 1 }), 0.0, z + 0.33, 0.09, 12); t.rotation.z = Math.PI / 2; g.add(t); return g; };
F.sconceRing = ({ z = 1.6 }) => { const g = new THREE.Group(); const r = mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 28), M.brass); r.position.set(0, z, 0.05); g.add(r);
  const e = mesh(new THREE.CircleGeometry(0.075, 20), E('warm'), { cast: false, receive: false }); e.position.set(0, z, 0.048); g.add(e); return g; };
F.panelBed = ({ w = 1.9, d = 2.1 }) => { const g = new THREE.Group();
  g.add(rbox(w + 0.5, 0.34, d + 0.3, M.fabric_sand, 0, 0.17, 0.1, 0.05));          // szeroka platforma
  g.add(rbox(w, 0.26, d, M.bedding, 0, 0.47, 0, 0.05));
  const duv = rbox(w + 0.08, 0.16, d * 0.62, M.bedding, 0, 0.62, d * 0.16, 0.06); g.add(duv);
  g.add(rbox(w + 0.5, 0.42, 0.6, M.fabric_sand, 0, 0.42, d / 2 + 0.3, 0.1));        // ławka u stóp
  g.add(rbox(w + 0.2, 0.75, 0.22, M.fabric_cream, 0, 0.72, -d / 2 - 0.08, 0.06));   // tapicerowany zagłówek
  for (const s of [-1, 1]) { const p = rbox(0.66, 0.44, 0.18, M.bedding, s * 0.42, 0.74, -d / 2 + 0.22, 0.07); p.rotation.x = -0.3; g.add(p); }
  g.userData.collide = [w + 0.5, d + 0.9]; return g; };
F.stoneStrip = ({ w = 3.0, h = 0.8, z = 0.6 }) => { const g = new THREE.Group(); g.add(box(w, h, 0.03, M.patagonia_s, 0, z, 0.015)); return g; };
F.fluteWall = ({ w = 3.0, h = 2.4, z = 0 }) => { const g = new THREE.Group(); g.add(box(w, h, 0.04, M.wenge_fluted, 0, z + h / 2, 0.02)); return g; };
F.pendant = ({ r, z }) => { const g = new THREE.Group(); const shade = mesh(new THREE.CylinderGeometry(0.06, r, 0.34, 40, 1, true), std({ color: 0xf1ede4, roughness: 1, side: THREE.DoubleSide }), { cast: false });
  shade.position.y = z; g.add(shade); const cap = cyl(0.06, 0.06, 0.02, M.white_matte, 0, z + 0.17, 0); g.add(cap); g.add(cyl(0.004, 0.004, H - z - 0.18, M.black_metal, 0, (H + z + 0.18) / 2 - 0.09, 0, 6)); g.add(cyl(0.06, 0.06, 0.02, M.white_matte, 0, H - 0.02, 0));
  const bulb = mesh(new THREE.SphereGeometry(0.035, 16, 12), E('warm'), { cast: false, receive: false }); bulb.position.y = z - 0.02; g.add(bulb); return g; };
F.rug = ({ w, d }) => { const g = new THREE.Group(); const m = mesh(planeGeo(w, d), M.rug, { cast: false }); m.rotation.x = -Math.PI / 2; m.position.y = 0.012; g.add(m); return g; };
F.sofa = ({ w, d }) => { const g = new THREE.Group(); g.add(rbox(w, 0.4, d, M.fabric, 0, 0.2, 0, 0.05));
  const inner = w - 0.4; g.add(rbox(inner, 0.36, 0.28, M.fabric, 0, 0.55, -d / 2 + 0.16, 0.06));
  for (const s of [-1, 1]) g.add(rbox(0.2, 0.2, d, M.fabric, s * (w / 2 - 0.1), 0.5, 0, 0.04));
  const n = Math.max(2, Math.round(inner / 0.9)); for (let i = 0; i < n; i++) g.add(rbox(inner / n - 0.03, 0.16, d - 0.5, M.fabric, (i - (n - 1) / 2) * inner / n, 0.46, 0.1, 0.05));
  const pil = (x, mat, rot) => { const p = rbox(0.5, 0.5, 0.14, mat, x, 0.65, -d / 2 + 0.38, 0.06); p.rotation.x = -0.25; p.rotation.y = rot; g.add(p); };
  pil(-inner / 2 + 0.35, M.fabric_brown, 0.2); pil(0, M.fabric_light, -0.15); pil(inner / 2 - 0.35, M.fabric_brown, 0.1);
  g.userData.collide = [w, d]; return g; };
F.coffeeTable = ({ r }) => { const g = new THREE.Group(); g.add(cyl(0.16, 0.34, 0.33, std({ color: 0x3a3a3c, roughness: 0.7 }), 0, 0.165, 0)); g.add(cyl(r, r, 0.03, std({ color: 0x9a978f, roughness: 0.6 }), 0, 0.345, 0, 48));
  g.add(box(0.24, 0.03, 0.16, std({ color: 0x8b2c2a, roughness: 0.7 }), r * 0.3, 0.375, 0)); g.add(box(0.22, 0.025, 0.15, std({ color: 0xd9d4ca, roughness: 0.8 }), r * 0.3, 0.4, 0.01)); return g; };
F.sideTable = ({ r }) => { const g = new THREE.Group(); g.add(cyl(r, r, 0.02, M.stone_dark, 0, 0.42, 0, 40)); for (let i = 0; i < 3; i++) { const l = cyl(0.008, 0.008, 0.42, M.black_metal, Math.cos(i * 2.1) * r * 0.6, 0.21, Math.sin(i * 2.1) * r * 0.6, 6); l.rotation.z = Math.cos(i * 2.1) * 0.25; l.rotation.x = -Math.sin(i * 2.1) * 0.25; g.add(l); } return g; };
F.tvUnit = ({ w }) => { const g = new THREE.Group(); g.add(rbox(w, 0.42, 0.45, M.wardrobe_dark, 0, 0.21, 0, 0.01)); g.add(box(0.008, 0.36, 0.01, M.stone_dark, 0, 0.21, 0.226)); g.add(cyl(0.06, 0.05, 0.16, std({ color: 0x3b2f2a, roughness: 0.2 }), -0.6, 0.5, 0)); g.add(box(0.28, 0.04, 0.2, std({ color: 0xe9e4d8, roughness: 0.9 }), 0.7, 0.44, 0)); g.userData.collide = [w, 0.45]; return g; };
F.tv = ({ w, z }) => { const g = new THREE.Group(); g.add(box(w, w * 0.56, 0.035, M.tv, 0, z, 0)); return g; };
F.fireplace = ({ w }) => { const g = new THREE.Group(); g.add(box(w + 0.16, 0.74, 0.05, M.frame, 0, 0.62, 0.0));
  g.add(box(w, 0.6, 0.02, M.stone_dark, 0, 0.62, -0.09)); g.add(box(w, 0.02, 0.2, M.stone_dark, 0, 0.33, 0)); g.add(box(w, 0.02, 0.2, M.stone_dark, 0, 0.91, 0));
  const f = mesh(new THREE.PlaneGeometry(w - 0.1, 0.34), E('warm'), { cast: false, receive: false }); f.position.set(0, 0.55, -0.02); g.add(f);
  for (let i = 0; i < 5; i++) g.add(cyl(0.03, 0.03, w - 0.3, M.ember, 0, 0.42 + i * 0.03, 0.06 + i * 0.01, 8).rotateZ(Math.PI / 2)); return g; };
F.plant = ({ s = 1 }) => { const g = new THREE.Group(); g.add(cyl(0.2 * s, 0.16 * s, 0.4 * s, M.pot, 0, 0.2 * s, 0));
  const rnd = mulberry(11); for (let i = 0; i < 9; i++) { const leaf = mesh(new THREE.SphereGeometry(0.22 * s, 10, 8), M.plant); leaf.scale.set(0.35, 1.9, 0.12); const a = i * 0.75; leaf.position.set(Math.cos(a) * 0.25 * s, (0.9 + rnd() * 0.5) * s, Math.sin(a) * 0.25 * s); leaf.rotation.set(Math.sin(a) * 0.55, -a, -Math.cos(a) * 0.55); g.add(leaf); }
  return g; };
F.floorLamp = () => { const g = new THREE.Group(); g.add(cyl(0.15, 0.15, 0.02, M.black_metal, 0, 0.01, 0)); g.add(cyl(0.01, 0.01, 1.7, M.black_metal, 0, 0.85, 0, 8)); const d = mesh(new THREE.TorusGeometry(0.16, 0.012, 8, 32), M.black_metal); d.position.y = 1.6; g.add(d); const b = mesh(new THREE.SphereGeometry(0.06, 16, 12), E('warmSoft')); b.position.set(0.02, 1.6, 0); g.add(b); return g; };
F.curtain = ({ w, tone }) => { const g = new THREE.Group(); const geo = new THREE.PlaneGeometry(w, H - 0.02, 40, 1); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 22) * 0.035); geo.computeVertexNormals();
  const m = mesh(geo, tone === 'dark' ? M.curtain_dark : M.curtain_light, { cast: true }); m.position.y = H / 2 - 0.01; g.add(m); return g; };
F.painting = ({ w, h, z }) => { const g = new THREE.Group(); g.add(box(w, h, 0.03, M.frame, 0, z, 0.015)); const c = mesh(new THREE.PlaneGeometry(w - 0.06, h - 0.06), M.canvas, { cast: false }); c.position.set(0, z, 0.032); g.add(c); return g; };
F.track = ({ len, spots }) => { const g = new THREE.Group(); g.add(box(0.035, 0.03, len, M.black_metal, 0, H - 0.015, len / 2)); for (const s of spots) { g.add(cyl(0.03, 0.03, 0.12, M.black_metal, 0, H - 0.1, s)); const e = mesh(new THREE.CircleGeometry(0.02, 12), E('warmSoft'), { cast: false, receive: false }); e.rotation.x = -Math.PI / 2; e.position.set(0, H - 0.161, s); g.add(e); } return g; };
F.linear = ({ len }) => { const g = new THREE.Group(); const e = mesh(new THREE.BoxGeometry(0.03, 0.01, len), E('white'), { cast: false, receive: false }); e.position.y = H - 0.006; g.add(e); return g; };
F.downlight = ({ z }) => { const g = new THREE.Group(); const e = mesh(new THREE.CircleGeometry(0.045, 16), E('warmSoft'), { cast: false, receive: false }); e.rotation.x = Math.PI / 2; e.position.y = (z ?? H) - 0.02; g.add(e); const r = mesh(new THREE.RingGeometry(0.045, 0.06, 16), M.white_matte, { cast: false }); r.rotation.x = Math.PI / 2; r.position.y = (z ?? H) - 0.019; g.add(r); return g; };
F.wallSpot = () => { const g = new THREE.Group(); g.add(cyl(0.035, 0.035, 0.1, M.black_metal, 0, H - 0.06, 0)); return g; };
F.console = ({ w }) => { const g = new THREE.Group(); g.add(rbox(w, 0.28, 0.35, M.wardrobe_dark, 0, 0.82, 0.18, 0.01)); g.add(cyl(0.06, 0.05, 0.3, M.stone_dark, w * 0.3, 1.11, 0.18));
  for (let i = 0; i < 5; i++) { const s = cyl(0.004, 0.004, 0.7, std({ color: 0xc9b48c, roughness: 1 }), w * 0.3 + (i - 2) * 0.02, 1.55, 0.18 + (i % 2) * 0.03, 5); s.rotation.z = (i - 2) * 0.12; g.add(s); const t = mesh(new THREE.SphereGeometry(0.05, 8, 6), std({ color: 0xd9c4a0, roughness: 1 })); t.scale.set(0.5, 2.2, 0.5); t.position.set(w * 0.3 + (i - 2) * 0.06, 1.85, 0.18 + (i % 2) * 0.03); g.add(t); }
  const s = mesh(new THREE.BoxGeometry(w - 0.1, 0.01, 0.02), E('led'), { cast: false, receive: false }); s.position.set(0, 0.69, 0.02); g.add(s); return g; };
F.pouf = ({ r }) => { const g = new THREE.Group(); g.add(rbox(r * 2, 0.42, r * 2, M.fabric_light, 0, 0.21, 0, 0.08)); return g; };
F.bed = ({ w, d }) => { const g = new THREE.Group(); g.add(rbox(w, 0.28, d, M.fabric_grey, 0, 0.26, 0, 0.04)); g.add(rbox(w - 0.06, 0.2, d - 0.06, M.bedding, 0, 0.48, 0, 0.06));
  const duv = rbox(w + 0.06, 0.12, d * 0.66, M.bedding, 0, 0.6, d * 0.14, 0.05); g.add(duv);
  const thr = rbox(w * 0.6, 0.04, d * 0.4, M.fabric_grey, w * 0.1, 0.665, d * 0.15, 0.02); thr.rotation.y = 0.08; g.add(thr);
  for (const s of [-1, 1]) { const hb = rbox(w / 2 - 0.05, 0.42, 0.14, M.fabric_light, s * (w / 4 - 0.02), 0.72, -d / 2 + 0.07, 0.05); g.add(hb); const p = rbox(0.62, 0.42, 0.16, M.bedding, s * (w / 4 - 0.02), 0.68, -d / 2 + 0.3, 0.06); p.rotation.x = -0.35; g.add(p); }
  for (const [x, z] of [[-w / 2 + 0.1, -d / 2 + 0.1], [w / 2 - 0.1, -d / 2 + 0.1], [-w / 2 + 0.1, d / 2 - 0.1], [w / 2 - 0.1, d / 2 - 0.1]]) g.add(box(0.05, 0.12, 0.05, M.black_metal, x, 0.06, z));
  g.userData.collide = [w, d]; return g; };
F.singleBed = () => { const g = new THREE.Group(); const w = 0.95, d = 2.0; g.add(rbox(w, 0.3, d, M.fabric_light, 0, 0.2, 0, 0.04)); g.add(rbox(w - 0.04, 0.16, d - 0.05, M.bedding, 0, 0.42, 0, 0.05)); g.add(rbox(w - 0.02, 0.1, d * 0.6, std({ color: 0x9aa4b4, roughness: 1 }), 0, 0.51, d * 0.15, 0.04)); g.add(rbox(0.5, 0.12, 0.35, M.bedding, 0, 0.55, -d / 2 + 0.3, 0.05)); g.add(rbox(w, 0.7, 0.08, M.walnut, 0, 0.45, -d / 2 - 0.02, 0.01)); g.userData.collide = [w, d]; return g; };
F.desk = () => { const g = new THREE.Group(); g.add(box(1.3, 0.03, 0.6, M.walnut, 0, 0.74, 0)); for (const [x, z] of [[-0.6, -0.25], [0.6, -0.25], [-0.6, 0.25], [0.6, 0.25]]) g.add(cyl(0.015, 0.015, 0.73, M.black_metal, x, 0.365, z, 8)); g.add(box(0.5, 0.32, 0.02, M.tv, 0, 0.95, -0.15)); g.add(box(0.14, 0.02, 0.1, M.black_metal, 0, 0.765, -0.15)); g.userData.collide = [1.3, 0.6]; return g; };
F.nightstand = ({ r }) => { const g = new THREE.Group(); g.add(cyl(r, r * 0.8, 0.5, std({ color: 0xcfcbc4, roughness: 0.8 }), 0, 0.25, 0, 32)); g.add(cyl(0.05, 0.05, 0.04, M.black_metal, 0, 0.52, 0)); const b = mesh(new THREE.SphereGeometry(0.07, 16, 12), E('warmSoft'), { cast: false }); b.position.y = 0.62; g.add(b); g.add(box(0.2, 0.05, 0.14, std({ color: 0x3b3b3b, roughness: 0.8 }), -0.05, 0.525, 0.05)); return g; };
F.armchair = () => { const g = new THREE.Group(); g.add(rbox(0.72, 0.16, 0.7, M.leather, 0, 0.45, 0, 0.06)); g.add(rbox(0.72, 0.62, 0.14, M.leather, 0, 0.78, -0.3, 0.07)); for (const s of [-1, 1]) g.add(rbox(0.12, 0.26, 0.6, M.leather, s * 0.31, 0.58, -0.05, 0.04)); g.add(cyl(0.03, 0.03, 0.36, M.black_metal, 0, 0.19, 0)); for (let i = 0; i < 4; i++) { const l = box(0.34, 0.02, 0.03, M.black_metal, Math.cos(i * 1.57) * 0.17, 0.02, Math.sin(i * 1.57) * 0.17); l.rotation.y = -i * 1.57; g.add(l); } g.userData.collide = [0.75, 0.75]; return g; };
F.vanity = ({ w, basins }) => { const g = new THREE.Group(); g.add(rbox(w, 0.32, 0.5, M.walnut, 0, 0.66, 0.25, 0.01)); g.add(box(0.006, 0.28, 0.48, M.stone_dark, 0, 0.66, 0.25));
  for (let i = 0; i < basins; i++) { const x = basins === 1 ? 0 : (i - 0.5) * w * 0.5; g.add(cyl(0.2, 0.15, 0.36, M.ceramic, x, 1.0, 0.25, 40)); g.add(cyl(0.16, 0.16, 0.02, std({ color: 0xdedbd6, roughness: 0.3 }), x, 1.17, 0.25)); const t = cyl(0.01, 0.01, 0.18, M.steel, x, 1.28, 0.09, 8); t.rotation.x = Math.PI / 2; g.add(t); g.add(cyl(0.02, 0.02, 0.04, M.steel, x, 1.28, 0.02).rotateX(Math.PI / 2)); }
  const s = mesh(new THREE.BoxGeometry(w - 0.1, 0.01, 0.02), E('led'), { cast: false, receive: false }); s.position.set(0, 0.49, 0.03); g.add(s); g.userData.collide = [w, 0.5]; return g; };
F.mirror = ({ w, h, z }) => { const g = new THREE.Group(); g.add(box(w, h, 0.02, M.mirror, 0, z, 0.01)); const s = mesh(new THREE.BoxGeometry(w, 0.01, 0.01), E('led'), { cast: false, receive: false }); s.position.set(0, z - h / 2 - 0.01, 0.005); g.add(s); return g; };
F.roundTub = ({ r }) => { const g = new THREE.Group(); g.add(cyl(r, r * 0.92, 0.6, M.ceramic, 0, 0.3, 0, 48)); g.add(cyl(r - 0.06, r - 0.1, 0.5, std({ color: 0xdfe6e8, roughness: 0.2 }), 0, 0.36, 0, 48)); g.add(cyl(0.01, 0.01, 0.9, M.steel, 0, 0.45, r + 0.12, 8)); g.userData.collide = [r * 2, r * 2]; return g; };
F.toilet = () => { const g = new THREE.Group(); g.add(rbox(0.38, 0.32, 0.55, M.ceramic, 0, 0.32, 0.12, 0.08)); g.add(rbox(0.3, 0.05, 0.08, M.steel, 0, 0.95, -0.03, 0.01)); return g; };
F.slats = ({ len }) => { const g = new THREE.Group(); const n = Math.round(len / 0.11); for (let i = 0; i < n; i++) g.add(box(0.04, H, 0.04, M.walnut, (i - (n - 1) / 2) * 0.11, H / 2, 0)); g.add(box(len, 0.06, 0.06, M.walnut, 0, H - 0.03, 0)); g.userData.collide = [len, 0.05]; return g; };
F.saunaBench = ({ w }) => { const g = new THREE.Group(); g.add(box(w, 0.06, 0.55, M.sauna, 0, 0.45, 0)); g.add(box(w, 0.06, 0.5, M.sauna, 0, 0.9, -0.5)); g.add(box(w, 0.04, 0.06, M.sauna, 0, 0.2, 0.25)); const s = mesh(new THREE.BoxGeometry(w - 0.1, 0.01, 0.03), E('led'), { cast: false, receive: false }); s.position.set(0, 0.42, 0.26); g.add(s); g.add(box(0.4, 0.35, 0.4, M.black_metal, w / 2 - 0.25, 0.18, -0.6)); return g; };
F.shower = () => { const g = new THREE.Group(); g.add(box(0.25, 0.02, 0.25, M.steel, 0, 2.15, 0)); g.add(cyl(0.012, 0.012, 0.3, M.steel, 0, 2.3, 0, 8)); g.add(cyl(0.012, 0.012, 1.2, M.steel, -0.5, 1.4, -0.5, 8)); g.add(cyl(0.03, 0.03, 0.04, M.steel, -0.5, 1.1, -0.5)); return g; };
F.car = () => { const g = new THREE.Group(); g.add(rbox(1.85, 0.6, 4.6, M.car, 0, 0.55, 0, 0.1)); g.add(rbox(1.7, 0.5, 2.6, M.car_glass, 0, 1.08, -0.1, 0.18)); g.add(box(1.75, 0.08, 2.5, M.car, 0, 1.34, -0.1)); for (const [x, z] of [[-0.8, 1.5], [0.8, 1.5], [-0.8, -1.5], [0.8, -1.5]]) { const t = cyl(0.33, 0.33, 0.22, M.tyre, x, 0.33, z, 24); t.rotation.z = Math.PI / 2; g.add(t); } g.userData.collide = [1.9, 4.7]; return g; };
F.outdoorTable = ({ w, d }) => { const g = new THREE.Group(); g.add(box(w, 0.04, d, std({ color: 0x8a8a86, roughness: 0.7 }), 0, 0.74, 0)); for (const [x, z] of [[-w / 2 + 0.1, -d / 2 + 0.1], [w / 2 - 0.1, -d / 2 + 0.1], [-w / 2 + 0.1, d / 2 - 0.1], [w / 2 - 0.1, d / 2 - 0.1]]) g.add(box(0.05, 0.72, 0.05, M.outdoor_frame, x, 0.36, z)); g.userData.collide = [w, d]; return g; };
F.outdoorChair = () => { const g = new THREE.Group(); g.add(rbox(0.48, 0.05, 0.46, M.outdoor_seat, 0, 0.45, 0, 0.02)); g.add(rbox(0.48, 0.4, 0.04, M.outdoor_seat, 0, 0.66, -0.21, 0.02)); for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) g.add(cyl(0.01, 0.01, 0.44, M.outdoor_frame, x, 0.22, z, 6)); return g; };
F.lounger = () => { const g = new THREE.Group(); g.add(rbox(0.7, 0.08, 1.4, M.outdoor_seat, 0, 0.36, 0.3, 0.03)); const b = rbox(0.7, 0.08, 0.7, M.outdoor_seat, 0, 0.55, -0.68, 0.03); b.rotation.x = -0.6; g.add(b); for (const [x, z] of [[-0.3, -0.5], [0.3, -0.5], [-0.3, 0.9], [0.3, 0.9]]) g.add(cyl(0.012, 0.012, 0.32, M.outdoor_frame, x, 0.16, z, 6)); g.userData.collide = [0.7, 2.0]; return g; };
F.fireBowl = () => { const g = new THREE.Group(); g.add(cyl(0.55, 0.4, 0.35, std({ color: 0x3a3a3a, roughness: 0.6, metalness: 0.5 }), 0, 0.18, 0, 32)); g.add(cyl(0.45, 0.45, 0.02, M.ember, 0, 0.34, 0)); const f = mesh(new THREE.ConeGeometry(0.2, 0.5, 8), E('warm'), { cast: false }); f.position.y = 0.55; g.add(f); g.userData.collide = [1.1, 1.1]; return g; };
F.rectTable = ({ w = 2.2, d = 1.0, top = 'walnut' }) => { const g = new THREE.Group(); g.add(box(w, 0.05, d, M[top], 0, 0.73, 0)); for (const s of [-1, 1]) { g.add(box(0.05, 0.71, d - 0.1, M.black_metal, s * (w / 2 - 0.15), 0.355, 0)); } g.userData.collide = [w, d]; return g; };
F.column = () => { const g = new THREE.Group(); g.add(cyl(0.07, 0.07, H + 0.1, M.black_metal, 0, H / 2 - 0.05, 0, 16)); g.userData.collide = [0.16, 0.16]; return g; };
F.spiralStair = ({ r, top }) => { const g = new THREE.Group(); const n = 18, rise = top / n; g.add(cyl(0.07, 0.07, top + 1.1, M.black_metal, 0, (top + 1.1) / 2, 0, 16));
  for (let i = 0; i < n; i++) { const a = i * (Math.PI * 1.55 / n); const s = mesh(new THREE.BoxGeometry(r - 0.06, 0.04, 0.26), M.black_metal); s.position.set(Math.cos(a) * (r / 2 + 0.03), (i + 1) * rise, -Math.sin(a) * (r / 2 + 0.03)); s.rotation.y = a; g.add(s); const t = box(r - 0.1, 0.03, 0.22, M.soffit, 0, 0.035, 0); s.add(t);
    const bal = cyl(0.008, 0.008, 1.0, M.black_metal, Math.cos(a) * (r - 0.03), (i + 1) * rise + 0.5, -Math.sin(a) * (r - 0.03), 6); g.add(bal); }
  const pts = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 1.55; pts.push(new THREE.Vector3(Math.cos(a) * (r - 0.03), 1.0 + i / 60 * (n * rise), -Math.sin(a) * (r - 0.03))); }
  g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.02, 8), M.black_metal)); g.userData.collide = [r * 2, r * 2]; return g; };

function buildFurniture() {
  for (const f of HOUSE.furniture) {
    const fn = F[f.type]; if (!fn) { console.warn('brak mebla', f.type); continue; }
    const g = fn(f); g.position.set(f.x, f.z ?? 0, -f.y); g.rotation.y = (f.rot || 0) * DEG;
    house.add(g);
    if (g.userData.collide && (f.z ?? 0) < 1) {
      const [w, d] = g.userData.collide; const rot = ((f.rot || 0) % 180 + 180) % 180; const swap = rot > 45 && rot < 135;
      const hw = (swap ? d : w) / 2, hd = (swap ? w : d) / 2;
      colRects.push([f.x - hw, f.y - hd, f.x + hw, f.y + hd]);
    }
  }
}

function kelvin(k) { return { 2200: 0xffb060, 2400: 0xffbe72, 2700: 0xffcf8e, 3000: 0xffd9a6, 3500: 0xffe5c0, 4000: 0xffefd8 }[k] || 0xffd9a6; }
function buildLights() {
  for (const l of HOUSE.lights) {
    let light;
    if (l.type === 'point') { light = new THREE.PointLight(kelvin(l.k), l.i, l.dist || 8, 2); light.position.copy(P(l.x, l.y)); light.position.y = l.z; }
    else { light = new THREE.SpotLight(kelvin(l.k), l.i, 12, l.angle || 0.6, 0.6, 2); light.position.copy(P(l.x, l.y)); light.position.y = l.z; light.target.position.copy(P(l.tx, l.ty)); light.target.position.y = l.tz; house.add(light.target); }
    house.add(light); lights.push({ light, base: l.i });
  }
}

function buildSite() {
  const s = HOUSE.site; if (!s) return;
  const lawnPiece = (rr) => { const q = rc(rr); if (q.w <= 0 || q.d <= 0) return; const m = mesh(planeGeo(q.w, q.d), M.grass, { cast: false }); m.rotation.x = -Math.PI / 2; m.position.set(q.x, -0.12, -q.y); house.add(m); };
  const L = [s.lawn[0] - 100, s.lawn[1] - 100, s.lawn[2] + 100, s.lawn[3] + 100];
  if (s.poolDeck) { const D = s.poolDeck; lawnPiece([L[0], L[1], L[2], D[1]]); lawnPiece([L[0], D[3], L[2], L[3]]); lawnPiece([L[0], D[1], D[0], D[3]]); lawnPiece([D[2], D[1], L[2], D[3]]); }
  else lawnPiece(L);
  if (s.fence) { const r = s.fence.rect, h = s.fence.h; const seg = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); const m = box(L, h + 0.3, 0.25, M[s.fence.mat], 0, 0, 0); m.position.set((a[0] + b[0]) / 2, h / 2 - 0.15, -(a[1] + b[1]) / 2); m.rotation.y = Math.atan2(dy, dx); house.add(m); addSeg(a[0], a[1], b[0], b[1], 0.2); };
    seg([r[0], r[1]], [r[2], r[1]]); seg([r[2], r[1]], [r[2], r[3]]); seg([r[2], r[3]], [r[0], r[3]]); seg([r[0], r[3]], [r[0], r[1]]); }
  if (s.pool) { const p = s.pool.rect, r = rc(p), d = s.pool.depth;
    const fl = mesh(planeGeo(r.w, r.d), M.pool_floor, { cast: false }); fl.rotation.x = -Math.PI / 2; fl.position.set(r.x, -d, -r.y); house.add(fl);
    house.add(box(r.w, d, 0.02, M.pool_floor, r.x, -d / 2, -p[1])); house.add(box(r.w, d, 0.02, M.pool_floor, r.x, -d / 2, -p[3])); house.add(box(0.02, d, r.d, M.pool_floor, p[0], -d / 2, -r.y)); house.add(box(0.02, d, r.d, M.pool_floor, p[2], -d / 2, -r.y));
    const w = mesh(planeGeo(r.w, r.d), M.water, { cast: false }); w.rotation.x = -Math.PI / 2; w.position.set(r.x, -0.3, -r.y); house.add(w);
    colRects.push(p);
    if (s.poolDeck) { const D = s.poolDeck; const strip = (rr) => { const q = rc(rr); const m = mesh(planeGeo(q.w, q.d), M.pavers, { cast: false }); m.rotation.x = -Math.PI / 2; m.position.set(q.x, -0.06, -q.y); house.add(m); };
      strip([D[0], D[1], D[2], p[1]]); strip([D[0], p[3], D[2], D[3]]); strip([D[0], p[1], p[0], p[3]]); strip([p[2], p[1], D[2], p[3]]); }
  }
  const rnd = mulberry(3);
  for (const [x, y, h] of s.trees || []) {
    const g = new THREE.Group(); g.add(cyl(0.12, 0.2, h * 0.45, M.bark, 0, h * 0.22, 0, 10));
    for (let i = 0; i < 5; i++) { const geo = new THREE.IcosahedronGeometry(h * 0.22 + rnd() * h * 0.08, 2); const p = geo.attributes.position; for (let k = 0; k < p.count; k++) p.setXYZ(k, p.getX(k) * (0.85 + rnd() * 0.3), p.getY(k) * (0.85 + rnd() * 0.3), p.getZ(k) * (0.85 + rnd() * 0.3)); geo.computeVertexNormals();
      const c = mesh(geo, i % 2 ? M.leaf : M.leaf2); c.position.set((rnd() - 0.5) * h * 0.4, h * 0.5 + rnd() * h * 0.3, (rnd() - 0.5) * h * 0.4); g.add(c); }
    g.position.set(x, -0.1, -y); house.add(g); colRects.push([x - 0.3, y - 0.3, x + 0.3, y + 0.3]);
  }
  for (const [x, y, r] of s.shrubs || []) { const geo = new THREE.IcosahedronGeometry(r, 2); const p = geo.attributes.position; for (let k = 0; k < p.count; k++) p.setXYZ(k, p.getX(k) * (0.8 + rnd() * 0.4), p.getY(k) * 0.6, p.getZ(k) * (0.8 + rnd() * 0.4)); geo.computeVertexNormals(); const m = mesh(geo, M.leaf); m.position.set(x, r * 0.3 - 0.1, -y); house.add(m); colRects.push([x - r, y - r, x + r, y + r]); }
}

// ======================================================================= niebo, słońce, czas
const sky = new Sky(); sky.scale.setScalar(2000); scene.add(sky);
const sun = new THREE.DirectionalLight(0xffffff, 3); sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.00035; sun.shadow.normalBias = 0.025;
const SC = sun.shadow.camera; SC.near = 1; SC.far = 160; SC.left = SC.bottom = -32; SC.right = SC.top = 32;
scene.add(sun); scene.add(sun.target);
const moon = new THREE.DirectionalLight(0x9db4d8, 0); moon.position.set(30, 50, -20); scene.add(moon);
const hemi = new THREE.HemisphereLight(0xbcd3ee, 0x6d6a5c, 0.6); scene.add(hemi);
const pmrem = new THREE.PMREMGenerator(renderer);
const skyScene = new THREE.Scene(); const skyCopy = new Sky(); skyCopy.scale.setScalar(2000); skyScene.add(skyCopy);
let envRT = null;
// gwiazdy
const stars = (() => { const n = 2200, pos = new Float32Array(n * 3), rnd = mulberry(9); for (let i = 0; i < n; i++) { const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = Math.sqrt(1 - u * u); pos.set([r * Math.cos(th) * 800, Math.abs(u) * 800 + 20, r * Math.sin(th) * 800], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const m = new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }); const p = new THREE.Points(g, m); p.frustumCulled = false; scene.add(p); return p; })();

const state = { hour: 14.5, date: new Date(2026, 5, 21), orient: 'W', lightsMode: 'auto', quality: new URLSearchParams(location.search).get('q') || 'high', roof: true, mode: 'walk', fov: 72, speed: 1 };

function dayOfYear(d) { const s = new Date(d.getFullYear(), 0, 0); return Math.floor((d - s) / 864e5); }
function tzOffset(d) { // Polska: CET/CEST (ostatnia niedziela marca / października)
  const y = d.getFullYear(); const last = (m) => { const t = new Date(y, m + 1, 0); return new Date(y, m, t.getDate() - t.getDay()); };
  return (d >= last(2) && d < last(9)) ? 2 : 1;
}
function sunPos(hourLocal, date, lat, lon) {
  const N = dayOfYear(date); const utc = hourLocal - tzOffset(date);
  const g = 2 * Math.PI / 365 * (N - 1 + (utc - 12) / 24);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const tst = utc * 60 + eqt + 4 * lon; const ha = (tst / 4 - 180) * DEG;
  const la = lat * DEG;
  const el = Math.asin(Math.sin(la) * Math.sin(decl) + Math.cos(la) * Math.cos(decl) * Math.cos(ha));
  let az = Math.acos(clamp((Math.sin(decl) - Math.sin(el) * Math.sin(la)) / (Math.cos(el) * Math.cos(la)), -1, 1));
  if (ha > 0) az = 2 * Math.PI - az;
  return { el, az };   // radiany; az od północy zgodnie z ruchem wskazówek
}
function sunTimes(date, lat, lon) { let rise = null, set = null, prev = null; for (let h = 0; h <= 24; h += 1 / 60) { const e = sunPos(h, date, lat, lon).el; if (prev != null) { if (prev < -0.0145 && e >= -0.0145) rise = h; if (prev >= -0.0145 && e < -0.0145) set = h; } prev = e; } return { rise, set }; }

let envTimer = 0;
function applySky(force = false) {
  const { lat, lon } = HOUSE.location; const { el, az } = sunPos(state.hour, state.date, lat, lon);
  const elDeg = el / DEG;
  const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
  const u = sky.material.uniforms; u.sunPosition.value.copy(dir);
  const low = smooth(25, -3, elDeg);   // 1 nisko / 0 wysoko
  u.turbidity.value = 3 + 6 * low; u.rayleigh.value = 1.2 + 2.5 * low; u.mieCoefficient.value = 0.004 + 0.02 * low; u.mieDirectionalG.value = 0.8 + 0.15 * low;
  const sc = skyCopy.material.uniforms; for (const k of ['sunPosition', 'turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG']) { if (k === 'sunPosition') sc[k].value.copy(u[k].value); else sc[k].value = u[k].value; }
  const day = smooth(-4, 6, elDeg);          // ile dnia
  const twilight = smooth(-14, -2, elDeg);   // zmierzch cywilny/żeglarski
  const warm = smooth(20, 2, elDeg);
  sun.color.setRGB(1, lerp(0.98, 0.62, warm), lerp(0.92, 0.32, warm));
  sun.intensity = 2.7 * smooth(-1, 10, elDeg) * (0.35 + 0.65 * smooth(0, 25, elDeg));
  sun.position.copy(dir).multiplyScalar(80).add(sun.target.position); sun.visible = elDeg > -2;
  moon.intensity = 0.06 * (1 - twilight);
  hemi.intensity = 0.1 + 0.32 * day + 0.08 * twilight;
  hemi.color.setRGB(lerp(0.16, 0.72, twilight) * (1 - 0.35 * warm * day), lerp(0.2, 0.8, twilight) * (1 - 0.2 * warm * day), lerp(0.35, 1.0, twilight));
  hemi.groundColor.setRGB(0.42 * (0.3 + 0.7 * day), 0.4 * (0.3 + 0.7 * day), 0.34 * (0.3 + 0.7 * day));
  scene.fog.color.setRGB(lerp(0.05, 0.75, twilight), lerp(0.06, 0.82, twilight), lerp(0.1, 0.9, twilight));
  stars.material.opacity = 1 - smooth(-16, -4, elDeg);
  renderer.toneMappingExposure = lerp(0.85, 0.5, day) + 0.25 * twilight * (1 - day);
  // światło sztuczne
  const auto = 1 - smooth(-1, 7, elDeg);
  const lf = state.lightsMode === 'on' ? 1 : state.lightsMode === 'off' ? 0 : auto;
  lampFactor.v = lf;
  for (const { light, base } of lights) light.intensity = base * 0.42 * lf;
  for (const [m, b] of emissives) m.emissiveIntensity = b * (0.06 + 0.94 * lf);
  // env map (odbicia) — z opóźnieniem, żeby suwak nie dławił GPU
  envTimer = force ? 0 : 0.15; if (force) rebuildEnv();
  ui.sunInfo(elDeg, az / DEG);
}
function rebuildEnv() { if (envRT) envRT.dispose(); envRT = pmrem.fromScene(skyScene, 0, 1, 3000); scene.environment = envRT.texture; }

// ======================================================================= sterowanie
const walk = new PointerLockControls(camera, document.body);
const orbit = new OrbitControls(camera, canvas); orbit.enabled = false; orbit.enableDamping = true; orbit.maxPolarAngle = Math.PI / 2 - 0.05;
let lockOK = true, dragging = null;
function tryLock() {
  if (state.mode !== 'walk') return;
  try { const p = document.body.requestPointerLock(); if (p && p.catch) p.catch(() => { lockOK = false; $('#hint').hidden = true; $('#toast').hidden = false; setTimeout(() => { $('#toast').hidden = true; }, 5000); }); }
  catch (e) { lockOK = false; $('#hint').hidden = true; }
}
canvas.addEventListener('mousedown', (e) => { if (state.mode !== 'walk' || document.pointerLockElement || e.button !== 0) return; dragging = [e.clientX, e.clientY]; });
addEventListener('mousemove', (e) => { if (!dragging) return; const dx = e.clientX - dragging[0], dy = e.clientY - dragging[1]; dragging = [e.clientX, e.clientY]; camera.rotation.order = 'YXZ'; camera.rotation.y -= dx * 0.0035; camera.rotation.x = clamp(camera.rotation.x - dy * 0.0035, -1.5, 1.5); });
addEventListener('mouseup', () => { dragging = null; });
const keys = {}; addEventListener('keydown', (e) => { keys[e.code] = true; if (e.code === 'KeyF' && document.pointerLockElement) toggleFly(); }); addEventListener('keyup', (e) => { keys[e.code] = false; });
let eyeZ = 0, fly = false; const EYE = 1.62; const PR = 0.24;
function toggleFly() { fly = !fly; }
const touch = { move: null, look: null, mx: 0, my: 0 };
canvas.addEventListener('touchstart', (e) => { for (const t of e.changedTouches) { const half = innerWidth / 2; if (t.clientX < half && !touch.move) touch.move = { id: t.identifier, x0: t.clientX, y0: t.clientY, x: t.clientX, y: t.clientY }; else if (!touch.look) touch.look = { id: t.identifier, x: t.clientX, y: t.clientY }; } }, { passive: true });
canvas.addEventListener('touchmove', (e) => { for (const t of e.changedTouches) { if (touch.move && t.identifier === touch.move.id) { touch.move.x = t.clientX; touch.move.y = t.clientY; } if (touch.look && t.identifier === touch.look.id) { const dx = t.clientX - touch.look.x, dy = t.clientY - touch.look.y; touch.look.x = t.clientX; touch.look.y = t.clientY; if (state.mode === 'walk') { camera.rotation.order = 'YXZ'; camera.rotation.y -= dx * 0.004; camera.rotation.x = clamp(camera.rotation.x - dy * 0.004, -1.5, 1.5); } } } }, { passive: true });
canvas.addEventListener('touchend', (e) => { for (const t of e.changedTouches) { if (touch.move && t.identifier === touch.move.id) touch.move = null; if (touch.look && t.identifier === touch.look.id) touch.look = null; } }, { passive: true });

// pozycja gracza w układzie rzutu
function worldToPlan(v) { const l = house.worldToLocal(v.clone()); return { x: l.x, y: -l.z, z: l.y }; }
function planToWorld(x, y, z = 0) { return house.localToWorld(new THREE.Vector3(x, z, -y)); }
function resolveCollision(px, py) {
  let x = px, y = py;
  for (let iter = 0; iter < 3; iter++) {
    for (const s of colSegs) { const vx = s.bx - s.ax, vy = s.by - s.ay, L2 = vx * vx + vy * vy; const tr = L2 > 0 ? ((x - s.ax) * vx + (y - s.ay) * vy) / L2 : 0; const t = clamp(tr, 0, 1); const cx = s.ax + vx * t, cy = s.ay + vy * t; let dx = x - cx, dy = y - cy; const d = Math.hypot(dx, dy), min = s.r + ((tr < 0 || tr > 1) ? PR * 0.35 : PR); if (d < min) { if (d < 1e-4) { dx = -vy; dy = vx; } const k = Math.hypot(dx, dy); x = cx + dx / k * min; y = cy + dy / k * min; } }
    for (const r of colRects) { const ex = r[0] - PR, ey = r[1] - PR, fx = r[2] + PR, fy = r[3] + PR; if (x > ex && x < fx && y > ey && y < fy) { const d = [x - ex, fx - x, y - ey, fy - y]; const i = d.indexOf(Math.min(...d)); if (i === 0) x = ex; else if (i === 1) x = fx; else if (i === 2) y = ey; else y = fy; } }
  }
  return { x, y };
}
function moveTo(roomId) {
  const r = HOUSE.rooms.find((q) => q.id === roomId); if (!r) return;
  eyeZ = r.z || 0;
  const w = planToWorld(r.spawn[0], r.spawn[1], eyeZ + EYE); camera.position.copy(w);
  lookPlan(r.look[0], r.look[1]);
  if (state.mode === 'orbit') setMode('walk');
}
function lookPlan(dx, dy) { const d = new THREE.Vector3(dx, 0, -dy).applyQuaternion(house.quaternion); camera.rotation.order = 'YXZ'; camera.rotation.set(0, Math.atan2(-d.x, -d.z), 0); }

function setMode(m) {
  state.mode = m; $('#mode').value = m;
  if (m === 'orbit') { walk.unlock(); orbit.enabled = true; const c = planToWorld(...(HOUSE.center || [10, 1]), 1); orbit.target.copy(c); camera.position.copy(c).add(new THREE.Vector3(28, 30, 36)); orbit.update(); roofGroup.visible = state.roof; ceilGroup.visible = state.roof; $('#hint').hidden = true; }
  else { orbit.enabled = false; roofGroup.visible = true; ceilGroup.visible = true; moveTo($('#room').value); }
}

// ======================================================================= UI
const ui = {
  sunInfo(el, az) { const t = sunTimes(state.date, HOUSE.location.lat, HOUSE.location.lon); const fmt = (h) => { if (h == null) return '—'; const m = Math.round(h * 60); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
    $('#suninfo').textContent = el > -0.8 ? `Słońce: wys. ${el.toFixed(0)}°, azymut ${az.toFixed(0)}° · wschód ${fmt(t.rise)} · zachód ${fmt(t.set)}` : `Noc · wschód ${fmt(t.rise)} · zachód ${fmt(t.set)}`; },
};
function fmtHour(h) { const m = Math.round(h * 60); return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }
function initUI() {
  const sel = $('#room'); for (const r of HOUSE.rooms) { const o = document.createElement('option'); o.value = r.id; o.textContent = r.name; sel.appendChild(o); }
  sel.value = HOUSE.start.room; sel.addEventListener('change', () => { moveTo(sel.value); sel.blur(); });
  const time = $('#time'); time.value = state.hour; $('#clock').textContent = fmtHour(state.hour);
  time.addEventListener('input', () => { state.hour = +time.value; $('#clock').textContent = fmtHour(state.hour); applySky(); });
  const date = $('#date'); date.value = '2026-06-21'; date.addEventListener('change', () => { const [y, m, d] = date.value.split('-').map(Number); state.date = new Date(y, m - 1, d); applySky(true); });
  for (const b of document.querySelectorAll('#orient button')) b.addEventListener('click', () => { state.orient = b.dataset.d; setOrientation(); for (const q of document.querySelectorAll('#orient button')) q.classList.toggle('on', q === b); });
  $('#mode').addEventListener('change', (e) => setMode(e.target.value));
  $('#lights').addEventListener('change', (e) => { state.lightsMode = e.target.value; applySky(); });
  $('#quality').addEventListener('change', (e) => { state.quality = e.target.value; setQuality(); });
  $('#roof').addEventListener('change', (e) => { state.roof = e.target.checked; if (state.mode === 'orbit') { roofGroup.visible = state.roof; ceilGroup.visible = state.roof; } });
  $('#fov').addEventListener('input', (e) => { camera.fov = +e.target.value; camera.updateProjectionMatrix(); });
  $('#panelToggle').addEventListener('click', () => $('#panel').classList.toggle('open'));
  $('#hint .card').addEventListener('click', () => { $('#hint').hidden = true; tryLock(); });
  canvas.addEventListener('click', () => { if (state.mode === 'walk' && lockOK && !document.pointerLockElement) tryLock(); });
  walk.addEventListener('lock', () => { $('#hint').hidden = true; });
  walk.addEventListener('unlock', () => { if (state.mode === 'walk' && lockOK) $('#hint').hidden = false; });
  $('#house-name').textContent = HOUSE.name; $('#house-meta').textContent = `${HOUSE.author} · ${HOUSE.location.name} ${HOUSE.location.lat.toFixed(2)}°N`;
  document.title = HOUSE.name + ' · spacer 3D';
  for (const c of ['#time', '#date', '#room']) $(c).addEventListener('keydown', (e) => e.stopPropagation());
}
function setOrientation() {
  const dirs = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };   // kierunki świata w lokalnym układzie three (x, z)
  const planSide = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }[HOUSE.entranceSide || 'S'];
  const t = dirs[state.orient];
  const pos = worldToPlan(camera.position); const fwd = new THREE.Vector3(); camera.getWorldDirection(fwd); const lf = fwd.applyQuaternion(house.quaternion.clone().invert());
  house.rotation.y = Math.atan2(t[0], t[1]) - Math.atan2(planSide[0], planSide[1]);
  house.updateMatrixWorld(true);
  sun.target.position.copy(planToWorld(...(HOUSE.center || [10, 1]), 0)); sun.target.updateMatrixWorld();
  camera.position.copy(planToWorld(pos.x, pos.y, pos.z)); lookPlan(lf.x, -lf.z);
  drawMinimapBase(); applySky();
}

// ======================================================================= post-processing
let composer, gtao;
function setupPost() {
  const rt = new THREE.WebGLRenderTarget(innerWidth, innerHeight, { samples: 4, type: THREE.HalfFloatType });
  composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  gtao = new GTAOPass(scene, camera, innerWidth, innerHeight); gtao.output = GTAOPass.OUTPUT.Default;
  gtao.updateGtaoMaterial({ radius: 0.32, distanceExponent: 1, thickness: 1, scale: 1.2, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 4, radiusExponent: 1, rings: 2, samples: 12 });
  gtao.blendIntensity = 1.0;
  composer.addPass(gtao);
  composer.addPass(new OutputPass());
  setQuality();
}
function setQuality() {
  const hi = state.quality === 'high';
  gtao.enabled = hi; renderer.setPixelRatio(Math.min(devicePixelRatio, hi ? 2 : 1.25));
  sun.shadow.mapSize.set(hi ? 4096 : 2048, hi ? 4096 : 2048); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  onResize();
}
function onResize() { const w = innerWidth, h = innerHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); composer?.setSize(w, h); }
addEventListener('resize', onResize);

// ======================================================================= minimapa
const mm = $('#minimap'), mctx = mm.getContext('2d'); let mmBase = null; const MMS = 5.2;
let mmOrigin = [0, 0];
function drawMinimapBase() {
  const b = HOUSE.mapBounds || [-10, -10.5, 32, 12.5]; mmOrigin = [b[0], b[3]];
  const W = Math.round((b[2] - b[0]) * MMS), Hh = Math.round((b[3] - b[1]) * MMS); mm.width = W * 2; mm.height = Hh * 2; mm.style.width = W + 'px'; mm.style.height = Hh + 'px';
  const c = document.createElement('canvas'); c.width = W * 2; c.height = Hh * 2; const g = c.getContext('2d'); g.scale(2, 2);
  const X = (x) => (x - b[0]) * MMS, Y = (y) => (b[3] - y) * MMS;
  g.fillStyle = 'rgba(28,27,25,0.82)'; g.fillRect(0, 0, W, Hh);
  for (const r of HOUSE.rooms) { if (r.outdoor) continue; g.fillStyle = 'rgba(214,205,190,0.10)'; g.fillRect(X(r.rect[0]), Y(r.rect[3]), (r.rect[2] - r.rect[0]) * MMS, (r.rect[3] - r.rect[1]) * MMS); }
  g.strokeStyle = 'rgba(239,233,224,0.85)'; g.lineCap = 'round';
  for (const w of HOUSE.walls) { g.lineWidth = Math.max(1, w.t * MMS); g.beginPath(); g.moveTo(X(w.a[0]), Y(w.a[1])); g.lineTo(X(w.b[0]), Y(w.b[1])); g.stroke(); }
  g.font = '7px sans-serif'; g.fillStyle = 'rgba(239,233,224,0.6)';
  for (const r of HOUSE.rooms) { if (r.outdoor) continue; const n = r.name.split('·')[0].trim(); g.fillText(n, X(r.rect[0]) + 2, Y(r.rect[3]) + 8); }
  // róża wiatrów: gdzie jest północ w układzie rzutu
  const th = house.rotation.y; const nx = Math.sin(th), ny = Math.cos(th);
  g.save(); g.translate(W - 16, 16); g.strokeStyle = '#c8a06a'; g.fillStyle = '#c8a06a'; g.lineWidth = 1.2; g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(nx * 9, -ny * 9); g.lineTo(-ny * 3 + nx * 0, -nx * 3); g.lineTo(ny * 3, nx * 3); g.closePath(); g.fill(); g.font = 'bold 7px sans-serif'; g.fillText('N', nx * 13 - 2, -ny * 13 + 3); g.restore();
  mmBase = c;
}
function drawMinimap() {
  if (!mmBase) return; mctx.setTransform(1, 0, 0, 1, 0, 0); mctx.drawImage(mmBase, 0, 0); mctx.scale(2, 2);
  const p = worldToPlan(camera.position); const f = new THREE.Vector3(); camera.getWorldDirection(f); const lf = f.applyQuaternion(house.quaternion.clone().invert());
  const x = (p.x - mmOrigin[0]) * MMS, y = (mmOrigin[1] - p.y) * MMS; const a = Math.atan2(-lf.z, lf.x);
  mctx.fillStyle = 'rgba(200,160,106,0.28)'; mctx.beginPath(); mctx.moveTo(x, y); mctx.arc(x, y, 22, -a - 0.5, -a + 0.5); mctx.closePath(); mctx.fill();
  mctx.fillStyle = '#c8a06a'; mctx.beginPath(); mctx.arc(x, y, 3, 0, Math.PI * 2); mctx.fill();
}

// ======================================================================= pętla
const clock = new THREE.Clock();
function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (state.mode === 'walk') {
    const run = keys.ShiftLeft || keys.ShiftRight; const sp = (run ? 4.2 : 2.2) * state.speed;
    let fx = 0, fz = 0; if (keys.KeyW || keys.ArrowUp) fz += 1; if (keys.KeyS || keys.ArrowDown) fz -= 1; if (keys.KeyA || keys.ArrowLeft) fx -= 1; if (keys.KeyD || keys.ArrowRight) fx += 1;
    if (touch.move) { fx += clamp((touch.move.x - touch.move.x0) / 40, -1, 1); fz -= clamp((touch.move.y - touch.move.y0) / 40, -1, 1); }
    if (fx || fz) {
      const dir = new THREE.Vector3(); camera.getWorldDirection(dir); dir.y = 0; dir.normalize(); const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));
      const step = dir.multiplyScalar(fz * sp * dt).add(right.multiplyScalar(fx * sp * dt));
      const nw = camera.position.clone().add(step); const pl = worldToPlan(nw);
      const res = fly ? pl : resolveCollision(pl.x, pl.y);
      camera.position.copy(planToWorld(res.x, res.y, pl.z));
    }
    if (fly) { if (keys.KeyE || keys.Space) camera.position.y += sp * dt; if (keys.KeyQ || keys.KeyC) camera.position.y -= sp * dt; }
    else camera.position.y = eyeZ + EYE;
  } else orbit.update();
  if (envTimer > 0) { envTimer -= dt; if (envTimer <= 0) rebuildEnv(); }
  if (innerWidth > 0 && innerHeight > 0) { if (renderer.domElement.width !== Math.floor(innerWidth * renderer.getPixelRatio())) onResize(); composer.render(); }
  drawMinimap();
  requestAnimationFrame(animate);
}

// ======================================================================= start
async function main() {
  const hs = $('#houseSel');
  const hp = new URLSearchParams(location.hash.slice(1)).get('house') || new URLSearchParams(location.search).get('house');
  let saved = null; try { saved = localStorage.getItem('house'); } catch (e) {}
  const id = hp || saved || 'hk88';
  if (hs) { hs.value = id; if (hs.value !== id) hs.value = 'hk88'; hs.addEventListener('change', () => { try { localStorage.setItem('house', hs.value); } catch (e) {} location.hash = 'house=' + hs.value; location.reload(); }); }
  const cb = new URLSearchParams(location.search).get('v');
  HOUSE = (await import(`./${id}.js` + (cb ? `?v=${cb}` : ''))).default; H = HOUSE.ceiling;
  defineMaterials();
  buildFloors(); buildCeilings(); for (const w of HOUSE.walls) buildWall(w); buildBoxes(); buildRoof(); buildFurniture(); buildLights(); buildSite();
  // kontrola: meble/zabudowy blokujące przejścia (log w konsoli)
  for (const p of passages) { const nx = -p.uy, ny = p.ux; for (const s of [-1, 1]) { const qx = p.x + nx * s * 0.7, qy = p.y + ny * s * 0.7; for (const r of colRects) if (qx > r[0] - 0.15 && qx < r[2] + 0.15 && qy > r[1] - 0.15 && qy < r[3] + 0.15) console.warn('Przejście zasłonięte', p.x.toFixed(2), p.y.toFixed(2), 'przez', r.map((v) => +v.toFixed(2)).join(',')); } }
  setupPost(); initUI();
  state.orient = 'W'; setOrientation(); document.querySelector('#orient button[data-d="W"]').classList.add('on');
  moveTo(HOUSE.start.room);
  applySky(true);
  onResize();
  $('#loading').hidden = true;
  animate();
}
window.__app = { moveTo, resolveCollision, pos: () => worldToPlan(camera.position), walk: (dx, dy, n = 40) => { let p = worldToPlan(camera.position); for (let i = 0; i < n; i++) { p = resolveCollision(p.x + dx, p.y + dy); } camera.position.copy(planToWorld(p.x, p.y, eyeZ + EYE)); return p; } };
main().catch((e) => { console.error(e); $('#loading').textContent = 'Błąd: ' + e.message; });
