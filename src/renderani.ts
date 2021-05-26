import { oneMinutes } from './packages/ani';
const el = document.getElementById('ani') as HTMLElement;
const _obj = new oneMinutes(el);
_obj.generatePointer();
// _obj.drawLine();
// _obj.startPlay();
// _obj.drawCircle();
// _obj.repeatWindmill();
