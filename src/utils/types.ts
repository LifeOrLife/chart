export default {
	isString: (val: unknown): boolean => {
		return typeof val === 'string';
	},
	getType: (val: unknown): string => {
		return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
	}
};
