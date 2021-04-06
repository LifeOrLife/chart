export function startAni(fn: (i?: number) => void): void | number {
	// if (window.requestAnimationFrame) {
	// 	return window.requestAnimationFrame(fn);
	// }
	return setTimeout(fn, 200);
}

export function endAni(id: number): void {
	// if (window.cancelAnimationFrame) {
	// 	window.cancelAnimationFrame(id);
	// }
	clearTimeout(id);
}
