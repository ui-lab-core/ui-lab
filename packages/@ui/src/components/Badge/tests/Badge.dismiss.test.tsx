import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { Badge } from "../Badge";

it("gives each dismissible badge a distinct accessible control name", async () => {
  const dismiss = vi.fn();
  render(<><Badge dismissible dismissLabel="Remove draft" onDismiss={dismiss}>Draft</Badge><Badge dismissible dismissLabel="Remove published">Published</Badge></>);
  await userEvent.setup().click(screen.getByRole("button", { name: "Remove draft" }));
  expect(dismiss).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Remove published" })).toBeInTheDocument();
});
