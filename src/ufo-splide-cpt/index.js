import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import "@splidejs/splide/css";
import Edit from "./edit";
import metadata from "./block.json";
import { newspaperBlockIcon } from "./icon";

registerBlockType(metadata.name, {
  icon: newspaperBlockIcon,
  edit: Edit,
});
