import { getStyle } from '../utils/getStyle';

interface params {
	[key: string]: string | HTMLElement | number;
}
interface options {
	x: Array<string | number>;
	y: Array<string | number>;
	type: string;
}
type dots = Array<{ x: number; y: number; r: number }>;

export default class CreateChart {
	container: HTMLElement;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	points?: dots;
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
			this.judgeThePos(x, y);
		};
	}
	renderOptions(option: options): void {
		this.calculatePoint(option);
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
				r: 5
			});
		}
		this.points = point;
		this.addEvent();
		if (option.type === 'line') {
			this.renderLine();
		}
		if (option.type === 'bar') {
			this.renderBar();
		}
	}
	addEvent(): void {
		this.canvas.addEventListener('mousemove', this.moveHandle);
	}
	rmoveEvent(): void {
		this.canvas.removeEventListener('mousemove', this.moveHandle);
	}
	judgeThePos(x: number, y: number): void {
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
		}
	}
	// 数据点放大/还原
	pointScale(isIn: boolean, index?: number): void {
		this.canvas.style.cursor = isIn ? 'pointer' : 'default';
		this.points.forEach((p, i) => {
			p.r = 5;
			if (isIn && index === i) {
				p.r = 7;
			}
		});
		this.clearRect();
		this.renderLine();
	}

	clearRect(): void {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
	renderLine(): void {
		const ctx = this.ctx;
		const point = this.points;
		ctx.beginPath();
		ctx.strokeStyle = '#6cf';
		point.map((p, i) => {
			if (i === 0) {
				ctx.moveTo(p.x, p.y);
			} else {
				ctx.lineTo(p.x, p.y);
			}
		});
		ctx.stroke();
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
	renderBar() {
		const ctx = this.ctx;
		const point = this.points;
		let w = point[1].x - point[0].x;
		w = w * 0.6;
		if (w <= 20) {
			w = 20;
		}
		if (w >= 50) {
			w = 50;
		}
		ctx.save();
		ctx.fillStyle = 'aqua';
		point.forEach((p) => {
			ctx.fillRect(p.x - w / w, p.y, w, this.height - p.y);
			ctx.fill();
		});
		ctx.restore();
	}
}
