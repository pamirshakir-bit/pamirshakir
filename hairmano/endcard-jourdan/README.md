# Hairmano – loppuanimaatio (Jourdan)

Tumma brändilopetus hairmano.be:n footerin tyyliin. Kuva häivytetään mustaksi, pyöreä HAIRMANO-logo piirtyy esiin ja sen alle tulevat uuden liikkeen tiedot sekä CTA (hairmano.be).

## Tiedostot (`renders/`)

| Tiedosto | Mihin |
|---|---|
| `hairmano-jourdan-endcard_1080x1920_25fps_alpha.mov` | Pysty 9:16, ProRes 4444 + alfa. Aikajanalle. |
| `hairmano-jourdan-endcard_1920x1080_25fps_alpha.mov` | Vaaka 16:9, ProRes 4444 + alfa. Aikajanalle. |
| `…_preview.mp4` | Esikatselu puhelimelle. Alun taustalla on sivuston kuva Jourdanista videosi viimeisen kuvan tilalla. Ei aikajanalle. |

Kesto 8 s, 25 fps.

## DaVinci Resolve

1. Raahaa MOV Media Pooliin ja aikajanalle **V2:lle** niin, että se alkaa noin sekunnin ennen viimeisen klipin loppua. Ensimmäiset 0,8 s häivyttävät kuvan mustaksi.
2. Jos MOV:n alla ei ole mitään, ruutu on musta alusta asti, joten sen voi laittaa myös suoraan videon perään.
3. Jos läpinäkyvyys ei näy: oikea klikkaus klipistä → *Clip Attributes* → *Alpha Mode: Straight*.
4. Kaikki on ruudulla kohdassa 4,6 s, ja loppu on pelkkää pitoa. Sitä voi lyhentää vapaasti.

## Ajoitus

| s | Tapahtuu |
|---|---|
| 0–0,8 | Kuva häivyttyy mustaksi |
| 0,55–1,9 | Logo piirtyy |
| 1,8–3,4 | NOW OPEN IN JOURDAN, EUROPEAN QUARTER, osoite, aukiolo, puhelin |
| 2,95–4,6 | BOOK YOUR APPOINTMENT ja alleviivattu hairmano.be |

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
