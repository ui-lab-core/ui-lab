import * as React from "react";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Icon } from "./Icon";
import { IconProvider } from "./IconProvider";

it("lets an explicit asset-url override the provider resolver and inherit slot sizing", () => {
  render(<IconProvider default-variant="stroke" resolve-source={() => "/wrong.svg"}><Icon id="plus" label="Add" asset-url="/custom" /><Icon id="check" label="Done" size={32} /></IconProvider>);
  const icon = screen.getByRole("img", { name: "Add" });
  expect(icon.style.maskImage).toContain("/custom/stroke/plus.svg");
  expect(icon.style.width).toBe("var(--icon-size, 20px)");
  expect(screen.getByRole("img", { name: "Done" }).style.width).toBe("32px");
});
