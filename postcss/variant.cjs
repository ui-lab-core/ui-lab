const identifier = /^[a-z][a-z0-9-]*$/i;

function parseVariant(atRule) {
  const parts = atRule.params.trim().split(/\s+/).filter(Boolean);
  if (
    (parts.length !== 2 && parts.length !== 3) ||
    parts.some((part) => !identifier.test(part)) ||
    (parts.length === 3 && parts[2] !== "default")
  ) {
    throw atRule.error(
      "@variant requires a component and variant CSS identifier, optionally followed by default",
    );
  }
  if (!atRule.nodes) throw atRule.error("@variant requires a declaration block");
  return { component: parts[0], variant: parts[1], isDefault: parts[2] === "default" };
}

function variantSelector(component, variant, isDefault = false) {
  const explicit = `.${component}[data-variant="${variant}"]`;
  return isDefault ? `${explicit},\n.${component}:not([data-variant])` : explicit;
}

function variantPlugin() {
  return {
    postcssPlugin: "ui-lab-variant",
    Once(root) {
      const defaults = new Map();

      root.walkAtRules("variant", (atRule) => {
        const { component, variant, isDefault } = parseVariant(atRule);
        if (!isDefault) return;

        const existing = defaults.get(component);
        if (existing && existing !== variant) {
          throw atRule.error(`@variant defines more than one default for ${component}`);
        }
        defaults.set(component, variant);
      });

      root.walkAtRules("variant", (atRule) => {
        const { component, variant } = parseVariant(atRule);
        const rule = atRule.clone({
          type: "rule",
          name: undefined,
          params: undefined,
          selector: variantSelector(component, variant, defaults.get(component) === variant),
        });
        atRule.replaceWith(rule);
      });
    },
  };
}

module.exports = variantPlugin;
module.exports.parseVariant = parseVariant;
module.exports.variantSelector = variantSelector;
