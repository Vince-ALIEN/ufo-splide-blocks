# Ufo Splide Blocks

Blocs Gutenberg de carrousel basés sur [Splide](https://splidejs.com/), pour les thèmes UFO (Tailwind CSS).

## Blocs

### Ufo Splide Slider (`create-block/ufo-splide-slider`)
Slider libre dont chaque slide (`create-block/ufo-slide`) contient des blocs
(`ufo-blocks/ufo-grid` par défaut, image, titre, paragraphe, colonnes, groupe, boutons).

| Option | Défaut | Description |
|---|---|---|
| Autoplay | `false` | Défilement automatique (intervalle 3 s) |
| Navigation | `true` | Flèches précédent / suivant |
| Pagination | `true` | Puces de pagination |
| Fade Effect | `false` | Transition en fondu, une slide à la fois |
| Slides Per View | `1` | 1 à 6 (ignoré en fondu), avec des breakpoints à 640, 768 et 1024 px |

Supports : `align` (wide, full), `dimensions.minHeight`.

### Ufo Splide Posts (`create-block/ufo-splide-cpt`)
Carrousel de publications ou de Custom Post Types rendu côté serveur (`render.php`) :
type de contenu, taxonomie / termes, nombre de posts, date, catégorie, texte
et couleurs du bouton d'appel à l'action.

## Dépendances

- WordPress ≥ 6.7, PHP ≥ 7.4
- Plugin [`ufo-blocks`](https://github.com/Vince-ALIEN/ufo-blocks) (template `ufo-grid` des slides)
- Un thème qui compile les classes Tailwind utilisées dans `render.php`
  (`bg-tertiary`, `bg-primary`, `btn`, …)

## Développement

```bash
npm install
npm start          # watch
npm run build      # build de production dans build/
npm run plugin-zip # archive installable
```

Le dossier `build/` est versionné pour que le plugin puisse être installé
directement depuis le dépôt.

## Publier une version

1. Mettre le même numéro de version dans `ufo-splide-blocks.php`, `package.json`,
   `src/*/block.json` et `readme.txt` (Stable tag).
2. Compléter `CHANGELOG.md`.
3. Si le `save()` d'un bloc change, ajouter une entrée dans `deprecated.js`.
4. `npm run build`, commit, `git tag vX.Y.Z`, `git push --tags`.

## Licence

GPL-2.0-or-later
