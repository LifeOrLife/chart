/**
 * canvas绘制文字，自动换行
 * 可设置文字的大小，颜色，字体等
 * todo: 主动换行分段
 */

export interface textObj {
	el: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	line: number;
}

const obj: textObj = {
	el: null,
	ctx: null,
	width: 0,
	height: 0,
	line: 0
};

const config: {
	[key: string]: string | number;
} = {};

export function drawText(canvas: HTMLCanvasElement, text: string): void {
	initCanvas(canvas, obj);
	config.size = 13;
	config.h = 20;
	config.line = 1;
	// calaText(text);
	splitParagraph(text);
}

export function initCanvas(canvas: HTMLCanvasElement, obj: textObj) {
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
 * 根据换行符对文字进行切割，
 * 然后做分段处理
 */
function splitParagraph(text: string) {
	let paragraphs = text.split(/\n/g);
	paragraphs = paragraphs.filter((p) => !!p);
	paragraphs.forEach((pa, i) => {
		// 计算每一段文字会占据的行数
		const line = calculateLine(paragraphs, i);
		calaText(line, pa);
	});
}
/**
 * 计算行数
 */
function calculateLine(paragraphs: string[], index: number): number {
	if (index === 0) {
		return 1;
	}
	const num = getCharacterNumber();
	let _line = 1;
	for (let i = 0; i < index; i++) {
		const pa = paragraphs[i];
		const line = Math.ceil(pa.length / num);
		_line += line;
	}
	return _line;
}

/**
 * 计算
 * 每个字符按指定的大小尺寸进行渲染，页面不会混乱
 */
function calaText(line: number, text: string) {
	const words = text.split('');
	const num = getCharacterNumber();
	const w_w = config.size as number;
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		let _line = line;
		if (i >= num) {
			_line += Math.floor(i / num);
		}
		const x = (i % num) * w_w;
		const y = _line * (w_w + 10);
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

/**
 * 计算canvas每一行能够渲染的字符数量
 */
function getCharacterNumber(): number {
	const w_w = config.size as number;
	// 一行可以放置的文字
	const num = Math.floor(obj.width / w_w);
	return num;
}
