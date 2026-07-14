import * as React from "react"

export function infer(type: "text", node: React.ReactNode): boolean
export function infer(type: "text", node: React.ReactNode): boolean {
  switch (type) {
    case "text":
      return infer_text(node)
  }
}

function infer_text(node: React.ReactNode): boolean {
  const pending: React.ReactNode[] = [node]
  let found = false

  while (pending.length > 0) {
    const current = pending.pop()

    switch (typeof current) {
      case "undefined":
      case "boolean":
        continue
      case "string":
        found = current.length > 0 ? true : found
        continue
      case "number":
      case "bigint":
        found = true
        continue
      case "object": {
        switch (true) {
          case current === null:
            continue
          case Array.isArray(current):
            pending.push(...current)
            continue
          case React.isValidElement<{ children?: React.ReactNode }>(current) && current.type === React.Fragment:
            pending.push(current.props.children)
            continue
          default:
            return false
        }
      }
      default:
        return false
    }
  }

  return found
}
