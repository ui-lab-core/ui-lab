export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const rnd = (n: number, precision = 1000) => Math.round(n * precision) / precision;

export function hexToOklch(hex: string): OklchColor {
  const cleaned = String(hex || "")
    .replace("#", "")
    .trim();
  if (!cleaned || (cleaned.length !== 3 && cleaned.length !== 6)) {
    throw new Error(`Invalid hex color format: ${hex}`);
  }

  let r: number;
  let g: number;
  let b: number;

  if (cleaned.length === 6) {
    const numeric = parseInt(cleaned, 16);
    r = ((numeric >> 16) & 0xff) / 255;
    g = ((numeric >> 8) & 0xff) / 255;
    b = (numeric & 0xff) / 255;
  } else {
    r = parseInt(cleaned[0] + cleaned[0], 16) / 255;
    g = parseInt(cleaned[1] + cleaned[1], 16) / 255;
    b = parseInt(cleaned[2] + cleaned[2], 16) / 255;
  }

  const toLinear = (value: number) =>
    value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
  const y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
  const z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;

  const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

  const l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  return {
    l: rnd(l),
    c: rnd(Math.sqrt(a * a + b_ * b_)),
    h: rnd((Math.atan2(b_, a) * (180 / Math.PI) + 360) % 360, 10),
  };
}

export function oklchToCss(color: OklchColor): string {
  return `oklch(${(color.l * 100).toFixed(1)}% ${color.c.toFixed(3)} ${color.h.toFixed(1)})`;
}

export function parseOklchFromCss(value: string): OklchColor | null {
  const input = String(value || "").trim();
  if (!input) return null;

  let match = input.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+(-?[\d.]+)\s*\)/i);
  if (match) {
    const lightness = match[1].includes("%") ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
    return { l: lightness, c: parseFloat(match[2]), h: (parseFloat(match[3]) + 360) % 360 };
  }

  match = input.match(/oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (match) {
    const lightness = match[1].includes("%") ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
    const a = parseFloat(match[2]);
    const b = parseFloat(match[3]);
    return {
      l: lightness,
      c: Math.sqrt(a * a + b * b),
      h: (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360,
    };
  }

  match = input.match(/lab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (match) {
    const lightness = match[1].includes("%")
      ? parseFloat(match[1]) / 100
      : parseFloat(match[1]) / 100;
    const a = parseFloat(match[2]);
    const b = parseFloat(match[3]);
    return {
      l: lightness,
      c: Math.sqrt(a * a + b * b) / 100,
      h: (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360,
    };
  }

  return null;
}
