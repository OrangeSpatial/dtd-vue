<script setup lang="ts">
import { CSSProperties, inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { initStyle } from '../../common/presets';
import { DragEventType, Mouse } from '../../model/Mouse';
import { DTD_MOUSE } from '../../common/injectSymbol';
import { DtdNode } from '../../model/DtdNode';
import { getCursorPositionInDtdNode } from '../../common/dtdHelper';


defineOptions({
  name: 'AuxSelection',
})

const props = defineProps<{
    parentEl?: HTMLElement
}>()


const selectionStyle = ref<CSSProperties>(initStyle)
const selectNodes = ref<DtdNode[]>([])
const mouse = inject<Mouse>(DTD_MOUSE)
if (!mouse) {
    throw new Error('DtdAuxTool: mouse is required')
}
function selectHandler() {
    selectNodes.value = []
    mouse?.selectedNodes.forEach(selectNode => {
        selectNodes.value.push(selectNode.node)
        updateSelectionRectStyle(selectNode.e)
    })
}
function updateSelectionRectStyle(e: MouseEvent) {
    if (!e) {
        resetSelectionRectStyle()
        return
    }
    const positionObj = getCursorPositionInDtdNode(e)
    if (!mouse?.selectedNodes.length || !positionObj) {
        resetSelectionRectStyle()
        return
    }
    const container = props.parentEl?.parentElement
    if (!container) return
    const { x: pX, y: pY } = container.getBoundingClientRect()
    const { rect } = positionObj
    const d_x = e.pageX - e.clientX
    const d_y = e.pageY - e.clientY
    const left = d_x + rect.left - pX
    const top = d_y + rect.top - pY
    selectionStyle.value = {
        transform: `perspective(1px) translate3d(${left}px,${top}px,0px)`,
        width: rect.width + 'px',
        height: rect.height + 'px',
        borderWidth: '2px',
    }
}
function resetSelectionRectStyle() {
    selectionStyle.value = initStyle
}
onMounted(() => {
    mouse.on(DragEventType.Select, selectHandler)
    mouse.on(DragEventType.DragEnd, selectHandler)
})
onBeforeUnmount(() => {
    mouse.off(DragEventType.Select, selectHandler)
    mouse.off(DragEventType.DragEnd, selectHandler)
})
</script>

<template>
    <div v-for="node in selectNodes" :key="node.dragId" class="dtd-aux-selection-box" :style="selectionStyle"></div>
</template>

<style scoped>
.dtd-aux-selection-box {
    position: absolute;
    pointer-events: none;
    z-index: 999;
    box-sizing: border-box;
    transform: perspective(1px) translateZ(0);
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border: 0px solid #0092fbe1;
}
</style>