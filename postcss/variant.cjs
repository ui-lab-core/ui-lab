const identifier = /^[a-z][a-z0-9-]*$/i;

function parseVariant(atRule) {
  const parts = atRule.params.trim().split(/\s+/).filter(Boolean);
  if (parts.length !== 2 || parts.some((part) => !identifier.test(part))) {
    throw atRule.error("@variant requires a component and variant CSS identifier");
  }
  if (!atRule.nodes) throw atRule.error("@variant requires a declaration block");
  return { component: parts[0], variant: parts[1] };
}

function variantSelector(component, variant) {
  return `.${component}[data-variant="${variant}"]`;
}

function variantPlugin() {
  return {
    postcssPlugin: "ui-lab-variant",
    Once(root) {
      root.walkAtRules("variant", (atRule) => {
        const { component, variant } = parseVariant(atRule);
        const rule = atRule.clone({
          type: "rule",
          name: undefined,
          params: undefined,
          selector: variantSelector(component, variant),
        });
        atRule.replaceWith(rule);
      });
    },
  };
}

module.exports = variantPlugin;
module.exports.parseVariant = parseVariant;
module.exports.variantSelector = variantSelector;
