# Changelog

Toutes les évolutions notables de ce plugin sont documentées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [0.1.10] - 2026-10-06

### Corrigé
- **Ufo Splide Posts** : `mb-0` sur l'extrait pour neutraliser la marge basse
  des paragraphes ajoutée par le thème (repris de `new-isd`).

## [0.1.9] - 2026-10-06

### Ajouté
- **Ufo Splide Posts** : filtre `ufo_splide_term_class` (`$class`, `$term`,
  `$post`, `$attributes`) pour ajouter des classes au libellé de chaque terme,
  par exemple un badge coloré défini par le thème. Vide par défaut : rendu
  inchangé.

### Modifié
- **Ufo Splide Posts** : couleurs de la carte basées sur les couleurs
  `background` et `foreground` de `theme.json` (au lieu de `tertiary`) : fond
  `bg-background`, dégradé `from-foreground via-foreground/70`, contour
  `ring-foreground/10`.
- **Ufo Splide Posts** : date et termes en `text-xs/6` (au lieu de `text-sm/6`).
- **Ufo Splide Posts** (éditeur) : classe `not-prose` sur l'image de l'aperçu.

### Corrigé
- **Ufo Splide Posts** : tous les termes de la taxonomie affichée sont rendus,
  et plus seulement le premier (ex. une formation à la fois « Alternance » et
  « Initial »).
- **Ufo Splide Posts** (éditeur) : l'aperçu affiche les termes de la taxonomie
  sélectionnée, et non le premier terme de la première taxonomie embarquée.

## [0.1.8] - 2026-09-25

Version de consolidation : fusion de la branche `sup-saintdominiquebase` (0.1.7)
et de la branche `new-isd` (0.1.6 + correctifs du bloc Posts).

### Ajouté
- **Ufo Splide Slider** : dépréciation `0.1.6` pour que les sliders enregistrés
  avant la 0.1.7 soient migrés automatiquement au lieu d'être signalés comme
  « contenu inattendu » (`src/ufo-splide-slider/deprecated.js`). La valeur
  d'`autoplay` d'origine est conservée.
- `CHANGELOG.md` et `README.md`.

### Modifié
- **Ufo Splide Posts** : on garde le rendu de `new-isd` (voir 0.1.7 → « Non repris »).
- `package.json` : version synchronisée avec le plugin.

## [0.1.7] - 2026-08-21

Développée sur `sup-saintdominiquebase`.

### Ajouté
- **Ufo Splide Slider** : option **Fade Effect** (transition en fondu, une seule
  slide visible, `rewind` activé, breakpoints désactivés).
- **Ufo Splide Slider** : navigation précédent/suivant et libellé « Slide X of Y »
  dans l'éditeur quand le fondu est actif.
- **Ufo Splide Slider** : support `dimensions.minHeight`.
- Icônes personnalisées pour les blocs Slider, Slide et Posts (`icon.js`).
- Le bloc Slide accepte `ufo-blocks/ufo-grid`, qui devient son template par défaut.

### Modifié
- **Ufo Splide Slider** : `autoplay` est désactivé par défaut (au lieu d'activé).
- **Ufo Splide Slider** : suppression du `gap` de 1rem par défaut.
- Pagination active : couleur `--wp--preset--color--primary`.
- La CSS de Splide est chargée en front via `frontend.css`.

### Corrigé
- **Ufo Splide Slider** : l'instance Splide de l'éditeur est remise à `null`
  après `destroy()`, ce qui évite de réutiliser une instance détruite.

### Non repris dans la 0.1.8
- Le `render.php` du bloc Posts de la 0.1.7 (image `<img>` brute sans
  `srcset`, `$cta_style` non échappé, police `font-chillax`).

## [0.1.6] - 2026-08-19

Développée sur `new-isd`.

### Modifié
- **Ufo Splide Posts** (`render.php`, mis à jour le 2026-09-25) :
  - vignette via `get_the_post_thumbnail()` (`width`/`height`/`srcset`/`sizes`,
    pas de CLS) ;
  - échappement de l'ID du post et de `$cta_style` ;
  - extrait tronqué avec `_ufo_truncate_text()` du thème si elle existe,
    sinon `wp_trim_words()` ;
  - couleurs alignées sur la charte ISD (`bg-tertiary`, dégradé `tertiary`).

## Versions antérieures

Non documentées.

[0.1.10]: https://github.com/Vince-ALIEN/ufo-splide-blocks/releases/tag/v0.1.10
[0.1.9]: https://github.com/Vince-ALIEN/ufo-splide-blocks/releases/tag/v0.1.9
[0.1.8]: https://github.com/Vince-ALIEN/ufo-splide-blocks/releases/tag/v0.1.8
