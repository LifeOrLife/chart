import { domType } from './type'

export function getStyle(el: domType): CSSStyleDeclaration | null {
  if (window.getComputedStyle && el) {
    return window.getComputedStyle(el as Element, null)
  }
  return null
}
