import { initCanvas } from './index';
import { textObj } from './index';

const config_oth: {
	[key: string]: string | number;
} = {};

const obj_oth: textObj = {
	el: null,
	ctx: null,
	width: 0,
	height: 0,
	line: 0
};

/**
 * 默认渲染方式
 */
export function defaultDrawText(canvas: HTMLCanvasElement, text: string): void {
	initCanvas(canvas, obj_oth);
	config_oth.size = 13;
	config_oth.h = 20;
	config_oth.line = 1;
	defaultRender(text);
}

const defaultLines: Array<{
	line: number;
	word: string;
}> = [];
/***
 * 文字按照默认浏览器渲染规则大小来渲染
 */
function defaultRender(text: string) {
	// 1、从1个字符开始，逐个字符叠加渲染，每次渲染之后获取渲染文字的宽度
	// 2、若获取的文字宽度，超过容器的宽度，则换下一行渲染
	const start = 0;
	const line = 1;
	drawDefaultLine(text, start, line);
}

/**
 * 绘制每一行文本
 * @param text {string} 要绘制的文本内容
 * @param start {number} 当前一行开头的第一个文字对应的默认文本的下标
 * @param line {number} 当前行数
 */
function drawDefaultLine(text: string, start: number, line: number) {
	const len = text.length;
	const { ctx, width, height } = obj_oth;
	const { size } = config_oth;
	const h = Number(size);
	const y = Number(size) * (line + 1);
	for (let i = start; i < len; i++) {
		let word = text.slice(start, i);
		renderWord(ctx, h, word, y, width, height);
		const info = ctx.measureText(word);
		if (info.width > width) {
			word = text.slice(start, i - 1);
			renderWord(ctx, h, word, y, width, height);
			defaultLines.push({
				line,
				word
			});
			drawDefaultLine(text.slice(i - 1), 0, line + 1);
			break;
		} else {
			if (i === len - 1) {
				word = text.slice(start);
				defaultLines.push({
					line,
					word
				});
			}
		}
	}
	// 最终只要绘制一次，不需要每次递归都绘制
	if (line === 1) {
		ctx.clearRect(0, 0, width, height);
		defaultLines.forEach((line) => {
			const y_v = line.line * (h + 4);
			ctx.font = `${size}px 微软雅黑`;
			ctx.fillText(line.word, 0, y_v);
		});
	}
}

function renderWord(
	ctx: CanvasRenderingContext2D,
	size: number,
	word: string,
	y: number,
	width: number,
	h: number
) {
	ctx.clearRect(0, 0, width, h);
	ctx.font = `${size}px 微软雅黑`;
	ctx.fillText(word, 0, y);
}
