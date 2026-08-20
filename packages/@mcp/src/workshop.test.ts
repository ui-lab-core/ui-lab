import assert from "node:assert/strict";
import test from "node:test";
import { getWorkshopItem } from "./adapters/workshop-adapter.js";
test("standard components return a package install intent instead of source", () => { const item = getWorkshopItem("button"); assert.equal((item?.installIntent as { access?: string }).access, "package"); assert.equal("files" in (item ?? {}), false); });
