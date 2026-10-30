# Hairmano – loppuanimaatio (Jourdan)

Tumma brändilopetus hairmano.be:n footerin tyyliin: viimeinen kuva liukuu mustaan, pyöreä HAIRMANO-logo piirtyy esiin, Jourdanin liikkeen tiedot tulevat sisään ja lopuksi CTA (hairmano.be).

## Tiedostot (`renders/`)

| Tiedosto | Mihin |
|---|---|
| `hairmano-jourdan-endcard_1080x1920_25fps_alpha.mov` | Pysty 9:16, ProRes 4444 + alfa. Aikajanalle. |
| `hairmano-jourdan-endcard_1920x1080_25fps_alpha.mov` | Vaaka 16:9, ProRes 4444 + alfa. Aikajanalle. |
| `…_preview.mp4` | Esikatselu puhelimelle. Taustalla sivuston kuva Jourdanista videosi viimeisen kuvan tilalla. Ei aikajanalle. |

Kesto 10 s, 25 fps.

## DaVinci Resolve

1. Raahaa MOV Media Pooliin ja aikajanalle **V2:lle** viimeisen klipin päälle.
2. Anna viimeisen kuvan jatkua MOV:n alla noin 6 s. Musta peittää kuvan kokonaan kohdassa 6,3 s. Jos kuvaa ei ole tarpeeksi: oikea klikkaus klipistä → *Change Clip Speed* → *Freeze Frame*.
3. Ilman mitään alla MOV toimii myös erillisenä lopetuksena, koska tausta on joka tapauksessa musta.
4. Jos läpinäkyvyys ei näy: oikea klikkaus klipistä → *Clip Attributes* → *Alpha Mode: Straight*.
5. Loppu (n. 8,3–10 s) on pelkkää pitoa. Sitä voi lyhentää vapaasti.

## Ajoitus

| s | Tapahtuu |
|---|---|
| 0–1,2 | Musta nousee alhaalta, kuva näkyy yläosassa |
| 0,55–1,9 | Logo piirtyy |
| 1,2–3,1 | NOW OPEN · EUROPEAN QUARTER, Jourdan, osoite, aukiolo, puhelin |
| 5,0–6,4 | Tiedot poistuvat, musta täyttää ruudun, logo siirtyy keskelle |
| 6,3–8,3 | NOW OPEN IN JOURDAN · BOOK YOUR APPOINTMENT · hairmano.be |

## Huomioitavaa

- **Logo on piirretty uudelleen** sivuston footerin kuvakaappauksesta (fontit Bungee ja Oswald, viikset vektorina). Alkuperäistä logotiedostoa ei saatu ladattua. Jos sinulla on logo PNG- tai SVG-muodossa, se vaihdetaan tilalle ja renderöidään uudelleen.
- Tekstit ovat englanniksi kuten sivustolla. Osoite, puhelin ja aukioloajat ovat sivuston Jourdan-kortista (sivustolla "7 Rue gray", korjattu muotoon "7 Rue Gray").
- Värit: musta #000, valkoinen, harmaa #8c8c8c, logon khaki #8f8a6f, renkaan kerma #e9e6de.

## Muokkaus ja uudelleenrenderöinti

Tekstit ovat `endcard.html`:ssä (`COPY`), ajoitukset kohdassa `T`. Selaimessa `endcard.html?format=h&preview&t=4` näyttää vaakaversion ruudun kohdasta 4 s.

Tarvitaan Node, Playwright ja ffmpeg:

```bash
npm i playwright && npx playwright install chromium
```

```bash
node render.cjs
```

```bash
node render.cjs --format v --fps 30
```

Ensimmäinen renderöi molemmat formaatit 25 fps:llä, toinen pelkän pystyversion 30 fps:llä (jos aikajana on 30 tai 29,97 fps).
