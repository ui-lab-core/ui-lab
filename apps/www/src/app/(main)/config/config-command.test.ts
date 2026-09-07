import assert from "node:assert/strict";
import test from "node:test";
import { createInitCommand } from "./config-command";
import { defaultInitConfig, decodeInitConfig, validateInitConfig, generationColors, generateInitFiles, generateTypographyFile } from "ui-lab-registry/init-config";
import { generateThemeSetupFiles } from "../../../features/theme/config/theme/generator";

test("website produces a deterministic offline v2 command for each supported framework",async()=>{
  for(const framework of ["next","vite"] as const) {
    const config={...defaultInitConfig(framework),customFont:true,font:"geist" as const,themeToggle:true};
    const command=await createInitCommand(config);
    assert.match(command,/^npx ui-lab-cli init --config v2_[A-Za-z0-9_-]+_[0-9a-f]{8}$/);
    assert.equal(command,await createInitCommand(config));
    assert.deepEqual(await decodeInitConfig(command.split(" ").at(-1)!),validateInitConfig(config));
    assert.ok(command.length<100);
  }
});
test("website setup output equals CLI-facing generation after command decoding",async()=>{
  const config=defaultInitConfig("next","light");
  config.colors.accent.h=276.4;
  config.colors.semantic!.success.light.color.h=120+40/6;
  config.typography.headerScale=.63;config.typography.bodyMinFontSizePx=14.35;
  const before=generateThemeSetupFiles(generationColors(config.colors),config.themeMode,config.typography,config.layout);
  const command=await createInitCommand(config), decoded=await decodeInitConfig(command.split(" ").at(-1)!);
  assert.equal(decoded.version,2);if(decoded.version!==2) throw Error("v2 expected");
  const after=generateInitFiles(decoded,"/* shared static typography */");
  assert.equal(after.themeCss,before.themeCss);
  assert.ok(before.globalsCss.endsWith(after.globalsCss));
  assert.equal(after.typographyCss,generateTypographyFile(config.typography,"/* shared static typography */"));
});
