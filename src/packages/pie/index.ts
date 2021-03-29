import CreateChart from '../../init/create';
import { getColors } from '../../config/colors';

interface options {
	x: Array<string | number>;
	y: Array<string | number>;
	type: string;
	lineWidth?: number;
}

type pieType = {
	x: number;
	y: number;
	start: number;
	end: number;
	color: string;
	r: number;
};

let _obj;
export default function renderPie(render: CreateChart, option: options): void {
	_obj = render;
	const sum = option.y.reduce((t, n) => Number(t) + Number(n), 0) as number;
	const per = option.y.map((v) => {
		v = Number(v);
		return Math.floor((v / sum) * 100);
	});
	per[0] += 100 - per.reduce((v, n) => v + n, 0);
	const x = render.width / 2;
	const y = render.height / 2;
	const r = Math.min(render.width, render.height) / 2 - 80;
	render.radius = r;
	const pieList: Array<pieType> = [];
	per.forEach((p, index) => {
		const obj: pieType = {
			x: 0,
			y: 0,
			start: 0,
			end: 0,
			color: '',
			r: 0
		};
		const color = getColors(index);
		const { start, end } = calcRadian(per, index);
		obj.x = x;
		obj.y = y;
		obj.start = start;
		obj.end = end;
		obj.r = r;
		obj.color = color;
		pieList.push(obj);
		renderSinglePie(obj);
	});
	_obj.pieList = pieList;
}

/**
 * 根据下标计算弧度值
 */
function calcRadian(
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

function renderSinglePie(pie: pieType): void {
	const { color, x, y, r, start, end } = pie;
	_obj.ctx.save();
	_obj.ctx.beginPath();
	_obj.ctx.fillStyle = color;
	_obj.ctx.arc(x, y, r, start, end);
	_obj.ctx.lineTo(x, y);
	_obj.ctx.fill();
	_obj.ctx.closePath();
	_obj.ctx.restore();
}

export function judgeThePosPie(x: number, y: number): void {
	const center_x = _obj.width / 2;
	const center_y = _obj.height / 2;
	const v_x = center_x - x;
	const v_y = center_y - y;
	const dis = Math.sqrt(v_x * v_x + v_y * v_y);
	const per = _obj.pieList;
	let isIn = false;
	for (let i = 0; i < per.length; i++) {
		if (dis <= per[i].r) {
			renderSinglePie(per[i]);
			isIn = true;
			if (_obj.ctx.isPointInPath(x * _obj.ratio, y * _obj.ratio)) {
				initPieRadius();
				per[i].r = _obj.radius + 10;
				rePaintPie();
				break;
			}
		}
	}
	if (isIn) {
		_obj.canvas.style.cursor = 'pointer';
	} else {
		_obj.canvas.style.cursor = 'default';
		initPieRadius();
		rePaintPie();
	}
}

function initPieRadius(): void {
	_obj.pieList.forEach((p) => {
		p.r = _obj.radius;
	});
}
function rePaintPie(): void {
	const per = _obj.pieList;
	_obj.clearRect();
	per.forEach((p) => {
		renderSinglePie(p);
	});
}
