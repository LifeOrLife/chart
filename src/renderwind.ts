import { renderWind, startDrawWind } from './packages/wind';

renderWind({
	el: '#wind'
});
const winds = [
	{
		x: 100,
		y: 100,
		vx: 0.8,
		vy: 0.1,
		color: '#6cf',
		width: 2,
		height: 10
	}
];
startDrawWind(winds);
