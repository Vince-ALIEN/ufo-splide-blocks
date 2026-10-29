import { __, _n, sprintf } from "@wordpress/i18n";
import {
  useBlockProps,
  useInnerBlocksProps,
  BlockControls,
  InspectorControls,
  store as blockEditorStore,
} from "@wordpress/block-editor";
import { createBlocksFromInnerBlocksTemplate } from "@wordpress/blocks";
import {
  ToggleControl,
  RangeControl,
  Button,
  ToolbarGroup,
  ToolbarButton,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { chevronLeft, chevronRight, plus } from "@wordpress/icons";
import metadata from "./block.json";
import {
  UfoToolsPanel,
  PanelItem,
  getAttributeDefaults,
} from "../shared/controls";
import "../shared/editor.scss";
import "./editor.scss";

const DEFAULTS = getAttributeDefaults(metadata);
const SLIDER_KEYS = [
  "autoplay",
  "navigation",
  "pagination",
  "fadeEffect",
  "slidesPerView",
];

const ALLOWED_BLOCKS = ["create-block/ufo-slide"];
// Grille d'une colonne avec sa cellule : une grille vide affiche le
// sélecteur de disposition de Ufo Grid à la place de la slide.
const SLIDE_GRID = [
  "ufo-blocks/ufo-grid",
  { columnsCount: 1 },
  [["ufo-blocks/ufo-row"]],
];
const SLIDE = ["create-block/ufo-slide", {}, [SLIDE_GRID]];
const TEMPLATE = [SLIDE, SLIDE, SLIDE];

/**
 * L'éditeur ne monte pas Splide : en boucle, il clone les slides (clones
 * impossibles à éditer) et capte les clics. Les slides sont affichées côte
 * à côte, `perView` à la fois, avec une navigation précédent / suivant.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
  const { autoplay, navigation, pagination, slidesPerView, fadeEffect } =
    attributes;
  const perView = fadeEffect ? 1 : Math.max(1, slidesPerView || 1);
  const [first, setFirst] = useState(0);
  const { selectBlock, insertBlocks } = useDispatch(blockEditorStore);

  const { slideCount, selectedSlide } = useSelect(
    (select) => {
      const { getBlockOrder, getSelectedBlockClientId, getBlockParents } =
        select(blockEditorStore);
      const order = getBlockOrder(clientId);
      const selected = getSelectedBlockClientId();
      // Index de la slide qui contient le bloc sélectionné, -1 sinon.
      const chain = selected
        ? [selected, ...getBlockParents(selected, true)]
        : [];
      const index = chain.reduce(
        (found, id) => (found >= 0 ? found : order.indexOf(id)),
        -1,
      );
      return { slideCount: order.length, selectedSlide: index };
    },
    [clientId],
  );

  const maxFirst = Math.max(0, slideCount - perView);
  const start = Math.min(first, maxFirst);

  // Affiche la slide du bloc sélectionné (vue en liste, ajout d'une slide).
  useEffect(() => {
    if (
      selectedSlide >= 0 &&
      (selectedSlide < start || selectedSlide >= start + perView)
    ) {
      setFirst(Math.min(selectedSlide, maxFirst));
    }
  }, [selectedSlide]);

  const blockProps = useBlockProps({ className: "ufo-splide-editor" });
  const innerBlocksProps = useInnerBlocksProps(
    {
      className: "ufo-splide__list",
      style: { "--ufo-splide-per-view": perView },
    },
    {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      orientation: "horizontal",
      // Un « + » dans la liste prendrait la place d'une slide : les slides
      // s'ajoutent depuis la barre d'outils, comme les cellules de ufo-grid.
      renderAppender: false,
    },
  );

  // La nouvelle slide est sélectionnée, et donc affichée (voir plus haut).
  const addSlide = () =>
    insertBlocks(
      createBlocksFromInnerBlocksTemplate([SLIDE]),
      undefined,
      clientId,
    );

  // Slides hors de la vue masquées par position (ce sont les blocs enfants,
  // rendus par InnerBlocks : pas de prop à leur passer).
  const slideSelector = `#block-${clientId} > .ufo-splide__list > .wp-block-create-block-ufo-slide`;
  const hidden = [`${slideSelector}:nth-child(n+${start + perView + 1})`];
  if (start > 0) {
    hidden.push(`${slideSelector}:nth-child(-n+${start})`);
  }

  const badge = [
    __("Slider", "ufo-splide-blocks"),
    sprintf(
      // translators: %d: number of slides
      _n("%d slide", "%d slides", slideCount, "ufo-splide-blocks"),
      slideCount,
    ),
    fadeEffect
      ? __("fondu", "ufo-splide-blocks")
      : sprintf(
          // translators: %d: slides per view
          __("%d par vue", "ufo-splide-blocks"),
          perView,
        ),
  ].join(" · ");

  const last = Math.min(start + perView, slideCount);
  const navLabel =
    perView === 1
      ? sprintf(
          // translators: 1: current slide number, 2: total number of slides
          __("Slide %1$d sur %2$d", "ufo-splide-blocks"),
          start + 1,
          slideCount,
        )
      : sprintf(
          // translators: 1: first visible slide, 2: last visible slide, 3: total
          __("Slides %1$d à %2$d sur %3$d", "ufo-splide-blocks"),
          start + 1,
          last,
          slideCount,
        );

  const itemProps = { attributes, defaults: DEFAULTS, setAttributes };

  return (
    <>
      <BlockControls group="other">
        <ToolbarGroup>
          <ToolbarButton
            icon={plus}
            label={__("Ajouter une slide", "ufo-splide-blocks")}
            onClick={addSlide}
          />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <UfoToolsPanel
          label={__("Slider", "ufo-splide-blocks")}
          defaults={DEFAULTS}
          keys={SLIDER_KEYS}
          setAttributes={setAttributes}
        >
          <PanelItem
            {...itemProps}
            label={__("Défilement automatique", "ufo-splide-blocks")}
            keys={["autoplay"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Défilement automatique", "ufo-splide-blocks")}
              checked={autoplay}
              onChange={(value) => setAttributes({ autoplay: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Flèches", "ufo-splide-blocks")}
            keys={["navigation"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Flèches précédent / suivant", "ufo-splide-blocks")}
              checked={navigation}
              onChange={(value) => setAttributes({ navigation: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Pagination", "ufo-splide-blocks")}
            keys={["pagination"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Pagination", "ufo-splide-blocks")}
              checked={pagination}
              onChange={(value) => setAttributes({ pagination: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Fondu", "ufo-splide-blocks")}
            keys={["fadeEffect"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Transition en fondu", "ufo-splide-blocks")}
              help={__(
                "Une seule slide à la fois, qui apparaît en fondu au lieu de glisser.",
                "ufo-splide-blocks",
              )}
              checked={fadeEffect}
              onChange={(value) => setAttributes({ fadeEffect: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Slides par vue", "ufo-splide-blocks")}
            keys={["slidesPerView"]}
          >
            <RangeControl
              __nextHasNoMarginBottom
              __next40pxDefaultSize
              label={__("Slides par vue", "ufo-splide-blocks")}
              value={slidesPerView}
              onChange={(value) =>
                setAttributes({
                  slidesPerView: value ?? DEFAULTS.slidesPerView,
                })
              }
              min={1}
              max={6}
              disabled={fadeEffect}
              help={__(
                "À partir de 1024px. 2 au plus entre 768 et 1024px, 1 en dessous.",
                "ufo-splide-blocks",
              )}
            />
          </PanelItem>
        </UfoToolsPanel>
      </InspectorControls>
      <div {...blockProps}>
        <button
          type="button"
          className="ufo-splide__badge"
          onClick={() => selectBlock(clientId)}
          aria-label={__("Sélectionner le slider", "ufo-splide-blocks")}
        >
          {badge}
        </button>
        <style>{`${hidden.join(",")}{display:none}`}</style>
        <div className="ufo-splide__edit-nav">
          {slideCount > perView && (
            <>
              <Button
                size="small"
                icon={chevronLeft}
                label={__("Précédent", "ufo-splide-blocks")}
                onClick={() => setFirst(Math.max(0, start - 1))}
                disabled={start === 0}
              />
              <span className="ufo-splide__edit-nav-label">{navLabel}</span>
              <Button
                size="small"
                icon={chevronRight}
                label={__("Suivant", "ufo-splide-blocks")}
                onClick={() => setFirst(Math.min(maxFirst, start + 1))}
                disabled={start >= maxFirst}
              />
            </>
          )}
          <Button
            size="small"
            icon={plus}
            label={__("Ajouter une slide", "ufo-splide-blocks")}
            onClick={addSlide}
          />
        </div>
        <div {...innerBlocksProps} />
      </div>
    </>
  );
}
