import { useEffect, type RefObject } from "react"

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  onOutsideClick: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node

      const clickedInside = refs.some((ref) => ref.current?.contains(target))
      if (!clickedInside) onOutsideClick()
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [refs, onOutsideClick, enabled])
}
