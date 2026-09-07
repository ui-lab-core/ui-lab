export const INIT_CONFIG_VERSION = 1 as const;
export const MAX_CONFIG_ID_LENGTH = 32_768;
export const MAX_CONFIG_PAYLOAD_BYTES = 128_000;

export type InitFramework = "next" | "vite" | "astro";
export type InitFont = "inter" | "geist" | "work-sans" | "karla" | "dm-sans" | "manrope";

export interface LegacyInitConfig {
  version: 1;
  framework: InitFramework;
  themeMode: "light" | "dark";
  themeCss: string;
  typography: {
    headerScale: number;
    headerMinFontSizePx: number;
    bodyScale: number;
    bodyMinFontSizePx: number;
    monoFontSizeScale: number;
    monoFontWeightScale: number;
    monoLetterSpacingScale: number;
    monoLineHeight: number;
    monoMinFontSizePx: number;
  };
  layout: { radius: number; borderWidth: number; spacingScale: number };
  longFormTypography: boolean;
  customFont: boolean;
  font: InitFont;
  themeToggle: boolean;
}

type CompactConfig = {
  f: InitFramework; m: "light" | "dark"; c: string;
  t: [number, number, number, number, number, number, number, number, number];
  l: [number, number, number]; o: [boolean, boolean, InitFont, boolean];
};

const frameworks = new Set<unknown>(["next", "vite", "astro"]);
const modes = new Set<unknown>(["light", "dark"]);
const fonts = new Set<unknown>(["inter", "geist", "work-sans", "karla", "dm-sans", "manrope"]);

function fail(message: string): never { throw new Error(`Invalid UI Lab configuration ID: ${message}`); }
function numberIn(value: unknown, min: number, max: number, name: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max)
    fail(`${name} must be a finite number between ${min} and ${max}.`);
  return value;
}
function bool(value: unknown, name: string): boolean {
  if (typeof value !== "boolean") fail(`${name} must be a boolean.`);
  return value;
}
function text(value: unknown, name: string): string {
  if (typeof value !== "string") fail(`${name} must be a string.`);
  return value;
}
function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromBase64url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) fail("payload is not valid Base64URL.");
  try {
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    if (base64url(bytes) !== value) fail("payload is not canonical Base64URL.");
    return bytes;
  } catch { return fail("payload is not valid Base64URL."); }
}
function crc32(bytes: Uint8Array): string {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}
async function transform(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const input = new Blob([bytes.slice().buffer]).stream();
  const reader = input.pipeThrough(stream).getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_CONFIG_PAYLOAD_BYTES) { await reader.cancel(); fail("decoded payload is too large."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk,offset); offset += chunk.length; }
  return result;
}
function compact(config: LegacyInitConfig): CompactConfig {
  validate(config);
  const t = config.typography;
  return { f: config.framework, m: config.themeMode, c: config.themeCss,
    t: [t.headerScale,t.headerMinFontSizePx,t.bodyScale,t.bodyMinFontSizePx,t.monoFontSizeScale,t.monoFontWeightScale,t.monoLetterSpacingScale,t.monoLineHeight,t.monoMinFontSizePx],
    l: [config.layout.radius,config.layout.borderWidth,config.layout.spacingScale],
    o: [config.longFormTypography,config.customFont,config.font,config.themeToggle] };
}
function validate(config: LegacyInitConfig): LegacyInitConfig {
  if (config.version !== 1) fail(`unsupported schema version ${String(config.version)}.`);
  if (!frameworks.has(config.framework)) fail("unknown framework.");
  if (!modes.has(config.themeMode)) fail("unknown theme mode.");
  if (!fonts.has(config.font)) fail("unknown font.");
  text(config.themeCss, "themeCss");
  const t = config.typography;
  numberIn(t.headerScale,.5,1,"headerScale"); numberIn(t.bodyScale,.5,1,"bodyScale");
  numberIn(t.headerMinFontSizePx,10,18,"headerMinFontSizePx"); numberIn(t.bodyMinFontSizePx,10,18,"bodyMinFontSizePx");
  numberIn(t.monoFontSizeScale,.8,1.2,"monoFontSizeScale"); numberIn(t.monoFontWeightScale,.8,1.2,"monoFontWeightScale");
  numberIn(t.monoLetterSpacingScale,0,3.5,"monoLetterSpacingScale"); numberIn(t.monoLineHeight,1,2,"monoLineHeight");
  numberIn(t.monoMinFontSizePx,10,18,"monoMinFontSizePx");
  numberIn(config.layout.radius,0,1.5,"radius"); numberIn(config.layout.borderWidth,0,4,"borderWidth"); numberIn(config.layout.spacingScale,.75,1.25,"spacingScale");
  bool(config.longFormTypography,"longFormTypography"); bool(config.customFont,"customFont"); bool(config.themeToggle,"themeToggle");
  return config;
}

export async function encodeInitConfig(config: LegacyInitConfig): Promise<string> {
  const raw = new TextEncoder().encode(JSON.stringify(compact(config)));
  if (raw.length > MAX_CONFIG_PAYLOAD_BYTES) fail("decoded payload is too large.");
  const compressed = await transform(raw, new CompressionStream("deflate"));
  const id = `v1_${base64url(compressed)}_${crc32(compressed)}`;
  if (id.length > MAX_CONFIG_ID_LENGTH) fail("encoded payload is too large.");
  return id;
}

export async function decodeInitConfig(id: string): Promise<LegacyInitConfig> {
  if (typeof id !== "string" || id.length > MAX_CONFIG_ID_LENGTH) fail("encoded payload is too large.");
  const match = /^v([^_]+)_(.+)_([0-9a-f]{8})$/.exec(id);
  if (!match) fail("expected v<version>_<payload>_<checksum>.");
  if (match[1] !== "1") fail(`unsupported schema version ${match[1]}.`);
  const compressed = fromBase64url(match[2]);
  if (crc32(compressed) !== match[3]) fail("checksum mismatch.");
  let raw: Uint8Array;
  try { raw = await transform(compressed, new DecompressionStream("deflate")); }
  catch { return fail("compressed payload is invalid."); }
  if (raw.length > MAX_CONFIG_PAYLOAD_BYTES) fail("decoded payload is too large.");
  let value: CompactConfig;
  try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw)); }
  catch { return fail("decoded payload is not valid JSON."); }
  if (!value || typeof value !== "object" || !Array.isArray(value.t) || value.t.length !== 9 || !Array.isArray(value.l) || value.l.length !== 3 || !Array.isArray(value.o) || value.o.length !== 4) fail("payload schema is malformed.");
  return validate({ version: 1, framework: value.f, themeMode: value.m, themeCss: value.c,
    typography: { headerScale:value.t[0],headerMinFontSizePx:value.t[1],bodyScale:value.t[2],bodyMinFontSizePx:value.t[3],monoFontSizeScale:value.t[4],monoFontWeightScale:value.t[5],monoLetterSpacingScale:value.t[6],monoLineHeight:value.t[7],monoMinFontSizePx:value.t[8] },
    layout: { radius:value.l[0],borderWidth:value.l[1],spacingScale:value.l[2] }, longFormTypography:value.o[0],customFont:value.o[1],font:value.o[2],themeToggle:value.o[3] });
}
