import slotPlugin from "../../postcss/slot.mjs";
import variantPlugin from "../../postcss/variant.mjs";
import tailwindcss from "@tailwindcss/postcss";

const config = {
  plugins: [variantPlugin(), slotPlugin(), tailwindcss()],
};

export default config;
