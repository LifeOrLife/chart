import { domType } from './type';

export function getStyle(el: domType): CSSStyleDeclaration | null {
	if (window.getComputedStyle) {
		return window.getComputedStyle(el as Element, null);
	}
	return null;
}
