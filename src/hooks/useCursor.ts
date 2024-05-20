import { Keyboard } from '../model/Keyboard.ts'
import { Mouse } from '../model/Mouse.ts'
import { onBeforeUnmount, onMounted } from 'vue'

export function useCursor(keyboard: Keyboard) {
  const mouse = new Mouse(keyboard)

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
