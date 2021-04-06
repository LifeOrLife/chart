import CreateChart from '../../init/create';
import { isInLine } from '../../utils/contain/line';
import { startAni, endAni } from '../../utils/ani';

type points = Array<{ x: number; y: number }>;

let _obj;
export default function renderLine(render: CreateChart, w?: number): void {
	if (!w) {
		w = 1;
	}
	_obj = render;
	drawStraight(_obj.points, w);
	// 绘制贝塞尔曲线
	bezierCurve(_obj.points, w);
	drawCircle();

	dynamicDraw();
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

// 绘制数据点圆形
function drawCircle(style = '#6cf'): void {
	const { ctx, points } = _obj;
	points.forEach((p) => {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = style;
		ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
		ctx.stroke();
		ctx.restore();
	});
}

// 绘制普通直线折线
function drawStraight(points: points, w = 1, style = 'aqua'): void {
	const { ctx } = _obj;
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = w;
	ctx.strokeStyle = style;
	points.map((p, i) => {
		if (i === 0) {
			ctx.moveTo(p.x, p.y);
		} else {
			ctx.lineTo(p.x, p.y);
		}
	});
	ctx.stroke();
	ctx.restore();
	ctx.closePath();
}

// 绘制贝塞尔曲线
function bezierCurve(points: points, w = 1): void {
	const { ctx } = _obj;
	ctx.save();
	ctx.lineWidth = w;
	ctx.beginPath();
	ctx.strokeStyle = '#6cf';
	points.forEach((item, index) => {
		const scale = 0.1;
		// 前一个点坐标
		let nextX, nextY;
		let cAx, cAy, cBx, cBy;
		const nowX = item.x;
		const nowY = item.y;
		if (index === 0) {
			ctx.moveTo(nowX, nowY);
			return;
		}
		const last1X = points[index - 1].x;
		const last1Y = points[index - 1].y;
		if (index !== points.length - 1) {
			nextX = points[index + 1].x;
			nextY = points[index + 1].y;
			cBx = nowX - (nextX - last1X) * scale;
			cBy = nowY - (nextY - last1Y) * scale;
		}
		if (index === 1) {
			cAx = last1X + nowX * scale;
			if (last1Y > nowY) {
				cAy = last1Y - nowY * scale;
			} else {
				cAy = last1Y + nowX * scale;
			}
			ctx.bezierCurveTo(cAx, cAy, cBx, cBy, nowX, nowY);
			return;
		}
		const last2X = points[index - 2].x;
		const last2Y = points[index - 2].y;
		cAx = last1X + (nowX - last2X) * scale;
		cAy = last1Y + (nowY - last2Y) * scale;
		if (index === points.length - 1) {
			cBx = nowX - (nowX - last1X) * scale;
			cBy = nowY - (nowY - last1Y) * scale;
		}
		ctx.bezierCurveTo(cAx, cAy, cBx, cBy, nowX, nowY);
	});
	ctx.stroke();
	ctx.restore();
}

// 动态绘制曲线
let a_id,
	p_i = 0;
function dynamicDraw(): void {
	const { points, ctx } = _obj;
	if (p_i >= points.length - 1 && a_id) {
		endAni(a_id);
		return;
	}
	const p: points = [];
	let s_i = 0;
	while (s_i++ <= p_i) {
		p.push(points[s_i]);
	}
	_obj.clearRect();
	drawStraight(p);
	p_i++;
	a_id = startAni(dynamicDraw);
}
