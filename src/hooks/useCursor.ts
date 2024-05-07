import { Mouse } from '../model/Mouse.ts'
import { onBeforeUnmount, onMounted } from 'vue'

export function useCursor() {
  const mouse = new Mouse()

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
