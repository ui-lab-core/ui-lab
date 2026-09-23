import assert from "node:assert/strict";
import test from "node:test";
import { deflateSync } from "node:zlib";
import { decodeInitConfig, encodeInitConfig, defaultInitConfig, validateInitConfig, generateInitFiles, generationColors, FRAMEWORKS, FONTS, CODE_THEMES, EASINGS, CHROMA_SCALINGS, INIT_NUMERIC_FIELDS, type UiLabInitConfig } from "./init-config.js";
import { encodeInitConfig as encodeV1 } from "./init-config-v1.js";
import { generateThemeSetupFiles } from "./init-generation/config/theme/generator.js";
import { ALL_SHADES } from "./init-generation/lib/color/scales.js";

function put(object: any, path: string, value: unknown) {
  const keys=path.split("."); for(const key of keys.slice(0,-1)) object=object[key]??={}; object[keys[keys.length-1]]=value;
}
function frame(bytes: Uint8Array, version=2): string {
  let crc=0xffffffff;
  for(const byte of bytes) { crc^=byte; for(let i=0;i<8;i++) crc=(crc>>>1)^(0xedb88320&-(crc&1)); }
  const value=`${Buffer.from(bytes).toString("base64url")}_${((crc^0xffffffff)>>>0).toString(16).padStart(8,"0")}`;
  return version===2 ? value : `v${version}_${value}`;
}
function bytes(id: string): Buffer { return Buffer.from(id.replace(/^v2_/,"").slice(0,-9),"base64url"); }
function bits(data: Uint8Array, offset: number, count: number, value: number) {
  for(let i=0;i<count;i++) { const bit=offset+i; data[bit>>>3]=(data[bit>>>3]&~(1<<(bit%8)))|(((value>>>i)&1)<<(bit%8)); }
}
async function roundtrip(config: UiLabInitConfig) {
  const id=await encodeInitConfig(config), decoded=await decodeInitConfig(id);
  assert.deepEqual(decoded,validateInitConfig(config));
  assert.equal(await encodeInitConfig(decoded as UiLabInitConfig),id);
  return id;
}
function customized(): UiLabInitConfig {
  const value=defaultInitConfig();
  value.colors.background={l:.32,c:.008,h:216}; value.colors.foreground={...value.colors.background}; value.colors.accent={l:.5,c:.275,h:281};
  value.colors.globalAdjustments={lightnessShift:-.007,chromaBoost:1.25};
  for(const [i,role] of ["success","danger","warning","info"].entries()) {
    for(const [j,mode] of ["light","dark"].entries()) put(value,`colors.semantic.${role}.${mode}.color.h`,[133.3,32.7,76.2,263.1][i]+j);
  }
  value.typography.bodyScale=.83;value.typography.headerScale=.68;value.layout={radius:.8,borderWidth:1.5,spacingScale:1.1};
  return value;
}
function worst(): UiLabInitConfig {
  const value=defaultInitConfig("astro","light");
  for(const [i,field] of INIT_NUMERIC_FIELDS.entries()) put(value,field.path,field.exact ? field.min+(field.max-field.min)*(.123456789012345+i*.00123456789) : field.max);
  value.customFont=true;value.themeToggle=true;value.font="manrope";
  value.colors.backgroundShade=50;value.colors.foregroundShade=950;value.colors.accentShade=950;
  value.colors.accentEasing="accent";value.colors.accentChromaScaling="desaturateBright";value.colors.codeTheme="material";
  return value;
}
test("binary round trips, canonical defaults, source precision and deterministic property order",async()=>{
  assert.equal(await encodeInitConfig(defaultInitConfig()),"DAIAAAAAAAAAAAA_6568f316");
  assert.equal(await encodeInitConfig(defaultInitConfig("vite")),"DQIAAAAAAAAAAAA_a4e62cd6");
  for(const config of [defaultInitConfig(),customized(),worst()]) {
    const id=await roundtrip(config);
    assert.equal(await encodeInitConfig(Object.fromEntries(Object.entries(config).reverse()) as UiLabInitConfig),id);
    assert.ok(!Buffer.from(bytes(id)).toString().includes("themeCss"));
  }
  const value=defaultInitConfig(); delete value.colors.semantic;
  await roundtrip(value);
  value.colors.accent.h=120+40/6; await roundtrip(value);
});
test("all enums, booleans, shades and optional states",async()=>{
  for(const framework of FRAMEWORKS) for(const mode of ["light","dark"] as const) await roundtrip(defaultInitConfig(framework,mode));
  for(const font of FONTS) await roundtrip({...defaultInitConfig(),font});
  for(let mask=0;mask<8;mask++) await roundtrip({...defaultInitConfig(),longFormTypography:!!(mask&1),customFont:!!(mask&2),themeToggle:!!(mask&4)});
  for(const codeTheme of CODE_THEMES) await roundtrip({...defaultInitConfig(),colors:{...defaultInitConfig().colors,codeTheme}});
  for(const accentEasing of [undefined,...Object.keys(EASINGS)] as const) for(const accentChromaScaling of [undefined,...Object.keys(CHROMA_SCALINGS)] as const) await roundtrip({...defaultInitConfig(),colors:{...defaultInitConfig().colors,accentEasing:accentEasing as never,accentChromaScaling:accentChromaScaling as never}});
  for(const shade of ALL_SHADES) for(const role of ["background","foreground","accent"]) { const value=defaultInitConfig(); put(value,`colors.${role}Shade`,shade); await roundtrip(value); }
});
test("every numeric boundary and every stepped-control increment",async()=>{
  for(const field of INIT_NUMERIC_FIELDS) {
    const values=field.exact ? [field.min,field.max] : Array.from({length:Math.round((field.max-field.min)/field.step)+1},(_,i)=>Number((field.min+i*field.step).toFixed(8)));
    for(const number of values) { const value=defaultInitConfig(); put(value,field.path,number); await roundtrip(value); }
    for(const number of [NaN,Infinity,-Infinity,field.min-field.step,field.max+field.step,...(field.exact?[]:[field.min+field.step/2])]) {
      const value=defaultInitConfig(); put(value,field.path,number); await assert.rejects(encodeInitConfig(value), /finite number|increments/);
    }
  }
});
test("malformed Base64URL, corruption, versions and size limits",async()=>{
  for(const payload of ["A","A=","A+","A/"," A","AB","%%%"] ) await assert.rejects(decodeInitConfig(`${payload}_00000000`),/Base64URL/);
  for(const version of [0,3,99]) await assert.rejects(decodeInitConfig(`v${version}_AA_00000000`),/unsupported schema version/);
  await assert.rejects(decodeInitConfig("A".repeat(1100)+"_00000000"),/too large/);
  await assert.rejects(decodeInitConfig(frame(new Uint8Array(641))),/too large/);
  const id=await encodeInitConfig(defaultInitConfig());
  await assert.rejects(decodeInitConfig(id.slice(0,-8)+"00000000"),/checksum mismatch/);
});
test("truncation at every byte boundary, trailing bytes, reserved bits and bad enum indexes",async()=>{
  for(const config of [defaultInitConfig(),customized(),worst()]) {
    const raw=bytes(await encodeInitConfig(config));
    for(let i=0;i<raw.length;i++) await assert.rejects(decodeInitConfig(frame(raw.subarray(0,i))),/truncated|expected/);
    await assert.rejects(decodeInitConfig(frame(Buffer.concat([raw,Buffer.from([0])]))),/trailing/);
  }
  const raw=bytes(await encodeInitConfig(defaultInitConfig()));
  for(const [offset,count,value] of [[0,2,3],[6,3,7],[10,2,3],[12,2,3],[14,4,15],[18,6,1]]) {
    const mutated=Buffer.from(raw); bits(mutated,offset,count,value); await assert.rejects(decodeInitConfig(frame(mutated)),/enum|reserved/);
  }
  const pad=Buffer.from(raw);pad[pad.length-1]|=128;await assert.rejects(decodeInitConfig(frame(pad)),/reserved/);
  const shade=Buffer.from(raw); bits(shade,24,5,31);await assert.rejects(decodeInitConfig(frame(shade)),/enum/);
});
test("rejects invalid presence masks and out-of-range reconstructed integers and floats",async()=>{
  const value=defaultInitConfig();value.typography.headerScale=.6;
  const raw=bytes(await encodeInitConfig(value));
  // 24 header bits, three shade-presence bits, then 56 numeric presence bits.
  const start=27+INIT_NUMERIC_FIELDS.length;
  bits(raw,start,6,63); await assert.rejects(decodeInitConfig(frame(raw)),/finite number/);
  bits(raw,start,6,25); await assert.rejects(decodeInitConfig(frame(raw)),/presence mask/);
  const color=defaultInitConfig();color.colors.background.l=.123456789;
  const floating=bytes(await encodeInitConfig(color));
  const nan=Buffer.alloc(8);nan.writeDoubleLE(NaN);
  for(let i=0;i<8;i++) bits(floating,start+1+i*8,8,nan[i]);
  await assert.rejects(decodeInitConfig(frame(floating)),/finite number/);
});
test("v1 compatibility and bounded invalid decompression",async()=>{
  const defaults=defaultInitConfig();
  const legacy={...defaults,version:1 as const,themeCss:":root { --accent: red; }"};
  const id=await encodeV1(legacy);
  const {colors,...expected}=legacy; assert.deepEqual(await decodeInitConfig(id),expected);
  await assert.rejects(decodeInitConfig(frame(Buffer.from([1,2,3]),1)),/compressed payload/);
  await assert.rejects(decodeInitConfig(frame(deflateSync(Buffer.alloc(128001)),1)),/compressed payload|too large/);
});
test("website generation before encoding equals validated offline generation after decoding",async()=>{
  for(const value of [defaultInitConfig(),customized(),worst()]) {
    const before=generateThemeSetupFiles(generationColors(value.colors),value.themeMode,value.typography,value.layout);
    const decoded=await decodeInitConfig(await encodeInitConfig(value)); assert.equal(decoded.version,2);
    const after=generateInitFiles(decoded as UiLabInitConfig,"/* typography template */");
    assert.equal(after.themeCss,before.themeCss);assert.ok(before.globalsCss.endsWith(after.globalsCss));
    assert.equal(after.typographyCss,"/* typography template */");
    assert.match(before.globalsCss,/--header-scale:/);
    assert.match(before.globalsCss,/--body-scale:/);
    assert.doesNotMatch(before.globalsCss,/--text-(xs|sm|md|base|lg|xl|2xl|3xl|4xl|5xl)-(body|header):/);
    assert.doesNotMatch(before.globalsCss,/--font-weight-(header|body)-|--letter-spacing-(header|base)|--leading-(header|body)/);
  }
  assert.equal(generateInitFiles({...defaultInitConfig(),longFormTypography:false},"").typographyCss,undefined);
});
test("representative ID lengths and explicit budgets; deflate comparison includes framing",async(t)=>{
  for(const [name,config,budget] of [
    ["default Next.js",defaultInitConfig(),32], ["default Vite",defaultInitConfig("vite"),32],
    ["all optional features",{...defaultInitConfig(),customFont:true,themeToggle:true},32],
    ["custom semantic theme",customized(),80], ["worst-case exact source",worst(),504],
  ] as const) {
    const id=await roundtrip(config), compressed=frame(deflateSync(bytes(id)));
    t.diagnostic(`${name}: ${id.length} chars; deflate ${compressed.length}; budget ${budget}`);
    assert.ok(id.length<=budget,`${name}: ${id.length} > ${budget}`);
  }
});
