import slotPlugin from "../../postcss/slot.mjs";
import tailwindcss from "@tailwindcss/postcss";

const config = {
  plugins: [slotPlugin(), tailwindcss()],
};

export default config;
