import { __, _n, sprintf } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import {
  useBlockProps,
  InspectorControls,
  PanelColorSettings,
  store as blockEditorStore,
} from "@wordpress/block-editor";
import {
  ToggleControl,
  RangeControl,
  SelectControl,
  TextControl,
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useEffect, useRef } from "@wordpress/element";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import { getSplideConfig } from "./splide-config";
import metadata from "./block.json";
import {
  UfoToolsPanel,
  PanelItem,
  getAttributeDefaults,
} from "../shared/controls";
import "./style.scss";
import "../shared/editor.scss";
import "./editor.scss";

const DEFAULTS = getAttributeDefaults(metadata);
const CONTENT_KEYS = [
  "postType",
  "postsToShow",
  "selectedTaxonomy",
  "selectedTerms",
];
const CARD_KEYS = ["showDate", "showCategory", "ctaText"];
const SLIDER_KEYS = ["autoplay", "navigation", "pagination", "slidesPerView"];

export default function Edit({ attributes, setAttributes, clientId }) {
  const {
    autoplay,
    navigation,
    pagination,
    slidesPerView,
    postsToShow,
    postType,
    selectedTaxonomy,
    selectedTerms,
    showDate,
    showCategory,
    ctaText,
    ctaBackgroundColor,
    ctaTextColor,
  } = attributes;

  const splideRef = useRef(null);

  const { posts, postTypes, taxonomies, terms } = useSelect(
    (select) => {
      const allTypes = select(coreStore).getPostTypes({ per_page: -1 });
      const allTaxonomies = select(coreStore).getTaxonomies({ per_page: -1 });

      return {
        posts: select(coreStore).getEntityRecords("postType", postType, {
          per_page: postsToShow,
          _embed: true,
          context: "edit",
        }),
        postTypes: allTypes
          ? allTypes.filter((t) => t.viewable && t.slug !== "attachment")
          : [],
        taxonomies: allTaxonomies
          ? allTaxonomies.filter(
              (tax) => tax.types && tax.types.includes(postType),
            )
          : [],
        terms: selectedTaxonomy
          ? select(coreStore).getEntityRecords("taxonomy", selectedTaxonomy, {
              per_page: -1,
            })
          : [],
      };
    },
    [postType, postsToShow, selectedTaxonomy],
  );

  useEffect(() => {
    if (posts && posts.length > 0 && splideRef.current) {
      // Pas de glisser dans l'éditeur : Splide capterait le clic qui
      // sélectionne le bloc.
      const splide = new Splide(splideRef.current, {
        ...getSplideConfig(attributes),
        drag: false,
        autoplay: false,
      });
      splide.mount();
      return () => {
        splide.destroy();
      };
    }
  }, [posts, attributes]);

  const { selectBlock } = useDispatch(blockEditorStore);
  const blockProps = useBlockProps({ className: "ufo-splide-editor" });
  const postTypeLabel =
    (postTypes || []).find((t) => t.slug === postType)?.name || postType;
  const badge = [
    __("Posts", "ufo-splide-cpt"),
    postTypeLabel,
    sprintf(
      // translators: %d: number of items
      _n("%d élément", "%d éléments", postsToShow, "ufo-splide-cpt"),
      postsToShow,
    ),
  ].join(" · ");
  const itemProps = { attributes, defaults: DEFAULTS, setAttributes };

  const taxonomyOptions = [
    { value: "", label: __("— Aucun filtre —", "ufo-splide-cpt") },
    ...(taxonomies || []).map((tax) => ({
      value: tax.slug,
      label: tax.name,
    })),
  ];

  const termOptions = (terms || []).map((term) => ({
    value: String(term.id),
    label: term.name,
  }));

  return (
    <div {...blockProps}>
      <InspectorControls>
        <UfoToolsPanel
          label={__("Contenu", "ufo-splide-cpt")}
          defaults={DEFAULTS}
          keys={CONTENT_KEYS}
          setAttributes={setAttributes}
        >
          <PanelItem
            {...itemProps}
            label={__("Type de contenu", "ufo-splide-cpt")}
            keys={["postType", "selectedTaxonomy", "selectedTerms"]}
          >
            <SelectControl
              __nextHasNoMarginBottom
              __next40pxDefaultSize
              label={__("Type de contenu", "ufo-splide-cpt")}
              value={postType}
              options={(postTypes || []).map((t) => ({
                value: t.slug,
                label: t.name,
              }))}
              onChange={(value) =>
                setAttributes({
                  postType: value,
                  selectedTaxonomy: "",
                  selectedTerms: [],
                })
              }
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Nombre d'éléments", "ufo-splide-cpt")}
            keys={["postsToShow"]}
          >
            <RangeControl
              __nextHasNoMarginBottom
              __next40pxDefaultSize
              label={__("Nombre d'éléments", "ufo-splide-cpt")}
              value={postsToShow}
              onChange={(value) =>
                setAttributes({ postsToShow: value ?? DEFAULTS.postsToShow })
              }
              min={1}
              max={20}
            />
          </PanelItem>
          {taxonomyOptions.length > 1 && (
            <PanelItem
              {...itemProps}
              label={__("Filtrer par taxonomie", "ufo-splide-cpt")}
              keys={["selectedTaxonomy", "selectedTerms"]}
            >
              <SelectControl
                __nextHasNoMarginBottom
                __next40pxDefaultSize
                label={__("Filtrer par taxonomie", "ufo-splide-cpt")}
                value={selectedTaxonomy}
                options={taxonomyOptions}
                onChange={(value) =>
                  setAttributes({ selectedTaxonomy: value, selectedTerms: [] })
                }
              />
              {selectedTaxonomy && termOptions.length > 0 && (
                <SelectControl
                  __nextHasNoMarginBottom
                  multiple
                  label={__("Filtrer par termes", "ufo-splide-cpt")}
                  value={selectedTerms.map(String)}
                  options={termOptions}
                  onChange={(value) => setAttributes({ selectedTerms: value })}
                />
              )}
            </PanelItem>
          )}
        </UfoToolsPanel>
        <UfoToolsPanel
          label={__("Carte", "ufo-splide-cpt")}
          defaults={DEFAULTS}
          keys={CARD_KEYS}
          setAttributes={setAttributes}
        >
          <PanelItem
            {...itemProps}
            label={__("Date", "ufo-splide-cpt")}
            keys={["showDate"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Afficher la date", "ufo-splide-cpt")}
              checked={showDate}
              onChange={(value) => setAttributes({ showDate: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Catégorie", "ufo-splide-cpt")}
            keys={["showCategory"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Afficher la catégorie", "ufo-splide-cpt")}
              checked={showCategory}
              onChange={(value) => setAttributes({ showCategory: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Texte du bouton", "ufo-splide-cpt")}
            keys={["ctaText"]}
          >
            <TextControl
              __nextHasNoMarginBottom
              __next40pxDefaultSize
              label={__("Texte du bouton", "ufo-splide-cpt")}
              value={ctaText}
              onChange={(value) => setAttributes({ ctaText: value })}
            />
          </PanelItem>
        </UfoToolsPanel>
        <UfoToolsPanel
          label={__("Slider", "ufo-splide-cpt")}
          defaults={DEFAULTS}
          keys={SLIDER_KEYS}
          setAttributes={setAttributes}
        >
          <PanelItem
            {...itemProps}
            label={__("Défilement automatique", "ufo-splide-cpt")}
            keys={["autoplay"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Défilement automatique", "ufo-splide-cpt")}
              help={__("Désactivé dans l'éditeur.", "ufo-splide-cpt")}
              checked={autoplay}
              onChange={(value) => setAttributes({ autoplay: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Flèches", "ufo-splide-cpt")}
            keys={["navigation"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Flèches précédent / suivant", "ufo-splide-cpt")}
              checked={navigation}
              onChange={(value) => setAttributes({ navigation: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Pagination", "ufo-splide-cpt")}
            keys={["pagination"]}
          >
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Pagination", "ufo-splide-cpt")}
              checked={pagination}
              onChange={(value) => setAttributes({ pagination: value })}
            />
          </PanelItem>
          <PanelItem
            {...itemProps}
            label={__("Slides par vue", "ufo-splide-cpt")}
            keys={["slidesPerView"]}
          >
            <RangeControl
              __nextHasNoMarginBottom
              __next40pxDefaultSize
              label={__("Slides par vue", "ufo-splide-cpt")}
              value={slidesPerView}
              onChange={(value) =>
                setAttributes({
                  slidesPerView: value ?? DEFAULTS.slidesPerView,
                })
              }
              min={1}
              max={5}
            />
          </PanelItem>
        </UfoToolsPanel>
        <PanelColorSettings
          title={__("Couleurs du bouton", "ufo-splide-cpt")}
          colorSettings={[
            {
              value: ctaBackgroundColor,
              onChange: (value) => setAttributes({ ctaBackgroundColor: value }),
              label: __("Fond", "ufo-splide-cpt"),
            },
            {
              value: ctaTextColor,
              onChange: (value) => setAttributes({ ctaTextColor: value }),
              label: __("Texte", "ufo-splide-cpt"),
            },
          ]}
        />
      </InspectorControls>

      <button
        type="button"
        className="ufo-splide__badge"
        onClick={() => selectBlock(clientId)}
        aria-label={__("Sélectionner le carrousel", "ufo-splide-cpt")}
      >
        {badge}
      </button>
      {/* Splide garde le focus pour lui : le clic sur l'aperçu sélectionne
          le bloc explicitement. */}
      <div
        className="splide"
        ref={splideRef}
        onClick={() => selectBlock(clientId)}
      >
        <div className="splide__track">
          <div className="splide__list">
            {posts &&
              posts.map((post) => {
                const thumbnail =
                  post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
                const taxonomyDisplay = selectedTaxonomy || "category";
                const termNames = (post._embedded?.["wp:term"] || [])
                  .flat()
                  .filter((term) => term?.taxonomy === taxonomyDisplay)
                  .map((term) => decodeEntities(term.name));
                return (
                  <div className="splide__slide" key={post.id}>
                    <article
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        overflow: "hidden",
                        borderRadius: "1rem",
                        backgroundColor: "#111827",
                        minHeight: "480px",
                        padding: "2rem",
                      }}
                    >
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={post.title.rendered}
                          className="not-prose"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            zIndex: 0,
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, #111827, #11182766)",
                          zIndex: 1,
                        }}
                      />
                      <div style={{ position: "relative", zIndex: 2 }}>
                        {(showDate || showCategory) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              color: "#d1d5db",
                              fontSize: "0.875rem",
                              marginBottom: "0.75rem",
                            }}
                          >
                            {showDate && (
                              <span>
                                {new Date(post.date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            )}
                            {showDate &&
                              showCategory &&
                              termNames.length > 0 && (
                                <span
                                  style={{ color: "rgba(255,255,255,0.3)" }}
                                >
                                  •
                                </span>
                              )}
                            {showCategory &&
                              termNames.map((name) => (
                                <span key={name}>{name}</span>
                              ))}
                          </div>
                        )}
                        <h3
                          style={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "1rem",
                            lineHeight: "1.5rem",
                            height: "3rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            margin: "0 0 0.5rem",
                          }}
                        >
                          {decodeEntities(post.title.rendered)}
                        </h3>
                        <p
                          style={{
                            color: "#cbd5e1",
                            fontSize: "0.875rem",
                            lineHeight: "1.5rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            margin: "0 0 1rem",
                          }}
                        >
                          {decodeEntities(
                            (post.excerpt?.rendered || "").replace(
                              /<[^>]+>/g,
                              "",
                            ),
                          )}
                        </p>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.5rem 1.25rem",
                            backgroundColor:
                              ctaBackgroundColor ||
                              "var(--wp--preset--color--primary, #6366f1)",
                            color: ctaTextColor || "#fff",
                            borderRadius: "9999px",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                          }}
                        >
                          {ctaText}
                        </span>
                      </div>
                    </article>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
