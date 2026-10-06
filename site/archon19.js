// ARCHON — Dom w przebiśniegach 19 (G2E) — definicja domu dla silnika app.js
// Układ: metry, rzut architektoniczny (X → prawo rysunku, Y → góra). (0,0) = zewnętrzny narożnik SW garażu / linia zachodniej ściany.
// Wejście główne w rzucie od dołu ('S') – wiatrołap w załamaniu między częścią dzienną a garażem.

const H = 2.8;          // wysokość pomieszczeń
const EAVE = 3.0;       // okap (spód podbitki)
const W = (a, b, t, o = {}) => ({ a, b, t, ...o });
const EXT = { matL: 'ext_white', matR: 'plaster', ext: true, h: EAVE };

export default {
  id: 'archon19',
  name: 'Dom w przebiśniegach 19 (G2E)',
  author: 'ARCHON+ · parterowy, dach kopertowy 33°',
  location: { lat: 53.13, lon: 23.16, name: 'Białystok' },
  ceiling: H,
  doorH: 2.2,
  entranceSide: 'S',
  center: [9.5, 11],
  mapBounds: [-3, -1.5, 21, 24],

  rooms: [
    { id: 'wejscie', name: 'Przed wejściem', rect: [5, 4, 10, 7.3], spawn: [8.15, 4.6], look: [0, 1], outdoor: true },
    { id: 'wiatrolap', name: '1 · Wiatrołap', rect: [7.65, 7.7, 10.0, 12.3], spawn: [8.8, 8.6], look: [0, 1] },
    { id: 'spizarnia', name: '2 · Spiżarnia', rect: [4.7, 7.7, 7.5, 9.9], spawn: [5.1, 9.2], look: [1, -0.2] },
    { id: 'kuchnia', name: '3 · Kuchnia', rect: [0.4, 7.7, 4.55, 12.2], spawn: [4.3, 9.0], look: [-0.8, 0.6] },
    { id: 'jadalnia', name: '4 · Jadalnia', rect: [0.4, 12.2, 5.0, 16.4], spawn: [4.6, 12.8], look: [-0.7, 0.7] },
    { id: 'salon', name: '4 · Salon', rect: [5.0, 12.3, 10.1, 18.8], spawn: [6.2, 13.2], look: [0.5, 0.85] },
    { id: 'hol', name: '5 · Korytarz', rect: [10.3, 11.2, 14.45, 13.35], spawn: [11.6, 12.2], look: [1, 0.15] },
    { id: 'korytarz', name: '5 · Korytarz (pokoje)', rect: [13.27, 13.35, 15.77, 17.51], spawn: [13.9, 13.7], look: [0.1, 1] },
    { id: 'garderoba', name: '6 · Garderoba', rect: [10.9, 13.35, 13.27, 14.9], spawn: [12.0, 13.8], look: [-1, 0.2] },
    { id: 'pralnia', name: '7 · Pralnia', rect: [10.9, 15.05, 13.27, 17.41], spawn: [12.7, 16.2], look: [-1, 0.2] },
    { id: 'pokoj1', name: '8 · Pokój', rect: [10.71, 17.51, 14.0, 21.52], spawn: [13.5, 18.2], look: [-0.6, 0.8] },
    { id: 'pokoj2', name: '9 · Pokój', rect: [15.0, 17.51, 18.3, 21.52], spawn: [15.5, 18.2], look: [0.6, 0.8] },
    { id: 'lazienka', name: '10 · Łazienka', rect: [14.45, 15.05, 18.3, 17.41], spawn: [15.3, 16.5], look: [0.7, 0.7] },
    { id: 'pokoj3', name: '11 · Pokój', rect: [14.45, 11.7, 18.3, 14.96], spawn: [14.9, 13.0], look: [1, 0.2] },
    { id: 'sypialnia', name: '12 · Sypialnia', rect: [15.0, 6.55, 18.3, 11.5], spawn: [16.6, 10.6], look: [0.05, -1] },
    { id: 'garderoba2', name: '13 · Garderoba', rect: [12.9, 6.55, 15.0, 8.4], spawn: [14.5, 10.8], look: [-0.2, -1] },
    { id: 'lazienka2', name: '14 · Łazienka', rect: [11.8, 8.6, 14.0, 11.2], spawn: [12.9, 10.1], look: [0, -1] },
    { id: 'toaleta', name: '15 · Toaleta', rect: [10.3, 8.6, 11.7, 10.0], spawn: [11.0, 10.6], look: [0, -1] },
    { id: 'kotlownia', name: '16 · Kotłownia', rect: [10.3, 6.55, 12.9, 8.4], spawn: [11.0, 7.0], look: [1, 0.3] },
    { id: 'garaz', name: '17 · Garaż', rect: [10.3, 0.45, 18.3, 6.55], spawn: [10.9, 6.25], look: [0.55, -0.84] },
    { id: 'taras', name: 'Taras zadaszony', rect: [-1.5, 16.4, 10.4, 22.0], spawn: [4.0, 19.6], look: [-0.6, 0.8], outdoor: true },
    { id: 'ogrod', name: 'Ogród · widok na dom', rect: [-8, 22, 12, 30], spawn: [-6.0, 27.0], look: [0.7, -0.7], outdoor: true },
    { id: 'front', name: 'Ulica · widok na front', rect: [5, -12, 20, -2], spawn: [14.0, -9.0], look: [-0.2, 1], outdoor: true },
  ],

  floors: [
    { rect: [0.4, 7.7, 10.4, 16.4], mat: 'tiles_light' },
    { rect: [5.2, 16.4, 10.4, 18.8], mat: 'tiles_light' },
    { rect: [10.0, 8.4, 14.45, 13.35], mat: 'tiles_light' },
    { rect: [13.27, 13.35, 15.77, 17.51], mat: 'tiles_light' },
    { rect: [10.9, 15.05, 13.27, 17.41], mat: 'tiles_light' },
    { rect: [14.45, 15.05, 18.3, 17.41], mat: 'slate' },
    { rect: [11.8, 8.6, 14.0, 11.2], mat: 'slate' },
    { rect: [10.3, 8.6, 11.7, 10.0], mat: 'slate' },
    { rect: [10.71, 17.51, 18.3, 21.52], mat: 'oak' },
    { rect: [14.45, 11.7, 18.3, 14.96], mat: 'oak' },
    { rect: [15.0, 6.55, 18.3, 11.5], mat: 'oak' },
    { rect: [12.9, 6.55, 15.0, 11.2], mat: 'oak' },
    { rect: [10.9, 13.35, 13.27, 14.9], mat: 'oak' },
    { rect: [10.3, 0.45, 18.3, 6.55], mat: 'concrete' },
    { rect: [10.3, 6.55, 12.9, 8.4], mat: 'concrete' },
    // tarasy i utwardzenia
    { rect: [-1.5, 16.0, 10.4, 22.0], mat: 'pavers', z: -0.04 },
    { rect: [0, 16.4, 5.2, 19.2], mat: 'pavers', z: -0.04 },
    { rect: [5.0, 6.4, 10.0, 7.3], mat: 'tiles_light', z: -0.04 },     // podest wejściowy
    { rect: [5.0, 2.0, 10.0, 6.4], mat: 'pavers', z: -0.06 },           // dojście
    { rect: [9.75, -12.0, 19.5, 0.0], mat: 'pavers', z: -0.07 },        // podjazd
    { rect: [18.7, 0.0, 19.5, 22.0], mat: 'pavers', z: -0.07 },         // opaska
  ],

  ceilings: [
    { rect: [0.4, 7.7, 10.4, 16.4], mat: 'ceiling' }, { rect: [5.2, 16.4, 10.4, 18.8], mat: 'ceiling' },
    { rect: [10.0, 6.55, 18.3, 21.52], mat: 'ceiling' },
    { rect: [10.3, 0.45, 18.3, 6.55], mat: 'ceiling_garage' },
  ],

  walls: [
    // ---- zewnętrzne (zgodnie z ruchem wskazówek zegara; lewa strona = zewnątrz)
    W([0.2, 7.29], [0.2, 16.6], 0.4, { ...EXT, openings: [
      { at: 0.71, w: 1.6, h: 1.4, sill: 1.0, kind: 'glass' },
      { at: 4.91, w: 4.0, h: 2.4, kind: 'glass', mullions: [1.33, 2.67] },
    ] }),
    W([0.0, 16.4], [5.2, 16.4], 0.4, { ...EXT, openings: [{ at: 1.3, w: 3.6, h: 2.4, kind: 'glass', mullions: [1.2, 2.4] }] }),
    W([5.2, 16.2], [5.2, 19.2], 0.4, EXT),
    W([5.0, 19.0], [10.7, 19.0], 0.4, { ...EXT, openings: [{ at: 1.0, w: 4.0, h: 2.4, kind: 'slider', fixed: 'R' }] }),
    W([10.55, 18.8], [10.55, 21.9], 0.4, { ...EXT, openings: [{ at: 0.9, w: 1.0, h: 2.4, kind: 'glassdoor' }] }),
    W([10.35, 21.7], [18.7, 21.7], 0.4, { ...EXT, openings: [
      { at: 1.15, w: 2.4, h: 1.5, sill: 0.9, kind: 'glass', mullions: [1.2] },
      { at: 5.25, w: 2.4, h: 1.5, sill: 0.9, kind: 'glass', mullions: [1.2] },
    ] }),
    W([18.5, 21.9], [18.5, 0.0], 0.4, { ...EXT, openings: [
      { at: 1.9, w: 1.0, h: 2.4, kind: 'glassdoor' },
      { at: 5.0, w: 1.5, h: 1.5, sill: 1.0, kind: 'glass' },
      { at: 7.8, w: 1.5, h: 1.5, sill: 0.9, kind: 'glass' },
      { at: 11.3, w: 2.6, h: 1.5, sill: 0.9, kind: 'glass', mullions: [1.3] },
      { at: 17.7, w: 1.5, h: 1.5, sill: 1.2, kind: 'glass' },
    ] }),
    W([18.7, 0.2], [9.75, 0.2], 0.4, { ...EXT, matL: 'sinter', openings: [
      { at: 0.6, w: 0.8, h: 2.0, kind: 'door', leaf: 'entry', open: 85 },
      { at: 2.85, w: 5.0, h: 2.38, kind: 'garagedoor', mat: 'wardrobe_dark' },
    ] }),
    W([10.0, 0.0], [10.0, 7.5], 0.5, { ...EXT, matL: 'sinter' }),
    W([10.2, 7.5], [0.0, 7.5], 0.4, { ...EXT, openings: [
      { at: 0.45, w: 0.55, h: 2.4, kind: 'glass' },
      { at: 1.05, w: 2.0, h: 2.1, kind: 'door', leaf: 'entry', open: 85, swing: 'R' },
      { at: 5.9, w: 3.0, h: 1.4, sill: 1.0, kind: 'glass', mullions: [1.5] },
    ] }),

    // ---- wewnętrzne
    W([10.65, 12.22], [10.65, 18.8], 0.5, { mat: 'plaster' }),                                  // salon | skrzydło sypialne
    W([4.55, 12.22], [10.4, 12.22], 0.16, { mat: 'plaster', openings: [{ at: 3.2, w: 0.8, h: 2.0, kind: 'door', leaf: 'white', open: 80, swing: 'L' }] }),  // blok TV/kominek + drzwi do wiatrołapu
    W([7.55, 7.5], [7.55, 10.05], 0.15, { mat: 'plaster' }),                                    // spiżarnia | wiatrołap
    W([4.7, 10.05], [7.55, 10.05], 0.15, { mat: 'plaster' }),                                   // spiżarnia N
    W([4.7, 7.5], [4.7, 10.05], 0.15, { mat: 'plaster', openings: [{ at: 1.3, w: 0.8, h: 2.0, kind: 'door', leaf: 'dark', open: 25, swing: 'L' }] }),
    W([5.15, 10.05], [5.15, 12.22], 0.1, { mat: 'plaster' }),                                   // zabudowa kuchni | nisza szafy
    W([10.15, 7.5], [10.15, 12.22], 0.3, { mat: 'plaster', openings: [
      { at: 0.85, w: 0.91, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'L' },                // wiatrołap → kotłownia (pomiar rzutu)
      { at: 2.40, w: 1.04, h: 2.2, kind: 'opening' },                                                  // przejście wiatrołap → hol (pomiar)
      { at: 3.78, w: 0.89, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'L' },                // drzwi do części dziennej
    ] }),
    W([10.0, 6.7], [18.5, 6.7], 0.3, { matR: 'garage_wall', matL: 'plaster', openings: [{ at: 0.6, w: 0.8, h: 2.0, kind: 'door', leaf: 'white', open: 0, into: 'L' }] }),   // garaż N
    W([11.70, 8.5], [14.0, 8.5], 0.15, { mat: 'plaster', matL: 'marble_wall' }),                // ściana łazienki (na rzucie zaczyna się dopiero tutaj)
    W([11.75, 8.5], [11.75, 11.2], 0.15, { mat: 'marble_wall' }),                                // toaleta | łazienka
    W([10.3, 10.05], [11.75, 10.05], 0.1, { mat: 'plaster', matR: 'marble_wall', openings: [{ at: 0.1, w: 0.87, h: 2.0, kind: 'door', leaf: 'white', open: 75, swing: 'R' }] }),  // toaleta N (pomiar)
    W([11.75, 11.2], [14.0, 11.2], 0.15, { mat: 'plaster', matR: 'marble_wall', openings: [{ at: 1.40, w: 0.81, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'R', into: 'L' }] }),   // hol → łazienka 14
    W([14.0, 8.5], [14.0, 11.2], 0.1, { matR: 'plaster', matL: 'marble_wall', openings: [{ at: 1.1, w: 0.8, h: 2.0, kind: 'door', leaf: 'dark', open: 70, swing: 'L', into: 'L' }] }),  // łazienka | garderoba
    W([15.0, 6.7], [15.0, 11.6], 0.15, { mat: 'plaster', openings: [{ at: 2.8, w: 0.8, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'L' }] }),   // garderoba | sypialnia
    W([14.45, 11.6], [18.5, 11.6], 0.2, { mat: 'plaster', openings: [{ at: 0.25, w: 0.96, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'L', into: 'L' }] }),   // sypialnia | pokój 11 (pomiar)
    W([14.45, 11.2], [14.45, 16.1], 0.15, { mat: 'plaster', openings: [
      { at: 1.4, w: 0.8, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'L' },
      { at: 4.0, w: 0.8, h: 2.0, kind: 'door', leaf: 'dark', open: 70, swing: 'R' },
    ] }),
    W([14.45, 14.97], [18.5, 14.97], 0.15, { mat: 'plaster', matL: 'marble_wall' }),           // pokój 11 | łazienka 10
    W([14.45, 16.1], [15.77, 16.1], 0.15, { mat: 'marble_wall' }), W([15.77, 16.1], [15.77, 17.51], 0.15, { mat: 'marble_wall' }),
    W([13.27, 13.27], [13.27, 17.51], 0.15, { mat: 'plaster', openings: [
      { at: 0.42, w: 0.82, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'R', into: 'L' },
      { at: 2.60, w: 0.81, h: 2.0, kind: 'door', leaf: 'white', open: 70, swing: 'R', into: 'L' },
    ] }),
    W([10.9, 14.97], [13.27, 14.97], 0.15, { mat: 'plaster' }),
    W([10.3, 13.27], [13.27, 13.27], 0.15, { mat: 'plaster' }),
    W([10.9, 17.51], [18.5, 17.51], 0.15, { mat: 'plaster', openings: [
      { at: 2.45, w: 0.82, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'R', into: 'L' },
      { at: 3.80, w: 0.79, h: 2.0, kind: 'door', leaf: 'white', open: 85, swing: 'L', into: 'L' },
    ] }),
    W([14.5, 17.51], [14.5, 21.7], 1.0, { mat: 'plaster' }),                                    // szacht między pokojami
    W([12.55, 10.55], [12.55, 11.2], 0.05, { mat: 'glass_panel', h: 2.2 }),                          // kabina prysznicowa (łazienka 14)
  ],

  boxes: [
    { rect: [2.44, 9.72, 2.52, 11.98], h: 0.86, mat: 'walnut_fluted' },                            // lamelowy bok wyspy
    { rect: [14.45, 15.05, 18.3, 15.17], h: H, mat: 'marble_wall' },                              // łazienka 10 – marmur
    { rect: [18.18, 15.05, 18.3, 17.41], h: H, mat: 'marble_wall' },
    { rect: [11.75, 8.6, 11.87, 11.2], h: H, mat: 'marble_wall' },                                // łazienka 14 – marmur
    { rect: [11.87, 11.08, 13.08, 11.2], h: H, mat: 'marble_wall' },
    { rect: [16.55, 15.17, 18.25, 16.07], h: 0.56, mat: 'marble_wall' },                           // wanna zabudowana (obudowa)

    { rect: [0.4, 9.5, 1.0, 12.15], h: 2.6, mat: 'wenge', doors: 'x1', ovens: [[10.4, 11.4]], ovenFace: 'x1' },   // wysoka zabudowa z piekarnikami
    { rect: [1.0, 7.7, 6.4, 8.3], h: 0.86, mat: 'white_gloss', doors: 'y1' },                     // szafki dolne
    { rect: [0.98, 7.68, 6.42, 8.32], z: 0.86, h: 0.04, mat: 'concrete_dark' },
    { rect: [0.4, 8.3, 1.0, 9.5], h: 0.86, mat: 'white_gloss', doors: 'x1' },
    { rect: [0.38, 8.28, 1.02, 9.52], z: 0.86, h: 0.04, mat: 'concrete_dark' },
    { rect: [1.0, 8.05, 6.4, 8.3], z: 0.90, h: 0.62, mat: 'lacobel' },                            // panel ścienny nad blatem (lacobel)
    { rect: [4.4, 7.7, 6.4, 8.05], z: 1.52, h: 0.98, mat: 'wenge', doors: 'y1' },                // szafki górne
    { rect: [4.55, 9.9, 5.15, 12.15], h: H, mat: 'wenge', doors: 'x0' },                          // kolumna zabudowy (lodówka)
    { rect: [5.25, 11.3, 7.5, 12.1], h: H, mat: 'wardrobe_dark', doors: 'y0' },                  // szafa w niszy wiatrołapu
    { rect: [5.4, 12.3, 6.6, 12.34], h: H, mat: 'marble_wall' },                                  // ściana kominka (marmur)
    { rect: [10.1, 13.0, 10.4, 18.6], h: H, mat: 'walnut', doors: 'x0' },                         // zabudowa przy wschodniej ścianie salonu
    { rect: [15.0, 10.6, 15.6, 11.45], h: H, mat: 'walnut', doors: 'x1' },                        // szafa sypialnia
    { rect: [14.6, 11.75, 18.3, 12.35], h: H, mat: 'walnut', doors: 'y1' },                       // szafa pokój 11
    { rect: [10.71, 17.6, 13.0, 18.2], h: H, mat: 'walnut', doors: 'y1' },                        // szafa pokój 8
    { rect: [16.4, 17.6, 18.3, 18.2], h: H, mat: 'walnut', doors: 'y1' },                         // szafa pokój 9
    { rect: [10.9, 13.35, 11.5, 14.9], h: H, mat: 'walnut', doors: 'x1' }, { rect: [11.5, 14.3, 13.2, 14.9], h: H, mat: 'walnut', doors: 'y0' },   // garderoba 6
    { rect: [12.95, 6.7, 13.55, 7.55], h: H, mat: 'walnut', doors: 'x1' }, { rect: [14.4, 6.7, 14.95, 8.4], h: H, mat: 'wardrobe_glass', doors: 'x0' },   // garderoba 13
    { rect: [12.3, 16.8, 13.2, 17.41], h: 0.9, mat: 'white_gloss', doors: 'none' },               // pralnia blat
    { rect: [12.28, 16.78, 13.22, 17.43], z: 0.9, h: 0.03, mat: 'stone_top' },
    { rect: [11.7, 6.7, 12.4, 7.4], h: 1.6, mat: 'appliance' },                                    // kocioł
    { rect: [10.35, 0.5, 10.9, 4.0], h: 2.0, mat: 'appliance' },                                   // regał w garażu
    { rect: [12.0, 6.1, 17.0, 6.55], h: 2.2, mat: 'wardrobe_dark', doors: 'y0' },                  // szafy garażowe
    // gzyms LED nad strefą TV i w holu
    { rect: [5.2, 12.34, 10.1, 13.0], z: 2.62, h: 0.18, mat: 'ceiling', led: ['y1'] },
    { rect: [10.3, 11.2, 14.45, 11.8], z: 2.62, h: 0.18, mat: 'ceiling', led: ['y1'] },
    // komin
    { rect: [13.2, 12.9, 14.0, 13.7], z: 3.0, h: 4.6, mat: 'ext_white' },
  ],

  furniture: [
    // kuchnia i jadalnia
    { type: 'island', x: 3.1, y: 10.85, rot: 0, w: 1.2, d: 2.3, body: 'concrete_dark', top: 'concrete_dark' },
    { type: 'plantRack', x: 3.3, y: 8.15, rot: 0, w: 1.9, z: 1.75 },
    { type: 'barStoolUph', x: 4.05, y: 10.85, rot: -90, n: 3, gap: 0.68 },
    { type: 'hoodIsland', x: 3.1, y: 10.85, rot: 0, w: 1.1, d: 0.62, z: 1.62 },
    { type: 'pendantBlack', x: 3.1, y: 10.2, z: 1.72, r: 0.11, h: 0.28 }, { type: 'pendantBlack', x: 3.1, y: 11.5, z: 1.72, r: 0.11, h: 0.28 },
    { type: 'linear', x: 3.1, y: 8.2, rot: 0, len: 1.4 },
    { type: 'bottles', x: 1.6, y: 7.95, rot: 180, z: 0.92 }, { type: 'decorIsland', x: 3.1, y: 10.85, rot: 90 },
    { type: 'tableWood', x: 2.0, y: 14.2, rot: 0, w: 2.8, d: 1.05, top: 'walnut' },
    { type: 'chairUph', x: 1.3, y: 15.05, rot: 0 }, { type: 'chairUph', x: 2.0, y: 15.05, rot: 0 }, { type: 'chairUph', x: 2.7, y: 15.05, rot: 0 },
    { type: 'chairUph', x: 1.3, y: 13.35, rot: 180 }, { type: 'chairUph', x: 2.0, y: 13.35, rot: 180 }, { type: 'chairUph', x: 2.7, y: 13.35, rot: 180 },
    { type: 'chairUph', x: 0.35, y: 14.2, rot: 90 }, { type: 'chairUph', x: 3.65, y: 14.2, rot: -90 },
    { type: 'pendantBlack', x: 1.2, y: 14.1, z: 1.75, r: 0.09 }, { type: 'pendantBlack', x: 1.65, y: 14.35, z: 1.95, r: 0.08 }, { type: 'pendantBlack', x: 2.05, y: 14.05, z: 1.65, r: 0.1 },
    { type: 'pendantBlack', x: 2.45, y: 14.3, z: 1.85, r: 0.08 }, { type: 'pendantBlack', x: 2.85, y: 14.1, z: 2.0, r: 0.09 },
    { type: 'curtain', x: 0.42, y: 12.6, rot: 90, w: 0.8, tone: 'light' }, { type: 'curtain', x: 0.42, y: 15.9, rot: 90, w: 0.8, tone: 'light' },
    // salon
    { type: 'rugSoft', x: 8.1, y: 16.2, w: 3.4, d: 3.6 },
    { type: 'sofaL', x: 8.75, y: 16.1, rot: -90, w: 3.6, d: 2.5, mat: 'fabric_light', side: 'L' },
    { type: 'glassTableTwo', x: 7.35, y: 16.3, rot: 0, w: 1.3, d: 0.78 },
    { type: 'woodColumn', x: 10.4, y: 12.6, rot: 0, w: 0.5, d: 0.5, mat: 'walnut' },
    { type: 'slatWall', x: 9.0, y: 12.3, rot: 180, w: 2.1, h: 2.78, slat: 0.045, gap: 0.03, depth: 0.045, mat: 'wenge', back: 'wenge' },
    { type: 'tvNiche', x: 9.0, y: 12.23, rot: 180, w: 1.68, h: 2.3, nw: 1.52, nh: 1.02, z: 1.38 },
    { type: 'slatWall', x: 7.12, y: 12.3, rot: 180, w: 1.05, h: 2.78, slat: 0.045, gap: 0.03, depth: 0.045, mat: 'wenge', back: 'wenge' },
    { type: 'fireplaceStone', x: 6.0, y: 12.37, rot: 180, w: 1.1, h: 0.66, z: 0.52 },
    { type: 'plantReal', x: 5.5, y: 18.3, s: 1.5, kind: 'strelitzia' },
    { type: 'floorLamp', x: 5.6, y: 13.0 },
    { type: 'curtain', x: 5.6, y: 18.85, rot: 0, w: 0.8, tone: 'light' }, { type: 'curtain', x: 10.3, y: 18.85, rot: 0, w: 0.6, tone: 'light' },
    { type: 'track', x: 6.2, y: 13.2, rot: 90, len: 5.4, spots: [0.6, 2.2, 3.8, 5.0] },
    { type: 'track', x: 8.6, y: 13.6, rot: 90, len: 4.2, spots: [0.5, 1.8, 3.2] },
    { type: 'books', x: 7.5, y: 16.2, z: 0.42 },
    { type: 'plantReal', x: 10.0, y: 18.4, s: 1.25, kind: 'monstera' },
    { type: 'tvSideboard', x: 9.0, y: 12.6, rot: 180, w: 2.5, d: 0.42, h: 0.36, z: 0.3 },
    { type: 'shelfWall', x: 10.38, y: 15.6, rot: -90, w: 0.9, z: 1.65 },
    { type: 'downlight', x: 2.0, y: 9.0 }, { type: 'downlight', x: 2.0, y: 11.6 }, { type: 'downlight', x: 8.5, y: 14.0 },
    { type: 'painting', x: 10.38, y: 13.6, rot: -90, w: 0.9, h: 1.1, z: 1.5 },
    // wiatrołap, hol
    { type: 'console', x: 9.9, y: 9.0, rot: -90, w: 1.2 },
    { type: 'bench', x: 7.9, y: 9.4, rot: 90, w: 1.2 }, { type: 'doormat', x: 8.85, y: 8.1 },
    { type: 'coatRack', x: 7.68, y: 10.9, rot: 90, w: 0.9 }, { type: 'mirrorTall', x: 9.98, y: 9.6, rot: -90, w: 0.6, h: 1.8 },
    { type: 'painting', x: 8.8, y: 12.2, rot: 0, w: 1.0, h: 1.1, z: 1.5 },
    { type: 'painting', x: 12.4, y: 13.25, rot: 0, w: 1.0, h: 1.2, z: 1.45 },
    { type: 'downlight', x: 8.8, y: 10.0 }, { type: 'downlight', x: 12.4, y: 12.3 }, { type: 'downlight', x: 14.5, y: 15.5 },
    // sypialnia 12 (17,84) + garderoba 13 + łazienka 14
    { type: 'slatWall', x: 16.7, y: 6.87, rot: 0, w: 3.0, h: 2.5, mat: 'wenge', back: 'wenge' },
    { type: 'bedReal', x: 16.7, y: 7.95, rot: 180, w: 1.8, d: 2.1 },
    { type: 'rug', x: 16.7, y: 9.0, w: 3.0, d: 2.4 },
    { type: 'nightstand', x: 15.5, y: 7.0, r: 0.25 }, { type: 'nightstand', x: 17.9, y: 7.0, r: 0.25 },
    { type: 'armchair', x: 17.6, y: 10.7, rot: -150 },
    { type: 'wallSpot', x: 16.2, y: 6.65, z: 2.7 }, { type: 'wallSpot', x: 17.2, y: 6.65, z: 2.7 },
    { type: 'vanityStone', x: 12.9, y: 8.64, rot: 180, w: 1.5, basins: 1 }, { type: 'mirrorLed', x: 12.9, y: 8.68, rot: 180, w: 1.5, h: 0.85, z: 1.78 },
    { type: 'towels', x: 12.3, y: 8.4, rot: 180, z: 1.02 }, { type: 'towelRail', x: 11.82, y: 10.2, rot: 90, z: 1.05 },
    { type: 'wcWall', x: 12.4, y: 11.15, rot: 0 }, { type: 'shower', x: 12.15, y: 10.8 },
    { type: 'slats', x: 11.85, y: 9.9, rot: 90, len: 1.6 },
    { type: 'downlight', x: 12.9, y: 9.9 },
    // toaleta 15
    { type: 'wcWall', x: 11.0, y: 8.68, rot: 180 }, { type: 'vanity', x: 10.33, y: 9.5, rot: 90, w: 0.6, basins: 1 },
    // pokój 11
    { type: 'slatWall', x: 17.9, y: 11.74, rot: 0, w: 2.2, h: 2.4, mat: 'wenge', back: 'wenge' },
    { type: 'bedReal', x: 17.55, y: 13.05, rot: 0, w: 1.0, d: 2.0 }, { type: 'rug', x: 16.9, y: 13.6, w: 2.0, d: 1.6 }, { type: 'desk', x: 16.0, y: 14.6, rot: 180 }, { type: 'chairUph', x: 16.0, y: 13.9, rot: 180 },
    { type: 'downlight', x: 16.4, y: 13.3 },
    // łazienka 10
    { type: 'tubOval', x: 17.4, y: 15.62, rot: 0, w: 1.62, d: 0.86, h: 0.55 },
    { type: 'vanityStone', x: 16.7, y: 17.33, rot: 180, w: 1.9, basins: 2 }, { type: 'mirrorLed', x: 16.7, y: 17.38, rot: 180, w: 1.9, h: 0.9, z: 1.78 },
    { type: 'towels', x: 15.9, y: 17.1, rot: 180, z: 1.02 }, { type: 'bottles', x: 17.4, y: 17.1, rot: 180, z: 1.02 },
    { type: 'towelRail', x: 18.26, y: 16.45, rot: -90, z: 1.05 }, { type: 'plantReal', x: 15.9, y: 15.4, s: 0.7, kind: 'monstera' },
    { type: 'rug', x: 16.6, y: 16.6, w: 1.2, d: 0.8 },
    { type: 'wcWall', x: 18.2, y: 16.95, rot: -90 }, { type: 'shower', x: 15.0, y: 16.1 },
    { type: 'slats', x: 15.85, y: 16.8, rot: 90, len: 1.2 },
    { type: 'downlight', x: 16.3, y: 16.3 },
    // pokoje 8 i 9
    { type: 'slatWall', x: 13.4, y: 18.25, rot: 0, w: 2.2, h: 2.4, mat: 'wenge', back: 'wenge' },
    { type: 'bedReal', x: 13.4, y: 19.6, rot: 0, w: 1.0, d: 2.0 }, { type: 'rug', x: 12.2, y: 20.2, w: 2.0, d: 1.6 }, { type: 'desk', x: 11.7, y: 21.15, rot: 180 }, { type: 'chairUph', x: 11.7, y: 20.5, rot: 180 },
    { type: 'slatWall', x: 15.6, y: 18.25, rot: 0, w: 2.2, h: 2.4, mat: 'wenge', back: 'wenge' },
    { type: 'bedReal', x: 15.6, y: 19.6, rot: 0, w: 1.0, d: 2.0 }, { type: 'rug', x: 16.8, y: 20.2, w: 2.0, d: 1.6 }, { type: 'desk', x: 17.4, y: 21.15, rot: 180 }, { type: 'chairUph', x: 17.4, y: 20.5, rot: 180 },
    { type: 'downlight', x: 12.4, y: 19.5 }, { type: 'downlight', x: 16.6, y: 19.5 },
    // pralnia, garaż
    { type: 'washer', x: 11.3, y: 17.1, rot: 0 }, { type: 'washer', x: 11.95, y: 17.1, rot: 0 },
    { type: 'carG', x: 12.4, y: 3.15, rot: 0, color: 0x2b2e31 }, { type: 'carPanamera', x: 15.6, y: 3.2, rot: 0, color: 0x14181f },
    // taras zadaszony i wnęka jadalna
    { type: 'outdoorTable', x: 2.5, y: 17.8, rot: 0, w: 2.4, d: 1.0 },
    { type: 'outdoorChair', x: 1.7, y: 18.6, rot: 0 }, { type: 'outdoorChair', x: 2.5, y: 18.6, rot: 0 }, { type: 'outdoorChair', x: 3.3, y: 18.6, rot: 0 },
    { type: 'outdoorChair', x: 1.7, y: 17.0, rot: 180 }, { type: 'outdoorChair', x: 2.5, y: 17.0, rot: 180 }, { type: 'outdoorChair', x: 3.3, y: 17.0, rot: 180 },
    { type: 'columnSq', x: 0.25, y: 21.6, w: 0.4 }, { type: 'columnSq', x: 5.25, y: 21.6, w: 0.4 }, { type: 'columnSq', x: 0.25, y: 18.9, w: 0.4 },
    { type: 'lounger', x: 7.2, y: 20.6, rot: -90 }, { type: 'lounger', x: 8.6, y: 20.6, rot: -90 },
    { type: 'plantReal', x: -0.8, y: 20.5, s: 1.4, kind: 'strelitzia' }, { type: 'plantReal', x: 9.8, y: 21.5, s: 1.2, kind: 'monstera' },
    { type: 'downlight', x: 2.5, y: 18.0, z: EAVE, outdoor: true }, { type: 'downlight', x: 7.5, y: 20.5, z: EAVE, outdoor: true }, { type: 'downlight', x: 8.8, y: 6.9, z: EAVE, outdoor: true },
    // --- detale (dodatki)
    { type: 'decorIsland', x: 3.1, y: 10.85, rot: 90 },
    { type: 'pantryShelves', x: 6.1, y: 9.7, rot: 0, w: 2.5, h: 2.3 },
    { type: 'wallLamp', x: 7.7, y: 7.28, rot: 0, z: 2.3 }, { type: 'wallLamp', x: 16.6, y: -0.02, rot: 0, z: 2.5 },
    { type: 'mirrorTall', x: 9.93, y: 11.2, rot: -90, w: 0.6, h: 1.8 },
    { type: 'wardrobeRods', x: 6.35, y: 10.6, rot: 0, w: 2.0 },
    { type: 'wardrobeRods', x: 13.97, y: 7.5, rot: 90, w: 1.5 },
    { type: 'wardrobeRods', x: 12.3, y: 13.62, rot: 180, w: 1.4 },
    { type: 'tvPanel', x: 16.7, y: 11.47, rot: 180, w: 1.3, z: 1.25 },
    { type: 'books', x: 15.5, y: 7.0, z: 0.5 }, { type: 'books', x: 17.9, y: 7.0, z: 0.5, n: 2 },
    { type: 'rug', x: 16.7, y: 9.6, w: 2.4, d: 1.6 }, { type: 'rug', x: 12.3, y: 19.6, w: 1.6, d: 2.2 }, { type: 'rug', x: 16.7, y: 19.6, w: 1.6, d: 2.2 }, { type: 'rug', x: 16.4, y: 13.2, w: 1.8, d: 1.6 },
    { type: 'shelfWall', x: 12.0, y: 17.6, rot: 0, w: 0.9, z: 1.6 }, { type: 'shelfWall', x: 17.2, y: 17.6, rot: 0, w: 0.9, z: 1.6 }, { type: 'shelfWall', x: 15.8, y: 11.72, rot: 0, w: 0.9, z: 1.6 },
    { type: 'laptop', x: 11.7, y: 21.15, rot: 180, z: 0.755 }, { type: 'laptop', x: 17.4, y: 21.15, rot: 180, z: 0.755 }, { type: 'laptop', x: 16.0, y: 14.6, rot: 180, z: 0.755 },
    { type: 'clock', x: 13.6, y: 13.26, rot: 0, z: 2.0 }, { type: 'clock', x: 4.2, y: 12.32, rot: 0, z: 2.2 },
    { type: 'towels', x: 16.3, y: 17.1, rot: 0, z: 0.83 }, { type: 'bottles', x: 17.7, y: 17.1, rot: 0, z: 0.83 },
    { type: 'towels', x: 12.3, y: 8.8, rot: 0, z: 0.83, n: 1 }, { type: 'bottles', x: 13.4, y: 8.8, rot: 0, z: 0.83 },
    { type: 'bottles', x: 12.7, y: 17.1, rot: 0, z: 0.93 },
    { type: 'painting', x: 16.7, y: 6.57, rot: 180, w: 1.2, h: 0.8, z: 1.9 }, { type: 'painting', x: 8.1, y: 12.24, rot: 180, w: 0.8, h: 1.0, z: 1.5 },
    { type: 'downpipe', x: -0.08, y: 7.22, h: 3.0 }, { type: 'downpipe', x: -0.08, y: 16.6, h: 3.0 }, { type: 'downpipe', x: 10.78, y: 21.96, h: 3.0 }, { type: 'downpipe', x: 18.78, y: 21.96, h: 3.0 }, { type: 'downpipe', x: 18.78, y: -0.08, h: 3.0 }, { type: 'downpipe', x: 9.72, y: -0.08, h: 3.0 },
    { type: 'grassClump', x: -2.5, y: 15.0, s: 1.2 }, { type: 'grassClump', x: -2.5, y: 8.5, s: 1.0 }, { type: 'grassClump', x: 8.0, y: 23.2, s: 1.1 }, { type: 'grassClump', x: 11.5, y: 23.0, s: 1.2 }, { type: 'grassClump', x: 19.6, y: 10.0, s: 1.0 },
    { type: 'grassClump', x: 8.2, y: -1.5, s: 1.1 }, { type: 'grassClump', x: 3.5, y: 5.0, s: 1.2 }, { type: 'grassClump', x: 20.5, y: -2.5, s: 1.0 }, { type: 'grassClump', x: -1.0, y: 23.5, s: 1.1 }, { type: 'grassClump', x: 21.0, y: 21.0, s: 1.0 },
  ],

  lights: [
    { type: 'point', x: 2.0, y: 14.2, z: 1.7, i: 14, k: 2700, dist: 8 },       // jadalnia
    { type: 'point', x: 3.1, y: 10.85, z: 1.6, i: 10, k: 3000, dist: 6 },      // wyspa
    { type: 'point', x: 2.0, y: 9.0, z: 2.7, i: 10, k: 3000, dist: 7 },        // kuchnia
    { type: 'spot', x: 8.6, y: 14.0, z: 2.75, tx: 9.4, ty: 12.4, tz: 1.3, i: 36, k: 3000, angle: 0.55 },   // TV
    { type: 'spot', x: 6.2, y: 14.0, z: 2.75, tx: 6.0, ty: 12.4, tz: 0.8, i: 26, k: 3000, angle: 0.5 },   // kominek
    { type: 'point', x: 8.0, y: 16.5, z: 2.7, i: 12, k: 2700, dist: 9 },       // salon
    { type: 'point', x: 8.8, y: 10.0, z: 2.7, i: 9, k: 2700, dist: 6 },        // wiatrołap
    { type: 'point', x: 12.4, y: 12.3, z: 2.7, i: 12, k: 2700, dist: 8 },      // hol
    { type: 'point', x: 14.5, y: 15.5, z: 2.7, i: 10, k: 2700, dist: 7 },      // korytarz
    { type: 'spot', x: 16.2, y: 6.9, z: 2.72, tx: 16.2, ty: 6.6, tz: 1.0, i: 20, k: 2700, angle: 0.5 },
    { type: 'spot', x: 17.2, y: 6.9, z: 2.72, tx: 17.2, ty: 6.6, tz: 1.0, i: 20, k: 2700, angle: 0.5 },
    { type: 'point', x: 16.6, y: 9.5, z: 2.6, i: 8, k: 2700, dist: 7 },        // sypialnia
    { type: 'point', x: 12.9, y: 9.9, z: 2.65, i: 9, k: 2700, dist: 5 },       // łazienka 14
    { type: 'point', x: 16.3, y: 16.3, z: 2.65, i: 10, k: 2700, dist: 6 },     // łazienka 10
    { type: 'point', x: 16.4, y: 13.3, z: 2.65, i: 9, k: 2700, dist: 6 },      // pokój 11
    { type: 'point', x: 12.4, y: 19.5, z: 2.65, i: 9, k: 2700, dist: 6 },      // pokój 8
    { type: 'point', x: 16.6, y: 19.5, z: 2.65, i: 9, k: 2700, dist: 6 },      // pokój 9
    { type: 'point', x: 11.0, y: 9.4, z: 2.6, i: 5, k: 2700, dist: 4 },        // toaleta
    { type: 'point', x: 12.0, y: 16.2, z: 2.6, i: 7, k: 3500, dist: 5 },       // pralnia
    { type: 'point', x: 2.5, y: 18.0, z: 2.9, i: 10, k: 2700, dist: 8, outdoor: true },   // taras (wnęka)
    { type: 'point', x: 7.5, y: 20.5, z: 2.9, i: 10, k: 2700, dist: 8, outdoor: true },   // taras N
    { type: 'point', x: 8.8, y: 6.9, z: 2.9, i: 8, k: 2700, dist: 6, outdoor: true },     // wejście
  ],

  roofHip: [
    { rect: [-1.5, 6.4, 11.4, 22.4], pitch: 33, eave: EAVE, axis: 'x' },     // część dzienna + taras zadaszony
    { rect: [9.0, -0.9, 19.6, 22.6], pitch: 33, eave: EAVE, axis: 'y' },     // skrzydło sypialne + garaż
  ],

  site: {
    lawn: [-14, -14, 32, 36],
    fence: { rect: [-13, -13, 31, 35], h: 1.6, mat: 'ext_white' },
    pool: { rect: [1.5, 24.0, 6.5, 30.0], depth: 1.5 },
    poolDeck: [0.7, 23.2, 7.3, 30.8],
    trees: [[-9, 30, 7], [12, 32, 8], [24, 28, 7], [28, 12, 6.5], [27, -6, 7], [-9, -8, 6], [-10, 8, 6.5], [4, -11, 5.5], [22, 24, 5]],
    shrubs: [[-2.5, 23.0, 1.1], [9.5, 24.0, 1.2], [12, 24.5, 1.0], [20.5, 23.5, 1.1], [20.5, 9, 1.0], [-2.5, 10, 1.0], [-2.5, 5, 1.1], [3, 3, 0.9], [21, -3, 1.0], [7, -3, 1.1]],
  },

  start: { room: 'wejscie' },
};
