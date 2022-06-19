import { initCanvas, getStyle } from '@/utils'

type Point = {
  x: number
  y: number
}

const center: Point = {
  x: 0,
  y: 0
}

const axisInfo = {
  color: '#eee'
}
const canvasInfo: Record<string, string | number | CanvasRenderingContext2D> = {}

export function initAngel(el: HTMLCanvasElement) {
  const canvas = el
  const { width, height } = getStyle(el)
  const w = parseInt(width, 10)
  const h = parseInt(height, 10)
  const info = initCanvas(canvas, w, h)
  Object.assign(canvasInfo, info)
  drawAxisLine()
}

function drawLine(a: Point, b: Point) {
  const { ctx, ratio } = canvasInfo
  const c = ctx as CanvasRenderingContext2D
  const r = ratio as number
  c.beginPath()
  c.strokeStyle = axisInfo.color
  c.moveTo(a.x * r, a.y * r)
  c.lineTo(b.x * r, b.y * r)
  c.stroke()
}

function drawAxisLine() {
  const { width, height } = canvasInfo
  const w = (width as number) / 2
  const h = (height as number) / 2
  drawLine({ x: 0, y: h }, { x: w * 2, y: h })
  drawLine({ x: w, y: 0 }, { x: w, y: h * 2 })
  center.x = w
  center.y = h
  calculateAngel({ x: w + 100, y: h - 100 })
}

function calculateAngel(p: Point) {
  const angel = (Math.atan((p.y - center.y) / (p.x - center.x)) * 180) / Math.PI
  const { ctx, ratio } = canvasInfo
  const c = ctx as CanvasRenderingContext2D
  const r = ratio as number
  c.strokeStyle = '#6cf'
  const a = {
    x: center.x * r,
    y: center.y * r
  }
  const b = {
    x: p.x * r,
    y: p.y * r
  }
  c.beginPath()
  c.arc(a.x, a.y, 5, 0, Math.PI * 2)
  c.stroke()
  c.beginPath()
  c.arc(b.x, b.y, 5, 0, Math.PI * 2)
  c.stroke()
  console.log('距离水平X轴的旋转角度为：' + angel + 'deg')
  c.moveTo(a.x, a.y)
  c.lineTo(b.x, b.y)
  c.stroke()
  drawAngelText(angel)
}

function drawAngelText(angel: number) {
  const { ctx, ratio } = canvasInfo
  const c = ctx as CanvasRenderingContext2D
  const r = ratio as number
  const R = 30
  c.beginPath()
  c.arc(center.x * r, center.y * r, R * r, 0, (angel * Math.PI) / 180, true)
  c.stroke()
  const v = Math.sqrt(R / 2)
  c.save()
  c.font = '12px 楷体'
  const x = (center.x + v) * r
  const y = (center.y - v) * r
  c.translate(x, y)
  c.rotate(-(angel * Math.PI) / 180)
  console.log({ x, y })
  c.fillText(Math.abs(angel) + 'deg', 0, 0)
  c.restore()
}

function clearCanvas() {
  const { ctx, width, height } = canvasInfo
  ;(ctx as CanvasRenderingContext2D).clearRect(0, 0, width as number, height as number)
}
