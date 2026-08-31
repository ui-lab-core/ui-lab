const identifier = /^[a-z][a-z0-9-]*$/i;

function propertyName(slot, property) {
  return `--slot-${slot}-${property}`;
}

function splitArguments(value) {
  const arguments_ = [];
  let start = 0;
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) {
      arguments_.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  arguments_.push(value.slice(start).trim());
  return arguments_;
}

function expandSlotFunctions(value) {
  let result = "";
  let cursor = 0;

  while (cursor < value.length) {
    const match = /(^|[^a-zA-Z0-9_-])slot\(/.exec(value.slice(cursor));
    if (!match) return result + value.slice(cursor);

    const prefixLength = match[1].length;
    const functionStart = cursor + match.index + prefixLength;
    const argumentsStart = functionStart + "slot(".length;
    let depth = 1;
    let end = argumentsStart;

    while (end < value.length && depth > 0) {
      if (value[end] === "(") depth += 1;
      if (value[end] === ")") depth -= 1;
      end += 1;
    }

    if (depth !== 0) throw new Error("Unclosed slot() function");

    const arguments_ = splitArguments(value.slice(argumentsStart, end - 1));
    if (arguments_.length < 2 || arguments_.length > 3 || arguments_.some((item) => !item)) {
      throw new Error("slot() requires a slot, property, and optional fallback");
    }

    const [slot, property, fallback] = arguments_;
    if (!identifier.test(slot) || !identifier.test(property)) {
      throw new Error("slot() slot and property names must be CSS identifiers");
    }

    const expandedFallback = fallback === undefined ? undefined : expandSlotFunctions(fallback);
    const replacement = `var(${propertyName(slot, property)}${
      expandedFallback === undefined ? "" : `, ${expandedFallback}`
    })`;

    result += value.slice(cursor, functionStart) + replacement;
    cursor = end;
  }

  return result;
}

function slotPlugin() {
  return {
    postcssPlugin: "ui-lab-slot",
    Once(root) {
      root.walkAtRules("slot", (atRule) => {
        const slot = atRule.params.trim();
        if (!identifier.test(slot)) throw atRule.error("@slot requires one CSS identifier");
        if (!atRule.nodes) throw atRule.error("@slot requires a declaration block");

        const transformNodes = (nodes) => {
          for (const node of nodes) {
            if (node.type === "comment") continue;
            if (node.type === "atrule" && node.name === "supports" && node.nodes) {
              transformNodes(node.nodes);
              continue;
            }
            if (node.type !== "decl" || !node.prop.startsWith("--")) {
              throw atRule.error("@slot blocks may contain only custom property declarations");
            }
            const property = node.prop.slice(2);
            if (!identifier.test(property)) throw node.error("Invalid @slot property name");
            node.prop = propertyName(slot, property);
          }
        };

        transformNodes(atRule.nodes);
        atRule.replaceWith(...atRule.nodes);
      });

      root.walkDecls((declaration) => {
        if (!declaration.value.includes("slot(")) return;
        try {
          declaration.value = expandSlotFunctions(declaration.value);
        } catch (error) {
          throw declaration.error(error instanceof Error ? error.message : String(error));
        }
      });
    },
  };
}

module.exports = slotPlugin;
module.exports.expandSlotFunctions = expandSlotFunctions;
