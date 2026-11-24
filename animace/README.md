# Animace webu Court of Moravia

Všechny animace z prototypu webu CoM (artefakt „Court of Moravia – Zrcadlo“, verze 126). Nejsou to videa ani obrázky. Kreslí je JavaScript do elementu `<canvas>`, takže se přizpůsobí každé velikosti a nic se nestahuje.

Živé ukázky všech animací i s kódem na vložení jsou v **`ukazky.html`**. Stačí ji otevřít v prohlížeči (lokálně nebo přes GitHub Pages: `…/claude-first-repo/animace/ukazky.html`).

## Co je ve složce

| Soubor | Co dělá |
|---|---|
| `vizual.js` | Knihovna všech animací: tok moci (`flow`), vizuály produktů, linka fází a linka kroků. Stejný soubor jako na webu. |
| `pozadi.js` | Kouř v pozadí úvodu homepage. Na webu je ten kód přímo v `index.html`, tady je vytažený do samostatné funkce. |
| `img/crown-white.svg` | Korunka, kterou kreslí vizuál `adwazir` (Vezír). |
| `ukazky.html` | Katalog: každá animace naživo, popis a kód na vložení. |

Knihovna nemá žádné závislosti, nepotřebuje build ani framework.

## Rychlý start

```html
<canvas class="viz" data-viz="flow" data-case="clot" data-live="1" aria-hidden="true"
        style="display:block;width:100%;height:480px"></canvas>

<script src="vizual.js"></script>
```

`vizual.js` po načtení najde všechny `canvas.viz` a rozběhne je. Skript dej až na konec `<body>`, za všechny canvasy.

**Velikost určuje CSS.** Canvas musí mít v CSS šířku i výšku (nebo `aspect-ratio`). Knihovna si podle ní sama nastaví vnitřní rozlišení a při změně velikosti se překreslí (ResizeObserver).

## Atributy

| Atribut | Hodnoty | Význam |
|---|---|---|
| `data-viz` | `flow`, `radix`, `opus`, `adwazir`, `otium`, `ee`, `pcd`, `pcdline`, `steps` | Která animace se kreslí. |
| `data-live` | `1` (výchozí), `hover` | `1` = animuje se, kdykoli je vidět. `hover` = stojí a rozběhne se pod kurzorem nebo při fokusu (karty produktů). |
| `data-case` | jen pro `flow`: `free`, `clot`, `one`, `scatter`, `stall`, `astray`, `fog`, `loop` | Režim toku moci, viz níže. |
| `data-labels` | jen pro `flow`: `0` | Skryje popisky MAJITEL / ŘEDITEL / VEDENÍ / TÝM. |
| `data-on` | jen pro `pcdline`: např. `0,1` | Které fáze svítí: 0 = Skica, 1 = Návrh, 2 = Stavba. |
| `data-quiet` | jen pro `pcdline`: `1` | Méně částic (stránka Power Change Delivery). |
| `data-xs` | jen pro `steps`: např. `0.004,0.333,0.666` | Pozice zastávek 0–1 zleva. |

### Kde se co používá

| Animace | Místo na webu |
|---|---|
| `pozadi.js` | Homepage, celý úvod (kouř pod obsahem). |
| `flow` + `clot` / `one` / `scatter` / `stall` / `astray` | Homepage, obrazovka „Příčina“. Pět bolestí v tomto pořadí: Rozhodují jiní… / Všechno musím rozhodnout sám / Na poradách… / Rozhodnutí padne, ale nepřetaví se v realitu / Na plánování… nezbývá čas. |
| `flow` + `free` + `data-labels="0"` | Homepage, obrazovka „Nechcete jinou firmu…“ (zdravý stav). |
| `flow` + `fog` | Stránka Power Change Delivery. |
| `flow` + ostatní režimy, včetně `loop` | Případové studie. |
| `radix`, `opus`, `adwazir`, `otium`, `ee`, `pcd` | Hlavičky a karty stránek Půdorys, Dílo, Vezír, Výjezd, Manažerská zkušenost a Power Change Delivery. |
| `pcdline` | Sekce „Kde … sedí“ a „Tři kroky“ (fáze Skica → Návrh → Stavba). |
| `steps` | Sekce „Jak to probíhá“ na produktových stránkách. |

## Přepnutí toku na jinou bolest

Po změně `data-case` (nebo jiného atributu) je nutné animaci znovu připravit:

```js
var cv = document.getElementById('whyCv');
cv.dataset.case = 'scatter';
CoMViz.refresh(cv);
```

Když canvas přidáš do stránky až po načtení `vizual.js` (např. ze šablony), zavolej `CoMViz.scan()`.

## Kouř v pozadí (`pozadi.js`)

```html
<canvas id="fx" aria-hidden="true" style="position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none"></canvas>
<script src="pozadi.js"></script>
<script>
  var pozadi = CoMPozadi(document.getElementById('fx'));
  // po výběru bolesti:      pozadi.setGlow(1.35);
  // obrazovka „Tři kroky“:  pozadi.setGlow(1.6);
  // zpět na první obrazovku: pozadi.setGlow(1);
</script>
```

Na webu stránka za úvodem canvas plynule zprůhlední přes `cv.style.opacity` podle scrollu. Při opacity 0 se nekreslí, takže nezatěžuje procesor.

## Linka kroků: pozice zastávek podle textu

Na produktových stránkách sedí zastávky přesně nad sloupci s kroky. Dělá to tento skript (canvas a `<ol>` s kroky jsou v jednom obalu `.stepsline`):

```js
(function(){var w=document.querySelector('.stepsline');if(!w)return;var cv=w.querySelector('canvas'),ol=w.querySelector('ol');
function place(){var W=ol.offsetWidth;if(!W)return;cv.dataset.xs=[].map.call(ol.children,function(li){return ((li.offsetLeft+6)/W).toFixed(4);}).join(',');if(window.CoMViz)window.CoMViz.refresh(cv);}
place();window.addEventListener('resize',place);window.addEventListener('load',place);})();
```

## Na co dát pozor

- **Korunka:** vizuál `adwazir` načítá `img/crown-white.svg` relativně ke stránce, ne ke skriptu. Když bude jinde, uprav cestu na řádku `crown.src=…` ve `vizual.js`.
- **Písmo:** popisky toku se kreslí písmem Geist Mono (Google Fonts). Když na stránce není, použije se náhradní monospace.
- **Texty popisků** (MAJITEL, ŘEDITEL, VEDENÍ, TÝM) jsou přímo v kódu, ve funkci `flow` ve `vizual.js`. Pro anglickou verzi je potřeba je tam přeložit.
- **Úzký displej:** `flow` se sám otočí svisle, když canvas není aspoň o 15 % širší než vysoký.
- **Okraje:** na webu se okraje canvasů prolínají do černé přes CSS `mask-image` (lineární gradienty). Animace sama ostré okraje má. Hodnoty masek najdeš v `index.html` a `produkt.css` v kořeni repozitáře.
- **Výkon:** animace běží asi na 30 snímků za sekundu a jen tehdy, když jsou vidět (IntersectionObserver).
- **Přístupnost:** při systémovém nastavení „omezit pohyb“ (`prefers-reduced-motion`) se vykreslí jen statický snímek.
- **První blok ve `vizual.js`** nesouvisí s animacemi. Po načtení stránky posune okno nahoru (kvůli tomu, jak prototyp běží v artefaktu). Na ostrém webu ho můžeš smazat (blok začíná komentářem „Po příchodu na stránku vždy začít nahoře“).
- **Barvy** jsou ve `vizual.js` nahoře: červená `206,22,22`, krémová `234,231,224` a pozadí `#050505`.
