export type domType = Document | Window | HTMLElement

/**
 * 地图数据类型
 */
export type datasource = {
  type: string
  features: {
    type: string
    properties: {
      [key: string]: number | string | number[]
    }
    geometry: {
      type: string
      // coordinates: Array<Array<Array<Array<number>>>>;
      coordinates: [[[number[]]]]
    }
  }[]
}
export type features = datasource['features']

export type point = {
  points: [number[]]
  name: string
  center: number[]
}

/**
 * 函数类型
 */
export type fn = (ev: MouseEvent) => any

/**
 * event 类型
 */
export interface wheel extends WheelEvent {
  layerX: number
  layerY: number
}
