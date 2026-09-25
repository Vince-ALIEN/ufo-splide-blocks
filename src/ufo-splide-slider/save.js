import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

// Composant Edit
export function edit({ attributes }) {
  const { autoplay, navigation, pagination, slidesPerView } = attributes;
  const blockProps = useBlockProps({
    className: "wp-block-slider-container",
  });
  const innerBlocksProps = useInnerBlocksProps({
    className: "splide__list",
  });

  return (
    <div {...blockProps}>
      <div className="splide splide--edit-mode">
        <div className="splide__track">
          <div {...innerBlocksProps} />
        </div>
      </div>
    </div>
  );
}

// Composant Save
export default function save({ attributes }) {
  const { autoplay, navigation, pagination, slidesPerView, fadeEffect } =
    attributes;
  const blockProps = useBlockProps.save();
  const innerBlocksProps = useInnerBlocksProps.save({
    className: "splide__list",
  });

  const splideOptions = {
    type: fadeEffect ? "fade" : "loop",
    rewind: fadeEffect,
    perPage: fadeEffect ? 1 : slidesPerView,
    perMove: 1,
    autoplay: autoplay,
    arrows: navigation,
    pagination: pagination,
    drag: true, // Active le drag uniquement en front
  };

  return (
    <div {...blockProps}>
      <div className="splide" data-splide={JSON.stringify(splideOptions)}>
        <div className="splide__track">
          <div {...innerBlocksProps} />
        </div>
      </div>
    </div>
  );
}
