import CreateChart from '../../init/create';
import { isInBar } from '../../utils/contain/bar';

let _obj;
export default function renderBar(render: CreateChart): void {
	_obj = render;
	calculateBar(render);
	startRenderBar(render);
}

function calculateBar(_ins: CreateChart): void {
	const point = _ins.points;
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
		p.h = _ins.height - p.y;
	});
	_ins.barW = w;
}

function startRenderBar(_ins: CreateChart): void {
	const point = _ins.points;
	const ctx = _ins.ctx;
	ctx.save();
	ctx.fillStyle = 'aqua';
	point.forEach((p) => {
		ctx.fillRect(p.x - p.w / 2, p.y, p.w, p.h);
		ctx.fill();
	});
	ctx.restore();
}

function barScale(isIn: boolean, index?: number): void {
	_obj.canvas.style.cursor = isIn ? 'pointer' : 'default';
	const point = _obj.points;
	point.forEach((p, i) => {
		p.w = _obj.barW;
		if (isIn && i === index) {
			p.w = _obj.barW + 5;
		}
	});
	_obj.clearRect();
	startRenderBar(_obj);
}

export function judgeThePosBar(x: number, y: number): void {
	let isIn = false,
		index;
	const point = _obj.points;
	for (let i = 0; i < point.length; i++) {
		const p = point[i];
		// 此时绘制的柱状图，从canvas底部开始绘制，所以暂时只判断状态图的头部
		if (isInBar(p, x, y)) {
			isIn = true;
			index = i;
			break;
		}
	}
	if (isIn) {
		barScale(isIn, index);
	} else {
		barScale(isIn);
	}
}
