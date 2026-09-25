import { __, sprintf } from "@wordpress/i18n";
import {
  useBlockProps,
  useInnerBlocksProps,
  InnerBlocks,
  InspectorControls,
  store as blockEditorStore,
} from "@wordpress/block-editor";
import {
  PanelBody,
  ToggleControl,
  RangeControl,
  Button,
} from "@wordpress/components";
import { useEffect, useRef, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { chevronLeft, chevronRight } from "@wordpress/icons";
import Splide from "@splidejs/splide";
import "./editor.scss";

export default function Edit({ attributes, setAttributes, clientId }) {
  const { autoplay, navigation, pagination, slidesPerView, fadeEffect } =
    attributes;
  const splideRef = useRef(null);
  const splideInstance = useRef(null);
  const blockProps = useBlockProps();
  const [activeSlide, setActiveSlide] = useState(0);

  const slideCount = useSelect(
    (select) =>
      select(blockEditorStore).getBlockOrder(clientId).length || 1,
    [clientId],
  );

  useEffect(() => {
    if (activeSlide > slideCount - 1) {
      setActiveSlide(Math.max(0, slideCount - 1));
    }
  }, [slideCount, activeSlide]);

  const ALLOWED_BLOCKS = ["create-block/ufo-slide"];
  const TEMPLATE = [
    ["create-block/ufo-slide", {}, [["ufo-blocks/ufo-grid"]]],
    ["create-block/ufo-slide", {}, [["ufo-blocks/ufo-grid"]]],
    ["create-block/ufo-slide", {}, [["ufo-blocks/ufo-grid"]]],
  ];

  const innerBlocksProps = useInnerBlocksProps(
    {
      className: "splide__list edit-mode",
      ...(fadeEffect ? { "data-active-slide": activeSlide + 1 } : {}),
    },
    {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      orientation: "horizontal",
      renderAppender: InnerBlocks.ButtonBlockAppender,
    },
  );

  useEffect(() => {
    // The fade effect positions inactive slides with opacity/absolute
    // positioning, which fights with InnerBlocks editing (selecting a block
    // inside a non-active slide makes it disappear). Skip the live carousel
    // for fade and rely on the static "all slides visible" editor CSS
    // instead; it stays available for the regular loop mode, where it
    // doesn't hide any slide content.
    if (fadeEffect) {
      return;
    }

    const initSplide = () => {
      if (splideRef.current) {
        if (splideInstance.current) {
          splideInstance.current.destroy();
        }

        const options = {
          type: "loop",
          perPage: slidesPerView,
          perMove: 1,
          autoplay: autoplay,
          arrows: navigation,
          pagination: pagination,
          speed: 600,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          interval: 3000,
          drag: false,
          noDrag: true,
          a11y: {
            // Enhanced accessibility options
            container: "region",
            items: "group",
            slideRole: "group",
            live: true,
            next: "Next slide",
            prev: "Previous slide",
            select: "Select slide",
          },
          breakpoints: {
            640: {
              perPage: 1,
            },
            768: {
              perPage: Math.min(2, slidesPerView),
            },
            1024: {
              perPage: slidesPerView,
            },
          },
          direction: "ltr",
        };

        try {
          splideInstance.current = new Splide(splideRef.current, options);

          // Fix focus management
          splideInstance.current.on("mounted moved", () => {
            const slides = splideInstance.current.Components.Elements.slides;
            slides.forEach((slide) => {
              // Remove aria-hidden from slides
              slide.removeAttribute("aria-hidden");

              // Add proper focus management
              const focusableElements = slide.querySelectorAll(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
              );

              focusableElements.forEach((element) => {
                if (!slide.classList.contains("is-active")) {
                  element.setAttribute("tabindex", "-1");
                } else {
                  element.removeAttribute("tabindex");
                }
              });
            });
          });

          splideInstance.current.mount();
        } catch (e) {
          console.error("Splide initialization error:", e);
        }
      }
    };

    const timer = setTimeout(initSplide, 100);

    return () => {
      clearTimeout(timer);
      if (splideInstance.current) {
        splideInstance.current.destroy();
        splideInstance.current = null;
      }
    };
  }, [autoplay, navigation, pagination, slidesPerView, fadeEffect]);

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Slider Settings", "ufo-splide-blocks")}>
          <ToggleControl
            label={__("Autoplay", "ufo-splide-blocks")}
            checked={autoplay}
            onChange={(value) => setAttributes({ autoplay: value })}
          />
          <ToggleControl
            label={__("Show Navigation", "ufo-splide-blocks")}
            checked={navigation}
            onChange={(value) => setAttributes({ navigation: value })}
          />
          <ToggleControl
            label={__("Show Pagination", "ufo-splide-blocks")}
            checked={pagination}
            onChange={(value) => setAttributes({ pagination: value })}
          />
          <ToggleControl
            label={__("Fade Effect", "ufo-splide-blocks")}
            help={__(
              "Crossfades between slides instead of sliding. Only shows one slide at a time.",
              "ufo-splide-blocks",
            )}
            checked={fadeEffect}
            onChange={(value) => setAttributes({ fadeEffect: value })}
          />
          <RangeControl
            label={__("Slides Per View", "ufo-splide-blocks")}
            value={slidesPerView}
            onChange={(value) => setAttributes({ slidesPerView: value })}
            min={1}
            max={6}
            disabled={fadeEffect}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {fadeEffect && (
          <div className="splide__edit-nav">
            <Button
              icon={chevronLeft}
              label={__("Previous slide", "ufo-splide-blocks")}
              onClick={() => setActiveSlide((i) => Math.max(0, i - 1))}
              disabled={activeSlide === 0}
            />
            <span className="splide__edit-nav-label">
              {sprintf(
                // translators: 1: current slide number, 2: total number of slides
                __("Slide %1$d of %2$d", "ufo-splide-blocks"),
                activeSlide + 1,
                slideCount,
              )}
            </span>
            <Button
              icon={chevronRight}
              label={__("Next slide", "ufo-splide-blocks")}
              onClick={() =>
                setActiveSlide((i) => Math.min(slideCount - 1, i + 1))
              }
              disabled={activeSlide >= slideCount - 1}
            />
          </div>
        )}
        <div
          className={
            fadeEffect
              ? "splide splide--edit-mode splide--static-preview"
              : "splide splide--edit-mode"
          }
          ref={splideRef}
          role="region"
          aria-label={__("Slider", "ufo-splide-blocks")}
          data-splide={JSON.stringify({
            type: fadeEffect ? "fade" : "loop",
            rewind: fadeEffect,
            perPage: fadeEffect ? 1 : slidesPerView,
            autoplay: autoplay,
            arrows: navigation,
            pagination: pagination,
            drag: false,
          })}
        >
          <div className="splide__track">
            <div {...innerBlocksProps} role="presentation" />
          </div>
        </div>
      </div>
    </>
  );
}
