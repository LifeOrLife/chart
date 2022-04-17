import mapdata from './packages/map/hubei.json'
import renderMap, { setOptions } from './packages/map'

renderMap({
  el: '#map'
})
// @ts-ignore
setOptions(mapdata)
