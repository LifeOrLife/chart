/**
 * canvas绘制文字，自动换行
 * 可设置文字的大小，颜色，字体等
 */

interface textObj {
	el: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
}

const obj: textObj = {
	el: null,
	ctx: null,
	width: 0,
	height: 0
};

const config: {
	[key: string]: string | number;
} = {};

export function drawText(canvas: HTMLCanvasElement, text: string): void {
	initCanvas(canvas);
	config.size = 13;
	config.h = 20;
	config.line = 1;
	calaText(text);
}

function initCanvas(canvas: HTMLCanvasElement) {
	const { width, height } = window.getComputedStyle(canvas, null);
	const w = parseInt(width);
	const h = parseInt(height);
	obj.ctx = canvas.getContext('2d');
	obj.width = w;
	obj.height = h;
	const context = obj.ctx;
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
}

/**
 * 计算
 */
function calaText(text: string) {
	const words = text.split('');
	const w_w = config.size as number;
	// 一行可以放置的文字
	const num = Math.floor(obj.width / w_w);
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		let line = 1;
		if (i >= num) {
			line = Math.floor(i / num) + 1;
		}
		const x = (i % num) * w_w;
		const y = line * (w_w + 10);
		drawWord(w, x, y);
	}
}

/**
 * 开始绘制文字，一个一个绘制
 * @param text 要绘制的文字
 * @param x x方向位置
 * @param y y方向位置
 */
function drawWord(text: string, x: number, y: number) {
	const ctx = obj.ctx;
	ctx.font = `${config.size}px 微软雅黑`;
	ctx.fillText(text, x, y);
}
