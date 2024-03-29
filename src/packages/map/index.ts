/**
 * 渲染地图，区分边界
 * 绑定hover，点击事件等
 */
import { getStyle } from '../../utils/getStyle'
import type { point, datasource } from '../../utils/type'

export interface opt {
  el: string | HTMLElement
  padding?: number
}

interface Params {
  ctx?: CanvasRenderingContext2D
  width?: number
  height?: number
  el?: HTMLElement
  padding?: number
  ratio?: number
  canvas?: HTMLCanvasElement
  scale?: number
  minLog?: number
  maxLog?: number
  minLat?: number
  maxLat?: number
  areas?: point[]
}

const params: Params = {}
export default function renderMap<T extends opt>(options: T): void {
  let el = options.el
  if (typeof el === 'string') {
    el = document.querySelector<HTMLElement>(el) as HTMLElement
  }
  const style = getStyle(el as HTMLElement)!
  const { width, height } = style
  params.width = parseInt(width)
  params.height = parseInt(height)
  params.el = el
  params.padding = options.padding || 50
  initCanvas()
}

function initCanvas() {
  const ratio = window.devicePixelRatio || 1
  const canvas = document.createElement('canvas')
  const el = params.el as HTMLElement
  const width = params.width as number
  const height = params.height as number
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.width = width * ratio
  canvas.height = height * ratio
  const ctx = canvas.getContext('2d')!
  // ctx.scale(ratio, ratio)
  params.ratio = ratio
  params.canvas = canvas
  params.ctx = ctx
  el.appendChild(canvas)
  bindEvent()
}

/**
 * 开始渲染地图
 */
export function setOptions(data: datasource): void {
  calculateData(data)
  drawArea()
}

/**
 * 计算地图数据边界
 */
function calculateData(map: datasource) {
  const v = getBoundry(map)
  const x = v.maxLog - v.minLog
  const y = v.maxLat - v.minLat
  const width = params.width as number
  const height = params.height as number
  const xScale = (width - 50) / x
  const yScale = (height - 50) / y
  const scale = xScale < yScale ? xScale : yScale
  params.scale = Math.floor(scale)
  params.minLog = v.minLog
  params.maxLog = v.maxLog
  params.minLat = v.minLat
  params.maxLat = v.maxLat
}

/**
 * 区域绘制
 */
function drawArea() {
  clearCanvas()
  const areas = params.areas as unknown as Array<point>
  areas.forEach(item => {
    drawLine(item.points)
    drawText(item)
  })
}

/**
 * 绘制边界线
 */
function drawLine(points: Array<Array<number>>) {
  const ctx = params.ctx as unknown as CanvasRenderingContext2D
  const minLog = params.minLog as number
  const scale = params.scale as number
  const maxLat = params.maxLat as number
  const padding = params.padding as number
  ctx.beginPath()
  const p = points[0]
  let x = (p[0] - minLog) * scale
  let y = (maxLat - p[1]) * scale + padding
  ctx.moveTo(x, y)
  for (let i = 0; i < points.length; i++) {
    x = (points[i][0] - minLog) * scale
    y = (maxLat - points[i][1]) * scale + padding
    ctx.lineTo(x, y)
  }
  ctx.strokeStyle = '#6cf'
  ctx.stroke()
  ctx.fillStyle = 'rgba(102, 204, 255, .3)'
  ctx.fill()
}

/**
 * 绘制中心文字
 */
function drawText(area: point) {
  const ctx = params.ctx!
  const maxLat = params.maxLat as number
  const minLog = params.minLog as number
  const scale = params.scale as number
  const padding = params.padding as number
  ctx.save()
  ctx.textAlign = 'center'
  const x = (area.center[0] - minLog) * scale
  const y = (maxLat - area.center[1]) * scale + padding
  ctx.fillStyle = 'aqua'
  ctx.font = '13px 微软雅黑'
  ctx.fillText(area.name, x, y)
  ctx.restore()
}

function getBoundry(map: datasource) {
  const log: number[] = [],
    lat: number[] = []
  const areas: {
    points: [number[]]
    name: string
    center: number[]
  }[] = []
  map.features.forEach(item => {
    const points = item.geometry.coordinates[0][0]
    points.forEach(p => {
      log.push(p[0])
      lat.push(p[1])
    })
    areas.push({
      points: points,
      name: item.properties.name as string,
      center: item.properties.center as number[]
    })
  })
  const maxLog = Math.max(...log)
  const minLog = Math.min(...log)
  const maxLat = Math.max(...lat)
  const minLat = Math.min(...lat)
  params.areas = areas
  return { maxLog, minLog, maxLat, minLat }
}

/**
 * 清除画布
 */
function clearCanvas() {
  const ctx = params.ctx!
  const width = params.width as number
  const height = params.height as number
  ctx.clearRect(0, 0, width, height)
}

/**
 * 绑定事件
 */
function bindEvent() {
  const canvas = params.canvas as HTMLElement
  canvas.addEventListener(
    'mousemove',
    throttle((e: MouseEvent) => {
      const x = e.offsetX
      const y = e.offsetY
      const areas = params.areas as Array<point>
      const num = judgePointArea(x, y)
      let cursor = 'default'
      const ctx = params.ctx as unknown as CanvasRenderingContext2D
      if (num !== -1) {
        cursor = 'pointer'
        ctx.save()
        ctx.lineWidth = 2
        drawLine(areas[num].points)
        ctx.restore()
        for (let i = num; i < areas.length; i++) {
          drawLine(areas[i].points)
          drawText(areas[i])
        }
      }
      canvas.style.cursor = cursor
    }, 50)
  )

  canvas.addEventListener(
    'click',
    throttle(e => {
      const x = e.clientX
      const y = e.clientY
      const num = judgePointArea(x, y)
      const areas = params.areas as Array<point>
      if (num === -1) {
        console.log('地图区域外部')
        return
      }
      for (let i = num; i < areas.length; i++) {
        drawLine(areas[i].points)
        drawText(areas[i])
      }
    }, 50)
  )
}

/**
 * 对点和区域的判断
 * @param x {number}
 * @param y {number}
 * @return {number} 返回-1表示没有在地图的任何区域
 */
function judgePointArea(x: number, y: number): number {
  clearCanvas()
  const areas = params.areas as Array<point>
  const ratio = params.ratio as number
  const ctx = params.ctx as unknown as CanvasRenderingContext2D
  for (let i = 0; i < areas.length; i++) {
    drawLine(areas[i].points)
    drawText(areas[i])
    if (ctx.isPointInPath(x * ratio, y * ratio)) {
      return i
    }
  }
  return -1
}

function throttle(fn: (e: MouseEvent) => void, time: number) {
  let timer: ReturnType<typeof setTimeout>
  return (e: MouseEvent) => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn(e)
      }, time)
    }
  }
}
