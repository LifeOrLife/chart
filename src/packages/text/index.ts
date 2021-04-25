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

export function drawText(canvas: HTMLCanvasElement, text: string): void {
	initCanvas(canvas);
}

function initCanvas(canvas: HTMLCanvasElement) {
	const { width, height } = window.getComputedStyle(canvas, null);
	const w = parseInt(width);
	const h = parseInt(height);
	obj.ctx = canvas.getContext('2d');
	obj.width = w;
	obj.height = h;
	const context = this.context;
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
 * 开始绘制文字，一个一个绘制
 * @param text 要绘制的文字
 * @param x x方向位置
 * @param y y方向位置
 */
function drawWord(text: string, x: number, y: number) {
	const ctx = obj.ctx;
	ctx.fillText(text, x, y);
}
