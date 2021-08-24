import { renderWind, startDrawWind } from './packages/wind';

renderWind({
	el: '#wind'
});
const winds = Array.from('0'.repeat(100), (v) => {
	const obj = {
		x: randomVal(100, 0, true),
		y: randomVal(400, 0, true),
		vx: randomVal(1, 0.5),
		vy: Math.random(),
		color: '#6cf',
		width: 2,
		height: randomVal(15, 5, true)
	};
	return obj;
});

function randomVal(max: number, min: number, isInteger?: boolean): number {
	const v = Math.random() * (max - min) + min;
	if (isInteger) {
		return Math.floor(v);
	}
	return v;
}

startDrawWind(winds);
