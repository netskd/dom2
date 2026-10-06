// Realistyczne kształty wyposażenia — rejestrowane w katalogu mebli silnika (F.*).
// Zamiast prostopadłościanów: miękka tapicerka (zaokrąglone bryły z deformacją siatki),
// toczone sanitariaty (LatheGeometry), gięte oparcia, liście z łukowanych płatów.

export function registerShapes(ctx) {
  const { THREE, RoundedBoxGeometry, M, E, F, mesh, box, rbox, cyl, std, mulberry, ceilH } = ctx;
  const PI = Math.PI;

  // ---------------------------------------------------------------- narzędzia
  // miękka poducha: zaokrąglone pudełko z lekkim „wybrzuszeniem" i nierównością krawędzi
  function cushion(w, h, d, mat, { bulge = 0.06, noise = 0.008, seed = 1, seg = 4, r = null } = {}) {
    const rad = r ?? Math.min(w, h, d) * 0.32;
    const g = new RoundedBoxGeometry(w, h, d, seg, rad);
    const p = g.attributes.position;
    const hx = w / 2, hy = h / 2, hz = d / 2;
    // szum liczony z POZYCJI (nie z indeksu), żeby zdublowane wierzchołki na szwach
    // dostały identyczne przesunięcie i siatka nie pękała
    const ph = seed * 1.37;
    const wob = (x, y, z) => Math.sin(x * 9.1 + ph) * Math.cos(z * 7.7 - ph) * 0.6 + Math.sin((x + z) * 5.3 + y * 4.1 + ph) * 0.4;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const fx = 1 - (Math.abs(y) / hy) ** 2;
      const fy = (1 - (Math.abs(x) / hx) ** 2) * (1 - (Math.abs(z) / hz) ** 2);
      const n = wob(x, y, z) * noise;
      p.setXYZ(i, x * (1 + bulge * fx) + n, y * (1 + bulge * 0.35 * fy) + n * 0.5, z * (1 + bulge * fx) + n);
    }
    g.computeVertexNormals();
    return mesh(g, mat);
  }
  // koc / narzuta: płat z fałdami
  function throwCloth(w, d, mat, { seed = 3, fold = 0.035, drop = 0.18 } = {}) {
    const g = new THREE.PlaneGeometry(w, d, 28, 28);
    const p = g.attributes.position, rnd = mulberry(seed);
    const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const u = x / w + 0.5, v = y / d + 0.5;
      let z = Math.sin(u * 11 + ph[0]) * fold + Math.sin(v * 7 + ph[1]) * fold * 0.7 + Math.sin((u + v) * 17 + ph[2]) * fold * 0.4;
      z -= Math.max(0, (Math.abs(x) / (w / 2) - 0.82)) * drop * 6;   // opad przy krawędziach
      p.setZ(i, z);
    }
    g.computeVertexNormals();
    const m = mesh(g, mat); m.rotation.x = -PI / 2; return m;
  }
  // profil obrotowy (wanna, umywalka, klosz)
  function lathe(points, mat, seg = 48, { cast = true } = {}) {
    const g = new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), seg);
    g.computeVertexNormals();
    return mesh(g, mat, { cast });
  }
  // wygięty płat (oparcie kubełkowe, liść)
  function curvedPanel(w, h, thick, mat, { curve = 0.25, segs = 14, taper = 0 } = {}) {
    const g = new THREE.BoxGeometry(w, h, thick, segs, 6, 1);
    const p = g.attributes.position, hx = w / 2, hy = h / 2;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const t = x / hx;
      const narrow = 1 - taper * (y / hy + 1) * 0.5;
      p.setXYZ(i, x * narrow, y, z + curve * (t * t));
    }
    g.computeVertexNormals();
    return mesh(g, mat);
  }
  const legTaper = (r0, r1, h, mat, x, y, z, seg = 10) => cyl(r0, r1, h, mat, x, y, z, seg);

  // ================================================================ SALON
  // sofa narożna (jak na wizualizacjach: niskie siedzisko, pękate oparcia, szerokie podłokietniki)
  F.sofaL = ({ w = 3.6, d = 2.4, arm = 0.34, mat = 'fabric', side = 'L' }) => {
    const g = new THREE.Group(); const m = M[mat];
    const legH = 0.1, baseH = 0.26, seatY = legH + baseH;
    const dMain = 1.0;                                   // głębokość prostego członu
    const s = side === 'L' ? 1 : -1;                     // kierunek narożnika
    // podstawy
    g.add(rbox(w, baseH, dMain, m, 0, legH + baseH / 2, -(d - dMain) / 2, 0.05));
    g.add(rbox(dMain, baseH, d - dMain, m, s * (w - dMain) / 2, legH + baseH / 2, dMain / 2, 0.05));
    // siedziska
    const nSeat = Math.max(2, Math.round((w - arm) / 0.95));
    for (let i = 0; i < nSeat; i++) {
      const cw = (w - arm) / nSeat - 0.03;
      const c = cushion(cw, 0.2, dMain - 0.12, m, { seed: 11 + i, bulge: 0.08 });
      c.position.set(-s * arm / 2 + (i - (nSeat - 1) / 2) * (w - arm) / nSeat, seatY + 0.1, -(d - dMain) / 2 + 0.02);
      g.add(c);
    }
    const nSide = Math.max(1, Math.round((d - dMain - arm) / 0.95));
    for (let i = 0; i < nSide; i++) {
      const cd = (d - dMain - arm) / nSide - 0.03;
      const c = cushion(dMain - 0.12, 0.2, cd, m, { seed: 31 + i, bulge: 0.08 });
      c.position.set(s * (w - dMain) / 2, seatY + 0.1, dMain / 2 + (i - (nSide - 1) / 2) * (d - dMain - arm) / nSide + arm / 2);
      g.add(c);
    }
    // oparcia (pękate poduchy odchylone do tyłu)
    for (let i = 0; i < nSeat; i++) {
      const cw = (w - arm) / nSeat - 0.05;
      const b = cushion(cw, 0.58, 0.28, m, { seed: 51 + i, bulge: 0.13, noise: 0.012 });
      b.position.set(-s * arm / 2 + (i - (nSeat - 1) / 2) * (w - arm) / nSeat, seatY + 0.40, -(d - dMain) / 2 - dMain / 2 + 0.2);
      b.rotation.x = -0.09; g.add(b);
    }
    for (let i = 0; i < nSide; i++) {
      const cd = (d - dMain - arm) / nSide - 0.05;
      const b = cushion(0.28, 0.58, cd, m, { seed: 71 + i, bulge: 0.13, noise: 0.012 });
      b.position.set(s * (w / 2 - 0.22), seatY + 0.46, dMain / 2 + (i - (nSide - 1) / 2) * (d - dMain - arm) / nSide + arm / 2);
      b.rotation.z = s * 0.09; g.add(b);
    }
    // podłokietniki
    const a1 = cushion(arm, 0.42, dMain, m, { seed: 91, bulge: 0.05, r: arm * 0.42 });
    a1.position.set(-s * (w - arm) / 2, seatY + 0.18, -(d - dMain) / 2); g.add(a1);
    const a2 = cushion(dMain, 0.42, arm, m, { seed: 92, bulge: 0.05, r: arm * 0.42 });
    a2.position.set(s * (w - dMain) / 2, seatY + 0.18, d / 2 - arm / 2); g.add(a2);
    // poduszki dekoracyjne + narzuta
    const pil = (x, z, mm, rot) => { const p = cushion(0.5, 0.5, 0.17, M[mm], { seed: 101 + x * 10, bulge: 0.2, noise: 0.02 }); p.position.set(x, seatY + 0.36, z); p.rotation.set(-0.3, rot, 0.1); g.add(p); };
    pil(-s * (w / 2 - 0.75), -(d - dMain) / 2 + 0.22, 'fabric_grey', 0.2);
    pil(-s * (w / 2 - 1.5), -(d - dMain) / 2 + 0.22, 'fabric_light', -0.15);
    const th = throwCloth(1.1, 0.95, M.fabric_grey, { seed: 7, fold: 0.03 });
    th.position.set(s * (w / 2 - 1.0), seatY + 0.23, -(d - dMain) / 2 + 0.1); th.rotation.z = 0.25; g.add(th);
    // nóżki
    for (const [x, z] of [[-w / 2 + 0.12, -(d - dMain) / 2 - dMain / 2 + 0.12], [w / 2 - 0.12, -(d - dMain) / 2 - dMain / 2 + 0.12],
      [-w / 2 + 0.12, -(d - dMain) / 2 + dMain / 2 - 0.12], [s * (w / 2 - 0.12), d / 2 - 0.12]])
      g.add(legTaper(0.022, 0.026, legH, M.black_metal, x, legH / 2, z, 8));
    g.userData.collide = [w, d];
    return g;
  };
  // sofa prosta, miękka
  F.sofaSoft = ({ w = 2.6, d = 1.0, mat = 'fabric' }) => {
    const g = new THREE.Group(); const m = M[mat];
    const legH = 0.1, baseH = 0.26, seatY = legH + baseH, arm = 0.3;
    g.add(rbox(w, baseH, d, m, 0, legH + baseH / 2, 0, 0.05));
    const n = Math.max(2, Math.round((w - 2 * arm) / 0.9));
    for (let i = 0; i < n; i++) {
      const cw = (w - 2 * arm) / n - 0.03;
      const c = cushion(cw, 0.2, d - 0.14, m, { seed: 201 + i, bulge: 0.08 });
      c.position.set((i - (n - 1) / 2) * (w - 2 * arm) / n, seatY + 0.1, 0.02); g.add(c);
      const b = cushion(cw, 0.5, 0.24, m, { seed: 221 + i, bulge: 0.14, noise: 0.016 });
      b.position.set((i - (n - 1) / 2) * (w - 2 * arm) / n, seatY + 0.42, -(d - 0.28) / 2); b.rotation.x = -0.09; g.add(b);
    }
    for (const s of [-1, 1]) { const a = cushion(arm, 0.4, d, m, { seed: 241 + s, bulge: 0.05, r: arm * 0.42 }); a.position.set(s * (w - arm) / 2, seatY + 0.17, 0); g.add(a); }
    const p = cushion(0.46, 0.46, 0.16, M.fabric_grey, { seed: 260, bulge: 0.2 }); p.position.set(-w / 4, seatY + 0.34, -(d - 0.5) / 2); p.rotation.set(-0.3, 0.2, 0.08); g.add(p);
    for (const [x, z] of [[-w / 2 + 0.12, -d / 2 + 0.12], [w / 2 - 0.12, -d / 2 + 0.12], [-w / 2 + 0.12, d / 2 - 0.12], [w / 2 - 0.12, d / 2 - 0.12]])
      g.add(legTaper(0.022, 0.026, legH, M.black_metal, x, legH / 2, z, 8));
    g.userData.collide = [w, d]; return g;
  };
  // krzesło tapicerowane kubełkowe
  F.chairUph = ({ mat = 'fabric_sand', legs = 'black_metal' }) => {
    const g = new THREE.Group(); const m = M[mat];
    const seat = cushion(0.48, 0.12, 0.46, m, { seed: 301, bulge: 0.07, r: 0.08 });
    seat.position.y = 0.45; g.add(seat);
    const back = curvedPanel(0.48, 0.44, 0.1, m, { curve: 0.1, taper: 0.12 });
    back.position.set(0, 0.73, -0.2); back.rotation.x = -0.12; g.add(back);
    // boczne „ramiona" kubełka
    for (const s of [-1, 1]) {
      const w2 = curvedPanel(0.2, 0.26, 0.09, m, { curve: 0.06 });
      w2.position.set(s * 0.21, 0.62, -0.11); w2.rotation.y = s * 1.15; g.add(w2);
    }
    for (const [x, z] of [[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]]) {
      const l = legTaper(0.011, 0.016, 0.45, M[legs], x, 0.225, z, 8);
      l.rotation.set(-z * 0.12, 0, x * 0.12); g.add(l);
    }
    return g;
  };
  F.barStoolUph = ({ n = 3, gap = 0.62, mat = 'fabric_sand' }) => {
    const g = new THREE.Group();
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * gap, s = new THREE.Group(); s.position.x = x;
      const seat = cushion(0.42, 0.11, 0.4, M[mat], { seed: 401 + i, bulge: 0.08, r: 0.09 });
      seat.position.y = 0.67; s.add(seat);
      const back = curvedPanel(0.4, 0.3, 0.09, M[mat], { curve: 0.09, taper: 0.1 });
      back.position.set(0, 0.86, -0.17); back.rotation.x = -0.1; s.add(back);
      for (const [dx, dz] of [[-0.15, -0.14], [0.15, -0.14], [-0.15, 0.14], [0.15, 0.14]]) {
        const l = legTaper(0.011, 0.015, 0.67, M.black_metal, dx, 0.335, dz, 8);
        l.rotation.set(-dz * 0.1, 0, dx * 0.1); s.add(l);
      }
      s.add(box(0.3, 0.014, 0.014, M.black_metal, 0, 0.21, 0.145));
      g.add(s);
    }
    return g;
  };
  // stół jadalniany: drewniany blat z fazą + metalowe płaskowniki
  F.tableWood = ({ w = 2.4, d = 1.0, top = 'walnut', legs = 'black_metal' }) => {
    const g = new THREE.Group();
    g.add(rbox(w, 0.045, d, M[top], 0, 0.735, 0, 0.012));
    g.add(box(w - 0.1, 0.03, d - 0.08, M[top], 0, 0.70, 0));
    for (const s of [-1, 1]) {
      g.add(box(0.035, 0.69, d - 0.22, M[legs], s * (w / 2 - 0.22), 0.345, 0));
      g.add(box(0.035, 0.025, d - 0.18, M[legs], s * (w / 2 - 0.22), 0.012, 0));
    }
    g.add(box(w - 0.8, 0.03, 0.035, M[legs], 0, 0.62, 0));
    g.userData.collide = [w, d]; return g;
  };
  // stolik kawowy: dwupoziomowy, szklany na czarnej ramie
  F.glassTableTwo = ({ w = 1.25, d = 0.72 }) => {
    const g = new THREE.Group();
    const top = mesh(new THREE.BoxGeometry(w, 0.012, d), M.glass, { cast: false }); top.position.y = 0.42; g.add(top);
    const low = mesh(new THREE.BoxGeometry(w - 0.26, 0.01, d - 0.2), M.glass, { cast: false }); low.position.set(0.06, 0.15, 0); g.add(low);
    const bar = (x1, z1, x2, z2, y) => { const dx = x2 - x1, dz = z2 - z1, L = Math.hypot(dx, dz);
      const b = box(L, 0.02, 0.02, M.black_metal, (x1 + x2) / 2, y, (z1 + z2) / 2); b.rotation.y = Math.atan2(-dz, dx); g.add(b); };
    const hx = w / 2 - 0.03, hz = d / 2 - 0.03;
    for (const [x, z] of [[-hx, -hz], [hx, -hz], [-hx, hz], [hx, hz]]) g.add(box(0.02, 0.42, 0.02, M.black_metal, x, 0.21, z));
    bar(-hx, -hz, hx, -hz, 0.41); bar(-hx, hz, hx, hz, 0.41); bar(-hx, -hz, -hx, hz, 0.41); bar(hx, -hz, hx, hz, 0.41);
    bar(-hx + 0.13, -hz + 0.1, hx - 0.13, -hz + 0.1, 0.14); bar(-hx + 0.13, hz - 0.1, hx - 0.13, hz - 0.1, 0.14);
    // drobiazgi na blacie
    g.add(box(0.24, 0.035, 0.18, std({ color: 0xe8e3d8, roughness: 0.9 }), -w * 0.22, 0.443, 0.04));
    g.add(lathe([[0, 0], [0.055, 0], [0.06, 0.02], [0.045, 0.1], [0.05, 0.13], [0.049, 0.13]], M.glass, 24, { cast: false }).translateX(w * 0.26).translateY(0.426).translateZ(-0.02));
    return g;
  };
  // ================================================================ SYPIALNIA
  F.bedReal = ({ w = 1.8, d = 2.1, head = 'fabric_light', linen = 'bedding' }) => {
    const g = new THREE.Group();
    const frameH = 0.26;
    g.add(rbox(w + 0.12, frameH, d + 0.06, M.wenge, 0, frameH / 2 + 0.06, 0, 0.02));
    // materac
    const mat = cushion(w, 0.24, d, M[linen], { seed: 501, bulge: 0.04, r: 0.06 });
    mat.position.y = frameH + 0.18; g.add(mat);
    // kołdra z fałdami
    const duvet = cushion(w + 0.06, 0.16, d * 0.62, M[linen], { seed: 503, bulge: 0.1, noise: 0.02, r: 0.07 });
    duvet.position.set(0, frameH + 0.36, d * 0.17); g.add(duvet);
    // narzuta w nogach
    const thr = throwCloth(w * 0.95, d * 0.3, M.fabric_grey, { seed: 511, fold: 0.03 });
    thr.position.set(0, frameH + 0.42, d * 0.34); g.add(thr);
    // poduszki
    for (const s of [-1, 1]) {
      const p = cushion(0.62, 0.17, 0.42, M[linen], { seed: 521 + s, bulge: 0.22, noise: 0.02, r: 0.1 });
      p.position.set(s * 0.42, frameH + 0.44, -d / 2 + 0.34); p.rotation.set(-0.42, 0, 0); g.add(p);
      const p2 = cushion(0.5, 0.14, 0.34, M.fabric_light, { seed: 531 + s, bulge: 0.2, noise: 0.018, r: 0.09 });
      p2.position.set(s * 0.42, frameH + 0.4, -d / 2 + 0.52); p2.rotation.set(-0.2, 0, 0); g.add(p2);
    }
    // zagłówek — pikowana tapicerka
    const hb = new THREE.Group(); hb.position.set(0, 0, -d / 2 - 0.08);
    hb.add(rbox(w + 0.2, 0.95, 0.12, M[head], 0, 0.95, 0, 0.05));
    const cols = Math.max(2, Math.round((w + 0.2) / 0.45));
    for (let i = 0; i < cols; i++) for (let j = 0; j < 2; j++) {
      const q = cushion((w + 0.2) / cols - 0.04, 0.42, 0.1, M[head], { seed: 541 + i * 3 + j, bulge: 0.18, noise: 0.01, r: 0.06 });
      q.position.set((i - (cols - 1) / 2) * (w + 0.2) / cols, 0.72 + j * 0.46, 0.07); hb.add(q);
    }
    g.add(hb);
    for (const [x, z] of [[-w / 2, -d / 2 + 0.1], [w / 2, -d / 2 + 0.1], [-w / 2, d / 2 - 0.1], [w / 2, d / 2 - 0.1]])
      g.add(legTaper(0.025, 0.03, 0.06, M.black_metal, x, 0.03, z, 8));
    g.userData.collide = [w + 0.2, d + 0.3]; return g;
  };
  // ================================================================ ŁAZIENKA
  F.tubOval = ({ w = 1.7, d = 0.8, h = 0.56, mat = 'ceramic' }) => {
    const g = new THREE.Group();
    const prof = [[0, 0], [0.46, 0], [0.5, 0.04], [0.5, h - 0.02], [0.48, h], [0.44, h - 0.03], [0.44, 0.09], [0.4, 0.06], [0, 0.06]];
    const body = lathe(prof, M[mat], 56);
    body.scale.set(w / 1.0, 1, d / 1.0); g.add(body);
    const water = mesh(new THREE.CircleGeometry(0.42, 48), std({ color: 0xdfeaef, roughness: 0.08, envMapIntensity: 1.2 }), { cast: false });
    water.rotation.x = -PI / 2; water.position.y = h - 0.1; water.scale.set(w, d, 1); g.add(water);
    g.userData.collide = [w, d]; return g;
  };
  F.basinOval = ({ w = 0.55, d = 0.38, h = 0.14, mat = 'ceramic' }) => {
    const prof = [[0, 0.02], [0.2, 0.01], [0.26, 0.05], [0.28, h], [0.27, h], [0.25, 0.05], [0.19, 0.035], [0, 0.045]];
    const g = lathe(prof, M[mat], 44);
    g.scale.set(w / 0.56, 1, d / 0.56);
    return g;
  };
  F.wcWall = ({ mat = 'ceramic' }) => {
    const g = new THREE.Group();
    const bowl = cushion(0.37, 0.3, 0.54, M[mat], { seed: 601, bulge: 0.04, r: 0.14 });
    bowl.position.set(0, 0.42, 0.14); bowl.scale.set(1, 1, 1); g.add(bowl);
    const seat = cushion(0.35, 0.035, 0.5, std({ color: 0xf6f5f1, roughness: 0.25 }), { seed: 602, bulge: 0.02, r: 0.08 });
    seat.position.set(0, 0.575, 0.15); g.add(seat);
    g.add(rbox(0.22, 0.14, 0.02, M.steel, 0, 1.0, -0.01, 0.01));
    return g;
  };
  // ================================================================ ZIELEŃ
  F.plantReal = ({ s = 1, kind = 'strelitzia', pot = 'pot' }) => {
    const g = new THREE.Group();
    const potProf = [[0, 0], [0.19, 0], [0.21, 0.04], [0.19, 0.42], [0.2, 0.45], [0.182, 0.45], [0.172, 0.42], [0.19, 0.05], [0, 0.04]];
    const p = lathe(potProf, M[pot], 36); p.scale.setScalar(s); g.add(p);
    const soil = mesh(new THREE.CircleGeometry(0.175 * s, 24), std({ color: 0x3a2f26, roughness: 1 }), { cast: false });
    soil.rotation.x = -PI / 2; soil.position.y = 0.4 * s; g.add(soil);
    const rnd = mulberry(kind === 'monstera' ? 77 : 97);
    const leafMat = std({ color: kind === 'monstera' ? 0x2d6628 : 0x37702e, roughness: 0.58, side: THREE.DoubleSide });
    const stemMat = std({ color: 0x406b36, roughness: 0.8 });
    const n = kind === 'monstera' ? 8 : 10;
    // liść: płat zwężony u nasady i na końcu, złożony w korytko wzdłuż nerwu, opadający końcem
    const makeLeaf = (len, wid, monstera) => {
      const geo = new THREE.PlaneGeometry(wid, len, 10, 18);
      const pos = geo.attributes.position;
      for (let k = 0; k < pos.count; k++) {
        const x = pos.getX(k), y = pos.getY(k);
        const t = Math.min(1, Math.max(0, (y + len / 2) / len));          // 0 nasada → 1 koniec
        const shape = Math.max(0, Math.sin(Math.pow(t, 0.72) * PI)) ** 0.75;
        const u = wid > 0 ? x / (wid / 2) : 0;
        const fold = (1 - Math.cos(u * 1.15)) * wid * 0.5;                 // korytko wzdłuż nerwu
        const droop = -Math.pow(t, 2.2) * len * 0.3;                       // opadanie końcówki
        let nx = x * shape;
        if (monstera) { const cut = Math.abs(Math.sin(t * 9)) < 0.22 ? 0.45 : 1; nx *= cut; }   // wcięcia liścia
        pos.setXYZ(k, nx, (y + len / 2), fold + droop);
      }
      geo.computeVertexNormals();
      return mesh(geo, leafMat);
    };
    for (let i = 0; i < n; i++) {
      const a = (i / n) * PI * 2 + rnd() * 0.6;
      const lean = 0.18 + rnd() * 0.4;
      const len = (0.55 + rnd() * 0.4) * s, wid = (kind === 'monstera' ? 0.4 : 0.2) * s * (0.85 + rnd() * 0.35);
      const stemH = (0.45 + rnd() * 0.55) * s;
      const stem = new THREE.Group();
      stem.position.set(Math.cos(a) * 0.05 * s, 0.4 * s, Math.sin(a) * 0.05 * s);
      stem.rotation.set(Math.sin(a) * lean, -a, -Math.cos(a) * lean);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.01 * s, stemH * 0.5, 0.02 * s),
        new THREE.Vector3(0.03 * s, stemH, 0.06 * s)]);
      stem.add(mesh(new THREE.TubeGeometry(curve, 12, 0.011 * s, 6), stemMat));
      const leaf = makeLeaf(len, wid, kind === 'monstera');
      leaf.position.set(0.03 * s, stemH, 0.06 * s);
      leaf.rotation.x = -0.25 - rnd() * 0.25;
      leaf.rotation.z = (rnd() - 0.5) * 0.25;
      stem.add(leaf);
      g.add(stem);
    }
    return g;
  };

  // ================================================================ SAMOCHODY
  // Nadwozie z przekrojów: osobno bryła dolna (do linii okien), przeszklona kabina i dach —
  // stąd czytelny podział jak w prawdziwym aucie, a nie jedna zlepiona bańka.
  // kontur przekroju: zaokrąglony prostokąt (płaski spód, pionowe boki, zaokrąglona góra)
  function sectionPts(w, h, rTop, rBot, M) {
    const pts = [];
    const corner = (cz, cy, r, a0, a1, n) => { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); pts.push([cz + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    const rt = Math.min(rTop, w * 0.9, h * 0.45), rb = Math.min(rBot, w * 0.9, h * 0.45);
    const n = Math.max(2, Math.round(M / 8));
    corner(w - rt, h - rt, rt, 0, Math.PI / 2, n);          // prawy górny
    corner(-(w - rt), h - rt, rt, Math.PI / 2, Math.PI, n); // lewy górny
    corner(-(w - rb), -(h - rb), rb, Math.PI, 1.5 * Math.PI, n);
    corner(w - rb, -(h - rb), rb, 1.5 * Math.PI, 2 * Math.PI, n);
    return pts;
  }
  function shell(sections, mat, loKey, hiKey, { N = 56, shrink = 0, cast = true, rTop = null, rBot = null } = {}) {
    const lerp = (a, b, t) => a + (b - a) * t;
    const sample = (t) => {
      const u = Math.min(0.9999, Math.max(0, t)) * (sections.length - 1);
      const i = Math.floor(u), f = u - i, A = sections[i], B = sections[Math.min(sections.length - 1, i + 1)];
      const e = f * f * (3 - 2 * f), g = (k) => lerp(A[k], B[k], e);
      return { w: Math.max(0.02, g('w') - shrink), lo: g(loKey), hi: g(hiKey), r: g('r') };
    };
    const M = 32, pos = [], idx = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, s = sample(t), x = t - 0.5;
      const h = Math.max(0.01, (s.hi - s.lo) / 2), cy = (s.hi + s.lo) / 2;
      const pts = sectionPts(s.w, h, (rTop ?? s.r) * 2 * h, (rBot ?? s.r * 0.5) * 2 * h, M);
      for (const [z, y] of pts) pos.push(x, cy + y, z);
    }
    const per = (pos.length / 3) / (N + 1);
    for (let i = 0; i < N; i++) for (let j = 0; j < per; j++) {
      const j2 = (j + 1) % per, a = i * per + j, b = (i + 1) * per + j, a2 = i * per + j2, b2 = (i + 1) * per + j2;
      idx.push(a, b, a2, a2, b, b2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx); g.computeVertexNormals();
    return mesh(g, mat, { cast });
  }
  function wheel(r, width, rimMat, spokes = 5) {
    const g = new THREE.Group();
    const tyre = mesh(new THREE.CylinderGeometry(r, r, width, 30, 1), std({ color: 0x121214, roughness: 0.92 }));
    tyre.rotation.z = PI / 2; g.add(tyre);
    const rim = mesh(new THREE.CylinderGeometry(r * 0.68, r * 0.68, width * 0.98, 26), rimMat);
    rim.rotation.z = PI / 2; g.add(rim);
    for (const s of [-1, 1]) {
      const face = mesh(new THREE.CircleGeometry(r * 0.68, 26), rimMat, { cast: false });
      face.rotation.y = s * PI / 2; face.position.x = s * width * 0.5; g.add(face);
      for (let i = 0; i < spokes; i++) {
        const sp = box(width * 0.1, r * 1.12, r * 0.13, rimMat, s * width * 0.48, 0, 0);
        sp.rotation.x = (i / spokes) * PI; g.add(sp);
      }
      g.add(cyl(r * 0.15, r * 0.15, width * 0.08, rimMat, s * width * 0.53, 0, 0, 16).rotateZ(PI / 2));
    }
    return g;
  }
  const paint = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.55 });
  const glassCar = () => new THREE.MeshPhysicalMaterial({ color: 0x0b0e11, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.78, envMapIntensity: 0.8 });

  // Mercedes-Benz Klasa G (4,82 × 1,93 × 1,97) — pionowe ściany, płaski dach, koło zapasowe
  F.carG = ({ color = 0x2a2d31, len = 4.82, wid = 1.93, hgt = 1.97 } = {}) => {
    const g = new THREE.Group(), body = paint(color);
    const sx = len, k = hgt / 1.97;
    const S = [
      { w: 0.44, y0: 0.44, belt: 0.95, y1: 1.00, r: 0.22 },
      { w: 0.49, y0: 0.36, belt: 1.20, y1: 1.22, r: 0.15 },
      { w: 0.50, y0: 0.34, belt: 1.30, y1: 1.97, r: 0.13 },
      { w: 0.50, y0: 0.34, belt: 1.35, y1: 1.97, r: 0.13 },
      { w: 0.50, y0: 0.34, belt: 1.35, y1: 1.97, r: 0.13 },
      { w: 0.50, y0: 0.34, belt: 1.35, y1: 1.97, r: 0.13 },
      { w: 0.50, y0: 0.34, belt: 1.35, y1: 1.96, r: 0.13 },
      { w: 0.49, y0: 0.36, belt: 1.33, y1: 1.94, r: 0.14 },
      { w: 0.46, y0: 0.42, belt: 1.25, y1: 1.88, r: 0.18 },
    ].map((q) => ({ w: q.w * wid, y0: q.y0 * k, belt: q.belt * k, y1: q.y1 * k, r: q.r }));
    const lower = shell(S, body, 'y0', 'belt'); lower.scale.x = sx; g.add(lower);
    const cab = shell(S.map((q, i) => ({ ...q, w: q.w * (i <= 1 ? 0.72 : i >= 8 ? 0.8 : 0.96) })), glassCar(), 'belt', 'y1', { shrink: 0.015, cast: false, rTop: 0.18, rBot: 0.05 });
    cab.scale.x = sx; g.add(cab);
    // dach i słupki
    g.add(box(sx * 0.46, 0.03, wid * 0.86, body, sx * 0.05, 1.955 * k, 0));
    for (const s of [-1, 1]) {
      g.add(box(0.07, 0.62 * k, 0.07, body, -sx * 0.19, 1.65 * k, s * wid * 0.47));   // słupek A
      g.add(box(0.07, 0.62 * k, 0.07, body, sx * 0.03, 1.65 * k, s * wid * 0.47));    // B
      g.add(box(0.07, 0.62 * k, 0.07, body, sx * 0.24, 1.65 * k, s * wid * 0.47));    // C
      g.add(box(0.95, 0.07, 0.17, std({ color: 0x1a1a1c, roughness: 0.6 }), sx * 0.02, 0.44 * k, s * wid * 0.5));  // stopień
      g.add(box(0.1, 0.03, 0.03, M.steel, sx * 0.0, 1.25 * k, s * wid * 0.51));
      g.add(box(0.1, 0.03, 0.03, M.steel, sx * 0.19, 1.25 * k, s * wid * 0.51));
      const mir = box(0.1, 0.12, 0.2, body, -sx * 0.16, 1.42 * k, s * wid * 0.58); g.add(mir);
      g.add(box(0.05, 0.04, 0.12, M.black_metal, -sx * 0.16, 1.4 * k, s * wid * 0.52));
      g.add(cyl(0.05, 0.05, 0.09, std({ color: 0xd9a024, roughness: 0.3, emissive: 0x241700 }), -sx * 0.4, 1.24 * k, s * wid * 0.45, 12));
      const lamp = cyl(0.13, 0.13, 0.05, std({ color: 0xf4f5f2, roughness: 0.08, emissive: 0x2a2b28 }), -sx * 0.497, 1.0 * k, s * wid * 0.33, 20);
      lamp.rotation.z = PI / 2; g.add(lamp);
      g.add(box(0.05, 0.4, 0.13, std({ color: 0x8a1a1a, roughness: 0.25, emissive: 0x2a0505 }), sx * 0.497, 1.15 * k, s * wid * 0.4));
    }
    // atrapa
    g.add(box(0.04, 0.4, wid * 0.72, std({ color: 0x15171a, roughness: 0.45, metalness: 0.5 }), -sx * 0.5, 1.02 * k, 0));
    for (let i = 0; i < 3; i++) g.add(box(0.03, 0.04, wid * 0.68, M.steel, -sx * 0.508, 0.88 * k + i * 0.12, 0));
    g.add(cyl(0.13, 0.13, 0.04, M.steel, -sx * 0.512, 1.02 * k, 0, 20).rotateZ(PI / 2));
    g.add(box(0.14, 0.28, wid * 0.86, std({ color: 0x1b1d1f, roughness: 0.7 }), -sx * 0.5, 0.56 * k, 0));
    // koło zapasowe
    const spare = new THREE.Group(); spare.position.set(sx * 0.505, 1.18 * k, 0.08);
    spare.add(wheel(0.36, 0.2, std({ color: 0x27292c, roughness: 0.55, metalness: 0.4 }), 5)); spare.rotation.y = PI / 2; g.add(spare);
    const wb = 2.89, wr = 0.39;
    for (const [x, s] of [[-wb / 2, -1], [-wb / 2, 1], [wb / 2, -1], [wb / 2, 1]]) {
      const w = wheel(wr, 0.28, std({ color: 0x3c3f43, roughness: 0.35, metalness: 0.85 }), 5);
      w.position.set(x, wr, s * wid * 0.45); g.add(w);
    }
    g.rotation.y = PI / 2;
    const outer = new THREE.Group(); outer.add(g); outer.userData.collide = [wid + 0.12, len]; return outer;
  };

  // Porsche Panamera Executive (5,20 × 1,94 × 1,42) — niska linia, fastback, pas świetlny
  F.carPanamera = ({ color = 0x161b23, len = 5.2, wid = 1.94, hgt = 1.43 } = {}) => {
    const g = new THREE.Group(), body = paint(color);
    const sx = len, k = hgt / 1.43;
    const S = [
      { w: 0.38, y0: 0.26, belt: 0.60, y1: 0.62, r: 0.5 },
      { w: 0.47, y0: 0.20, belt: 0.80, y1: 0.82, r: 0.44 },
      { w: 0.50, y0: 0.18, belt: 0.88, y1: 0.90, r: 0.4 },
      { w: 0.50, y0: 0.18, belt: 0.95, y1: 1.30, r: 0.38 },
      { w: 0.49, y0: 0.18, belt: 0.97, y1: 1.43, r: 0.4 },
      { w: 0.49, y0: 0.18, belt: 0.97, y1: 1.43, r: 0.4 },
      { w: 0.49, y0: 0.19, belt: 0.97, y1: 1.38, r: 0.42 },
      { w: 0.50, y0: 0.20, belt: 0.98, y1: 1.18, r: 0.44 },
      { w: 0.48, y0: 0.22, belt: 0.96, y1: 1.00, r: 0.46 },
      { w: 0.42, y0: 0.26, belt: 0.90, y1: 0.92, r: 0.5 },
    ].map((q) => ({ w: q.w * wid, y0: q.y0 * k, belt: q.belt * k, y1: q.y1 * k, r: q.r }));
    const lower = shell(S, body, 'y0', 'belt'); lower.scale.x = sx; g.add(lower);
    const cab = shell(S.map((q, i) => ({ ...q, w: q.w * (i <= 2 ? 0.7 : i >= 8 ? 0.72 : 0.95) })), glassCar(), 'belt', 'y1', { shrink: 0.012, cast: false, rTop: 0.34, rBot: 0.06 });
    cab.scale.x = sx; g.add(cab);
    g.add(box(sx * 0.2, 0.02, wid * 0.82, body, sx * 0.02, 1.42 * k, 0));
    for (const s of [-1, 1]) {
      g.add(box(0.05, 0.42 * k, 0.05, body, -sx * 0.1, 1.2 * k, s * wid * 0.47));
      g.add(box(0.05, 0.4 * k, 0.05, body, sx * 0.16, 1.2 * k, s * wid * 0.47));
      const head = box(0.26, 0.09, 0.4, std({ color: 0xeef0ee, roughness: 0.07, emissive: 0x25251f }), -sx * 0.47, 0.78 * k, s * wid * 0.33);
      head.rotation.z = -0.1; g.add(head);
      g.add(box(0.2, 0.14, 0.44, std({ color: 0x0d0e10, roughness: 0.55 }), -sx * 0.49, 0.42 * k, s * wid * 0.32));
      g.add(box(0.05, 0.06, 0.18, M.black_metal, 0.1, 0.9 * k, s * wid * 0.5));
      g.add(box(0.05, 0.06, 0.18, M.black_metal, 1.2, 0.9 * k, s * wid * 0.5));
      const mir = box(0.12, 0.07, 0.19, body, -sx * 0.12, 1.07 * k, s * wid * 0.57); mir.rotation.z = -0.08; g.add(mir);
      g.add(box(0.04, 0.035, 0.1, M.black_metal, -sx * 0.12, 1.05 * k, s * wid * 0.51));
      g.add(cyl(0.045, 0.045, 0.14, M.steel, sx * 0.49, 0.33 * k, s * wid * 0.28, 14).rotateZ(PI / 2));
    }
    g.add(box(0.05, 0.055, wid * 0.84, std({ color: 0x9c1818, roughness: 0.18, emissive: 0x3c0808 }), sx * 0.487, 0.93 * k, 0));
    g.add(box(0.22, 0.018, wid * 0.66, body, sx * 0.4, 1.12 * k, 0));
    const wb = 3.1, wr = 0.37;
    for (const [x, s] of [[-wb / 2, -1], [-wb / 2, 1], [wb / 2, -1], [wb / 2, 1]]) {
      const w = wheel(wr, 0.3, std({ color: 0xa2a5a9, roughness: 0.22, metalness: 0.95 }), 5);
      w.position.set(x, wr, s * wid * 0.44); g.add(w);
    }
    g.rotation.y = PI / 2;
    const outer = new THREE.Group(); outer.add(g); outer.userData.collide = [wid + 0.12, len]; return outer;
  };

  // ================================================================ OŚWIETLENIE I DODATKI
  F.pendantDome = ({ r = 0.26, z = 1.75, mat = 'black_metal' }) => {
    const g = new THREE.Group();
    const prof = []; const seg = 14;
    for (let i = 0; i <= seg; i++) { const a = (i / seg) * (PI / 2); prof.push([Math.sin(a) * r, Math.cos(a) * r * 0.78]); }
    prof.push([r * 0.995, 0.004], [r * 0.99, 0]);
    const shade = lathe(prof, std({ color: mat === 'black_metal' ? 0x15161a : 0xf0ece4, roughness: 0.45, metalness: mat === 'black_metal' ? 0.5 : 0, side: THREE.DoubleSide }), 36);
    shade.position.y = z; g.add(shade);
    const bulb = mesh(new THREE.SphereGeometry(0.045, 14, 10), E('warm'), { cast: false, receive: false }); bulb.position.y = z - r * 0.5; g.add(bulb);
    g.add(cyl(0.0035, 0.0035, Math.max(0.05, ceilH() - z - r * 0.78), M.black_metal, 0, (ceilH() + z + r * 0.78) / 2, 0, 6));
    g.add(cyl(0.05, 0.05, 0.015, M.black_metal, 0, ceilH() - 0.008, 0));
    return g;
  };
  F.rugSoft = ({ w = 3.2, d = 2.4, mat = 'rug', fringe = true }) => {
    const g = new THREE.Group();
    const r = rbox(w, 0.022, d, M[mat], 0, 0.011, 0, 0.01); r.receiveShadow = true; r.castShadow = false; g.add(r);
    if (fringe) { const rnd = mulberry(811);
      for (const s of [-1, 1]) for (let i = 0; i < Math.round(w / 0.03); i++) {
        const x = -w / 2 + i * 0.03 + 0.015;
        g.add(cyl(0.0035, 0.0035, 0.07 + rnd() * 0.03, M[mat], x, 0.008, s * (d / 2 + 0.035), 4).rotateX(PI / 2));
      } }
    return g;
  };
  // okap wyspowy
  F.hoodIsland = ({ w = 1.1, d = 0.55, z = 1.55 }) => {
    const g = new THREE.Group();
    g.add(rbox(w, 0.16, d, M.appliance, 0, z, 0, 0.02));
    g.add(box(w - 0.08, 0.02, d - 0.08, M.steel, 0, z - 0.085, 0));
    const e = mesh(new THREE.BoxGeometry(w - 0.2, 0.008, d - 0.3), E('white'), { cast: false, receive: false }); e.position.y = z - 0.095; g.add(e);
    g.add(box(0.26, ceilH() - z - 0.08, 0.26, M.appliance, 0, (ceilH() + z + 0.08) / 2, 0));
    return g;
  };
  // kominek: marmurowa obudowa + czarna rama paleniska + ogień
  F.fireplaceStone = ({ w = 1.25, h = 0.68, z = 0.55, mat = 'marble_wall' }) => {
    const g = new THREE.Group();
    g.add(box(w + 0.18, h + 0.16, 0.04, M.frame, 0, z + h / 2, 0.02));
    const glass = mesh(new THREE.PlaneGeometry(w, h), std({ color: 0x0a0a0c, roughness: 0.06, metalness: 0.2 }), { cast: false });
    glass.position.set(0, z + h / 2, 0.045); g.add(glass);
    const rnd = mulberry(901);
    for (let i = 0; i < 9; i++) {
      const fh = 0.18 + rnd() * 0.22, fx = -w / 2 + 0.12 + rnd() * (w - 0.24);
      const f = mesh(new THREE.ConeGeometry(0.045 + rnd() * 0.03, fh, 7), E('warm'), { cast: false, receive: false });
      f.position.set(fx, z + 0.06 + fh / 2, 0.02); f.rotation.z = (rnd() - 0.5) * 0.3; g.add(f);
    }
    for (let i = 0; i < 6; i++) g.add(cyl(0.028, 0.028, w - 0.2, M.ember, 0, z + 0.04 + (i % 2) * 0.03, 0.0 + i * 0.012, 7).rotateZ(PI / 2));
    return g;
  };
  // ściana z prawdziwych lameli (listwy 3D zamiast płaskiej tekstury)
  F.slatWall = ({ w = 3.0, h = 2.6, z = 0, slat = 0.042, gap = 0.028, depth = 0.04, mat = 'wenge', back = 'wenge' }) => {
    const g = new THREE.Group();
    g.add(box(w, h, 0.016, M[back], 0, z + h / 2, 0.008));
    const pitch = slat + gap, n = Math.max(1, Math.floor(w / pitch));
    const geo = new RoundedBoxGeometry(slat, h, depth, 2, slat * 0.22);
    const m = M[mat];
    for (let i = 0; i < n; i++) {
      const s = mesh(geo, m);
      s.position.set(-w / 2 + pitch / 2 + i * pitch + (w - n * pitch) / 2, z + h / 2, 0.016 + depth / 2);
      g.add(s);
    }
    return g;
  };
  // szafka RTV podwieszana z uchylnymi frontami
  F.tvSideboard = ({ w = 2.6, d = 0.42, h = 0.36, z = 0.32, mat = 'wenge' }) => {
    const g = new THREE.Group();
    g.add(rbox(w, h, d, M[mat], 0, z + h / 2, 0, 0.012));
    const n = Math.max(2, Math.round(w / 0.85));
    for (let i = 1; i < n; i++) g.add(box(0.006, h - 0.03, 0.006, M.stone_dark, -w / 2 + i * w / n, z + h / 2, d / 2 + 0.004));
    g.add(box(w - 0.06, 0.008, 0.01, M.stone_dark, 0, z + 0.02, d / 2 + 0.002));
    return g;
  };
}
