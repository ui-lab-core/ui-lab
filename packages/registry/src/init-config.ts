export { typographyTemplate } from "./.generated/setup-template.js";
import { decodeInitConfig as decodeV1, type LegacyInitConfig } from "./init-config-v1.js";
export { generateStylesheetImports } from "./setup-contract.js";
import type { SimpleThemeColors } from "./init-generation/constants/themes.js";
import type { TypographyConfig } from "./init-generation/lib/typography-config.js";
import { V2_DEFAULTS } from "./init-config-defaults.js";
import { ALL_SHADES } from "./init-generation/lib/color/scales.js";
import { generateThemeSetupFiles } from "./init-generation/config/theme/generator.js";
export { THEME_TOGGLE_TSX } from "./init-generation/config/theme/generator.js";
import { generateGlobalsCSS, generateTypographyFile } from "./init-generation/config/output.js";
export { generateGlobalsCSS, generateTypographyFile } from "./init-generation/config/output.js";

export const INIT_CONFIG_VERSION = 2 as const;
export const MAX_CONFIG_ID_LENGTH = 1024;
export const MAX_CONFIG_PAYLOAD_BYTES = 640;
export const FRAMEWORKS = ["next", "vite", "astro"] as const;
export const FONTS = ["inter", "geist", "work-sans", "karla", "dm-sans", "manrope"] as const;
export const CODE_THEMES = ["adaptive", "github", "one-dark", "vitesse", "vscode", "catppuccin", "gruvbox", "rose-pine", "solarized", "material"] as const;
export const EASINGS = { linear: (t: number) => t, accent: (t: number) => t < .2 ? .9-t*.5 : t < .5 ? .8-(t-.2) : .5+(t-.5) };
export const CHROMA_SCALINGS = { linear: (_t: number) => 1, desaturateBright: (t: number) => t < .2 ? .3+t*1.5 : t < .5 ? .6+(t-.2) : .9+(t-.5)*.2 };
const easingNames = [undefined, "linear", "accent"] as const;
const scalingNames = [undefined, "linear", "desaturateBright"] as const;
export type InitFramework = typeof FRAMEWORKS[number];
export type InitFont = typeof FONTS[number];
export type InitColors = Omit<SimpleThemeColors, "accentEasing" | "accentChromaScaling" | "syntaxVariation"> & {
  accentEasing?: keyof typeof EASINGS;
  accentChromaScaling?: keyof typeof CHROMA_SCALINGS;
};
export interface UiLabInitConfig {
  version: 2;
  framework: InitFramework;
  themeMode: "light" | "dark";
  colors: InitColors;
  typography: TypographyConfig;
  layout: { radius: number; borderWidth: number; spacingScale: number };
  longFormTypography: boolean;
  customFont: boolean;
  font: InitFont;
  themeToggle: boolean;
}
export type DecodedInitConfig = UiLabInitConfig | LegacyInitConfig;
export function generateInitFiles(config: UiLabInitConfig, typographyTemplate: string) {
  const value = validateInitConfig(config);
  return {
    themeCss: generateThemeSetupFiles(generationColors(value.colors),value.themeMode,value.typography,value.layout).themeCss,
    globalsCss: generateGlobalsCSS(value.typography,value.layout),
    typographyCss: value.longFormTypography ? generateTypographyFile(value.typography,typographyTemplate) : undefined,
  };
}
function fail(message: string): never { throw new Error(`Invalid UI Lab configuration ID: ${message}`); }
function enumIndex(values: readonly unknown[], value: unknown): number {
  const index = values.indexOf(value);
  if (index < 0) fail("unknown enum value.");
  return index;
}
function functionName<T extends Record<string, (t: number) => number>>(table: T, fn: unknown): keyof T | undefined {
  if (fn === undefined) return undefined;
  const name = Object.keys(table).find(key => table[key] === fn);
  if (!name) fail("unknown easing/chroma-scaling function; use a shared enum function.");
  return name;
}
export function sourceColors(colors: SimpleThemeColors): InitColors {
  return { ...colors, accentEasing: functionName(EASINGS, colors.accentEasing), accentChromaScaling: functionName(CHROMA_SCALINGS, colors.accentChromaScaling) };
}
export function generationColors(colors: InitColors): SimpleThemeColors {
  return { ...colors, accentEasing: colors.accentEasing === undefined ? undefined : EASINGS[colors.accentEasing], accentChromaScaling: colors.accentChromaScaling === undefined ? undefined : CHROMA_SCALINGS[colors.accentChromaScaling] };
}
export function defaultInitConfig(framework: InitFramework = "next", themeMode: "light" | "dark" = "dark"): UiLabInitConfig {
  return { ...structuredClone(V2_DEFAULTS[themeMode]), framework };
}

// Field order and defaults are immutable parts of the v2 wire schema.
export interface NumericField { path: string; min: number; max: number; step: number; exact?: boolean; }
export const INIT_NUMERIC_FIELDS: readonly NumericField[] = [
  ...["headerScale", "bodyScale"].map(key => ({path:`typography.${key}`,min:.5,max:1.5,step:.01})),
  ...["headerMinFontSizePx", "bodyMinFontSizePx", "monoMinFontSizePx"].map(key => ({path:`typography.${key}`,min:10,max:18,step:.05})),
  ...["monoFontSizeScale", "monoFontWeightScale"].map(key => ({path:`typography.${key}`,min:.8,max:1.2,step:.01})),
  {path:"typography.monoLetterSpacingScale",min:0,max:3.5,step:.05},
  {path:"typography.monoLineHeight",min:1,max:2,step:.01},
  {path:"layout.radius",min:0,max:1.5,step:.1},
  {path:"layout.borderWidth",min:0,max:4,step:.5},
  {path:"layout.spacingScale",min:.75,max:1.25,step:.05},
  {path:"colors.globalAdjustments.lightnessShift",min:-.015,max:.015,step:.001},
  {path:"colors.globalAdjustments.chromaBoost",min:.7,max:1.5,step:.05},
  ...["background", "foreground", "accent", ...["success", "danger", "warning", "info"].flatMap(role => ["light", "dark"].map(mode => `semantic.${role}.${mode}.color`))].flatMap(key => [
    {path:`colors.${key}.l`,min:0,max:1,step:.001,exact:true},
    {path:`colors.${key}.c`,min:0,max:.4,step:.001,exact:true},
    {path:`colors.${key}.h`,min:0,max:360,step:.1,exact:true},
  ]),
  {path:"colors.accentChromaLimit",min:0,max:.4,step:.001,exact:true},
  ...["success", "danger", "warning", "info"].flatMap(role => ["light", "dark"].map(mode => ({path:`colors.semantic.${role}.${mode}.chromaLimit`,min:0,max:.4,step:.001,exact:true}))),
];
function get(object: unknown, path: string): any { return path.split(".").reduce((value: any,key) => value?.[key], object); }
function set(object: object, path: string, value: unknown) {
  const parts = path.split("."); let target: any = object;
  for (const key of parts.slice(0,-1)) target = target[key] ??= {};
  target[parts[parts.length-1]] = value;
}
function grid(field: NumericField, index: number): number { return Number((field.min + index * field.step).toFixed(8)); }
function quantize(field: NumericField, value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < field.min || value > field.max) fail(`${field.path} must be a finite number between ${field.min} and ${field.max}.`);
  const index = Math.round((value-field.min)/field.step);
  if (!field.exact && Math.abs(grid(field,index)-value) > 1e-9) fail(`${field.path} must use increments of ${field.step}.`);
  return index;
}
function fieldBits(field: NumericField): number { return Math.ceil(Math.log2(Math.round((field.max-field.min)/field.step)+1)); }
export function validateInitConfig(config: UiLabInitConfig): UiLabInitConfig {
  if (!config || config.version !== 2) fail("unsupported schema version.");
  enumIndex(FRAMEWORKS, config.framework); enumIndex(["light","dark"], config.themeMode); enumIndex(FONTS, config.font);
  for (const key of ["longFormTypography","customFont","themeToggle"] as const) if (typeof config[key] !== "boolean") fail(`${key} must be a boolean.`);
  if (!config.colors || !config.typography || !config.layout) fail("missing source configuration.");
  enumIndex(easingNames, config.colors.accentEasing); enumIndex(scalingNames, config.colors.accentChromaScaling); enumIndex(CODE_THEMES, config.colors.codeTheme ?? "adaptive");
  const colors = config.colors;
  const result: UiLabInitConfig = { version: 2, framework: config.framework, themeMode: config.themeMode, longFormTypography: config.longFormTypography, customFont: config.customFont, font: config.font, themeToggle: config.themeToggle, typography: {} as TypographyConfig, layout: {} as UiLabInitConfig["layout"], colors: { background: {} as never, foreground: {} as never, accent: {} as never, accentEasing: colors.accentEasing, accentChromaScaling: colors.accentChromaScaling, codeTheme: colors.codeTheme ?? "adaptive" } };
  for (const role of ["background","foreground","accent"] as const) {
    const key = `${role}Shade` as const, shade = colors[key] ?? 500;
    enumIndex(ALL_SHADES,shade); result.colors[key] = shade;
  }
  for (const field of INIT_NUMERIC_FIELDS) {
    if (field.path.includes(".semantic.") && colors.semantic === undefined) continue;
    let value = get(config,field.path);
    if (field.path === "colors.globalAdjustments.lightnessShift") value ??= 0;
    if (field.path === "colors.globalAdjustments.chromaBoost") value ??= 1;
    if (field.path === "colors.accentChromaLimit") value ??= .3;
    if (field.path.endsWith(".chromaLimit")) value ??= .025;
    const index = quantize(field,value); set(result,field.path,field.exact ? value : grid(field,index));
  }
  return result;
}
class Writer {
  bytes: number[] = []; position = 0;
  put(value: number, count: number) {
    for (let i=0;i<count;i++,this.position++) { const byte = this.position >>> 3; this.bytes[byte] = (this.bytes[byte] ?? 0) | (((value >>> i)&1) << (this.position&7)); }
  }
  float(value: number) { const bytes = new Uint8Array(8); new DataView(bytes.buffer).setFloat64(0,value,true); for (const byte of bytes) this.put(byte,8); }
}
class Reader {
  position = 0;
  constructor(readonly bytes: Uint8Array) {}
  take(count: number): number {
    if (this.position+count > this.bytes.length*8) fail("truncated binary payload.");
    let value = 0;
    for(let i=0;i<count;i++,this.position++) value |= ((this.bytes[this.position>>>3] >>> (this.position&7))&1) << i;
    return value;
  }
  float(): number { const bytes = Uint8Array.from({length:8},()=>this.take(8)); return new DataView(bytes.buffer).getFloat64(0,true); }
  end() { if (Math.ceil(this.position/8) !== this.bytes.length) fail("trailing unexpected bytes."); if (this.take((8-this.position%8)%8)) fail("nonzero reserved padding bits."); }
}
function at<T>(values: readonly T[], index: number): T { if (index >= values.length) fail("unknown enum index."); return values[index]; }
function binary(config: UiLabInitConfig): Uint8Array {
  const value = validateInitConfig(config), defaults = validateInitConfig(defaultInitConfig(value.framework,value.themeMode)), w = new Writer();
  w.put(enumIndex(FRAMEWORKS,value.framework),2); w.put(value.themeMode === "dark" ? 1:0,1);
  for (const key of ["longFormTypography","customFont","themeToggle"] as const) w.put(Number(value[key]),1);
  w.put(enumIndex(FONTS,value.font),3); w.put(Number(value.colors.semantic !== undefined),1);
  w.put(enumIndex(easingNames,value.colors.accentEasing),2); w.put(enumIndex(scalingNames,value.colors.accentChromaScaling),2);
  w.put(enumIndex(CODE_THEMES,value.colors.codeTheme),4); w.put(0,6);
  for(const role of ["background","foreground","accent"] as const) {
    const key = `${role}Shade` as const, changed = value.colors[key] !== defaults.colors[key];
    w.put(Number(changed),1); if(changed) w.put(enumIndex(ALL_SHADES,value.colors[key]),4);
  }
  const fields = INIT_NUMERIC_FIELDS.filter(f => !f.path.includes(".semantic.") || value.colors.semantic !== undefined);
  for(const field of fields) w.put(Number(get(value,field.path) !== get(defaults,field.path)),1);
  for(const field of fields) {
    const number = get(value,field.path); if(number === get(defaults,field.path)) continue;
    const index = quantize(field,number), exact = field.exact && grid(field,index) !== number;
    if(field.exact) w.put(Number(exact),1);
    if(exact) w.float(number); else w.put(index,fieldBits(field));
  }
  return Uint8Array.from(w.bytes);
}
function readBinary(bytes: Uint8Array): UiLabInitConfig {
  const r = new Reader(bytes), framework = at(FRAMEWORKS,r.take(2)), mode = r.take(1) ? "dark":"light";
  const value = validateInitConfig(defaultInitConfig(framework,mode));
  for(const key of ["longFormTypography","customFont","themeToggle"] as const) value[key] = Boolean(r.take(1));
  value.font = at(FONTS,r.take(3)); if(!r.take(1)) delete value.colors.semantic;
  value.colors.accentEasing = at(easingNames,r.take(2)); value.colors.accentChromaScaling = at(scalingNames,r.take(2)); value.colors.codeTheme = at(CODE_THEMES,r.take(4));
  if(r.take(6)) fail("nonzero reserved bits.");
  for(const role of ["background","foreground","accent"] as const) if(r.take(1)) value.colors[`${role}Shade`] = at(ALL_SHADES,r.take(4));
  const fields = INIT_NUMERIC_FIELDS.filter(f => !f.path.includes(".semantic.") || value.colors.semantic !== undefined), presence = fields.map(()=>r.take(1));
  fields.forEach((field,i) => { if(presence[i]) { const number = field.exact && r.take(1) ? r.float() : grid(field,r.take(fieldBits(field))); quantize(field,number); set(value,field.path,number); } });
  r.end();
  const validated = validateInitConfig(value), canonical = binary(validated);
  if(canonical.length !== bytes.length || canonical.some((byte,i)=>byte !== bytes[i])) fail("invalid presence mask or noncanonical numeric encoding.");
  return validated;
}
function base64(bytes: Uint8Array): string { return btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
function unbase64(value: string): Uint8Array {
  if(!/^[A-Za-z0-9_-]+$/.test(value) || value.length%4 === 1) fail("payload is not valid Base64URL.");
  let bytes: Uint8Array;
  try { bytes = Uint8Array.from(atob(value.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0)); } catch { return fail("payload is not valid Base64URL."); }
  if(base64(bytes) !== value) fail("payload is not canonical Base64URL.");
  return bytes;
}
function checksum(bytes: Uint8Array): string {
  let crc = 0xffffffff;
  for(const byte of bytes) { crc ^= byte; for(let bit=0;bit<8;bit++) crc = (crc>>>1) ^ (0xedb88320 & -(crc&1)); }
  return ((crc^0xffffffff)>>>0).toString(16).padStart(8,"0");
}
export async function encodeInitConfig(config: UiLabInitConfig): Promise<string> {
  const bytes = binary(config);
  if(bytes.length > MAX_CONFIG_PAYLOAD_BYTES) fail("decoded payload is too large.");
  return `${base64(bytes)}_${checksum(bytes)}`;
}
export async function decodeInitConfig(id: string): Promise<DecodedInitConfig> {
  if(typeof id !== "string" || id.length > 32768) fail("encoded payload is too large.");
  const legacy = /^v([^_]+)_(.+)_([0-9a-f]{8})$/.exec(id);
  if(legacy?.[1] === "1") return decodeV1(id);
  if(legacy && legacy[1] !== "2") fail(`unsupported schema version ${legacy[1]}.`);
  const match = /^(?:v2_)?(.+)_([0-9a-f]{8})$/.exec(id);
  if(!match) fail("expected <payload>_<checksum>.");
  if(id.length > MAX_CONFIG_ID_LENGTH) fail("encoded payload is too large.");
  const bytes = unbase64(match[1]);
  if(bytes.length > MAX_CONFIG_PAYLOAD_BYTES) fail("decoded payload is too large.");
  if(checksum(bytes) !== match[2]) fail("checksum mismatch.");
  return readBinary(bytes);
}
