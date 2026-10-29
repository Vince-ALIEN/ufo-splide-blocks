import { __, sprintf } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import {
  useBlockProps,
  useInnerBlocksProps,
  store as blockEditorStore,
} from "@wordpress/block-editor";
import { useDispatch, useSelect } from "@wordpress/data";
import { galleryBlockIcon } from "../icons";

registerBlockType("create-block/ufo-slide", {
  apiVersion: 3,
  title: __("Slide", "ufo-splide-blocks"),
  category: "design",
  icon: galleryBlockIcon,
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
  edit: ({ attributes, clientId }) => {
    const { selectBlock } = useDispatch(blockEditorStore);
    const index = useSelect(
      (select) => select(blockEditorStore).getBlockIndex(clientId),
      [clientId],
    );

    const blockProps = useBlockProps({
      className: "splide__slide ufo-slide-editor",
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

    // Grille d'une colonne avec sa cellule : une grille vide affiche le
    // sélecteur de disposition de Ufo Grid à la place de la slide.
    const TEMPLATE = [
      ["ufo-blocks/ufo-grid", { columnsCount: 1 }, [["ufo-blocks/ufo-row"]]],
    ];

    const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      templateLock: false,
    });

    // Éditeur seulement : étiquette qui sélectionne la slide, souvent
    // impossible à atteindre au clic quand la grille la remplit.
    return (
      <div {...innerBlocksProps}>
        <button
          type="button"
          className="ufo-slide__badge"
          onClick={() => selectBlock(clientId)}
          aria-label={__("Sélectionner la slide", "ufo-splide-blocks")}
        >
          {sprintf(
            // translators: %d: slide number
            __("Slide %d", "ufo-splide-blocks"),
            index + 1,
          )}
        </button>
        {children}
      </div>
    );
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
