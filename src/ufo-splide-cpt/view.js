import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import { getSplideConfig } from "./splide-config";

const initSlider = (element) => {
  if (element.classList.contains("is-initialized")) {
    return;
  }

  let attributes = {};
  try {
    attributes = JSON.parse(element.dataset.splide || "{}");
  } catch (e) {
    console.error("Error parsing Splide options:", e);
  }
  // Splide re-reads data-splide on mount and injects some options as HTML:
  // remove it so only the options built by getSplideConfig are used.
  element.removeAttribute("data-splide");
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

  if (attributes.autoplay) {
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("class", "splide__live-region visually-hidden");
    element.appendChild(liveRegion);
  }

  // Splide adds the `is-initialized` class itself, and already refreshes its
  // pagination on mount and on update.
  splide.mount();
};

document.addEventListener("DOMContentLoaded", () => {
  const splideElements = document.querySelectorAll(
    ".wp-block-create-block-ufo-splide-cpt",
  );

  if (!("IntersectionObserver" in window)) {
    splideElements.forEach(initSlider);
    return;
  }

  // Mounting Splide measures the layout (slide widths, loop clones), which
  // forces a synchronous reflow. Defer it until the slider approaches the
  // viewport, at the start of a frame, to keep it out of the page load.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.unobserve(entry.target);
        requestAnimationFrame(() => initSlider(entry.target));
      });
    },
    { rootMargin: "300px 0px" },
  );

  splideElements.forEach((element) => observer.observe(element));
});
