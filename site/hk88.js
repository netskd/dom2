// HOMEKONCEPT 88 — definicja domu dla silnika app.js
// Układ: metry, rzut architektoniczny (X → wschód rysunku / prawo, Y → góra rysunku).
// Początek (0,0) = wewnętrzny narożnik SW kuchni. Wejście główne w rzucie jest od dołu ('S').
// Silnik obraca całość tak, żeby strona wejścia trafiła w wybrany kierunek świata.

const H = 2.8;          // wysokość pomieszczeń (przekrój: +2,80)
const R0 = 2.8, R1 = 3.7;   // dach: spód / wierzch płyty (grubość ~90 cm)

const W = (a, b, t, o = {}) => ({ a, b, t, ...o });

export default {
  id: 'hk88',
  name: 'HomeKoncept 88',
  author: 'proj. arch. Bartłomiej Szymańczuk / HomeKoncept',
  location: { lat: 53.13, lon: 23.16, name: 'Białystok' },
  ceiling: H,
  entranceSide: 'S',
  bounds: [-24, -22, 40, 22],   // obszar działki [x0,y0,x1,y1]

  // ---------------------------------------------------------------- pomieszczenia (minimapa, teleport)
  rooms: [
    { id: 'wejscie', name: 'Przed wejściem', rect: [8.8, -8.6, 10.0, -3.9], spawn: [9.35, -3.1], look: [1, -0.1], outdoor: true },
    { id: 'wiatrolap', name: '1 · Wiatrołap', rect: [10.15, -3.75, 12.15, 1.43], spawn: [11.1, -3.0], look: [0, 1] },
    { id: 'garderoba', name: '2 · Garderoba', rect: [12.27, -1.62, 14.95, 1.43], spawn: [13.5, -0.1], look: [1, 0] },
    { id: 'hol', name: '3 · Komunikacja', rect: [11.45, 1.62, 24.63, 3.29], spawn: [13.2, 2.45], look: [-1, 0] },
    { id: 'kuchnia', name: '4 · Kuchnia', rect: [0, 0, 5.97, 3.1], spawn: [5.4, 2.3], look: [-1, 0.05] },
    { id: 'spizarnia', name: '5 · Spiżarnia', rect: [6.03, 0, 8.45, 1.43], spawn: [7.2, 0.7], look: [1, 0] },
    { id: 'jadalnia', name: '6 · Jadalnia', rect: [0, 3.1, 6.25, 7.41], spawn: [5.6, 4.3], look: [-1, 0.5] },
    { id: 'salon', name: '7 · Salon', rect: [6.25, 1.62, 11.45, 7.41], spawn: [8.4, 2.6], look: [0.1, 1] },
    { id: 'pokoj1', name: '8 · Pokój', rect: [12.45, 3.45, 15.7, 7.41], spawn: [14.2, 3.9], look: [-0.3, 1] },
    { id: 'pokoj2', name: '9 · Pokój', rect: [16.91, 3.45, 20.25, 7.41], spawn: [17.5, 3.9], look: [0.4, 1] },
    { id: 'pokoj3', name: '10 · Pokój', rect: [21.05, 3.45, 24.5, 8.5], spawn: [21.7, 3.9], look: [0.4, 1] },
    { id: 'sypialnia', name: '11 · Sypialnia', rect: [24.88, 1.76, 29.2, 6.38], spawn: [25.4, 2.6], look: [0.7, 0.7] },
    { id: 'garderoba2', name: '12 · Garderoba sypialni', rect: [24.88, 6.38, 29.2, 8.5], spawn: [25.2, 7.4], look: [1, 0] },
    { id: 'garderoba3', name: '13 · Garderoba', rect: [24.88, 0, 29.2, 1.6], spawn: [25.3, 0.9], look: [1, 0] },
    { id: 'lazienka', name: '14 · Łazienka z sauną', rect: [21.0, -4.67, 24.63, 1.43], spawn: [22.2, 0.9], look: [0.2, -1] },
    { id: 'pralnia', name: '15 · Pralnia', rect: [17.85, -1.62, 20.35, 1.43], spawn: [19.1, 1.0], look: [0, -1] },
    { id: 'lazienka2', name: '16 · Łazienka', rect: [15.1, -1.62, 17.75, 1.43], spawn: [16.5, 1.0], look: [0, -1] },
    { id: 'kotlownia', name: '17 · Kotłownia', rect: [20.95, -8.38, 26.75, -5.04], spawn: [21.6, -6.5], look: [1, 0] },
    { id: 'garaz', name: 'G · Garaż', rect: [12.5, -8.38, 20.55, -1.94], spawn: [12.9, -2.6], look: [0.8, -0.6] },
    { id: 'taras', name: 'T1 · Taras zadaszony', rect: [-7.2, 0.5, -0.3, 8.9], spawn: [-3.0, 1.6], look: [-0.5, 0.86], outdoor: true },
    { id: 'taras3', name: 'T3 · Taras sypialni', rect: [29.5, 0, 31.1, 8.5], spawn: [30.3, 2.0], look: [0, 1], outdoor: true },
    { id: 'ogrod', name: 'Ogród · widok na dom', rect: [-19, -6, -9, 12], spawn: [-17.5, 12.5], look: [0.75, -0.66], outdoor: true },
    { id: 'dach', name: 'Taras na dachu', rect: [-7.0, 0, 11.5, 8.9], spawn: [1.0, 4.4], look: [-1, 0.2], outdoor: true, z: R1 },
  ],

  // ---------------------------------------------------------------- podłogi (rect, materiał, poziom)
  floors: [
    // wnętrza
    { rect: [0, 0, 11.45, 3.1], mat: 'terrazzo' },
    { rect: [0, 3.1, 11.45, 7.41], mat: 'oak' },
    { rect: [11.45, 1.62, 24.63, 3.29], mat: 'terrazzo' },
    { rect: [10.15, -3.75, 12.15, 1.62], mat: 'terrazzo' },
    { rect: [12.27, -1.62, 14.95, 1.43], mat: 'oak' },
    { rect: [15.1, -1.62, 17.75, 1.43], mat: 'slate' },
    { rect: [17.85, -1.62, 20.35, 1.43], mat: 'slate' },
    { rect: [21.0, -4.67, 24.63, 1.43], mat: 'slate' },
    { rect: [12.45, 3.45, 24.5, 8.5], mat: 'oak' },
    { rect: [24.88, 0, 29.2, 8.5], mat: 'oak' },
    { rect: [12.5, -8.38, 20.55, -1.94], mat: 'concrete' },
    { rect: [20.95, -8.38, 26.75, -5.04], mat: 'concrete' },
    { rect: [5.97, 0, 8.63, 1.43], mat: 'terrazzo' },
    // tarasy drewniane (lekko poniżej poziomu wnętrza)
    { rect: [-7.2, 0.5, -0.3, 8.9], mat: 'deck', z: -0.04, rot: 90 },
    { rect: [29.5, -0.15, 31.1, 8.8], mat: 'deck', z: -0.04 },
    { rect: [25.0, -3.3, 27.2, -0.3], mat: 'deck', z: -0.04 },
    // utwardzenia
    { rect: [-9.9, -1.0, -7.2, 11.2], mat: 'pavers', z: -0.06 },
    { rect: [-7.2, 8.9, 0.2, 11.2], mat: 'pavers', z: -0.06 },
    { rect: [-0.3, 7.71, 20.45, 8.95], mat: 'pavers', z: -0.06 },
    { rect: [20.45, 8.8, 24.6, 11.2], mat: 'pavers', z: -0.06 },
    { rect: [27.2, -3.0, 29.6, -0.3], mat: 'pavers', z: -0.06 },
    { rect: [8.8, -8.7, 10.0, -0.3], mat: 'sinter', z: -0.05 },        // ścieżka pod zadaszeniem do drzwi
    { rect: [7.5, -17.0, 27.2, -8.7], mat: 'pavers', z: -0.07 },        // podjazd
    { rect: [7.5, -8.7, 8.8, -3.9], mat: 'pavers', z: -0.07 },
  ],

  // ---------------------------------------------------------------- sufity (rect, materiał)
  ceilings: [
    { rect: [0, 0, 11.45, 7.41], mat: 'ceiling' },
    { rect: [11.45, 1.62, 24.63, 3.29], mat: 'ceiling' },
    { rect: [10.15, -3.75, 12.15, 1.62], mat: 'ceiling' },
    { rect: [12.27, -1.62, 20.35, 1.43], mat: 'ceiling' },
    { rect: [21.0, -4.67, 24.63, 1.43], mat: 'ceiling_dark' },
    { rect: [12.45, 3.45, 24.5, 8.5], mat: 'ceiling' },
    { rect: [24.88, 0, 29.2, 8.5], mat: 'ceiling' },
    { rect: [12.5, -8.38, 20.55, -1.94], mat: 'ceiling_garage' },
    { rect: [20.95, -8.38, 26.75, -5.04], mat: 'ceiling_garage' },
    { rect: [5.97, 0, 8.63, 1.43], mat: 'ceiling' },
  ],

  // ---------------------------------------------------------------- ściany
  // a→b; t grubość; matL / matR = materiał po lewej / prawej stronie kierunku a→b
  // otwory: at = odległość od a, w szerokość, h wysokość, sill parapet,
  //   kind: glass | glassdoor | door | opening | garagedoor ; leaf: white | dark | entry ; swing: L|R
  walls: [
    // ---- zewnętrzne (lewa strona = zewnątrz)
    W([-0.15, -0.15], [-0.15, 7.56], 0.3, { matL: 'ext_white', matR: 'plaster', ext: true, openings: [
      { at: 0.9, w: 1.1, h: 2.5, kind: 'glassdoor' },
      { at: 3.15, w: 4.41, h: 2.65, kind: 'glass' },
    ] }),
    W([-0.3, 7.56], [20.45, 7.56], 0.3, { matL: 'ext_white', matR: 'plaster', ext: true, openings: [
      { at: 0.3, w: 6.25, h: 2.65, kind: 'glass', mullions: [2.1, 4.2] },
      { at: 10.45, w: 1.1, h: 2.5, kind: 'glassdoor' },
      { at: 13.3, w: 2.2, h: 2.65, kind: 'glass', mullions: [1.1] },
      { at: 17.6, w: 2.3, h: 2.65, kind: 'glass', mullions: [1.15] },
    ] }),
    W([20.3, 7.41], [20.3, 8.8], 0.3, { matL: 'ext_white', matR: 'plaster', ext: true }),
    W([20.15, 8.65], [29.5, 8.65], 0.3, { matL: 'ext_white', matR: 'plaster', ext: true, openings: [
      { at: 1.2, w: 1.0, h: 2.5, kind: 'glassdoor' },
      { at: 2.45, w: 1.6, h: 2.65, kind: 'glass' },
      { at: 6.35, w: 2.0, h: 0.8, sill: 1.6, kind: 'glass' },
    ] }),
    W([29.35, 8.8], [29.35, -0.3], 0.3, { matL: 'ext_white', matR: 'plaster', ext: true, openings: [
      { at: 0.6, w: 6.2, h: 2.65, kind: 'glass', mullions: [2.0, 4.1] },
    ] }),
    W([29.5, -0.15], [24.75, -0.15], 0.3, { matL: 'ext_white', matR: 'plaster', ext: true }),
    W([24.75, -0.15], [24.75, -4.85], 0.3, { matL: 'ext_white', matR: 'slate', ext: true, openings: [
      { at: 0.35, w: 2.2, h: 2.65, kind: 'glass', mullions: [1.0] },
    ] }),
    W([24.75, -4.85], [26.9, -4.85], 0.3, { matL: 'sinter', matR: 'plaster', ext: true }),
    W([26.9, -4.85], [26.9, -8.53], 0.3, { matL: 'sinter', matR: 'plaster', ext: true, openings: [
      { at: 1.15, w: 0.9, h: 2.1, kind: 'door', leaf: 'entry', open: 85 },
    ] }),
    W([26.9, -8.53], [12.15, -8.53], 0.3, { matL: 'sinter', matR: 'plaster', ext: true, openings: [
      { at: 6.8, w: 3.4, h: 2.3, kind: 'garagedoor' },
      { at: 10.6, w: 3.4, h: 2.3, kind: 'garagedoor' },
    ] }),
    W([12.33, -8.53], [12.33, -3.9], 0.35, { matL: 'cladding', matR: 'plaster', ext: true }),
    W([12.33, -3.9], [10.0, -3.9], 0.3, { matL: 'cladding', matR: 'plaster', ext: true }),
    W([10.0, -3.9], [10.0, -0.15], 0.3, { matL: 'cladding', matR: 'plaster', ext: true, openings: [
      { at: 0.25, w: 1.1, h: 2.4, kind: 'door', leaf: 'entry', open: 75, swing: 'L', number: '88' },
      { at: 1.5, w: 1.1, h: 2.5, kind: 'glass' },
    ] }),
    W([10.15, -0.15], [8.8, -0.15], 0.3, { matL: 'cladding', matR: 'plaster', ext: true }),
    W([8.8, -0.15], [-0.3, -0.15], 0.3, { matL: 'ext_white', matR: 'plaster', ext: true }),

    // ---- wewnętrzne
    W([5.97, 1.525], [10.15, 1.525], 0.19, { mat: 'graphite' }),
    W([10.15, 1.525], [15.03, 1.525], 0.19, { mat: 'plaster', openings: [{ at: 0, w: 1.2, h: 2.4, kind: 'opening' }] }),
    W([15.03, 1.525], [17.8, 1.525], 0.19, { mat: 'plaster', matR: 'slate', openings: [{ at: 1.17, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 80, swing: 'R' }] }),
    W([17.8, 1.525], [20.35, 1.525], 0.19, { mat: 'plaster', openings: [{ at: 1.2, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 80, swing: 'R' }] }),
    W([20.35, 1.525], [24.75, 1.525], 0.19, { mat: 'plaster', matR: 'slate', openings: [{ at: 2.1, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'R' }] }),
    W([5.97, -0.15], [5.97, 1.525], 0.12, { mat: 'plaster', openings: [{ at: 0.3, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 20, swing: 'L' }] }),
    W([8.51, -0.15], [8.51, 1.525], 0.12, { mat: 'plaster' }),
    W([12.21, 1.525], [12.21, -1.78], 0.12, { mat: 'plaster', openings: [{ at: 1.32, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'L' }] }),
    W([12.33, -1.78], [12.33, -3.9], 0.35, { matR: 'plaster', matL: 'garage_wall', openings: [{ at: 0.6, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 0 }] }),
    W([12.21, -1.78], [15.03, -1.78], 0.32, { mat: 'plaster', matR: 'garage_wall' }),
    W([15.03, -1.78], [17.8, -1.78], 0.32, { matL: 'slate', matR: 'garage_wall' }),
    W([17.8, -1.78], [20.55, -1.78], 0.32, { mat: 'plaster', matR: 'garage_wall' }),
    W([15.03, 1.525], [15.03, -1.78], 0.15, { matR: 'plaster', matL: 'slate' }),
    W([17.8, 1.525], [17.8, -1.78], 0.1, { matR: 'slate', matL: 'plaster' }),
    W([20.675, 1.525], [20.675, -1.78], 0.65, { matR: 'plaster', matL: 'slate' }),
    W([20.75, -1.78], [20.75, -4.85], 0.4, { matR: 'garage_wall', matL: 'slate' }),
    W([20.75, -4.85], [20.75, -8.53], 0.4, { mat: 'garage_wall', openings: [{ at: 2.05, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 0 }] }),
    W([24.75, -4.85], [20.55, -4.85], 0.37, { matR: 'slate', matL: 'garage_wall' }),
    W([11.6, 3.37], [24.75, 3.37], 0.16, { mat: 'plaster', openings: [
      { at: 3.2, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 85, swing: 'L', into: 'L' },
      { at: 5.35, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 85, swing: 'L', into: 'L' },
      { at: 9.65, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 85, swing: 'L', into: 'L' },
    ] }),
    W([11.6, 3.37], [11.6, 7.56], 0.3, { mat: 'plaster' }),
    W([16.275, 3.37], [16.275, 7.56], 1.15, { mat: 'plaster' }),
    W([20.35, 3.37], [20.35, 7.56], 0.2, { mat: 'plaster' }),
    W([24.75, 8.65], [24.75, -0.15], 0.25, { mat: 'plaster', openings: [
      { at: 5.58, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 85, swing: 'L', into: 'L' },
      { at: 7.35, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 0 },
    ] }),
    W([24.75, 1.68], [29.35, 1.68], 0.16, { mat: 'plaster', openings: [{ at: 0.15, w: 1.0, h: 2.3, kind: 'opening' }] }),
    W([25.7, 5.99], [28.3, 5.99], 0.78, { mat: 'walnut_fluted' }),   // ściana za łóżkiem (obustronnie ryflowana)
    // sauna (ściany z drewna, front szklany)
    W([21.0, -2.77], [23.25, -2.77], 0.06, { mat: 'sauna', h: 2.3, openings: [
      { at: 0.1, w: 0.7, h: 2.0, kind: 'door', leaf: 'glass', open: 70, swing: 'L' },
      { at: 0.86, w: 2.3, h: 2.2, kind: 'glass', frame: 'thin' },
    ] }),
    W([23.25, -2.77], [23.25, -4.67], 0.06, { mat: 'sauna', h: 2.3 }),
    // prysznic – szklana tafla
    W([23.35, -3.3], [24.63, -3.3], 0.02, { mat: 'sauna', h: 2.2, openings: [{ at: 0, w: 1.28, h: 2.2, kind: 'glass', frame: 'none' }] }),
  ],

  // ---------------------------------------------------------------- bryły (szafy, bloki, zabudowy)
  boxes: [
    { rect: [8.63, 0, 10.15, 1.43], h: H, mat: 'wardrobe_dark', doors: 'x1' },       // szafy wiatrołapu
    { rect: [11.75, 3.45, 12.45, 7.41], h: H, mat: 'walnut', doors: 'x1' },          // szafa pokój 8 (zach.)
    { rect: [15.64, 3.45, 15.7, 7.41], h: H, mat: 'walnut', doors: 'x0' },           // front szafy pokój 8 (wsch.)
    { rect: [16.85, 3.45, 16.91, 7.41], h: H, mat: 'walnut', doors: 'x1' },          // front szafy pokój 9
    { rect: [20.45, 3.45, 21.05, 7.41], h: H, mat: 'walnut', doors: 'x1' },          // szafa pokój 10
    { rect: [24.88, 7.9, 29.2, 8.5], h: H, mat: 'wardrobe_glass', doors: 'y0' },     // garderoba sypialni
    { rect: [24.88, 6.4, 25.45, 7.9], h: H, mat: 'wardrobe_glass', doors: 'x1' },
    { rect: [28.6, 6.4, 29.2, 7.9], h: H, mat: 'wardrobe_glass', doors: 'x0' },
    { rect: [24.88, 0, 29.2, 0.6], h: H, mat: 'walnut', doors: 'y1' },               // garderoba 13
    { rect: [12.27, 0.83, 14.95, 1.43], h: H, mat: 'walnut', doors: 'y0' },          // garderoba 2
    { rect: [12.27, -1.62, 14.95, -1.02], h: H, mat: 'walnut', doors: 'y1' },
    { rect: [20.4, -1.62, 20.9, 1.43], h: H, mat: 'walnut', doors: 'x1' },           // wysoka zabudowa łazienka/pralnia
    { rect: [6.3, 7.38, 10.1, 7.41], h: H, mat: 'walnut', doors: 'none', slats: 0.45 },   // ściana TV (orzech)
    { rect: [11.4, 5.4, 11.45, 7.41], h: H, mat: 'marble', doors: 'none' },          // ściana kominka (marmur)
    { rect: [11.15, 3.45, 11.45, 5.4], h: H, mat: 'bookcase' },                      // regał
    { rect: [25.9, 1.76, 28.1, 1.79], h: H, mat: 'walnut', doors: 'none', slats: 0.45 },  // panel TV sypialnia
    { rect: [21.0, -2.6, 21.06, -0.3], h: H, mat: 'moss' },                          // zielona ściana
    { rect: [17.75, -1.62, 17.8, -0.3], h: 2.2, mat: 'glass_panel' },                // kabina łazienka 16
    // kuchnia: wysoka zabudowa
    { rect: [0, 0, 5.1, 0.6], h: H, mat: 'walnut', doors: 'y1', ovens: [[3.7, 4.8]] },
    // spiżarnia - regały
    { rect: [6.03, 0.6, 6.4, 1.43], h: 2.2, mat: 'wardrobe_dark' },
    { rect: [8.1, 0.6, 8.45, 1.43], h: 2.2, mat: 'wardrobe_dark' },
    // opuszczony sufit z LED (salon/kuchnia, wzdłuż osi) + hol
    { rect: [0, 2.85, 11.45, 3.45], z: 2.62, h: 0.18, mat: 'ceiling', led: ['y0', 'y1'] },
    { rect: [11.45, 1.62, 24.63, 3.29], z: 2.62, h: 0.18, mat: 'ceiling', led: ['y0', 'y1'] },
    // pralnia - blat, pralka i suszarka
    { rect: [17.95, -1.62, 20.3, -1.0], h: 0.9, mat: 'walnut', doors: 'none' },
    { rect: [18.05, -1.6, 18.65, -1.0], z: 0.9, h: 0.85, mat: 'appliance' },
    { rect: [18.8, -1.6, 19.4, -1.0], z: 0.9, h: 0.85, mat: 'appliance' },
    { rect: [17.95, 0.8, 20.3, 1.43], h: 0.9, mat: 'walnut', doors: 'none' },
    // kotłownia: kocioł + zasobnik
    { rect: [21.1, -8.3, 21.7, -7.7], h: 0.9, mat: 'appliance' },
    { rect: [21.1, -8.3, 21.9, -7.5], z: 0.9, h: 1.5, mat: 'appliance' },
    // garaż: regał
    { rect: [12.6, -8.3, 15.6, -7.8], h: 2.0, mat: 'appliance' },
  ],

  // ---------------------------------------------------------------- meble i wyposażenie
  // rot: 0 = front na dół rysunku (S), 90 = na prawo (E), 180 = góra (N), -90 = lewo (W)
  furniture: [
    // kuchnia
    { type: 'island', x: 2.7, y: 2.33, rot: 0, w: 3.6, d: 1.05 },
    { type: 'hood', x: 2.7, y: 2.33, rot: 0 },
    { type: 'stools', x: 2.7, y: 3.05, rot: 180, n: 3 },
    // jadalnia
    { type: 'diningTable', x: 2.65, y: 5.65, rot: 0, w: 3.0, d: 1.0 },
    { type: 'chair', x: 1.9, y: 6.5, rot: 0 }, { type: 'chair', x: 2.65, y: 6.5, rot: 0 }, { type: 'chair', x: 3.4, y: 6.5, rot: 0 },
    { type: 'chair', x: 1.9, y: 4.8, rot: 180 }, { type: 'chair', x: 2.65, y: 4.8, rot: 180 }, { type: 'chair', x: 3.4, y: 4.8, rot: 180 },
    { type: 'chair', x: 0.85, y: 5.65, rot: 90 }, { type: 'chair', x: 4.45, y: 5.65, rot: -90 },
    { type: 'pendant', x: 2.15, y: 5.65, z: 1.9, r: 0.33 },
    { type: 'pendant', x: 3.15, y: 5.65, z: 2.05, r: 0.28 },
    // salon
    { type: 'rug', x: 8.5, y: 5.3, w: 3.6, d: 3.2 },
    { type: 'sofa', x: 8.75, y: 4.15, rot: 180, w: 2.8, d: 1.05 },
    { type: 'sofa', x: 7.0, y: 5.75, rot: 90, w: 2.4, d: 1.0 },
    { type: 'coffeeTable', x: 8.7, y: 5.55, r: 0.5 },
    { type: 'sideTable', x: 7.95, y: 6.25, r: 0.32 },
    { type: 'tvUnit', x: 8.2, y: 7.2, rot: 0, w: 2.6 },
    { type: 'tv', x: 8.2, y: 7.36, rot: 0, w: 1.75, z: 1.35 },
    { type: 'fireplace', x: 11.42, y: 6.4, rot: -90, w: 1.3 },
    { type: 'plant', x: 10.85, y: 6.95, s: 1.6 },
    { type: 'plant', x: 0.55, y: 6.95, s: 1.3 },
    { type: 'floorLamp', x: 10.6, y: 4.1 },
    { type: 'curtain', x: 0.9, y: 7.25, rot: 0, w: 1.1, tone: 'light' },
    { type: 'curtain', x: 5.6, y: 7.25, rot: 0, w: 1.3, tone: 'light' },
    { type: 'curtain', x: 0.18, y: 3.5, rot: 90, w: 0.9, tone: 'dark' },
    { type: 'curtain', x: 0.18, y: 6.9, rot: 90, w: 0.9, tone: 'light' },
    { type: 'curtain', x: 10.05, y: 7.25, rot: 0, w: 0.5, tone: 'light' },
    { type: 'painting', x: 8.2, y: 1.62, rot: 180, w: 1.5, h: 1.4, z: 1.45 },   // na grafitowym bloku (od strony salonu)
    { type: 'painting', x: 13.2, y: 3.29, rot: 0, w: 1.1, h: 1.3, z: 1.45 },    // hol
    { type: 'track', x: 0.4, y: 5.0, rot: 90, len: 10.6, spots: [1.0, 3.2, 6.4, 8.8] },
    { type: 'linear', x: 7.5, y: 6.6, rot: 90, len: 1.2 }, { type: 'linear', x: 9.6, y: 6.6, rot: 90, len: 1.2 },
    { type: 'linear', x: 7.5, y: 4.4, rot: 90, len: 1.2 }, { type: 'linear', x: 9.6, y: 4.4, rot: 90, len: 1.2 },
    // wiatrołap, hol
    { type: 'console', x: 12.1, y: 0.85, rot: -90, w: 1.2 },
    { type: 'pouf', x: 10.6, y: -1.9, r: 0.35 },
    { type: 'painting', x: 12.1, y: 0.85, rot: -90, w: 1.0, h: 1.2, z: 1.7 },
    { type: 'track', x: 11.9, y: 2.45, rot: 90, len: 12.0, spots: [1.2, 4.0, 7.0, 10.0] },
    { type: 'downlight', x: 11.15, y: -0.5 }, { type: 'downlight', x: 11.15, y: -2.6 },
    { type: 'downlight', x: 13.6, y: -0.1 }, { type: 'downlight', x: 7.2, y: 0.7 },
    // sypialnia
    { type: 'bed', x: 27.0, y: 4.55, rot: 0, w: 1.8, d: 2.1 },
    { type: 'nightstand', x: 25.85, y: 5.25, r: 0.25 }, { type: 'nightstand', x: 28.15, y: 5.25, r: 0.25 },
    { type: 'armchair', x: 28.5, y: 2.55, rot: 150 },
    { type: 'tv', x: 27.0, y: 1.82, rot: 180, w: 1.4, z: 1.25 },
    { type: 'curtain', x: 29.15, y: 2.3, rot: -90, w: 0.7, tone: 'light' },
    { type: 'curtain', x: 29.15, y: 7.9, rot: -90, w: 0.7, tone: 'light' },
    { type: 'wallSpot', x: 26.4, y: 5.55, z: 2.7, dir: [0, 1] }, { type: 'wallSpot', x: 27.6, y: 5.55, z: 2.7, dir: [0, 1] },
    { type: 'downlight', x: 25.5, y: 3.0 }, { type: 'downlight', x: 27.0, y: 7.3 },
    // pokoje dzieci
    { type: 'singleBed', x: 13.0, y: 5.0, rot: 90 }, { type: 'desk', x: 14.2, y: 7.05, rot: 180 }, { type: 'chair', x: 14.2, y: 6.4, rot: 180 },
    { type: 'singleBed', x: 17.45, y: 5.0, rot: -90 }, { type: 'desk', x: 18.6, y: 7.05, rot: 180 }, { type: 'chair', x: 18.6, y: 6.4, rot: 180 },
    { type: 'singleBed', x: 23.95, y: 5.0, rot: -90 }, { type: 'desk', x: 23.6, y: 8.1, rot: 180 }, { type: 'chair', x: 23.6, y: 7.45, rot: 180 },
    { type: 'downlight', x: 14.0, y: 5.4 }, { type: 'downlight', x: 18.5, y: 5.4 }, { type: 'downlight', x: 22.7, y: 5.9 },
    // łazienka z sauną
    { type: 'vanity', x: 21.0, y: 0.75, rot: 90, w: 1.6, basins: 2 },
    { type: 'mirror', x: 21.08, y: 0.75, rot: 90, w: 1.6, h: 0.8, z: 1.7 },
    { type: 'roundTub', x: 22.6, y: -1.7, r: 0.8 },
    { type: 'toilet', x: 24.35, y: 0.65, rot: -90 },
    { type: 'slats', x: 23.4, y: -1.7, rot: 90, len: 2.0 },
    { type: 'saunaBench', x: 22.1, y: -3.9, rot: 180, w: 2.0 },
    { type: 'shower', x: 24.0, y: -4.0 },
    { type: 'plant', x: 23.9, y: 0.6, s: 0.9 },
    { type: 'downlight', x: 22.0, y: 0.3 }, { type: 'downlight', x: 23.6, y: -1.8 }, { type: 'downlight', x: 22.2, y: -2.2 },
    // łazienka 16, pralnia, garderoba 2
    { type: 'vanity', x: 15.1, y: 0.7, rot: 90, w: 1.2, basins: 1 },
    { type: 'mirror', x: 15.18, y: 0.7, rot: 90, w: 1.2, h: 0.8, z: 1.7 },
    { type: 'toilet', x: 17.45, y: 0.5, rot: -90 },
    { type: 'shower', x: 17.1, y: -1.15 },
    { type: 'downlight', x: 16.4, y: 0.3 }, { type: 'downlight', x: 19.1, y: 0.0 },
    { type: 'pouf', x: 13.6, y: -0.1, r: 0.35 },
    // garaż
    { type: 'car', x: 14.4, y: -5.2, rot: 0 }, { type: 'car', x: 18.2, y: -5.2, rot: 0 },
    // taras zadaszony T1
    { type: 'outdoorTable', x: -4.1, y: 4.2, rot: 90, w: 2.4, d: 1.0 },
    { type: 'outdoorChair', x: -4.65, y: 3.3, rot: 90 }, { type: 'outdoorChair', x: -4.65, y: 4.2, rot: 90 }, { type: 'outdoorChair', x: -4.65, y: 5.1, rot: 90 },
    { type: 'outdoorChair', x: -3.55, y: 3.3, rot: -90 }, { type: 'outdoorChair', x: -3.55, y: 4.2, rot: -90 }, { type: 'outdoorChair', x: -3.55, y: 5.1, rot: -90 },
    { type: 'spiralStair', x: -5.95, y: 6.9, r: 1.0, top: R1 },
    { type: 'column', x: -7.05, y: 1.0 }, { type: 'column', x: -7.05, y: 4.5 }, { type: 'column', x: -7.05, y: 8.5 },
    { type: 'lounger', x: -8.6, y: 10.2, rot: 60 }, { type: 'lounger', x: -7.4, y: 10.4, rot: 40 },
    { type: 'fireBowl', x: -8.7, y: 2.2 },
    { type: 'plant', x: -1.2, y: 8.3, s: 1.4, outdoor: true },
    { type: 'downlight', x: -3.0, y: 2.0, outdoor: true }, { type: 'downlight', x: -3.0, y: 6.5, outdoor: true },
    { type: 'downlight', x: 9.4, y: -2.2, outdoor: true, z: 2.75 },
    // T3, T2, T5
    { type: 'outdoorChair', x: 30.3, y: 5.6, rot: 0 }, { type: 'outdoorChair', x: 30.3, y: 7.4, rot: 180 }, { type: 'sideTable', x: 30.3, y: 6.5, r: 0.28, outdoor: true },
    { type: 'lounger', x: 26.1, y: -2.3, rot: 180 }, { type: 'plant', x: 26.7, y: -0.8, s: 1.1, outdoor: true },
    { type: 'outdoorChair', x: 22.0, y: 10.0, rot: 90 }, { type: 'outdoorChair', x: 23.2, y: 10.0, rot: -90 },
    // taras na dachu
    { type: 'lounger', x: 2.0, y: 4.0, rot: -90, z: R1 }, { type: 'lounger', x: 2.0, y: 5.5, rot: -90, z: R1 },
    { type: 'sideTable', x: 3.2, y: 4.75, r: 0.3, z: R1, outdoor: true },
    // --- detale (dodatki)
    { type: 'decorIsland', x: 2.7, y: 2.33, rot: 0 },
    { type: 'pantryShelves', x: 7.2, y: 1.2, rot: 0, w: 2.2, h: 2.3 },
    { type: 'clock', x: 5.4, y: 0.62, rot: 180, z: 2.1 },
    { type: 'doormat', x: 9.45, y: -3.15 }, { type: 'wallLamp', x: 9.84, y: -2.0, rot: -90, z: 2.2 }, { type: 'wallLamp', x: 9.84, y: -0.9, rot: -90, z: 2.2 },
    { type: 'mirrorTall', x: 11.2, y: -3.72, rot: 180, w: 0.7, h: 1.9 },
    { type: 'coatRack', x: 12.28, y: 0.2, rot: 90, w: 0.9 },
    { type: 'bench', x: 13.6, y: -0.1, rot: 0, w: 1.0 },
    { type: 'wardrobeRods', x: 27.0, y: 6.75, rot: 180, w: 2.6 },
    { type: 'books', x: 25.85, y: 5.25, z: 0.5 }, { type: 'books', x: 28.15, y: 5.25, z: 0.5, n: 2 },
    { type: 'tvPanel', x: 27.0, y: 1.8, rot: 180, w: 1.4, z: 1.25 },
    { type: 'rug', x: 14.0, y: 5.2, w: 1.6, d: 2.2 }, { type: 'rug', x: 18.6, y: 5.2, w: 1.6, d: 2.2 }, { type: 'rug', x: 22.8, y: 5.6, w: 1.8, d: 2.2 }, { type: 'rug', x: 27.0, y: 3.6, w: 2.6, d: 1.8 },
    { type: 'shelfWall', x: 14.9, y: 3.47, rot: 0, w: 0.9, z: 1.6 }, { type: 'shelfWall', x: 18.4, y: 3.47, rot: 0, w: 0.9, z: 1.6 }, { type: 'shelfWall', x: 23.0, y: 3.47, rot: 0, w: 0.9, z: 1.6 },
    { type: 'laptop', x: 14.2, y: 7.05, rot: 180, z: 0.755 }, { type: 'laptop', x: 18.6, y: 7.05, rot: 180, z: 0.755 }, { type: 'laptop', x: 23.6, y: 8.1, rot: 180, z: 0.755 },
    { type: 'clock', x: 13.0, y: 7.4, rot: 0, z: 2.0 }, { type: 'clock', x: 17.4, y: 7.4, rot: 0, z: 2.0 },
    { type: 'towels', x: 21.35, y: 0.25, rot: 90, z: 0.83 }, { type: 'bottles', x: 21.3, y: 1.25, rot: 90, z: 0.83 }, { type: 'towels', x: 23.5, y: -1.7, rot: 0, z: 0.0, n: 1 },
    { type: 'towels', x: 15.45, y: 0.2, rot: 90, z: 0.83 }, { type: 'bottles', x: 15.4, y: 1.1, rot: 90, z: 0.83 },
    { type: 'bottles', x: 19.8, y: 1.2, rot: 0, z: 0.91 },
    { type: 'painting', x: 27.0, y: 6.36, rot: 180, w: 1.2, h: 0.8, z: 1.9 },
    { type: 'downpipe', x: -0.4, y: -0.4, h: 3.7 }, { type: 'downpipe', x: -0.4, y: 7.8, h: 3.7 }, { type: 'downpipe', x: 29.6, y: 8.9, h: 3.7 }, { type: 'downpipe', x: 29.6, y: -0.4, h: 3.7 },
    { type: 'downpipe', x: 12.05, y: -8.75, h: 3.7 }, { type: 'downpipe', x: 27.15, y: -8.75, h: 3.7 }, { type: 'downpipe', x: 20.35, y: 9.0, h: 3.7 },
    { type: 'grassClump', x: -9.3, y: -0.5, s: 1.2 }, { type: 'grassClump', x: -9.3, y: 11.6, s: 1.1 }, { type: 'grassClump', x: 1.5, y: 11.6, s: 1.0 }, { type: 'grassClump', x: 8.0, y: 11.5, s: 1.2 },
    { type: 'grassClump', x: 32.0, y: 9.5, s: 1.1 }, { type: 'grassClump', x: 32.0, y: -1.5, s: 1.0 }, { type: 'grassClump', x: 7.0, y: -6.0, s: 1.1 }, { type: 'grassClump', x: 7.0, y: -9.5, s: 1.0 }, { type: 'grassClump', x: -17.5, y: -1.5, s: 1.2 }, { type: 'grassClump', x: -17.5, y: 10.5, s: 1.2 },
  ],

  // ---------------------------------------------------------------- światła (żarówki; oprawy powyżej)
  lights: [
    { type: 'point', x: 2.15, y: 5.65, z: 1.75, i: 14, k: 2700, dist: 9 },   // wisząca 1
    { type: 'point', x: 3.15, y: 5.65, z: 1.9, i: 12, k: 2700, dist: 9 },    // wisząca 2
    { type: 'point', x: 2.7, y: 2.33, z: 1.55, i: 10, k: 3000, dist: 6 },    // okap
    { type: 'point', x: 5.5, y: 3.15, z: 2.72, i: 12, k: 2400, dist: 12 },   // gzyms LED salon
    { type: 'spot', x: 8.2, y: 5.0, z: 2.75, tx: 8.2, ty: 7.4, tz: 1.3, i: 40, k: 3000, angle: 0.55 },  // ściana TV
    { type: 'spot', x: 9.5, y: 5.0, z: 2.75, tx: 11.4, ty: 6.3, tz: 1.0, i: 30, k: 3000, angle: 0.5 },  // kominek
    { type: 'spot', x: 7.5, y: 5.0, z: 2.75, tx: 8.0, ty: 5.0, tz: 0.4, i: 22, k: 3000, angle: 0.7 },   // sofa
    { type: 'point', x: 14.5, y: 2.45, z: 2.7, i: 14, k: 2700, dist: 10 },   // hol
    { type: 'point', x: 11.15, y: -1.4, z: 2.7, i: 10, k: 2700, dist: 6 },   // wiatrołap
    { type: 'spot', x: 26.4, y: 5.4, z: 2.72, tx: 26.4, ty: 5.9, tz: 1.0, i: 24, k: 2700, angle: 0.5 },
    { type: 'spot', x: 27.6, y: 5.4, z: 2.72, tx: 27.6, ty: 5.9, tz: 1.0, i: 24, k: 2700, angle: 0.5 },
    { type: 'point', x: 26.5, y: 3.0, z: 2.6, i: 8, k: 2700, dist: 7 },      // sypialnia ogólne
    { type: 'point', x: 22.0, y: 0.3, z: 2.65, i: 10, k: 2700, dist: 6 },    // łazienka 14
    { type: 'point', x: 22.5, y: -2.2, z: 2.65, i: 9, k: 2700, dist: 6 },
    { type: 'point', x: 22.1, y: -3.7, z: 1.8, i: 5, k: 2200, dist: 3 },     // sauna
    { type: 'point', x: 14.0, y: 5.4, z: 2.65, i: 9, k: 2700, dist: 6 },     // pokoje
    { type: 'point', x: 18.5, y: 5.4, z: 2.65, i: 9, k: 2700, dist: 6 },
    { type: 'point', x: 22.7, y: 5.9, z: 2.65, i: 9, k: 2700, dist: 6 },
    { type: 'point', x: 16.4, y: 0.0, z: 2.65, i: 8, k: 2700, dist: 5 },     // łazienka 16
    { type: 'point', x: 13.6, y: 0.0, z: 2.65, i: 6, k: 2700, dist: 5 },     // garderoba 2
    { type: 'point', x: -3.0, y: 4.2, z: 2.7, i: 12, k: 2700, dist: 9, outdoor: true },   // taras T1
    { type: 'point', x: 9.4, y: -2.2, z: 2.7, i: 8, k: 2700, dist: 6, outdoor: true },    // wejście
  ],

  // ---------------------------------------------------------------- dach (płyty; z0/z1), parapety i attyki
  roof: [
    { rect: [-7.5, -0.3, -7.0, 8.91], z0: R0, z1: R1, soffit: 'soffit' },            // A (z otworem na schody)
    { rect: [-7.0, -0.3, -4.9, 5.85], z0: R0, z1: R1, soffit: 'soffit' },
    { rect: [-7.0, 7.95, -4.9, 8.91], z0: R0, z1: R1, soffit: 'soffit' },
    { rect: [-4.9, -0.3, 11.75, 8.91], z0: R0, z1: R1, soffit: 'soffit' },
    { rect: [11.75, -1.94, 20.6, 8.91], z0: R0, z1: R1, soffit: 'soffit' },           // B
    { rect: [20.6, -4.97, 31.1, 8.8], z0: R0, z1: R1, soffit: 'soffit' },             // C
    { rect: [8.8, -8.68, 20.6, -1.94], z0: R0, z1: R1, soffit: 'soffit' },            // D
    { rect: [8.8, -1.94, 11.75, -0.3], z0: R0, z1: R1, soffit: 'soffit' },            // E
    { rect: [20.6, -8.68, 27.05, -4.97], z0: R0, z1: R1, soffit: 'soffit' },          // F
    // attyka tarasu na dachu (podwyższona bryła nad częścią dzienną)
    { rect: [-7.5, -0.3, 11.75, 0.1], z0: R1, z1: 4.67, mat: 'ext_white' },
    { rect: [-7.5, 8.51, 11.75, 8.91], z0: R1, z1: 4.67, mat: 'ext_white' },
    { rect: [-7.5, 0.1, -7.1, 8.51], z0: R1, z1: 4.67, mat: 'ext_white' },
    { rect: [11.35, 0.1, 11.75, 8.51], z0: R1, z1: 4.67, mat: 'ext_white' },
  ],
  roofHole: [-7.0, 5.85, -4.9, 7.95],   // otwór na schody spiralne + balustrada

  // ---------------------------------------------------------------- otoczenie
  site: {
    lawn: [-24, -22, 40, 22],
    fence: { rect: [-23, -21, 39, 21], h: 1.8, mat: 'ext_white' },
    pool: { rect: [-16.5, -0.5, -10.5, 9.5], depth: 1.5 },
    poolDeck: [-17.3, -1.3, -9.9, 10.3],
    trees: [
      [-20, 16, 7], [-14, 17.5, 6], [2, 16, 8], [16, 15, 7], [30, 14, 6.5], [36, 4, 7],
      [34, -12, 6], [20, -19, 7], [-4, -12, 5.5], [-20, -14, 7], [-21, 2, 6], [3, -18, 6.5],
      [-12, -8, 4.5],
    ],
    shrubs: [
      [-9.5, 12.5, 1.2], [-2, 12.3, 1.0], [6, 10.5, 1.1], [12, 10.2, 1.0], [26, 10.5, 1.2], [32.5, 10.0, 1.0],
      [33, -2, 1.0], [30, -6, 1.1], [7, -5, 1.0], [6.5, -12, 1.2], [-18, 8, 1.0],
    ],
  },

  // ---------------------------------------------------------------- start
  start: { room: 'wejscie' },
};
