import { drawText } from './packages/text';

const el = document.getElementById('text') as HTMLCanvasElement;
drawText(el, `一段文字，又是一段文字，还是一段文字，再来一段文字`);
