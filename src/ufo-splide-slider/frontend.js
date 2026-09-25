import Splide from "@splidejs/splide";
import "@splidejs/splide/css";

document.addEventListener("DOMContentLoaded", function () {
  const viewportWidth = document.documentElement.clientWidth;
  const destroyBlockStyle = viewportWidth < 980;
  const splideSliders = document.querySelectorAll(
    ".wp-block-create-block-ufo-splide-slider .splide",
  );

  if (splideSliders.length > 0) {
    [...splideSliders].forEach((sliderElement) => {
      try {
        let options = {};

        if (sliderElement.dataset.splide) {
          try {
            options = JSON.parse(sliderElement.dataset.splide);
          } catch (e) {
            console.error("Error parsing Splide options:", e);
          }
        }

        const isFade = options.type === "fade";

        const finalOptions = {
          type: "loop",
          speed: 600,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          interval: 3000,
          arrowPath:
            "m31.9 13.4-1.41 1.41 4.21 4.21h-33.1v2h33.1l-4.21 4.21 1.41 1.41 5.21-5.21 1.42-1.41-1.42-1.41z",
          ...options,
          a11y: {
            container: "region",
            items: "group",
            slideRole: "group",
            live: true,
            next: "Next slide",
            prev: "Previous slide",
            select: "Select slide",
          },
          breakpoints: isFade
            ? {}
            : {
                640: {
                  perPage: 1,
                },
                768: {
                  perPage: Math.min(2, options.perPage || 1),
                },
                1024: {
                  perPage: options.perPage || 1,
                },
              },
        };

        let splide = new Splide(sliderElement, finalOptions);

        // Fix focus management
        splide.on("mounted moved", () => {
          const slides = splide.Components.Elements.slides;
          slides.forEach((slide) => {
            // Remove aria-hidden from slides
            slide.removeAttribute("aria-hidden");

            // Manage focus for slide content
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

        // Handle autoplay announcements for screen readers
        if (finalOptions.autoplay) {
          const liveRegion = document.createElement("div");
          liveRegion.setAttribute("aria-live", "polite");
          liveRegion.setAttribute(
            "class",
            "splide__live-region visually-hidden",
          );
          sliderElement.appendChild(liveRegion);
        }

        splide.mount();

        if (
          destroyBlockStyle &&
          sliderElement.closest(".is-style-mini-gallery")
        ) {
          splide.destroy();
        }
      } catch (error) {
        console.error("Error initializing Splide:", error);
      }
    });
  }
});
