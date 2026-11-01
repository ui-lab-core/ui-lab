import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "..";

describe("Select state contract", () => {
  it("keeps null as an explicit empty value with the documented precedence", () => {
    const field = (value: string | null, stateValue?: string | null) => <Select value={value} selectedKey="one" state={stateValue !== undefined ? { value: stateValue } : undefined}><Select.Trigger aria-label="Mode"><Select.Value placeholder="Choose" /></Select.Trigger><Select.Content><Select.Item value="one">One</Select.Item></Select.Content></Select>;
    const { rerender } = render(field("one"));
    expect(screen.getByRole("button", { name: "Mode" })).toHaveTextContent("One");
    rerender(field(null));
    expect(screen.getByRole("button", { name: "Mode" })).toHaveTextContent("Choose");
    rerender(field("one", null));
    expect(screen.getByRole("button", { name: "Mode" })).toHaveTextContent("Choose");
  });
});
