import { Mouse } from '../model/Mouse.ts'
import { DtdNode } from '../model/DtdNode.ts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useCursor(node: DtdNode) {
  const mouse = ref(new Mouse())
  mouse.value.setNode(node)

  onMounted(() => {
    document.addEventListener('mousedown', mouse.value.down)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', mouse.value.down)
  })

  return {
    mouse,
  }
}
