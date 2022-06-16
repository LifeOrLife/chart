/**
 * 动态绘制风车
 */

import { initCanvas, clearCanvas, getStyle } from '@/utils'
import type { canvasInfo } from '@/utils'
import { color } from '@/utils/getColor'

// 最后一分钟倒计时
import { oneMinutes } from './index'

const ONE_ROUND = Math.PI * 2

interface obj extends canvasInfo {
  [key: string]: string | number | CanvasRenderingContext2D | HTMLCanvasElement
}
const obj: obj = {
  angel: 0, // 初始角度
  add: 5 // 增量
}

function oneMinutesPlay() {
  const { el, ctx, width, height } = obj
  clearCanvas(ctx, width, height)
  const _obj = new oneMinutes(el as HTMLCanvasElement)
  _obj.generatePointer()
  _obj.drawLine()
  _obj.startPlay()
  // _obj.drawCircle();
}

export function start(el: HTMLCanvasElement): void {
  const style = getStyle(el)
  Object.assign(obj, initCanvas(el, parseInt(style.width), parseInt(style.height)))
  obj.el = el
  oneMinutesPlay()
  setInterval(() => {
    startPlay()
  }, 1000)
}

/**
 * 开始动态播放
 */
function startPlay() {
  const { ctx, width, height } = obj
  clearCanvas(ctx, width, height)
  // generateLeaf(ONE_ROUND / 12);
  const h1 = Math.random() > 0.5 ? 100 : 200 // 扇叶主茎长度
  for (let i = 0; i < 6; i++) {
    const _angel = obj.angel as number
    const angel = i * 60 + _angel
    // 生成相近的颜色
    const c = `rgb(0, ${Math.floor(255 - 42.5 * i)}, ${Math.floor(255 - 42.5 * (i + 1))})`
    generateLeaf((ONE_ROUND / 360) * angel, h1, c)
  }
  const add = obj.add as number
  const angel = obj.angel as number
  obj.angel = angel + add
  // 绘制圆环
  for (let i = 0; i < 3; i++) {
    const x = obj.width / 2
    const y = obj.height / 2
    const r = 50 * (i + 1)
    drawCircle(x, y, r, 1, color())
  }
}

/**
 * 生成扇叶
 */
function generateLeaf(angel: number, h1: number, color = '#000') {
  const { ctx, width, height } = obj
  const x = width / 2
  const y = height / 2
  const h = 150
  // const h1 = Math.random() > 0.5 ? 100 : 200; // 扇叶主茎长度
  // const h1 = 100; // 设为200时，每个扇叶为向外突出的形状，100时，为向内凹陷的形状
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.translate(x, y)
  ctx.rotate(angel)
  const points = [
    { x, y: y - h },
    { x, y },
    { x: x + h / 2, y: y - h * Math.cos(ONE_ROUND / 12) },
    {
      x: x + h1 * Math.sin(ONE_ROUND / 24),
      y: y - h1 * Math.cos(ONE_ROUND / 24)
    }
  ]
  points.forEach((p, i) => {
    if (i === 0) {
      ctx.moveTo(p.x - x, p.y - y)
    } else {
      ctx.lineTo(p.x - x, p.y - y)
    }
  })
  ctx.lineTo(points[0].x - x, points[0].y - y)
  ctx.stroke()
  ctx.restore()
}

/**
 * 生成圆形
 */
function drawCircle(x: number, y: number, r: number, w = 1, color = '#000') {
  const { ctx } = obj
  if (!ctx) {
    return
  }
  ctx.beginPath()
  ctx.lineWidth = w
  ctx.strokeStyle = color
  ctx.arc(x, y, r, 0, ONE_ROUND)
  ctx.stroke()
}
