import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { ColorMode } from "../themes/onyx.js";
import type { FontChoice } from "../fonts.js";
export interface InitSelection {
  stylesheet: string;
  theme: "onyx" | "none";
  typography: boolean;
  colorMode: ColorMode;
  font: FontChoice;
  nextLayout?: string;
}
export interface InitChoices {
  stylesheet?: string;
  theme?: "onyx" | "none";
  typography?: boolean;
  colorMode?: ColorMode;
  font?: FontChoice;
  nextLayout?: string;
  detectedStylesheet?: string;
  nextLayouts: string[];
  nonInteractive?: boolean;
}
function validateColorMode(value: string): ColorMode {
  if (value === "system" || value === "light" || value === "dark") return value;
  throw new Error("Color mode must be system, light, or dark.");
}
export async function chooseInitOptions(
  options: InitChoices,
): Promise<InitSelection> {
  if (options.nonInteractive) {
    if (!options.stylesheet)
      throw new Error("No application stylesheet was detected. Pass --stylesheet <path>.");
    const theme = options.theme ?? "onyx";
    return {
      stylesheet: options.stylesheet,
      theme,
      typography: theme === "onyx" ? (options.typography ?? true) : false,
      colorMode: options.colorMode ?? "system",
      font: options.font ?? "work-sans",
      nextLayout:
        options.nextLayout === "none"
          ? undefined
          : options.nextLayout ?? (theme === "onyx" ? options.nextLayouts[0] : undefined),
    };
  }
  const prompt = createInterface({ input: stdin, output: stdout });
  try {
    const enteredStylesheet =
      options.stylesheet ??
      (await prompt.question(
        `Stylesheet to configure${options.detectedStylesheet ? ` [${options.detectedStylesheet}]` : ""}: `,
      ));
    const stylesheet = enteredStylesheet || options.detectedStylesheet;
    if (!stylesheet) throw new Error("A stylesheet path is required.");
    const selectedTheme =
      options.theme ?? (await prompt.question("Theme (onyx or none) [onyx]: "));
    const theme = (selectedTheme || "onyx") as "onyx" | "none";
    if (theme !== "onyx" && theme !== "none")
      throw new Error("Theme must be onyx or none.");
    if (theme === "none")
      return { stylesheet, theme, typography: false, colorMode: "system", font: "work-sans" };
    const typography =
      options.typography ??
      (await prompt.question("Install typography.css? (Y/n): "))
        .trim()
        .toLowerCase() !== "n";
    const colorMode =
      options.colorMode ??
      validateColorMode(
        (
          await prompt.question(
            "Color mode (system, light, or dark) [system]: ",
          )
        ).trim() || "system",
      );
    const selectedFont =
      options.font ??
      ((await prompt.question("Font (work-sans, inter, or manrope) [work-sans]: "))
        .trim() || "work-sans");
    if (selectedFont !== "work-sans" && selectedFont !== "inter" && selectedFont !== "manrope")
      throw new Error("Font must be work-sans, inter, or manrope.");
    const nextLayout =
      options.nextLayout ??
      (options.nextLayouts.length
        ? await prompt.question(
            `Next layout to integrate [${options.nextLayouts[0]}] (or none): `,
          )
        : undefined);
    return {
      stylesheet,
      theme,
      typography,
      colorMode,
      font: selectedFont,
      nextLayout:
        nextLayout === "none"
          ? undefined
          : nextLayout || options.nextLayouts[0],
    };
  } finally {
    prompt.close();
  }
}
