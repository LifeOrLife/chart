import { drawText, defaultDrawText } from './packages/text';

const el = document.getElementById('text') as HTMLCanvasElement;
const el_oth = document.getElementById('text_oth') as HTMLCanvasElement;
drawText(
	el,
	`
		一段文字,另一段文字，又一段文字，还有一段文字
		这是第二段文字
		再来一段文字，测试文字，测试文字二号`
);
defaultDrawText(
	el_oth,
	`    一段文字,另一段文字，又一段文字，还有一段文字。这是第二段文字，再来一段文字，测试文字，测试文字二号`
);
