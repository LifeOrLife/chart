import CreateChart from './init/create';

// 检验是否浏览器环境
try {
	document;
} catch (ex) {
	throw new Error('请在浏览器环境下运行');
}

const draw = new CreateChart({
	el: '#box'
});
// draw.renderOptions({
// 	type: 'line',
// 	x: ['', '', '', '', '', '', '', '', '', '', '', ''],
// 	y: [130, 40, 90, 200, 900, 600, 459, 780, 900, 120, 650, 900]
// });

draw.renderOptions({
	type: 'pie',
	x: ['', '', '', '', ''],
	y: [130, 40, 90, 200, 900]
});
