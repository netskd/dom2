// HOMEKONCEPT 168 — definicja domu dla silnika app.js
// Rzut parteru 199,25 m² + garaż 51,00 m²; wymiary budynku 20,37 × 25,78 m; dach kopertowy, kalenica +7,09.
// Układ: metry, rzut architektoniczny (X → prawo rysunku, Y → góra). (0,0) = wewnętrzny narożnik SW łazienki 5
// (południowo-zachodni narożnik wnętrza skrzydła sypialnego). Wejście główne w rzucie od dołu ('S').
// Materiały wg wizualizacji HOMEKONCEPT: kremowy kamień, ciemny dąb/wenge, kwarcyt Patagonia, mosiądz.

const H = 2.94;            // sufit w strefie nocnej (przekrój: +2,94)
const HD = 3.80;           // sufit podniesiony w strefie dziennej (+3,80)
const EAVE = 3.95;         // spód okapu / podbitki
const WH = 3.92;           // wysokość ścian zewnętrznych
const W = (a, b, t, o = {}) => ({ a, b, t, ...o });
const EXT = { matL: 'plaster_dark', matR: 'plaster_warm', ext: true, h: WH };
const EXTW = { matL: 'cedar', matR: 'plaster_warm', ext: true, h: WH };   // fragmenty z okładziną drewnianą

export default {
  id: 'hk168',
  name: 'HomeKoncept 168',
  author: 'HOMEKONCEPT · parterowy 199 m², dach kopertowy, wysoki salon',
  location: { lat: 53.13, lon: 23.16, name: 'Białystok' },
  ceiling: H,
  entranceSide: 'S',
  center: [6.5, 5.5],
  mapBounds: [-4.6, -9.6, 17.6, 18.2],

  // ---------------------------------------------------------------- pomieszczenia
  rooms: [
    { id: 'wejscie', name: 'Przed wejściem', rect: [5.0, -6.6, 9.4, -3.7], spawn: [6.1, -5.2], look: [0, 1], outdoor: true },
    { id: 'wiatrolap', name: '1 · Wiatrołap', rect: [5.04, -3.40, 7.14, -0.20], spawn: [6.1, -2.7], look: [0, 1] },
    { id: 'garderoba', name: '2 · Garderoba', rect: [7.34, -3.40, 9.32, -1.55], spawn: [8.3, -2.4], look: [0, -1] },
    { id: 'hol', name: '3 · Komunikacja', rect: [3.54, 0, 4.84, 11.11], spawn: [4.2, 1.0], look: [0, 1] },
    { id: 'pralnia', name: '4 · Pralnia', rect: [1.17, -2.06, 4.84, -0.25], spawn: [3.9, -1.2], look: [-1, 0] },
    { id: 'lazienka5', name: '5 · Łazienka', rect: [0, 0, 3.42, 1.48], spawn: [2.9, 0.75], look: [-1, 0] },
    { id: 'sypialnia6', name: '6 · Sypialnia', rect: [0, 1.60, 3.42, 5.05], spawn: [2.9, 2.2], look: [-0.5, 1] },
    { id: 'sypialnia7', name: '7 · Sypialnia', rect: [0, 5.17, 3.42, 8.62], spawn: [2.9, 5.8], look: [-0.5, 1] },
    { id: 'lazienka8', name: '8 · Łazienka', rect: [0, 8.74, 3.42, 10.89], spawn: [2.9, 9.4], look: [-1, 0.2] },
    { id: 'master', name: '9 · Sypialnia master', rect: [3.54, 13.07, 8.27, 16.51], spawn: [4.3, 13.6], look: [0.5, 0.8] },
    { id: 'lazienka10', name: '10 · Łazienka master', rect: [0, 11.01, 3.42, 13.81], spawn: [2.9, 11.6], look: [-0.9, 0.4] },
    { id: 'garderoba11', name: '11 · Garderoba master', rect: [0, 13.93, 3.42, 16.51], spawn: [2.9, 14.6], look: [-0.8, 0.6] },
    { id: 'sypialnia12', name: '12 · Sypialnia', rect: [5.04, 9.34, 8.27, 12.95], spawn: [5.6, 9.9], look: [0.7, 0.7] },
    { id: 'gabinet', name: '13 · Gabinet', rect: [5.04, 5.61, 8.27, 9.22], spawn: [5.6, 6.2], look: [0.7, 0.7] },
    { id: 'salon', name: '14 · Salon', rect: [5.04, 0, 14.00, 5.42], spawn: [6.6, 4.2], look: [0.75, -0.66] },
    { id: 'jadalnia', name: '14 · Jadalnia', rect: [10.4, 2.6, 14.00, 5.42], spawn: [11.0, 1.9], look: [0.4, 0.9] },
    { id: 'kuchnia', name: '15 · Kuchnia', rect: [9.42, -3.40, 14.00, 0], spawn: [12.6, -0.55], look: [-0.55, -0.83] },
    { id: 'spizarnia', name: '16 · Spiżarnia', rect: [7.34, -1.43, 9.32, -0.20], spawn: [8.3, -0.6], look: [0, -1] },
    { id: 'kotlownia', name: '17 · Kotłownia', rect: [-3.31, -2.06, 0.91, -0.25], spawn: [-2.6, -1.2], look: [1, 0] },
    { id: 'garaz', name: 'G · Garaż', rect: [-3.31, -8.31, 4.79, -2.31], spawn: [4.2, -2.9], look: [-0.8, -0.6] },
    { id: 'taras', name: 'T · Taras zadaszony', rect: [8.78, 5.61, 16.60, 11.07], spawn: [11.4, 7.2], look: [-0.6, -0.8], outdoor: true },
    { id: 'ogrod', name: 'Ogród · widok na dom', rect: [17, 10, 26, 20], spawn: [22.0, 15.5], look: [-0.75, -0.66], outdoor: true },
    { id: 'front', name: 'Podjazd · widok na front', rect: [2, -17, 12, -10], spawn: [6.5, -15.5], look: [0.1, 1], outdoor: true },
  ],

  // ---------------------------------------------------------------- podłogi
  floors: [
    // strefa dzienna – kremowy kamień wielkoformatowy
    { rect: [5.04, -0.20, 14.00, 5.42], mat: 'limestone' },
    { rect: [9.42, -3.40, 14.00, -0.20], mat: 'limestone' },
    { rect: [5.04, -3.40, 7.14, -0.20], mat: 'limestone' },
    { rect: [7.34, -3.40, 9.32, -0.20], mat: 'limestone' },
    { rect: [3.54, 0, 4.84, 11.11], mat: 'limestone' },
    { rect: [3.54, 11.11, 4.84, 13.07], mat: 'limestone' },
    // strefa nocna – jasny dąb
    { rect: [0, 1.60, 3.42, 8.62], mat: 'oak' },
    { rect: [3.54, 13.07, 8.27, 16.51], mat: 'oak' },
    { rect: [5.04, 5.61, 8.27, 12.95], mat: 'oak' },
    { rect: [0, 13.93, 3.42, 16.51], mat: 'oak' },
    // łazienki i pomieszczenia techniczne
    { rect: [0, 0, 3.42, 1.48], mat: 'limestone' },
    { rect: [0, 8.74, 3.42, 10.89], mat: 'limestone' },
    { rect: [0, 11.01, 3.42, 13.81], mat: 'limestone' },
    { rect: [1.17, -2.06, 4.84, -0.25], mat: 'limestone' },
    { rect: [-3.31, -2.06, 0.91, -0.25], mat: 'concrete' },
    { rect: [-3.31, -8.31, 4.79, -2.31], mat: 'concrete' },
    // tarasy i utwardzenia
    { rect: [8.72, 5.42, 16.60, 11.07], mat: 'deck', z: -0.03 },
    { rect: [14.00, -3.60, 16.60, 5.42], mat: 'deck', z: -0.03 },
    { rect: [4.90, -6.70, 9.60, -3.60], mat: 'limestone', z: -0.04 },      // podest i podcień wejściowy
    { rect: [-3.80, -14.5, 9.60, -6.70], mat: 'pavers', z: -0.07 },        // podjazd
    { rect: [9.60, -6.70, 16.60, -3.60], mat: 'pavers', z: -0.07 },
    { rect: [16.60, -3.60, 17.40, 11.07], mat: 'pavers', z: -0.07 },
  ],

  // ---------------------------------------------------------------- sufity
  ceilings: [
    { rect: [5.04, -3.40, 14.00, 5.42], mat: 'ceiling_warm', z: HD },     // wysoki sufit strefy dziennej
    { rect: [3.54, 0, 4.84, 13.07], mat: 'ceiling_warm' },
    { rect: [0, 0, 3.42, 16.51], mat: 'ceiling_warm' },
    { rect: [3.54, 13.07, 8.27, 16.51], mat: 'ceiling_warm' },
    { rect: [5.04, 5.61, 8.27, 12.95], mat: 'ceiling_warm' },
    { rect: [1.17, -2.06, 4.84, -0.25], mat: 'ceiling_warm' },
    { rect: [-3.31, -2.06, 0.91, -0.25], mat: 'ceiling_garage' },
    { rect: [-3.31, -8.31, 4.79, -2.31], mat: 'ceiling_garage' },
    { rect: [7.34, -3.40, 9.32, -0.20], mat: 'ceiling_warm' },
  ],

  // ---------------------------------------------------------------- ściany
  walls: [
    // ---- obrys zewnętrzny (lewa strona kierunku a→b = zewnątrz)
    W([-3.535, -8.535], [-3.535, -0.025], 0.45, { ...EXT, openings: [
      { at: 5.0, w: 0.9, h: 1.1, sill: 1.6, kind: 'glass' },
      { at: 7.1, w: 0.9, h: 1.1, sill: 1.6, kind: 'glass' },
    ] }),
    W([-3.535, -0.025], [-0.225, -0.025], 0.45, EXT),
    W([-0.225, -0.025], [-0.225, 16.735], 0.45, { ...EXT, openings: [
      { at: 0.55, w: 0.7, h: 1.0, sill: 1.5, kind: 'glass' },                       // 5 łazienka
      { at: 2.75, w: 1.9, h: 2.4, kind: 'glass', mullions: [0.95] },                // 6 sypialnia
      { at: 6.32, w: 1.9, h: 2.4, kind: 'glass', mullions: [0.95] },                // 7 sypialnia
      { at: 9.35, w: 1.1, h: 1.3, sill: 1.3, kind: 'glass' },                       // 8 łazienka
      { at: 11.95, w: 1.5, h: 1.3, sill: 1.1, kind: 'glass' },                      // 10 łazienka master
      { at: 15.0, w: 0.8, h: 1.9, sill: 0.6, kind: 'glass' },                       // 11 garderoba
    ] }),
    W([-0.225, 16.735], [8.495, 16.735], 0.45, { ...EXTW, openings: [
      { at: 4.3, w: 3.4, h: 2.5, kind: 'glass', mullions: [1.13, 2.27] },           // master – okno od ogrodu
    ] }),
    W([8.495, 16.735], [8.495, 5.515], 0.45, { ...EXT, openings: [
      { at: 0.55, w: 1.2, h: 2.5, kind: 'glassdoor' },                              // master – wyjście
      { at: 4.25, w: 2.4, h: 2.5, kind: 'slider', fixed: 'R' },                     // 12 sypialnia na taras
      { at: 8.0, w: 2.4, h: 2.5, kind: 'slider' },                                  // 13 gabinet na taras
    ] }),
    W([8.495, 5.515], [14.225, 5.515], 0.45, { ...EXT, h: WH, openings: [
      { at: 0.4, w: 4.9, h: 3.1, kind: 'slider', fixed: 'R' },                      // salon – przeszklenie na taras
    ] }),
    W([14.225, 5.515], [14.225, -3.625], 0.45, { ...EXT, h: WH, openings: [
      { at: 0.5, w: 4.3, h: 3.1, kind: 'glass', mullions: [1.43, 2.87] },           // jadalnia
      { at: 5.4, w: 1.2, h: 3.1, kind: 'glassdoor' },                               // wyjście z salonu
      { at: 7.35, w: 1.5, h: 1.2, sill: 1.35, kind: 'glass' },                      // kuchnia – okno pasmowe
    ] }),
    W([14.225, -3.625], [4.815, -3.625], 0.45, { ...EXTW, openings: [
      { at: 1.3, w: 2.6, h: 1.2, sill: 1.35, kind: 'glass', mullions: [1.3] },      // kuchnia – pasmo nad blatem
      { at: 6.55, w: 0.9, h: 2.1, sill: 0.0, kind: 'glass' },                       // doświetlenie przy wejściu
      { at: 7.75, w: 1.1, h: 2.4, kind: 'door', leaf: 'entry', open: 80, swing: 'L', into: 'R' },
    ] }),
    W([4.900, -3.625], [4.900, -8.535], 0.30, { matL: 'plaster_dark', matR: 'garage_wall', ext: true, h: WH }),
    W([4.815, -8.535], [-3.535, -8.535], 0.45, { ...EXT, openings: [
      { at: 1.65, w: 5.2, h: 2.5, kind: 'garagedoor', mat: 'cedar' },
    ] }),

    // ---- ściany wewnętrzne strefy nocnej
    W([3.48, -0.125], [3.48, 16.57], 0.12, { mat: 'plaster_warm', openings: [
      { at: 0.95, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'L' },   // 5
      { at: 3.45, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'L' },   // 6
      { at: 7.0, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'L' },    // 7
      { at: 9.6, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'L' },    // 8
      { at: 12.3, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'L' },   // 10 (z master)
      { at: 14.9, w: 1.1, h: 2.4, kind: 'opening' },                                               // 11 garderoba
    ] }),
    W([0, 1.54], [3.42, 1.54], 0.12, { mat: 'plaster_warm' }),
    W([0, 5.11], [3.42, 5.11], 0.12, { mat: 'plaster_warm' }),
    W([0, 8.68], [3.42, 8.68], 0.12, { mat: 'plaster_warm' }),
    W([0, 10.95], [3.42, 10.95], 0.12, { mat: 'plaster_warm' }),
    W([0, 13.87], [3.42, 13.87], 0.12, { mat: 'plaster_warm' }),
    // komunikacja | pokoje wschodnie i salon
    W([4.94, -0.125], [4.94, 5.515], 0.20, { mat: 'plaster_warm', matR: 'wenge', openings: [
      { at: 1.0, w: 1.6, h: 2.6, kind: 'opening' },                                  // otwarcie na salon
    ] }),
    W([4.94, 5.515], [4.94, 13.07], 0.20, { mat: 'plaster_warm', openings: [
      { at: 1.15, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'R', into: 'R' },   // 13 gabinet
      { at: 4.85, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'R', into: 'R' },   // 12 sypialnia
    ] }),
    W([3.54, 11.17], [4.84, 11.17], 0.12, { mat: 'plaster_warm', openings: [
      { at: 0.2, w: 1.0, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'L' },    // wejście do master
    ] }),
    W([4.94, 13.01], [8.27, 13.01], 0.12, { mat: 'plaster_warm' }),
    W([5.04, 9.28], [8.27, 9.28], 0.12, { mat: 'plaster_warm' }),
    W([4.94, 5.515], [8.495, 5.515], 0.19, { mat: 'plaster_warm', matL: 'wenge' }),   // salon | gabinet
    // ---- strefa dzienna i wejściowa
    W([4.92, -0.20], [7.24, -0.20], 0.20, { mat: 'plaster_warm', openings: [
      { at: 0.75, w: 1.1, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'R', into: 'L' },   // wiatrołap → salon
    ] }),
    W([7.24, -0.20], [9.42, -0.20], 0.12, { mat: 'plaster_warm', openings: [
      { at: 0.9, w: 0.8, h: 2.4, kind: 'door', leaf: 'white', open: 85, swing: 'R', into: 'L' },   // spiżarnia
    ] }),
    W([7.24, -3.625], [7.24, -0.20], 0.20, { mat: 'plaster_warm', openings: [
      { at: 1.1, w: 0.9, h: 2.4, kind: 'door', leaf: 'dark', open: 85, swing: 'L', into: 'R' },    // garderoba 2
    ] }),
    W([9.37, -3.625], [9.37, -0.20], 0.14, { mat: 'plaster_warm' }),
    W([7.34, -1.49], [9.37, -1.49], 0.12, { mat: 'plaster_warm' }),
    // pralnia / kotłownia / garaż
    W([0, -0.125], [4.90, -0.125], 0.25, { mat: 'plaster_warm', openings: [
      { at: 4.0, w: 0.9, h: 2.4, kind: 'door', leaf: 'white', open: 85, swing: 'R', into: 'L' },   // pralnia z wiatrołapu
    ] }),
    W([1.04, -2.185], [1.04, -0.125], 0.26, { mat: 'plaster_warm', matL: 'garage_wall', openings: [
      { at: 0.75, w: 0.9, h: 2.1, kind: 'door', leaf: 'white', open: 85, swing: 'L' },             // kotłownia
    ] }),
    W([-3.31, -2.185], [4.90, -2.185], 0.25, { matR: 'garage_wall', matL: 'plaster_warm', openings: [
      { at: 7.4, w: 0.9, h: 2.1, kind: 'door', leaf: 'white', open: 80, swing: 'R', into: 'L' },   // garaż → wiatrołap
      { at: 3.2, w: 0.9, h: 2.1, kind: 'door', leaf: 'white', open: 80, swing: 'R', into: 'L' },   // garaż → kotłownia
    ] }),
    // prysznice – tafle szkła
    W([2.30, 9.95], [3.42, 9.95], 0.02, { mat: 'glass_panel', h: 2.3, openings: [{ at: 0, w: 1.12, h: 2.3, kind: 'glass', frame: 'none' }] }),
    W([2.30, 12.60], [3.42, 12.60], 0.02, { mat: 'glass_panel', h: 2.3, openings: [{ at: 0, w: 1.12, h: 2.3, kind: 'glass', frame: 'none' }] }),
  ],

  // ---------------------------------------------------------------- zabudowy i bryły
  boxes: [
    // kuchnia – wysoka zabudowa wenge z piekarnikami i witryną
    { rect: [9.42, -1.30, 10.12, 0], h: HD, mat: 'wenge', doors: 'x1', ovens: [[-1.15, -0.35]], ovenFace: 'x1' },
    { rect: [10.12, -0.66, 12.6, 0], h: 2.6, mat: 'wenge', doors: 'y0' },
    { rect: [9.42, -3.40, 14.00, -2.78], h: 0.86, mat: 'white_gloss', doors: 'y1' },           // blat pod oknem
    { rect: [9.40, -3.42, 14.02, -2.74], z: 0.86, h: 0.04, mat: 'stone_beige' },
    { rect: [13.38, -2.78, 14.00, -1.0], h: 0.86, mat: 'white_gloss', doors: 'x0' },
    { rect: [13.36, -2.80, 14.02, -0.98], z: 0.86, h: 0.04, mat: 'stone_beige' },
    // salon – ściana TV (ciemny panel) i kominek w kwarcycie
    { rect: [5.04, 3.30, 5.22, 5.42], h: HD, mat: 'wenge' },
    { rect: [5.04, 0.60, 5.22, 3.10], h: HD, mat: 'patagonia' },                                // kominek
    { rect: [13.70, 0.10, 14.00, 2.20], h: HD, mat: 'wenge', doors: 'x0' },
    // garderoby i szafy
    { rect: [0, 13.93, 0.62, 16.51], h: H, mat: 'wenge', doors: 'x1' },
    { rect: [2.80, 13.93, 3.42, 14.70], h: H, mat: 'wenge', doors: 'x0' },
    { rect: [0, 16.0, 3.42, 16.51], h: H, mat: 'wenge', doors: 'y0' },
    { rect: [7.34, -3.40, 9.32, -2.85], h: H, mat: 'wenge', doors: 'y1' },
    { rect: [8.30, -2.20, 9.32, -1.55], h: H, mat: 'wenge', doors: 'y0' },
    { rect: [5.04, 9.34, 8.27, 9.96], h: H, mat: 'wenge', doors: 'y1' },                         // szafa 12
    { rect: [5.04, 8.60, 8.27, 9.22], h: H, mat: 'wenge', doors: 'y0' },                        // zabudowa 13
    { rect: [0, 1.60, 0.60, 3.30], h: H, mat: 'wenge', doors: 'x1' },                           // szafy sypialni 6
    { rect: [0, 5.17, 0.60, 6.90], h: H, mat: 'wenge', doors: 'x1' },                           // szafy sypialni 7
    { rect: [3.54, 13.07, 4.30, 14.60], h: H, mat: 'wenge', doors: 'x1' },                      // zabudowa master
    // spiżarnia, pralnia, technika
    { rect: [7.34, -1.43, 7.80, -0.20], h: 2.3, mat: 'wardrobe_dark' },
    { rect: [8.90, -1.43, 9.32, -0.20], h: 2.3, mat: 'wardrobe_dark' },
    { rect: [1.17, -2.06, 4.84, -1.50], h: 0.9, mat: 'white_gloss', doors: 'y1' },
    { rect: [1.15, -2.08, 4.86, -1.46], z: 0.9, h: 0.04, mat: 'stone_beige' },
    { rect: [2.90, -0.85, 4.30, -0.25], h: 2.3, mat: 'wardrobe_dark', doors: 'y0' },
    { rect: [-3.31, -2.06, -2.45, -0.25], h: 1.9, mat: 'appliance' },
    { rect: [-3.31, -8.31, -2.70, -4.50], h: 2.0, mat: 'appliance' },
    // gzyms LED w strefie dziennej i w holu
    { rect: [5.22, 4.80, 13.70, 5.42], z: HD - 0.26, h: 0.2, mat: 'ceiling_warm', led: ['y0'] },
    { rect: [3.54, 0, 4.84, 0.5], z: H - 0.26, h: 0.2, mat: 'ceiling_warm', led: ['y1'] },
    // zadaszenie wejścia (podcień z lamelami) – słupy i belka
    { rect: [9.30, -6.70, 9.60, -3.60], h: 3.6, mat: 'plaster_dark' },
    // komin
    { rect: [4.60, 1.40, 5.22, 2.10], z: EAVE, h: 3.0, mat: 'plaster_dark' },
  ],

  // ---------------------------------------------------------------- meble i wyposażenie
  furniture: [
    // ===== SALON (sofy boucle, kwarcytowy stolik, kominek, pierścieniowe lampy)
    { type: 'rug', x: 8.3, y: 2.5, w: 4.6, d: 3.8 },
    { type: 'curvedSofa', x: 8.3, y: 1.35, rot: 180, w: 3.6, d: 1.15 },
    { type: 'curvedSofa', x: 6.45, y: 3.1, rot: 90, w: 2.7, d: 1.1, mat: 'fabric_sand' },
    { type: 'marbleTable', x: 8.5, y: 2.6, rot: 0, w: 1.4, d: 0.9 },
    { type: 'sideTable', x: 9.9, y: 1.7, r: 0.3 },
    { type: 'tv', x: 5.3, y: 4.35, rot: 90, w: 1.8, z: 1.5 },
    { type: 'fireplace', x: 5.28, y: 1.85, rot: 90, w: 1.2 },
    { type: 'ringLight', x: 8.3, y: 2.6, z: 2.5, r: 0.62, n: 2 },
    { type: 'plant', x: 13.3, y: 4.9, s: 1.7 },
    { type: 'plant', x: 5.6, y: 5.0, s: 1.2 },
    { type: 'floorLamp', x: 6.3, y: 0.55 },
    { type: 'curtain', x: 13.95, y: 1.3, rot: -90, w: 0.9, tone: 'light' },
    { type: 'curtain', x: 13.95, y: 4.9, rot: -90, w: 0.9, tone: 'light' },
    { type: 'curtain', x: 9.3, y: 5.3, rot: 0, w: 0.9, tone: 'light' },
    { type: 'curtain', x: 13.6, y: 5.3, rot: 0, w: 0.9, tone: 'light' },
    { type: 'track', x: 6.1, y: 0.6, rot: 90, len: 4.4, spots: [0.6, 1.8, 3.0, 4.0] },
    { type: 'books', x: 8.5, y: 2.6, z: 0.52 },
    // ===== JADALNIA
    { type: 'ovalTable', x: 11.9, y: 3.9, rot: 0, w: 2.7, d: 1.25 },
    { type: 'diningChair', x: 11.0, y: 4.75, rot: 0 }, { type: 'diningChair', x: 11.9, y: 4.75, rot: 0 }, { type: 'diningChair', x: 12.8, y: 4.75, rot: 0 },
    { type: 'diningChair', x: 11.0, y: 3.05, rot: 180 }, { type: 'diningChair', x: 11.9, y: 3.05, rot: 180 }, { type: 'diningChair', x: 12.8, y: 3.05, rot: 180 },
    { type: 'diningChair', x: 10.25, y: 3.9, rot: 90 }, { type: 'diningChair', x: 13.55, y: 3.9, rot: -90 },
    { type: 'ringLight', x: 11.9, y: 3.9, z: 2.45, r: 0.5, n: 2 },
    // ===== KUCHNIA
    { type: 'barIsland', x: 11.9, y: -1.45, rot: 0, w: 3.4, d: 1.15 },
    { type: 'barStools', x: 11.9, y: -0.68, rot: 180, n: 3, gap: 0.68 },
    { type: 'linear', x: 11.9, y: -1.45, rot: 90, len: 2.2 },
    { type: 'bottles', x: 10.6, y: -3.0, rot: 0, z: 0.9 },
    { type: 'decorIsland', x: 11.9, y: -1.45, rot: 0 },
    { type: 'downlight', x: 10.4, y: -2.4 }, { type: 'downlight', x: 13.2, y: -2.4 },
    // ===== WIATROŁAP I HOL
    { type: 'doormat', x: 6.1, y: -3.0 },
    { type: 'bench', x: 5.45, y: -1.9, rot: 90, w: 1.2 },
    { type: 'mirrorTall', x: 7.12, y: -2.3, rot: -90, w: 0.7, h: 1.9 },
    { type: 'console', x: 6.95, y: -1.0, rot: -90, w: 1.0 },
    { type: 'coatRack', x: 5.07, y: -0.75, rot: 90, w: 0.9 },
    { type: 'painting', x: 4.86, y: 7.4, rot: 90, w: 1.0, h: 1.4, z: 1.6 },
    { type: 'painting', x: 4.86, y: 3.0, rot: 90, w: 0.9, h: 1.2, z: 1.6 },
    { type: 'wallSpot', x: 4.80, y: 5.4, rot: 90, z: 2.8 },
    { type: 'downlight', x: 4.19, y: 2.0 }, { type: 'downlight', x: 4.19, y: 6.0 }, { type: 'downlight', x: 4.19, y: 10.0 },
    { type: 'downlight', x: 6.1, y: -1.2 }, { type: 'downlight', x: 8.3, y: -0.8 },
    // ===== SYPIALNIA MASTER (9)
    { type: 'fluteWall', x: 5.95, y: 16.49, rot: 180, w: 3.4, h: 2.5 },
    { type: 'stoneStrip', x: 5.95, y: 16.46, rot: 180, w: 3.4, h: 0.75, z: 0.62 },
    { type: 'panelBed', x: 5.95, y: 15.1, rot: 180, w: 1.9, d: 2.15 },
    { type: 'nightstand', x: 4.75, y: 15.95, r: 0.26 }, { type: 'nightstand', x: 7.15, y: 15.95, r: 0.26 },
    { type: 'sconceRing', x: 7.55, y: 16.45, rot: 180, z: 1.75 }, { type: 'sconceRing', x: 7.55, y: 16.45, rot: 180, z: 1.3 },
    { type: 'floorLamp', x: 4.3, y: 16.1 },
    { type: 'rug', x: 5.95, y: 14.6, w: 3.2, d: 2.6 },
    { type: 'sideTable', x: 7.8, y: 14.3, r: 0.3 },
    { type: 'armchair', x: 7.6, y: 13.6, rot: -40 },
    { type: 'curtain', x: 4.6, y: 16.45, rot: 180, w: 0.8, tone: 'light' },
    { type: 'curtain', x: 8.2, y: 13.6, rot: -90, w: 0.8, tone: 'light' },
    { type: 'books', x: 4.75, y: 15.95, z: 0.52 },
    { type: 'downlight', x: 4.6, y: 14.2 }, { type: 'downlight', x: 7.2, y: 14.2 },
    // ===== SYPIALNIE 6, 7 i pokoje 12, 13
    { type: 'fluteWall', x: 1.9, y: 1.62, rot: 0, w: 2.2, h: 2.4 },
    { type: 'bed', x: 1.72, y: 2.75, rot: 0, w: 1.55, d: 2.0 },
    { type: 'nightstand', x: 0.95, y: 1.95, r: 0.22 }, { type: 'nightstand', x: 2.85, y: 1.95, r: 0.22 },
    { type: 'rug', x: 1.9, y: 3.6, w: 2.2, d: 1.8 },
    { type: 'desk', x: 2.3, y: 4.75, rot: 180 }, { type: 'diningChair', x: 2.3, y: 4.1, rot: 180 },
    { type: 'sconceRing', x: 0.75, y: 1.66, rot: 0, z: 1.5 }, { type: 'sconceRing', x: 3.05, y: 1.66, rot: 0, z: 1.5 },
    { type: 'fluteWall', x: 1.9, y: 5.19, rot: 0, w: 2.2, h: 2.4 },
    { type: 'bed', x: 1.72, y: 6.32, rot: 0, w: 1.55, d: 2.0 },
    { type: 'nightstand', x: 0.95, y: 5.52, r: 0.22 }, { type: 'nightstand', x: 2.85, y: 5.52, r: 0.22 },
    { type: 'rug', x: 1.9, y: 7.2, w: 2.2, d: 1.8 },
    { type: 'desk', x: 2.3, y: 8.32, rot: 180 }, { type: 'diningChair', x: 2.3, y: 7.65, rot: 180 },
    { type: 'sconceRing', x: 0.75, y: 5.23, rot: 0, z: 1.5 }, { type: 'sconceRing', x: 3.05, y: 5.23, rot: 0, z: 1.5 },
    { type: 'laptop', x: 2.3, y: 4.75, rot: 180, z: 0.755 }, { type: 'laptop', x: 2.3, y: 8.32, rot: 180, z: 0.755 },
    { type: 'downlight', x: 1.9, y: 3.3 }, { type: 'downlight', x: 1.9, y: 6.9 },
    { type: 'bed', x: 6.70, y: 11.75, rot: 180, w: 1.6, d: 2.0 },
    { type: 'nightstand', x: 5.55, y: 12.55, r: 0.22 }, { type: 'nightstand', x: 7.85, y: 12.55, r: 0.22 },
    { type: 'rug', x: 6.7, y: 10.9, w: 2.6, d: 2.0 },
    { type: 'fluteWall', x: 6.7, y: 12.93, rot: 180, w: 2.6, h: 2.4 },
    { type: 'downlight', x: 6.7, y: 11.0 },
    { type: 'desk', x: 6.6, y: 8.5, rot: 180 }, { type: 'diningChair', x: 6.6, y: 7.85, rot: 180 },
    { type: 'laptop', x: 6.6, y: 8.5, rot: 180, z: 0.755 },
    { type: 'curvedSofa', x: 6.9, y: 6.3, rot: 0, w: 2.1, d: 0.95, mat: 'fabric_sand' },
    { type: 'bookshelf', x: 5.3, y: 7.3, rot: 90, w: 2.0, d: 0.35, h: 2.5 },
    { type: 'rug', x: 6.9, y: 7.0, w: 2.4, d: 1.8 },
    { type: 'downlight', x: 6.6, y: 7.2 },
    { type: 'curtain', x: 8.2, y: 6.6, rot: -90, w: 0.8, tone: 'light' },
    { type: 'curtain', x: 8.2, y: 10.4, rot: -90, w: 0.8, tone: 'light' },
    // ===== ŁAZIENKA MASTER (10) i łazienki 5, 8
    { type: 'freeTub', x: 1.5, y: 12.9, rot: 0, w: 1.8, d: 0.85 },
    { type: 'vanityStone', x: 1.75, y: 11.05, rot: 0, w: 2.0, basins: 2 },
    { type: 'mirrorLed', x: 1.75, y: 11.03, rot: 0, w: 2.0, h: 0.95, z: 1.8 },
    { type: 'toilet', x: 2.95, y: 13.4, rot: -90 },
    { type: 'shower', x: 2.9, y: 13.2 },
    { type: 'towelRail', x: 0.04, y: 12.2, rot: 90, z: 1.05 },
    { type: 'towelRail', x: 0.04, y: 9.6, rot: 90, z: 1.05 },
    { type: 'shelfWall', x: 5.25, y: 5.6, rot: 0, w: 0.9, z: 1.7 },
    { type: 'clock', x: 4.86, y: 9.4, rot: 90, z: 2.0 },
    { type: 'towels', x: 1.0, y: 11.35, rot: 0, z: 1.02 },
    { type: 'bottles', x: 2.4, y: 11.35, rot: 0, z: 1.02 },
    { type: 'rug', x: 1.7, y: 12.1, w: 1.2, d: 0.8 },
    { type: 'downlight', x: 1.7, y: 12.5 },
    { type: 'vanityStone', x: 1.75, y: 8.78, rot: 0, w: 1.5, basins: 1 },
    { type: 'mirrorLed', x: 1.75, y: 8.76, rot: 0, w: 1.5, h: 0.9, z: 1.8 },
    { type: 'toilet', x: 0.45, y: 10.5, rot: 180 },
    { type: 'shower', x: 2.9, y: 10.4 },
    { type: 'towels', x: 1.2, y: 9.1, rot: 0, z: 1.02 },
    { type: 'downlight', x: 1.7, y: 9.9 },
    { type: 'vanityStone', x: 1.9, y: 0.04, rot: 0, w: 1.4, basins: 1 },
    { type: 'mirrorLed', x: 1.9, y: 0.02, rot: 0, w: 1.4, h: 0.9, z: 1.8 },
    { type: 'toilet', x: 0.45, y: 1.1, rot: 180 },
    { type: 'downlight', x: 1.9, y: 0.9 },
    // ===== GARDEROBA 11 i garderoba 2
    { type: 'wardrobeRods', x: 0.66, y: 15.2, rot: 90, w: 2.0 },
    { type: 'wardrobeRods', x: 2.76, y: 14.35, rot: -90, w: 1.2 },
    { type: 'pouf', x: 1.7, y: 15.1, r: 0.36 },
    { type: 'mirrorTall', x: 3.40, y: 14.4, rot: -90, w: 0.6, h: 1.8 },
    { type: 'downlight', x: 1.7, y: 15.6 },
    { type: 'wardrobeRods', x: 8.3, y: -2.80, rot: 180, w: 1.6 },
    { type: 'wardrobeRods', x: 8.8, y: -2.25, rot: 0, w: 0.9 },
    { type: 'downlight', x: 8.3, y: -2.5 },
    // ===== PRALNIA, SPIŻARNIA, KOTŁOWNIA, GARAŻ
    { type: 'washer', x: 1.75, y: -1.75, rot: 0 }, { type: 'washer', x: 2.45, y: -1.75, rot: 0 },
    { type: 'bottles', x: 4.3, y: -1.75, rot: 0, z: 0.94 },
    { type: 'downlight', x: 3.0, y: -1.1 },
    { type: 'pantryShelves', x: 8.35, y: -1.05, rot: 180, w: 1.9, h: 2.2 },
    { type: 'downlight', x: 8.3, y: -0.8 },
    { type: 'car', x: 0.1, y: -5.65, rot: 0 }, { type: 'car', x: 3.0, y: -5.65, rot: 0 },
    { type: 'downlight', x: -1.0, y: -1.2, z: 2.6 },
    // ===== TARAS ZADASZONY
    { type: 'curvedSofa', x: 11.4, y: 7.25, rot: 0, w: 2.8, d: 1.05, mat: 'outdoor_seat' },
    { type: 'curvedSofa', x: 13.6, y: 8.2, rot: -90, w: 2.4, d: 1.0, mat: 'outdoor_seat' },
    { type: 'marbleTable', x: 11.6, y: 8.0, rot: 0, w: 1.2, d: 0.8 },
    { type: 'outdoorTable', x: 14.6, y: 10.0, rot: 0, w: 2.2, d: 0.95 },
    { type: 'outdoorChair', x: 13.9, y: 10.7, rot: 0 }, { type: 'outdoorChair', x: 14.6, y: 10.7, rot: 0 }, { type: 'outdoorChair', x: 15.3, y: 10.7, rot: 0 },
    { type: 'outdoorChair', x: 13.9, y: 9.3, rot: 180 }, { type: 'outdoorChair', x: 14.6, y: 9.3, rot: 180 }, { type: 'outdoorChair', x: 15.3, y: 9.3, rot: 180 },
    { type: 'plant', x: 9.3, y: 10.6, s: 1.5, outdoor: true },
    { type: 'plant', x: 16.1, y: 6.2, s: 1.3, outdoor: true },
    { type: 'fireBowl', x: 10.3, y: 7.9 },
    { type: 'downlight', x: 11.4, y: 7.6, z: EAVE - 0.05, outdoor: true },
    { type: 'downlight', x: 14.6, y: 9.6, z: EAVE - 0.05, outdoor: true },
    { type: 'downlight', x: 7.0, y: -4.6, z: 3.55, outdoor: true },
    // lamele podcienia wejściowego (pionowe, jak na wizualizacjach)
    { type: 'slats', x: 9.45, y: -4.3, rot: 0, len: 2.6 },
    { type: 'lounger', x: 15.6, y: 2.6, rot: -90 }, { type: 'lounger', x: 15.6, y: 1.1, rot: -90 },
    // zieleń przy elewacji
    { type: 'grassClump', x: -0.9, y: 3.0, s: 1.2 }, { type: 'grassClump', x: -0.9, y: 7.0, s: 1.1 }, { type: 'grassClump', x: -0.9, y: 12.0, s: 1.2 },
    { type: 'grassClump', x: -0.9, y: 15.5, s: 1.0 }, { type: 'grassClump', x: 10.5, y: 17.4, s: 1.2 }, { type: 'grassClump', x: 17.2, y: 6.0, s: 1.1 },
    { type: 'grassClump', x: 17.2, y: 11.5, s: 1.2 }, { type: 'grassClump', x: 10.6, y: -5.2, s: 1.1 }, { type: 'grassClump', x: 13.5, y: -5.2, s: 1.0 },
    { type: 'grassClump', x: -4.3, y: -3.0, s: 1.2 }, { type: 'grassClump', x: -4.3, y: -7.0, s: 1.1 },
    { type: 'downpipe', x: -0.47, y: -0.3, h: 3.95 }, { type: 'downpipe', x: -0.47, y: 16.9, h: 3.95 },
    { type: 'downpipe', x: 8.72, y: 16.9, h: 3.95 }, { type: 'downpipe', x: 14.45, y: -3.85, h: 3.95 },
    { type: 'downpipe', x: 14.45, y: 5.3, h: 3.95 }, { type: 'downpipe', x: -3.76, y: -8.75, h: 3.3 },
  ],

  // ---------------------------------------------------------------- oświetlenie
  lights: [
    { type: 'point', x: 8.3, y: 2.6, z: 2.45, i: 16, k: 2700, dist: 11 },        // salon – pierścienie
    { type: 'point', x: 11.9, y: 3.9, z: 2.4, i: 14, k: 2700, dist: 9 },         // jadalnia
    { type: 'spot', x: 6.6, y: 2.4, z: 3.6, tx: 5.2, ty: 2.0, tz: 1.4, i: 30, k: 3000, angle: 0.55 },   // kominek
    { type: 'spot', x: 6.6, y: 4.4, z: 3.6, tx: 5.2, ty: 4.4, tz: 1.5, i: 26, k: 3000, angle: 0.5 },    // ściana TV
    { type: 'point', x: 9.5, y: 4.6, z: 3.6, i: 12, k: 2400, dist: 10 },         // gzyms LED
    { type: 'point', x: 11.9, y: -1.45, z: 2.3, i: 12, k: 3000, dist: 7 },       // wyspa kuchenna
    { type: 'point', x: 11.5, y: -2.9, z: 3.6, i: 10, k: 3000, dist: 8 },        // kuchnia
    { type: 'point', x: 6.1, y: -1.6, z: 2.8, i: 10, k: 2700, dist: 6 },         // wiatrołap
    { type: 'point', x: 4.19, y: 3.0, z: 2.8, i: 9, k: 2700, dist: 7 },          // komunikacja
    { type: 'point', x: 4.19, y: 8.5, z: 2.8, i: 9, k: 2700, dist: 7 },
    { type: 'spot', x: 7.55, y: 16.2, z: 1.75, tx: 7.55, ty: 16.5, tz: 1.5, i: 14, k: 2400, angle: 0.7 },  // kinkiety master
    { type: 'point', x: 5.95, y: 14.6, z: 2.8, i: 10, k: 2700, dist: 8 },        // master
    { type: 'point', x: 1.9, y: 3.3, z: 2.8, i: 9, k: 2700, dist: 6 },           // sypialnia 6
    { type: 'point', x: 1.9, y: 6.9, z: 2.8, i: 9, k: 2700, dist: 6 },           // sypialnia 7
    { type: 'point', x: 6.6, y: 11.0, z: 2.8, i: 9, k: 2700, dist: 6 },          // sypialnia 12
    { type: 'point', x: 6.6, y: 7.2, z: 2.8, i: 9, k: 2700, dist: 6 },           // gabinet
    { type: 'point', x: 1.7, y: 12.4, z: 2.8, i: 11, k: 2700, dist: 6 },         // łazienka master
    { type: 'point', x: 1.7, y: 9.8, z: 2.8, i: 9, k: 2700, dist: 5 },           // łazienka 8
    { type: 'point', x: 1.9, y: 0.8, z: 2.8, i: 8, k: 2700, dist: 5 },           // łazienka 5
    { type: 'point', x: 1.7, y: 15.3, z: 2.8, i: 8, k: 2700, dist: 5 },          // garderoba
    { type: 'point', x: 8.3, y: -2.5, z: 2.8, i: 7, k: 2700, dist: 5 },          // garderoba 2
    { type: 'point', x: 3.0, y: -1.2, z: 2.8, i: 8, k: 3500, dist: 5 },          // pralnia
    { type: 'point', x: 11.4, y: 7.6, z: 3.85, i: 12, k: 2700, dist: 10, outdoor: true },   // taras
    { type: 'point', x: 14.6, y: 9.6, z: 3.85, i: 10, k: 2700, dist: 8, outdoor: true },
    { type: 'point', x: 7.0, y: -4.6, z: 3.5, i: 9, k: 2700, dist: 7, outdoor: true },      // wejście
  ],

  // ---------------------------------------------------------------- dach kopertowy (22°, kalenica +7,04)
  roofHip: [
    { rect: [-0.75, -0.35, 9.0, 17.05], pitch: 22, eave: EAVE, axis: 'y', mat: 'rooftile', soffit: 'cedar', fascia: 'plaster_dark' },
    { rect: [4.6, -3.95, 16.9, 11.45], pitch: 22, eave: EAVE, axis: 'x', mat: 'rooftile', soffit: 'cedar', fascia: 'plaster_dark' },
    { rect: [-3.95, -8.95, 5.25, -1.85], pitch: 22, eave: 3.35, axis: 'x', mat: 'rooftile', soffit: 'cedar', fascia: 'plaster_dark' },
  ],

  // ---------------------------------------------------------------- otoczenie
  site: {
    lawn: [-16, -20, 32, 30],
    fence: { rect: [-15, -19, 31, 29], h: 1.7, mat: 'plaster_dark' },
    pool: { rect: [18.2, 3.0, 23.2, 11.5], depth: 1.5 },
    poolDeck: [17.4, 2.2, 24.0, 12.3],
    trees: [[-10, 20, 8], [4, 24, 7], [20, 24, 7.5], [28, 14, 7], [27, -4, 6.5], [20, -14, 7], [-2, -17, 6], [-11, -10, 6.5], [-11, 6, 7], [12, 21, 5.5]],
    shrubs: [[-1.6, 1.0, 1.0], [-1.6, 9.5, 1.1], [-1.6, 14.0, 1.0], [10.0, 18.0, 1.2], [14.5, 17.0, 1.0],
      [18.0, 13.0, 1.1], [17.8, 1.0, 1.0], [15.0, -5.5, 1.1], [8.0, -8.0, 1.2], [-4.8, -10.0, 1.0], [-5.0, 1.5, 1.1]],
  },

  start: { room: 'wejscie' },
};
