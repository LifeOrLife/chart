import CreateChart from './init/create';

// 检验是否浏览器环境
try {
	document;
} catch (ex) {
	throw new Error('请在浏览器环境下运行');
}

const bar = new CreateChart({
	el: '#bar'
});

bar.renderOptions({
	type: 'bar',
	x: Array.from('0'.repeat(12), (v, i) => '星期-' + i),
	y: [130, 40, 90, 200, 900, 600, 459, 780, 900, 120, 650, 900]
});

const line = new CreateChart({
	el: '#line'
});
line.renderOptions({
	type: 'line',
	x: ['', '', '', '', '', '', '', '', '', '', '', ''],
	y: [130, 40, 90, 200, 900, 600, 459, 780, 900, 120, 650, 900]
});

const pie = new CreateChart({
	el: '#pie'
});
pie.renderOptions({
	type: 'pie',
	x: ['', '', '', '', ''],
	y: [130, 40, 90, 200, 900]
});
