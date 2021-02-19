/**
 * 判断一个点是否包含在线上
 * @param {object} prev
 * @param {object} next
 * @param {number} x
 * @param {number} y
 * @param {number} lineWidth
 * @param {return} boolean
 */

type point = {
	x: number;
	y: number;
};

export function isInLine(
	prev: point,
	next: point,
	x: number,
	y: number,
	lineWidth: number
): boolean {
	if (lineWidth === 0) {
		return false;
	}
	if (
		(x < prev.x - lineWidth && x < next.x - lineWidth) ||
		(x > prev.x + lineWidth && x > next.x + lineWidth) ||
		(y < prev.y - lineWidth && y < next.y - lineWidth) ||
		(y > prev.y + lineWidth && y > next.y + lineWidth)
	) {
		return false;
	}
	if (prev.x === next.x) {
		return Math.abs(prev.y - next.y) <= lineWidth / 2;
	}
	// 此时，比较斜率
	let max, min;
	if (prev.y >= next.y) {
		max = prev.y;
		min = next.y;
	} else {
		max = next.y;
		min = prev.y;
	}
	const one = (max - min) / (next.x - prev.x);
	const two = (max - y) / (prev.y >= next.y ? x - prev.x : next.x - x);
	const v = Math.abs(one - two);
	return Math.abs(one - two) <= 0.04;
}
