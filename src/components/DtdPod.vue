<script setup lang="ts">
import { DtdNode, NodeLayout, insertNode, insertNodeInContainer } from '../model/DtdNode.ts'
import { useCursor } from '../hooks/cursorHook.ts'
import DtdAuxTool from './DtdAuxTool.vue'
import DtdGhost from './DtdGhost.vue'
import { onBeforeUnmount, ref, provide } from 'vue';
import { DragEventType } from '../model/Mouse.ts';
import { cursorAtContainerEdge, getCursorPositionInDtdNode, getLayoutNodeInContainer } from '../common/dtdHelper.ts';
import { DTD_MOUSE } from '../common/injectSymbol.ts'

defineOptions({
    name: 'DtdPod',
})

const { mouse } = useCursor()
provide(DTD_MOUSE, mouse)
mouse.on(DragEventType.DragEnd, dragEndHandler)
function dragEndHandler(e: MouseEvent, targetNode?: DtdNode) {
    const sourceNode = mouse.dataTransfer
    const positionObj = getCursorPositionInDtdNode(e)
    carryNode.value = []
    if (!targetNode || !sourceNode.length || !positionObj || !mouse.dragElement) return
    const dragType = sourceNode[0].dragType
    const isContainerEdge = cursorAtContainerEdge(positionObj.rect, e)
    const isVertical = getLayoutNodeInContainer(positionObj.targetEl) === NodeLayout.VERTICAL
    const insertBefore = isVertical ? positionObj.insertBefore : positionObj.isLeft
    if (targetNode?.droppable && !isContainerEdge) {
        insertNodeInContainer(targetNode, sourceNode, insertBefore, dragType)
    } else {
        insertNode(targetNode, sourceNode, isVertical ? positionObj.isTop : positionObj.isLeft, dragType)
    }
}

const carryNode = ref<DtdNode[]>([])

mouse.on(DragEventType.DragStart, () => {
    carryNode.value = mouse.dataTransfer
})

function ghostMounted(el: HTMLElement) {
    mouse.setGhostElement(el)
}

onBeforeUnmount(() => {
    mouse.off(DragEventType.DragEnd, dragEndHandler)
})

</script>

<template>
    <slot></slot>
    <dtd-aux-tool />
    <dtd-ghost @mounted="ghostMounted">
        <slot name="ghost" v-if="carryNode.length" :item="carryNode[0]?.props" />
    </dtd-ghost>
</template>

<style scoped>
.drag-to-drop {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
