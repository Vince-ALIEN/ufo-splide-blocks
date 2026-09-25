import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { carouselBlockIcon } from "./icon";

registerBlockType("create-block/ufo-slide", {
  apiVersion: 3,
  title: __("Slide", "ufo-splide-blocks"),
  category: "design",
  icon: carouselBlockIcon,
  description: __("Adds a slider element", "ufo-splide-blocks"),
  supports: {
    html: false,
    align: ["wide", "full"],
  },
  parent: ["create-block/ufo-splide-slider"],
  attributes: {
    backgroundColor: {
      type: "string",
      default: "transparent",
    },
    padding: {
      type: "object",
      default: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  },
  edit: ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps({
      className: "splide__slide",
      style: {
        backgroundColor: attributes.backgroundColor,
        padding: `${attributes.padding.top} ${attributes.padding.right} ${attributes.padding.bottom} ${attributes.padding.left}`,
      },
    });

    const ALLOWED_BLOCKS = [
      "core/image",
      "core/cover",
      "core/heading",
      "core/paragraph",
      "core/columns",
      "core/group",
      "core/buttons",
      "ufo-blocks/ufo-grid",
    ];

    const TEMPLATE = [["ufo-blocks/ufo-grid"]];

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      templateLock: false,
    });

    return <div {...innerBlocksProps} />;
  },
  save: ({ attributes }) => {
    const blockProps = useBlockProps.save({
      className: "splide__slide",
      style: {
        backgroundColor: attributes.backgroundColor,
        padding: `${attributes.padding.top} ${attributes.padding.right} ${attributes.padding.bottom} ${attributes.padding.left}`,
      },
    });

    const innerBlocksProps = useInnerBlocksProps.save(blockProps);
    return <div {...innerBlocksProps} />;
  },
});
