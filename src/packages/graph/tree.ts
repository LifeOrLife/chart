// 树形结构

type NodeInfo = {
  id: string | number
  text: string
  color?: string
  background?: string
}
type Option = {
  font: number
  color: string
  lineColor: string
  lineWidth: number
  ratio: number
  width: number
  height: number
  x_center: number
  y_center: number
  linePadding: number // 顶部节点和节点之间的距离
}

const initOptions: Partial<Option> = {
  font: 15,
  color: '#000',
  lineColor: '#6cf',
  ratio: window.devicePixelRatio || 1,
  linePadding: 200
}
const initRootOption = {
  color: '#000',
  background: '#f7f8fa'
}

const getStyle = (el: HTMLElement) => {
  return window.getComputedStyle(el, null)
}
const initCanvas = (el: HTMLElement) => {
  const { width, height } = getStyle(el)
  const canvas = document.createElement('canvas')
  initOptions.width = parseInt(width) * initOptions.ratio
  initOptions.height = parseInt(height) * initOptions.ratio
  canvas.width = initOptions.width
  canvas.height = initOptions.height
  canvas.style.width = width
  canvas.style.height = height
  initOptions.x_center = initOptions.width / 2
  initOptions.y_center = initOptions.height / 2
  return canvas
}

const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color?: string, bg?: string) => {
  ctx.font = `${initOptions.font * initOptions.ratio}px Arial`
  ctx.fillStyle = color || initOptions.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
  const { width } = ctx.measureText(text)
  drawCircle(ctx, width, x, y, bg)
}

const drawCircle = (ctx: CanvasRenderingContext2D, w: number, x: number, y: number, bg?: string) => {
  ctx.beginPath()
  ctx.save()
  ctx.globalCompositeOperation = 'destination-over'
  const a = (w + 50) / 2 // 椭圆的长半轴
  const b = initOptions.font + 20 // 椭圆的短半轴
  ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI)
  ctx.fillStyle = bg || initRootOption.background
  ctx.fill()
  ctx.closePath()
}

const drawChildNode = (ctx: CanvasRenderingContext2D, nodes: NodeInfo[]) => {
  const lens = nodes.map(node => ctx.measureText(node.text).width)
  const max = Math.max(...lens)
  // 左右边距
  const padding = 20
  const num = (initOptions.width - padding * 2) / (max + 20)
  const newNode = nodes.map((node, index) => {
    let x: number
    if (num > lens.length) {
      const item = (initOptions.width - padding * 2) / lens.length
      x = (index + 1) * item - item / 2 + padding
    } else {
      x = (index % num) * (max + 70) + 10 + lens[index] / 2
    }
    // const y = Math.floor(index / num) * (initOptions.font + 20) + 10 + (initOptions.font + 20) + 200
    const y = initOptions.y_center + (initOptions.linePadding + initOptions.font) / 2 + 20
    return {
      ...node,
      x,
      y
    }
  })
  newNode.forEach(node => {
    drawText(ctx, node.text, node.x, node.y, node.color, node.background)
  })
  return newNode
}

const drawLine = (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, nodes: ReturnType<typeof drawChildNode>) => {
  nodes.forEach(node => {
    ctx.beginPath()
    const begin = {
      x: start.x,
      y: start.y + initOptions.font + 20
    }
    const end = {
      x: node.x,
      y: node.y - (initOptions.font + 20)
    }
    const a = {
      x: begin.x,
      y: (end.y - start.y) / 2 + start.y + 20
    }
    const b = {
      x: end.x,
      y: a.y
    }
    ctx.strokeStyle = initOptions.lineColor
    ctx.lineWidth = initOptions.lineWidth
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.closePath()
    // 绘制箭头
    ctx.beginPath()
    ctx.moveTo(end.x, end.y)
    ctx.lineTo(end.x - 5, end.y - 5)
    ctx.lineTo(end.x + 5, end.y - 5)
    ctx.fillStyle = initOptions.lineColor
    ctx.fill()
  })
}

export const drawTree = (el: HTMLElement, root: NodeInfo, nodes: NodeInfo[]) => {
  const cnavas = initCanvas(el)
  const ctx = cnavas.getContext('2d')!
  el.appendChild(cnavas)

  drawText(ctx, root.text, initOptions.x_center, initOptions.y_center - initOptions.linePadding / 2, root.color, root.background)
  const child_node = drawChildNode(ctx, nodes)
  const init = {
    x: initOptions.x_center,
    y: initOptions.y_center - initOptions.linePadding / 2
  }
  drawLine(ctx, init, child_node)
}
