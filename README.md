# dom2 — spacer 3D po projektach domów

Interaktywna wizualizacja wnętrz (Three.js) z porą dnia liczoną astronomicznie dla Białegostoku,
cieniami, PBR, trybem z lotu ptaka i przełącznikiem orientacji wejścia.

- `site/index.html` — strona + UI
- `site/app.js` — silnik (niezależny od projektu)
- `site/hk88.js` — HomeKoncept 88
- `site/archon19.js` — Archon „Dom w przebiśniegach 19 (G2E)”
- `site/tex/` — tekstury proceduralne (generator: `gen_textures.py`, wymaga numpy + Pillow)

Uruchomienie lokalne: `python3 -m http.server 8095 --bind 0.0.0.0 --directory site`
(Three.js ładuje się z cdn.jsdelivr.net). Wybór projektu: `#house=hk88` / `#house=archon19`.

Nowy projekt = nowy plik `site/<id>.js` (rooms / floors / ceilings / walls z otworami / boxes / furniture /
lights / roof lub roofHip / site) + opcja w `<select id="houseSel">` w `index.html`.
