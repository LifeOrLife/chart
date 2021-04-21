import mapdata from './packages/map/hubei.json';
import renderMap, { setOptions } from './packages/map/index';

renderMap({
	el: '#map'
});
setOptions(mapdata);
