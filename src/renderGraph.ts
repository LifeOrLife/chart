import { drawDistribution } from './packages/graph'
import { drawTree } from './packages/graph/tree'

const el = document.getElementById('graph') as HTMLElement
const data = {
  id: 'center',
  text: '中心节点'
}
const nodes = [
  {
    id: '1',
    text: '节点1'
  },
  {
    id: '2',
    text: '节点2'
  },
  {
    id: '3',
    text: '节点2'
  }
]

drawDistribution(el, data, nodes)

const treeEl = document.getElementById('tree') as HTMLElement
const treeCenter = {
  id: '1',
  text: '这是根节点',
  color: '#fff',
  background: '#6cf'
}
const treeList = [
  {
    id: '2',
    text: '这是子节点1'
  },
  {
    id: '3',
    text: '这是子节点2'
  },
  {
    id: '4',
    text: '这是子节点3'
  },
  {
    id: '5',
    text: '这是子节点4'
  }
]

drawTree(treeEl, treeCenter, treeList)
