let openSelectId: string | null = null
const callbacks = new Map<string, (isOpen: boolean) => void>()

export function registerSelectCloseCallback(id: string, callback: (isOpen: boolean) => void) {
  callbacks.set(id, callback)
}

export function unregisterSelectCloseCallback(id: string) {
  callbacks.delete(id)
}

export function closeOtherSelects(currentSelectId: string) {
  if (openSelectId && openSelectId !== currentSelectId) {
    const idToClose = openSelectId
    Promise.resolve().then(() => {
      callbacks.get(idToClose)?.(true)
    })
  }
  openSelectId = currentSelectId
}

export function clearSelectRegistry(selectId: string) {
  if (openSelectId === selectId) {
    openSelectId = null
  }
}
