import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

/**
 * 0.1.6 et antérieures : pas de fadeEffect, autoplay activé par défaut et
 * pas d'option `rewind` dans data-splide. Sans cette entrée, les sliders
 * enregistrés avec ces versions sont signalés comme « contenu inattendu ».
 */
const v016 = {
  attributes: {
    autoplay: {
      type: "boolean",
      default: true,
    },
    navigation: {
      type: "boolean",
      default: true,
    },
    pagination: {
      type: "boolean",
      default: true,
    },
    slidesPerView: {
      type: "number",
      default: 1,
    },
  },
  supports: {
    html: false,
    align: ["wide", "full"],
  },
  // Conserve explicitement autoplay : le défaut est passé à false en 0.1.7.
  migrate: (attributes) => ({ ...attributes, fadeEffect: false }),
  save({ attributes }) {
    const { autoplay, navigation, pagination, slidesPerView } = attributes;
    const blockProps = useBlockProps.save();
    const innerBlocksProps = useInnerBlocksProps.save({
      className: "splide__list",
    });

    const splideOptions = {
      type: "loop",
      perPage: slidesPerView,
      perMove: 1,
      autoplay: autoplay,
      arrows: navigation,
      pagination: pagination,
      drag: true,
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
  },
};

export default [v016];
