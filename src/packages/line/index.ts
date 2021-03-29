import CreateChart from '../../init/create';
import { isInLine } from '../../utils/contain/line';

let _obj;
export default function renderLine(render: CreateChart, w?: number): void {
	if (!w) {
		w = 1;
	}
	_obj = render;
	const ctx = render.ctx;
	const point = render.points;
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

export function judgeThePosLine(x: number, y: number): void {
	let _x, _y, dis, index;
	const len = _obj.points.length;
	let isIn = false;
	for (let i = 0; i < len; i++) {
		_x = Math.abs(x - _obj.points[i].x);
		_y = Math.abs(y - _obj.points[i].y);
		dis = Math.sqrt(_x * _x + _y * _y);
		if (dis <= _obj.points[i].r) {
			isIn = true;
			index = i;
			break;
		}
		isIn = false;
	}
	if (isIn) {
		pointScale(isIn, index);
	} else {
		pointScale(isIn);
		judgeTheLine(x, y);
	}
}
// 数据点放大/还原
function pointScale(isIn: boolean, index?: number): void {
	_obj.canvas.style.cursor = isIn ? 'pointer' : 'default';
	_obj.points.forEach((p, i) => {
		p.r = 4;
		if (isIn && index === i) {
			p.r = 5;
		}
	});
	_obj.clearRect();
	renderLine(_obj);
}
// 判断鼠标是否移动到了线上

function judgeTheLine(x: number, y: number): void {
	const point = _obj.points;
	let inLine = false;
	for (let i = 0; i < point.length - 1; i++) {
		if (isInTheLine(x, y, i)) {
			inLine = true;
			break;
		}
	}
	if (inLine) {
		renderLine(_obj, _obj.lineWidth + 2);
	} else {
		renderLine(_obj, _obj.lineWidth);
	}
	_obj.canvas.style.cursor = inLine ? 'pointer' : 'default';
}

function isInTheLine(x: number, y: number, index: number): boolean {
	const pre = _obj.points[index];
	const next = _obj.points[index + 1];
	/**
	 * 在线段上的点，必定在以两点组成的线段为对角线的矩形内，同时，斜率与该线段的斜率相同
	 * 计算出来的斜率和线段斜率可能不完全一致，允许保留一定的误差范围~~~
	 */
	if (pre && next) {
		return isInLine(pre, next, x, y, _obj.ctx.lineWidth);
	}
	return false;
}
