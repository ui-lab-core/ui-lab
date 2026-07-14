import * as React from "react"
import { createPortal } from "react-dom"
import { describe, expect, it } from "vitest"
import { infer } from "../infer"

describe("infer", () => {
  it("detects renderable text primitives", () => {
    expect(infer("text", "Label")).toBe(true)
    expect(infer("text", 0)).toBe(true)
    expect(infer("text", BigInt(1))).toBe(true)
  })

  it("detects text nested in arrays and fragments", () => {
    const content = (
      <>
        {null}
        {false}
        {["All ", <>environments</>]}
      </>
    )

    expect(infer("text", content)).toBe(true)
  })

  it("does not classify empty content as text", () => {
    expect(infer("text", undefined)).toBe(false)
    expect(infer("text", null)).toBe(false)
    expect(infer("text", false)).toBe(false)
    expect(infer("text", "")).toBe(false)
    expect(infer("text", [null, false, ""])).toBe(false)
    expect(infer("text", <></>)).toBe(false)
  })

  it("does not inspect elements or components", () => {
    const Label = ({ children }: React.PropsWithChildren) => <span>{children}</span>

    expect(infer("text", <span>Label</span>)).toBe(false)
    expect(infer("text", <Label>Label</Label>)).toBe(false)
  })

  it("does not consume unsupported content types", () => {
    const portal = createPortal("Label", document.createElement("div"))
    const promise = Promise.resolve("Label") as unknown as React.ReactNode
    const iterable = new Set<React.ReactNode>(["Label"]) as unknown as React.ReactNode

    expect(infer("text", portal)).toBe(false)
    expect(infer("text", promise)).toBe(false)
    expect(infer("text", iterable)).toBe(false)
  })
})
