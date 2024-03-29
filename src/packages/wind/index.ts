/**
 * https://blog.csdn.net/axiwang88/article/details/105021078
 */

/**
 * 绘制动态风场效果
 *
 */
import { opt } from '../map/index';
import { getStyle } from '../../utils/getStyle';
import types from '../../utils/types';

const params: Record<string, string | number | null | undefined | HTMLElement | Element | CanvasRenderingContext2D> = {}
export function renderWind(options: opt) {
	let el = options.el;
	if (types.isString(el)) {
		el = document.querySelector<HTMLElement>(el as string);
	}
	const style = getStyle(el as HTMLElement);
	const { width, height } = style;
	params.width = parseInt(width, 10);
	params.height = parseInt(height, 10);
	params.el = el;
	params.padding = options.padding || 50;
	initCanvas();
}

function initCanvas() {
	const ratio = window.devicePixelRatio || 1;
	const canvas = document.createElement('canvas');
	const el = params.el as HTMLElement;
	const width = params.width as number;
	const height = params.height as number;
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';
	canvas.width = width * ratio;
	canvas.height = height * ratio;
	const ctx = canvas.getContext('2d');
	ctx.scale(ratio, ratio);
	params.ratio = ratio;
	params.canvas = canvas;
	params.ctx = ctx;
	el.appendChild(canvas);
}

/**
 * 开始绘制风
 */
type points = Array<{
	x: number;
	y: number;
	vx: number; // x方向移动的速度
	vy: number; // y方向移动的速度
	color: string;
}>;
export function startDrawWind(points: points) {
	const ctx = params.ctx as unknown as CanvasRenderingContext2D;
	const width = params.width as number;
	const height = params.height as number;
	ctx.beginPath();
	ctx.fillStyle = 'rgba(0, 0, 0, .1)'; // rgba a 控制流线拖曳长度
	ctx.fillRect(0, 0, width, height);
	points.forEach((p) => {
		ctx.save();
		ctx.lineWidth = 2; // 线的宽度
		const h = 1;
		ctx.lineCap = 'round';
		ctx.moveTo(p.x, p.y);
		const x = p.x + p.vx;
		const y = p.y + p.vy;
		ctx.lineTo(x + h, y);
		p.x = x;
		p.y = y;
		ctx.strokeStyle = p.color;
		ctx.stroke();
		ctx.restore();
		if (p.x >= width || p.y >= height) {
			p.x = randomVal(100, 0, true);
			p.y = randomVal(400, 0, true);
			p.vx = randomVal(1, 0.5);
			p.vy = Math.random() * (Math.random() > 0.5 ? 1 : -1);
		}
	});
	requestAnimationFrame(() => {
		startDrawWind(points);
	});
}

export function randomVal(max: number, min: number, isInteger?: boolean): number {
	const v = Math.random() * (max - min) + min;
	if (isInteger) {
		return Math.floor(v);
	}
	return v;
}
