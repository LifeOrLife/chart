import { getStyle } from '../utils/getStyle';
import { isInLine } from '../utils/contain/line';

interface params {
	[key: string]: string | HTMLElement | number;
}
interface options {
	x: Array<string | number>;
	y: Array<string | number>;
	type: string;
	lineWidth?: number;
}
type dots = Array<{ x: number; y: number; r: number; w?: number; h?: number }>;

export default class CreateChart {
	container: HTMLElement;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	points?: dots;
	options?: options;
	barW?: number; // 柱状图初始化计算出来的宽度
	lineWidth = 1;
	colors: Array<string> = [
		'#5470c6',
		'#91cc75',
		'#fac858',
		'#ee6666',
		'#73c0de'
	];
	moveHandle: (e: Event) => void;
	constructor(options: params) {
		const el = document.querySelector(options.el as string) as HTMLElement;
		if (!el) {
			return;
		}
		this.container = el;
		const style = getStyle(el);
		if (!style) {
			console.log(
				'%c不画了',
				'color: #6cf; font-size: 20px; font-style: italic;'
			);
			return;
		}
		const width = parseInt(style.width);
		const height = parseInt(style.height);
		const ratio = window.devicePixelRatio;
		const w = ratio * width,
			h = ratio * height;
		const canvas = document.createElement('canvas');
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext('2d');
		ctx.scale(ratio, ratio);
		this.container.appendChild(canvas);
		this.canvas = canvas;
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.moveHandle = (e: Event) => {
			const ev = e as WheelEvent;
			const x = ev.offsetX;
			const y = ev.offsetY;
			this.startJudge(x, y);
		};
	}
	renderOptions(option: options): void {
		this.lineWidth = option.lineWidth || 1;
		this.calculatePoint(option);
		this.options = option;
	}
	calculatePoint(option: options): void {
		if (!this.container) {
			console.log('....');
			return;
		}
		const len = option.x.length;
		const avg = Math.floor(this.width / len);
		const point: dots = [];
		const values = option.y.map((v) => +v);
		const interv = 5;
		let max = Math.max(...values);
		let min = Math.min(...values);
		const one = Math.floor((max - min) / interv);
		min = min - one;
		max = max + one;
		for (let i = 0; i < len; i++) {
			const x = avg * (i + 1 - 0.5);
			const y =
				this.height -
				Number(((values[i] - min) / (max - min)) * this.height);
			point.push({
				x: x,
				y: y,
				r: 4
			});
		}
		this.points = point;
		this.addEvent();
		if (option.type === 'line') {
			this.renderLine();
		}
		if (option.type === 'bar') {
			this.calculateBar();
			this.startRenderBar();
		}
		if (option.type === 'pie') {
			this.renderPie(option);
		}
	}
	addEvent(): void {
		this.canvas.addEventListener('mousemove', this.moveHandle);
	}
	rmoveEvent(): void {
		this.canvas.removeEventListener('mousemove', this.moveHandle);
	}
	startJudge(x: number, y: number): void {
		const type = this.options.type;
		if (type === 'line') {
			this.judgeThePosLine(x, y);
		}
		if (type === 'bar') {
			this.judgeThePosBar(x, y);
		}
	}
	judgeThePosLine(x: number, y: number): void {
		let _x, _y, dis, index;
		const len = this.points.length;
		let isIn = false;
		for (let i = 0; i < len; i++) {
			_x = Math.abs(x - this.points[i].x);
			_y = Math.abs(y - this.points[i].y);
			dis = Math.sqrt(_x * _x + _y * _y);
			if (dis <= this.points[i].r) {
				isIn = true;
				index = i;
				break;
			}
			isIn = false;
		}
		if (isIn) {
			this.pointScale(isIn, index);
		} else {
			this.pointScale(isIn);
			this.judgeTheLine(x, y);
		}
	}
	// 判断鼠标是否移动到了线上
	judgeTheLine(x: number, y: number): void {
		const point = this.points;
		let inLine = false;
		for (let i = 0; i < point.length - 1; i++) {
			if (this.isInTheLine(x, y, i)) {
				inLine = true;
				break;
			}
		}
		if (inLine) {
			this.renderLine(this.lineWidth + 2);
		} else {
			this.renderLine(this.lineWidth);
		}
		this.canvas.style.cursor = inLine ? 'pointer' : 'default';
	}
	isInTheLine(x: number, y: number, index: number): boolean {
		const pre = this.points[index];
		const next = this.points[index + 1];
		/**
		 * 在线段上的点，必定在以两点组成的线段为对角线的矩形内，同时，斜率与该线段的斜率相同
		 * 计算出来的斜率和线段斜率可能不完全一致，允许保留一定的误差范围~~~
		 */
		if (pre && next) {
			return isInLine(pre, next, x, y, this.ctx.lineWidth);
		}
		return false;
	}

	// 数据点放大/还原
	pointScale(isIn: boolean, index?: number): void {
		this.canvas.style.cursor = isIn ? 'pointer' : 'default';
		this.points.forEach((p, i) => {
			p.r = 4;
			if (isIn && index === i) {
				p.r = 5;
			}
		});
		this.clearRect();
		this.renderLine();
	}

	clearRect(): void {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
	renderLine(w?: number): void {
		if (!w) {
			w = 1;
		}
		const ctx = this.ctx;
		const point = this.points;
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = w;
		ctx.strokeStyle = '#6cf';
		point.map((p, i) => {
			if (i === 0) {
				ctx.moveTo(p.x, p.y);
			} else {
				ctx.lineTo(p.x, p.y);
			}
		});
		ctx.stroke();
		ctx.restore();
		ctx.closePath();

		point.forEach((p) => {
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = 'aqua';
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();
		});
	}
	judgeThePosBar(x: number, y: number): void {
		let isIn = false,
			index;
		const point = this.points;
		for (let i = 0; i < point.length; i++) {
			const p = point[i];
			// 此时绘制的柱状图，从canvas底部开始绘制，所以暂时只判断状态图的头部
			if (x >= p.x - p.w / 2 && x <= p.x + p.w / 2 && y >= p.y) {
				isIn = true;
				index = i;
				break;
			}
		}
		if (isIn) {
			this.barScale(isIn, index);
		} else {
			this.barScale(isIn);
		}
	}

	calculateBar(): void {
		const point = this.points;
		let w = point[1].x - point[0].x;
		w = w * 0.6;
		if (w <= 20) {
			w = 20;
		}
		if (w >= 50) {
			w = 50;
		}
		point.forEach((p) => {
			p.w = w;
			p.h = this.height - p.y;
		});
		this.barW = w;
	}
	barScale(isIn: boolean, index?: number): void {
		this.canvas.style.cursor = isIn ? 'pointer' : 'default';
		const point = this.points;
		point.forEach((p, i) => {
			p.w = this.barW;
			if (isIn && i === index) {
				p.w = this.barW + 5;
			}
		});
		this.clearRect();
		this.startRenderBar();
	}
	startRenderBar(): void {
		const point = this.points;
		const ctx = this.ctx;
		ctx.save();
		ctx.fillStyle = 'aqua';
		point.forEach((p) => {
			ctx.fillRect(p.x - p.w / 2, p.y, p.w, p.h);
			ctx.fill();
		});
		ctx.restore();
	}

	renderPie(option: options): void {
		const sum = option.y.reduce(
			(t, n) => Number(t) + Number(n),
			0
		) as number;
		const per = option.y.map((v) => {
			v = Number(v);
			return Math.floor((v / sum) * 100);
		});
		per[0] += 100 - per.reduce((v, n) => v + n, 0);
		const x = this.width / 2;
		const y = this.height / 2;
		const r = Math.min(this.width, this.height) / 2 - 80;
		per.forEach((p, index) => {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.fillStyle = this.getColor(index);
			const { start, end } = this.calcRadian(per, index);
			this.ctx.arc(x, y, r, start, end);
			this.ctx.lineTo(x, y);
			this.ctx.fill();
			this.ctx.closePath();
			this.ctx.restore();
		});
	}
	/**
	 * 根据下标计算弧度值
	 */
	calcRadian(
		y: Array<number>,
		index: number
	): { start: number; end: number } {
		let start = 0;
		const sum = y.reduce((v, n) => v + n, 0);
		let _sum = 0;
		const all = Math.PI * 2;
		for (let i = 0; i < index; i++) {
			_sum += y[i];
		}
		if (_sum) {
			start = (_sum / sum) * all;
		}
		const end = ((_sum + y[index]) / sum) * all;

		return {
			start,
			end
		};
	}

	getColor(index: number): string {
		if (index && this.colors[index]) {
			return this.colors[index];
		}
		return '#' + Math.random().toString(16).slice(2, 8);
	}
}
