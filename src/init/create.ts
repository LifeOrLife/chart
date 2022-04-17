import { getStyle } from '../utils/getStyle'

import renderBar, { judgeThePosBar } from '../packages/bar'
import renderLine, { judgeThePosLine } from '../packages/line'
import renderPie, { judgeThePosPie } from '../packages/pie'

interface params {
  [key: string]: string | HTMLElement | number
}
interface options {
  x: Array<string | number>
  y: Array<string | number>
  type: string
  lineWidth?: number
}
type dots = Array<{ x: number; y: number; r: number; w?: number; h?: number }>
type pieType = {
  x: number
  y: number
  start: number
  end: number
  color: string
  r: number
}
export default class CreateChart {
  container?: HTMLElement
  canvas?: HTMLCanvasElement
  ctx?: CanvasRenderingContext2D
  left = 50
  top = 50
  right = 50
  bottom = 50
  width?: number
  height?: number
  ratio = 1
  points?: dots
  options?: options
  barW?: number // 柱状图初始化计算出来的宽度
  lineWidth = 1
  radius?: number // 扇形图半径
  pieList?: Array<pieType>
  moveHandle?: (e: Event) => void
  constructor(options: params) {
    const el = document.querySelector(options.el as string) as HTMLElement
    if (!el) {
      return
    }
    this.container = el
    const style = getStyle(el)
    if (!style) {
      console.log('%c不画了', 'color: #6cf; font-size: 20px; font-style: italic;')
      return
    }
    const width = parseInt(style.width)
    const height = parseInt(style.height)
    const ratio = window.devicePixelRatio
    const w = ratio * width,
      h = ratio * height
    const canvas = document.createElement('canvas')
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.scale(ratio, ratio)
    this.container.appendChild(canvas)
    this.canvas = canvas
    this.ctx = ctx
    this.width = width
    this.height = height
    this.ratio = ratio
    this.paddingAdd(options)
    this.moveHandle = (e: Event) => {
      const ev = e as WheelEvent
      const x = ev.offsetX
      const y = ev.offsetY
      this.startJudge(x, y)
    }
  }
  paddingAdd(opt: params): void {
    const direction = ['left', 'top', 'right', 'bottom'] as const
    direction.forEach(prop => {
      const v = this[prop]
      let _v = Math.floor(Number(opt[prop]))
      if (_v === _v) {
        if (_v <= 30) {
          _v = 30
        }
        if (_v >= 60) {
          _v = 60
        }
      } else {
        _v = v
      }
      this[prop] = _v
    })
  }
  // 绘制轴线
  renderAxisLine(): void {
    const { left, top, bottom, right, width, height, ctx } = this
    const c = ctx!
    const poins: { x: number; y: number }[] = []
    // poins[0] = {
    // 	x: left,
    // 	y: top
    // };
    // poins[1] = {
    // 	x: left,
    // 	y: height - bottom
    // };
    // poins[2] = {
    // 	x: width - right,
    // 	y: height - bottom
    // };
    poins[0] = {
      x: 0,
      y: 0
    }
    poins[1] = {
      x: 0,
      y: height! - bottom
    }
    poins[2] = {
      x: width!,
      y: height! - bottom
    }
    c.beginPath()
    c.moveTo(poins[0].x, poins[0].y)
    c.lineTo(poins[1].x, poins[1].y)
    c.lineTo(poins[2].x, poins[2].y)
    c.stroke()
    c.closePath()
  }
  renderOptions(option: options): void {
    this.lineWidth = option.lineWidth || 1
    this.calculatePoint(option)
    this.options = option
  }
  calculatePoint(option: options): void {
    if (!this.container) {
      console.log('....')
      return
    }
    const len = option.x.length
    const avg = Math.floor(this.width! / len)
    const point: dots = []
    const values = option.y.map(v => +v)
    const interv = 5
    let max = Math.max(...values)
    let min = Math.min(...values)
    const one = Math.floor((max - min) / interv)
    min = min - one
    max = max + one
    for (let i = 0; i < len; i++) {
      const x = avg * (i + 1 - 0.5)
      const y = this.height! - Number(((values[i] - min) / (max - min)) * this.height!)
      point.push({
        x: x,
        y: y,
        r: 4
      })
    }
    this.points = point
    this.options = option

    this.addEvent()
    if (option.type === 'line') {
      renderLine(this)
    }
    if (option.type === 'bar') {
      renderBar(this)
    }
    if (option.type === 'pie') {
      renderPie(this, option)
    }
  }
  addEvent(): void {
    this.canvas?.addEventListener('mousemove', this.moveHandle!)
  }
  rmoveEvent(): void {
    this.canvas?.removeEventListener('mousemove', this.moveHandle!)
  }
  startJudge(x: number, y: number): void {
    const type = this.options?.type
    if (type === 'line') {
      judgeThePosLine(x, y)
    }
    if (type === 'bar') {
      judgeThePosBar(x, y)
    }
    if (type === 'pie') {
      judgeThePosPie(x, y)
    }
  }
  clearRect(): void {
    this.ctx?.clearRect(0, 0, this.width!, this.height!)
  }
}
