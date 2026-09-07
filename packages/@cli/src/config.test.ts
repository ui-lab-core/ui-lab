import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { encodeInitConfig, decodeInitConfig, defaultInitConfig, validateInitConfig, generateInitFiles } from "ui-lab-registry/init-config";
import { mergeInitConfigOptions } from "./init.js";
import { buildInitPlan } from "./init/build-plan.js";
import { ONYX_TYPOGRAPHY_CSS } from "./themes/onyx.js";

test("CLI dependency decodes configuration offline", async()=>{
  const config=defaultInitConfig("vite","light");
  assert.deepEqual(await decodeInitConfig(await encodeInitConfig(config)),validateInitConfig(config));
});
test("CLI ships the exact typography template used by the website",()=>{
  assert.equal(ONYX_TYPOGRAPHY_CSS,readFileSync(new URL("../../@ui/src/typography.css",import.meta.url),"utf8"));
});
test("actual CLI option merge honors explicit false, font, mode, framework, paths and theme",()=>{
  const config={...defaultInitConfig(),customFont:true,themeToggle:true};
  const explicit={font:"geist",typography:false,customFont:false,themeToggle:false,colorMode:"system",framework:"vite",theme:"none",stylesheet:"src/custom.css",themeTarget:"src/tokens.css",nextLayout:"none",viteHtml:"none",dryRun:true} as const;
  const merged=mergeInitConfigOptions(explicit,config);
  for(const key of Object.keys(explicit) as (keyof typeof explicit)[]) assert.equal(merged[key],explicit[key]);
  assert.equal(mergeInitConfigOptions({font:"karla"},{...config,customFont:false}).customFont,true);
  assert.equal(mergeInitConfigOptions({},config).colorMode,"dark");
  assert.throws(()=>mergeInitConfigOptions({},defaultInitConfig("astro")),/Astro/);
  assert.equal(mergeInitConfigOptions({framework:"vite"},defaultInitConfig("astro")).framework,"vite");
});
test("decoded source produces exact shared files, imports, dependencies and optional features",async()=>{
  const root=mkdtempSync(join(tmpdir(),"ui-lab-v2-"));
  try {
    writeFileSync(join(root,"site.css"),'@import "tailwindcss";\n');
    for(let mask=0;mask<8;mask++) {
      const config={...defaultInitConfig("vite"),longFormTypography:!!(mask&1),customFont:!!(mask&2),themeToggle:!!(mask&4),font:"manrope" as const};
      config.typography.bodyScale=.86;config.typography.monoLetterSpacingScale=1.75;
      const decoded=await decodeInitConfig(await encodeInitConfig(config));assert.equal(decoded.version,2);if(decoded.version!==2) throw Error("v2 expected");
      const options=mergeInitConfigOptions({},decoded);
      const plan=buildInitPlan({root,stylesheet:"site.css",typography:options.typography!,colorMode:options.colorMode!,font:options.font,customFont:options.customFont,themeToggle:options.themeToggle,sourceConfig:decoded});
      const expected=generateInitFiles(config,ONYX_TYPOGRAPHY_CSS);
      const file=(path:string)=>plan.writes.find(write=>write.path===path)?.content;
      assert.equal(file("theme.css"),expected.themeCss);
      assert.ok(file("site.css")!.includes(expected.globalsCss));
      assert.equal(file("typography.css"),expected.typographyCss);
      assert.equal(file("site.css")!.includes('@import "./typography.css"'),config.longFormTypography);
      assert.equal(file("site.css")!.includes('@import "./fonts.css"'),config.customFont);
      assert.equal(!!file("fonts.css"),config.customFont);
      assert.equal(plan.packages.includes("@fontsource-variable/manrope"),config.customFont);
      assert.equal(plan.packages.includes("@fontsource-variable/jetbrains-mono"),config.customFont);
      assert.equal(!!file("components/theme-toggle.tsx"),config.themeToggle);
      if(config.customFont) assert.match(file("fonts.css")!,/Manrope/);
      if(config.longFormTypography) assert.match(file("typography.css")!,/^@layer theme \{\n  :root \{/);
    }
    const invalid=defaultInitConfig();invalid.typography.bodyScale=2;
    assert.throws(()=>buildInitPlan({root,stylesheet:"missing.css",typography:true,colorMode:"dark",sourceConfig:invalid}),/bodyScale/);
  } finally { rmSync(root,{recursive:true,force:true}); }
});
