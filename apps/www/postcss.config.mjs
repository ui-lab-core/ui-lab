import { fileURLToPath } from "node:url";

const slotPlugin = fileURLToPath(new URL("../../postcss/slot.cjs", import.meta.url));

export default {
  plugins: {
    [slotPlugin]: {},
    "@tailwindcss/postcss": {},
  },
};
