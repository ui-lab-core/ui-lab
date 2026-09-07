import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "ui-lab-registry") {
      return { url: new URL("../registry/dist/index.js", import.meta.url).href, shortCircuit: true };
    }
    if (specifier === "ui-lab-registry/init-config") {
      return { url: new URL("../registry/dist/init-config.js", import.meta.url).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
