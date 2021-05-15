export interface canvasInfo {
	ctx?: CanvasRenderingContext2D;
	width?: number;
	height?: number;
	ratio?: number;
}
type obj = canvasInfo;

export function initCanvas(
	canvas: HTMLCanvasElement,
	width: number,
	height: number
): canvasInfo {
	const obj: obj = {};
	const w = width;
	const h = height;
	obj.ctx = canvas.getContext('2d');
	obj.width = w;
	obj.height = h;
	const context = obj.ctx as CanvasRenderingContext2D;
	// 根据设备像素比优化canvas绘图
	const devicePixelRatio = window.devicePixelRatio || 1;
	obj.ratio = devicePixelRatio;
	Object.assign(canvas, {
		style: {
			width: `${w}px`,
			height: `${h}px`
		},
		width: w * devicePixelRatio,
		height: h * devicePixelRatio
	});
	context.scale(devicePixelRatio, devicePixelRatio);
	return obj;
}

/**
 * 清空canvas
 * @param ctx {CanvasRenderingContext2D}
 * @param width {number}
 * @param height {number}
 */
export function clearCanvas(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number
) {
	ctx.clearRect(0, 0, width, height);
}
