// 绘制分布图
type NodeInfo = {
  id: string
  text: string
}

type BottomText = {
  text: string
  left: number
  bottom: number
}

let x_center: number, y_center: number, ratio: number
const getStyle = (el: HTMLElement) => {
  return window.getComputedStyle(el)
}

const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, arg?: number) => {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '18px Arial'
  ctx.fillText(text, x, y)
  const { width } = ctx.measureText(text!)
  drawCircle(ctx, x, y, width, arg)
}

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, arg?: number) => {
  ctx.beginPath()
  ctx.save()
  ctx.globalCompositeOperation = 'destination-over'
  // ctx.arc(x, y, , 0, 2 * Math.PI)
  const a = (w + 50) / 2 // 椭圆的长半轴
  const b = 50 // 椭圆的短半轴
  ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI)
  ctx.fillStyle = '#f7f8fa'
  ctx.fill()
  ctx.beginPath()
  drawLine(ctx, x, y, x_center, y_center)
  ctx.restore()
  if (typeof arg !== 'undefined') {
    const point = getPoint(x, y, a, b, arg - Math.PI)
    // ctx.beginPath()
    // ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
    // ctx.fillStyle = '#6cf'
    // ctx.fill()
    ctx.save()
    ctx.beginPath()
    ctx.translate(point.x, point.y)
    ctx.rotate(arg)
    // ctx.drawImage(icon, 2, -6, 16, 16)
    // 绘制箭头
    ctx.moveTo(0, 0)
    ctx.lineTo(-10, -5)
    ctx.lineTo(-10, 5)
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.restore()
  }
}

const drawLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = '#f7f8fa'
  ctx.lineWidth = 2
  ctx.stroke()
}

export const drawDistribution = (el: HTMLElement, center: NodeInfo, data: NodeInfo[], title?: BottomText) => {
  const style = getStyle(el)
  const width = parseInt(style.width)
  const height = parseInt(style.height)
  const canvas = document.createElement('canvas')
  ratio = window.devicePixelRatio || 1
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const ctx = canvas.getContext('2d')!
  x_center = (width / 2) * ratio
  y_center = (height / 2) * ratio
  drawText(ctx, center.text, x_center, y_center)
  const arg = (2 * Math.PI) / data.length
  data.forEach((item, index) => {
    const x = x_center + 250 * Math.cos(arg * index)
    const y = y_center + 250 * Math.sin(arg * index)
    drawText(ctx, item.text, x, y, arg * index)
  })
  el.appendChild(canvas)
}

// 绘制底部说明
// const drawExplain = () => {}

// 椭圆根据角度计算对应的坐标
const getPoint = (x: number, y: number, a: number, b: number, angle: number) => {
  return {
    x: x + a * Math.cos(angle),
    y: y + b * Math.sin(angle)
  }
}
