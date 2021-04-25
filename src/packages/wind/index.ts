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

const params: {
	[key: string]:
		| string
		| number
		| null
		| undefined
		| HTMLElement
		| Element
		| CanvasRenderingContext2D;
} = {};
export function renderWind(options: opt): void {
	let el = options.el;
	if (types.isString(el)) {
		el = document.querySelector(el as string);
	}
	const style = getStyle(el as HTMLElement);
	const { width, height } = style;
	params.width = parseInt(width);
	params.height = parseInt(height);
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
	width: number;
	height: number;
}>;
export function startDrawWind(points: points): void {
	const ctx = (params.ctx as unknown) as CanvasRenderingContext2D;
	const width = params.width as number;
	const height = params.height as number;
	ctx.beginPath();
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = 'rgba(0, 0, 0, .3)';
	points.forEach((p) => {
		ctx.save();
		ctx.lineWidth = p.width || 2;
		ctx.moveTo(p.x, p.y);
		ctx.lineTo(p.x + 10, p.y);
		ctx.strokeStyle = p.color;
		ctx.stroke();
		ctx.restore();
		p.x += p.vx;
	});
	requestAnimationFrame(() => {
		startDrawWind(points);
	});
}
