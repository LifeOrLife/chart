const colors: Array<string> = [
	'#5470c6',
	'#91cc75',
	'#fac858',
	'#ee6666',
	'#73c0de'
];
export function getColors(index: number): string {
	if (index && colors[index]) {
		return colors[index];
	}
	return '#' + Math.random().toString(16).slice(2, 8);
}
