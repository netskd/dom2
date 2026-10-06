// ARCHON — Dom w przebiśniegach 19 (G2E) · WERSJA LUSTRZANA
// Ten sam projekt co archon19.js, odbity względem pionowej osi rzutu — tak jak „lustrzane odbicie”
// w ofercie ARCHON-u. Silnik (mirrorHouse w app.js) odwraca geometrię, materiały ścian zostają
// po właściwych stronach, drzwi otwierają się w te same przestrzenie, a wejście zmienia stronę świata.

import base from './archon19.js';

export default {
  ...base,
  id: 'archon19m',
  name: 'Dom w przebiśniegach 19 (G2E) — lustro',
  author: 'ARCHON+ · wersja lustrzana · parterowy, dach kopertowy 33°',
  mirror: true,
  mirrorBounds: [-3, -1.5, 21, 24],   // oś odbicia: x' = (-3 + 21) − x
  start: { room: 'wejscie' },
};
