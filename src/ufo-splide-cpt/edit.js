import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { useBlockProps, InspectorControls, PanelColorSettings } from "@wordpress/block-editor";
import {
  PanelBody,
  ToggleControl,
  RangeControl,
  SelectControl,
  TextControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useEffect, useRef } from "@wordpress/element";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import { getSplideConfig } from "./splide-config";
import "./style.scss";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
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
          ? select(coreStore).getEntityRecords(
              "taxonomy",
              selectedTaxonomy,
              { per_page: -1 },
            )
          : [],
      };
    },
    [postType, postsToShow, selectedTaxonomy],
  );

  useEffect(() => {
    if (posts && posts.length > 0 && splideRef.current) {
      const splide = new Splide(splideRef.current, getSplideConfig(attributes));
      splide.mount();
      return () => {
        splide.destroy();
      };
    }
  }, [posts, attributes]);

  const blockProps = useBlockProps();

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
        <PanelBody title={__("Contenu", "ufo-splide-cpt")}>
          <SelectControl
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
          <RangeControl
            label={__("Nombre d'éléments", "ufo-splide-cpt")}
            value={postsToShow}
            onChange={(value) => setAttributes({ postsToShow: value })}
            min={1}
            max={20}
          />
          {taxonomyOptions.length > 1 && (
            <SelectControl
              label={__("Filtrer par taxonomie", "ufo-splide-cpt")}
              value={selectedTaxonomy}
              options={taxonomyOptions}
              onChange={(value) =>
                setAttributes({ selectedTaxonomy: value, selectedTerms: [] })
              }
            />
          )}
          {selectedTaxonomy && termOptions.length > 0 && (
            <SelectControl
              multiple
              label={__("Filtrer par termes", "ufo-splide-cpt")}
              value={selectedTerms.map(String)}
              options={termOptions}
              onChange={(value) => setAttributes({ selectedTerms: value })}
            />
          )}
        </PanelBody>
        <PanelBody title={__("Carte", "ufo-splide-cpt")}>
          <ToggleControl
            label={__("Afficher la date", "ufo-splide-cpt")}
            checked={showDate}
            onChange={(value) => setAttributes({ showDate: value })}
          />
          <ToggleControl
            label={__("Afficher la catégorie", "ufo-splide-cpt")}
            checked={showCategory}
            onChange={(value) => setAttributes({ showCategory: value })}
          />
          <TextControl
            label={__("Texte du bouton CTA", "ufo-splide-cpt")}
            value={ctaText}
            onChange={(value) => setAttributes({ ctaText: value })}
          />
        </PanelBody>
        <PanelColorSettings
          title={__("Couleurs du CTA", "ufo-splide-cpt")}
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
        <PanelBody title={__("Slider", "ufo-splide-cpt")}>
          <ToggleControl
            label={__("Autoplay", "ufo-splide-cpt")}
            checked={autoplay}
            onChange={(value) => setAttributes({ autoplay: value })}
          />
          <ToggleControl
            label={__("Navigation", "ufo-splide-cpt")}
            checked={navigation}
            onChange={(value) => setAttributes({ navigation: value })}
          />
          <ToggleControl
            label={__("Pagination", "ufo-splide-cpt")}
            checked={pagination}
            onChange={(value) => setAttributes({ pagination: value })}
          />
          <RangeControl
            label={__("Slides par vue", "ufo-splide-cpt")}
            value={slidesPerView}
            onChange={(value) => setAttributes({ slidesPerView: value })}
            min={1}
            max={5}
          />
        </PanelBody>
      </InspectorControls>

      <div className="splide" ref={splideRef}>
        <div className="splide__track">
          <div className="splide__list">
            {posts &&
              posts.map((post) => {
                const thumbnail =
                  post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
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
                            {showDate && showCategory &&
                              post._embedded?.["wp:term"]?.[0]?.[0]?.name && (
                              <span style={{ color: "rgba(255,255,255,0.3)" }}>
                                •
                              </span>
                            )}
                            {showCategory &&
                              post._embedded?.["wp:term"]?.[0]?.[0]?.name && (
                                <span>{post._embedded["wp:term"][0][0].name}</span>
                              )}
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
                            (post.excerpt?.rendered || "").replace(/<[^>]+>/g, "")
                          )}
                        </p>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.5rem 1.25rem",
                            backgroundColor: ctaBackgroundColor || "var(--wp--preset--color--primary, #6366f1)",
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
