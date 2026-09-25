import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import { getSplideConfig } from "./splide-config";

document.addEventListener("DOMContentLoaded", () => {
  const splideElements = document.querySelectorAll(
    ".wp-block-create-block-ufo-splide-cpt",
  );

  splideElements.forEach((element) => {
    if (!element.classList.contains("is-initialized")) {
      const attributes = JSON.parse(element.dataset.splide || "{}");
      const splide = new Splide(element, getSplideConfig(attributes));

      splide.on("mounted moved", () => {
        const slides = splide.Components.Elements.slides;

        // Batch reads first, then writes to avoid forced reflows
        const slideData = slides.map((slide) => ({
          slide,
          isActive: slide.classList.contains("is-active"),
          focusableElements: slide.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
          ),
        }));

        slideData.forEach(({ slide, isActive, focusableElements }) => {
          slide.removeAttribute("aria-hidden");

          focusableElements.forEach((element) => {
            if (!isActive) {
              element.setAttribute("tabindex", "-1");
            } else {
              element.removeAttribute("tabindex");
            }
          });
        });
      });

      splide.on("mounted updated", () => {
        splide.Components.Pagination.update();
      });

      if (attributes.autoplay) {
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("class", "splide__live-region visually-hidden");
        element.appendChild(liveRegion);
      }

      splide.mount();
      element.classList.add("is-initialized");
    }
  });
});
