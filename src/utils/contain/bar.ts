/**
 * 判断一个点是否在柱状图上
 * @param {object} bar
 * @param {number} bar.x
 * @param {number} bar.w
 * @param {number} bar.y
 * 此时柱状图由canvas底部开始绘制
 * @param {number} x
 * @param {number} y
 * @param {return} boolean
 *
 */

type bar = {
	x: number;
	y: number;
	r: number;
	w?: number;
	h?: number;
};

export function isInBar(bar: bar, x: number, y: number): boolean {
	return x >= bar.x - bar.w / 2 && x <= bar.x + bar.w / 2 && y >= bar.y;
}
