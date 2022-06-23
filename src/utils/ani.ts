export function startAni(fn: (i?: number) => void): Timer {
  // if (window.requestAnimationFrame) {
  // 	return window.requestAnimationFrame(fn);
  // }
  return setTimeout(fn, 200)
}

export function endAni(id: Timer) {
  // if (window.cancelAnimationFrame) {
  // 	window.cancelAnimationFrame(id);
  // }
  clearTimeout(id)
}

export type Timer = ReturnType<typeof setTimeout>
