/**
 * 生成随机颜色
 * @returns {string} 16进制标准格式颜色
 */
export function color(): string {
	return '#' + Math.random().toString(16).slice(2, 8);
}
