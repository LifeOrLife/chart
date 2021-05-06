/**
 * 瞳孔中的暗杀者
 * 游乐园倒计时动画
 */
import { getStyle } from '../../utils/getStyle';

interface canvasInfo {
	[key: string]: string | number | CanvasRenderingContext2D;
}

function initCanvas(
	canvas: HTMLCanvasElement,
	width: number,
	height: number
): canvasInfo {
	const obj: canvasInfo = {};
	const w = width;
	const h = height;
	obj.ctx = canvas.getContext('2d');
	obj.width = w;
	obj.height = h;
	const context = obj.ctx as CanvasRenderingContext2D;
	// 根据设备像素比优化canvas绘图
	const devicePixelRatio = window.devicePixelRatio;
	canvas.style.width = `${w}px`;
	canvas.style.height = `${h}px`;
	if (devicePixelRatio) {
		canvas.height = h * devicePixelRatio;
		canvas.width = w * devicePixelRatio;
		context.scale(devicePixelRatio, devicePixelRatio);
	} else {
		canvas.width = w;
		canvas.height = h;
	}
	return obj;
}

/**
 * 最后1分钟倒计时
 */
export class oneMinutes {
	el: HTMLElement;
	ctx?: CanvasRenderingContext2D;
	width?: number;
	height?: number;
	pointers?: number[];
	index = 0;
	timer = 0;
	constructor(el: HTMLElement) {
		this.el = el;
		this.init();
	}
	init() {
		let _can;
		const el = this.el;
		if (el instanceof HTMLCanvasElement) {
			_can = el;
		} else {
			_can = document.createElement('canvas');
		}
		const style = getStyle(el);
		const { width, height } = style;
		const w = parseInt(width);
		const h = parseInt(height);
		const info = initCanvas(_can, w, h);
		this.ctx = info.ctx as CanvasRenderingContext2D;
		this.width = info.width as number;
		this.height = info.height as number;
	}
	generatePointer() {
		const pointers: number[] = Array.from(' '.repeat(60), (item, index) => {
			return (index * 6 * Math.PI * 2) / 360;
		});
		this.pointers = pointers;
	}
	drawLine() {
		const pointers = this.pointers;
		this.renderLine(pointers);
	}
	renderLine(pointers: number[], color = '#000') {
		const ctx = this.ctx;
		const x = this.width / 2;
		const y = this.height / 2;
		const w = 2;
		const h = 20;
		pointers.forEach((p) => {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(p);
			ctx.beginPath();
			ctx.lineWidth = w;
			ctx.strokeStyle = color;
			ctx.moveTo(x - x, y - y - 50);
			ctx.lineTo(x - x, y - h - y - 150);
			ctx.stroke();
			ctx.restore();
		});
	}
	startPlay() {
		this.timer = setInterval(() => {
			this.index++;
			const pointers = this.pointers.slice(this.index);
			this.clear();
			this.renderLine(pointers, this.getColor());
			if (this.index >= 60) {
				clearInterval(this.timer);
			}
		}, 1000);
	}
	getColor(): string {
		return '#' + Math.random().toString(16).slice(2, 8);
	}
	clear() {
		const ctx = this.ctx;
		const w = this.width;
		const h = this.height;
		ctx.clearRect(0, 0, w, h);
	}
}
