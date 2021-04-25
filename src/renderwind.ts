import { renderWind, startDrawWind } from './packages/wind';
import { drawText } from './packages/text';

renderWind({
	el: '#wind'
});
const winds = [
	{
		x: 100,
		y: 100,
		vx: 0.1,
		vy: 0.1,
		color: '#6cf',
		width: 1,
		height: 1
	}
];
startDrawWind(winds);

const el = document.getElementById('text') as HTMLCanvasElement;
drawText(el, `一段文字，又是一段文字，还是一段文字，再来一段文字`);
