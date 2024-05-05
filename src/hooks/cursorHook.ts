import { Mouse } from '../model/Mouse.ts'
import { DtdNode } from '../model/DtdNode.ts'
import { onBeforeUnmount, onMounted } from 'vue'

export function useCursor(nodes?: DtdNode[]) {
  const mouse = new Mouse()
  nodes && mouse.setNodes(nodes)

  onMounted(() => {
    document.addEventListener('mousedown', mouse.down)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', mouse.down)
  })

  return {
    mouse,
  }
}
