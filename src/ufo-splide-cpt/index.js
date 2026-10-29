import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import "@splidejs/splide/css";
import Edit from "./edit";
import metadata from "./block.json";
import { galleryBlockIcon } from "../icons";

registerBlockType(metadata.name, {
  icon: galleryBlockIcon,
  edit: Edit,
});
