import * as React from "react"
import { act } from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Select } from ".."
import styles from "../Select.module.css"

afterEach(cleanup)

describe("Select.Trigger content", () => {
  it("wraps direct text in the truncation slot", () => {
    const { container } = render(
      <Select>
        <Select.Trigger>All environments</Select.Trigger>
      </Select>
    )

    const text = container.querySelector(`.${styles.text}`)

    expect(text).toHaveTextContent("All environments")
    expect(text?.parentElement).toHaveClass(styles["value-section"])
  })

  it("wraps text-only arrays and fragments", () => {
    const { container } = render(
      <Select>
        <Select.Trigger>
          <>{["All ", "branches"]}</>
        </Select.Trigger>
      </Select>
    )

    expect(container.querySelector(`.${styles.text}`)).toHaveTextContent("All branches")
  })

  it("preserves rich content without adding the text slot", () => {
    const { container } = render(
      <Select>
        <Select.Trigger>
          <strong data-label="true">All environments</strong>
        </Select.Trigger>
      </Select>
    )

    const label = container.querySelector("[data-label='true']")

    expect(label).toBeInTheDocument()
    expect(label?.parentElement).toHaveClass(styles["value-section"])
    expect(container.querySelector(`.${styles.text}`)).toBeNull()
  })

  it("leaves the value section empty when content does not render", () => {
    const { container } = render(
      <Select>
        <Select.Trigger>{false}</Select.Trigger>
      </Select>
    )

    const value = container.querySelector(`.${styles["value-section"]}`)

    expect(value).toBeEmptyDOMElement()
  })

  it("renders and hydrates inferred text with the same structure", async () => {
    const element = (
      <Select>
        <Select.Trigger>All environments</Select.Trigger>
      </Select>
    )
    const html = renderToString(element)
    const container = document.createElement("div")
    const on_recoverable_error = vi.fn()
    container.innerHTML = html

    expect(container.querySelector(`.${styles.text}`)).toHaveTextContent("All environments")

    const root = hydrateRoot(container, element, { onRecoverableError: on_recoverable_error })

    await act(async () => {})

    expect(on_recoverable_error).not.toHaveBeenCalled()
    expect(container.querySelector(`.${styles.text}`)).toHaveTextContent("All environments")

    await act(async () => root.unmount())
  })
})
