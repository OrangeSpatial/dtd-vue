import { Mouse } from '../model/Mouse.ts'
import { DtdNode } from '../model/DtdNode.ts'
import { onBeforeUnmount, onMounted } from 'vue'

export function useCursor(node?: DtdNode) {
  const mouse = new Mouse()
  node && mouse.setNode(node)

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
