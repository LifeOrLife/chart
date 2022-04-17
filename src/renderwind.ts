import { renderWind, startDrawWind } from './packages/wind'

renderWind({
  el: '#wind'
})
const winds = [
  {
    x: 100,
    y: 100,
    vx: 0.1,
    vy: 0.1,
    color: '#6cf',
    width: 1,
    height: 1
  }
]
startDrawWind(winds)

