/**
 * Contrôles d'inspecteur partagés, repris de ufo-tools-blocks
 * (src/shared/controls.js) pour garder le même inspecteur : ToolsPanel avec
 * réinitialisation, comme les blocs core.
 */
import {
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import { useViewportMatch } from "@wordpress/compose";

/**
 * Même placement du menu « ⋮ » des ToolsPanel que dans les blocs core.
 */
export function useToolsPanelDropdownMenuProps() {
  const isMobile = useViewportMatch("medium", "<");
  return !isMobile
    ? { popoverProps: { placement: "left-start", offset: 259 } }
    : {};
}

/**
 * Valeurs par défaut des attributs déclarés dans un block.json.
 */
export function getAttributeDefaults(metadata) {
  return Object.fromEntries(
    Object.entries(metadata.attributes).map(([name, { default: value }]) => [
      name,
      value,
    ]),
  );
}

/**
 * ToolsPanel dont « Tout réinitialiser » remet les attributs listés à leur
 * valeur par défaut. Chaque enfant est un PanelItem.
 */
export function UfoToolsPanel({ label, defaults, keys, setAttributes, children }) {
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  return (
    <ToolsPanel
      label={label}
      resetAll={() => setAttributes(pick(defaults, keys))}
      dropdownMenuProps={dropdownMenuProps}
    >
      {children}
    </ToolsPanel>
  );
}

/**
 * ToolsPanelItem lié à un ou plusieurs attributs : il a une valeur dès que
 * l'un d'eux s'écarte de sa valeur par défaut.
 */
export function PanelItem({
  label,
  keys,
  attributes,
  defaults,
  setAttributes,
  isShownByDefault = true,
  children,
}) {
  return (
    <ToolsPanelItem
      label={label}
      isShownByDefault={isShownByDefault}
      hasValue={() =>
        keys.some(
          (key) =>
            JSON.stringify(attributes[key]) !== JSON.stringify(defaults[key]),
        )
      }
      onDeselect={() => setAttributes(pick(defaults, keys))}
    >
      {children}
    </ToolsPanelItem>
  );
}

function pick(object, keys) {
  return Object.fromEntries(keys.map((key) => [key, object[key]]));
}
