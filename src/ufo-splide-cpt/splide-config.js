export const getSplideConfig = (attributes) => {
  const { slidesPerView, navigation, pagination, autoplay, postsToShow } =
    attributes;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  return {
    type: "loop",
    perMove: 1,
    perPage: slidesPerView,
    arrows: navigation,
    pagination: pagination,
    autoplay: prefersReducedMotion ? false : autoplay,
    gap: "1rem",
    speed: prefersReducedMotion ? 0 : 600,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    interval: 3000,
    arrowPath:
      "m31.9 13.4-1.41 1.41 4.21 4.21h-33.1v2h33.1l-4.21 4.21 1.41 1.41 5.21-5.21 1.42-1.41-1.42-1.41z",
    breakpoints: {
      640: { perPage: 1 },
      768: { perPage: Math.min(2, slidesPerView) },
      1024: { perPage: slidesPerView },
    },
    pagination: {
      el: ".splide__pagination",
      type: "bullets",
      clickable: true,
      items: Math.ceil(postsToShow / slidesPerView),
    },
    focus: "center",
    a11y: {
      container: "region",
      items: "group",
      slideRole: "group",
      live: true,
      next: "Slide suivant",
      prev: "Slide précédent",
      select: "Sélectionner le slide",
    },
  };
};
