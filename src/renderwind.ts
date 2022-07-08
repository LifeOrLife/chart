import { renderWind, startDrawWind, randomVal } from './packages/wind'

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
const points = Array.from(Array(100)).map(() => {
  const obj = {
    x: randomVal(100, 0),
    y: randomVal(400, 0),
    vx: randomVal(1.2, 0.1),
    vy: randomVal(1.2, 0.1),
    color: '#6cf',
    width: 1,
    height: 1
  }
  return obj
})
startDrawWind(points)
