<script setup lang="ts">
import { DtdNode, NodeLayout, insertNode, insertNodeInContainer } from '../model/DtdNode.ts'
import { useCursor } from '../hooks/useCursor.ts'
import DtdAuxTool from './DtdAuxTool.vue'
import DtdGhost from './DtdGhost.vue'
import { onBeforeUnmount, ref, provide, onMounted, CSSProperties } from 'vue';
import { DragEventType, DragNodeType } from '../model/Mouse.ts';
import { cursorAtContainerEdge, getCursorPositionInDtdNode, getLayoutNodeInContainer } from '../common/dtdHelper.ts';
import { DTD_MOUSE } from '../common/injectSymbol.ts'

defineOptions({
    name: 'DtdPod',
})

const podRef = ref<HTMLElement>()
const podStyle = ref<CSSProperties>({
    transform: 'translate(0, 0)',
})

const { mouse } = useCursor()
provide(DTD_MOUSE, mouse)
mouse.on(DragEventType.DragEnd, dragEndHandler)
function dragEndHandler(e: MouseEvent, targetNode?: DtdNode) {
    const sourceNode = mouse.dataTransfer
    const positionObj = getCursorPositionInDtdNode(e)
    carryNode.value = []
    if (!targetNode || !sourceNode.length || !positionObj || !mouse.dragElement) return
    const parentNode = sourceNode.find(node => node.isParentOf(targetNode))
    if (parentNode) return
    // COPY 拖拽不允许插入到容器内
    if (targetNode.root.dragType === DragNodeType.COPY) return
    const dragType = sourceNode[0].root.dragType
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
    if (podRef.value) {
        podRef.value.removeEventListener('scroll', podScrollHandler)
    }
})

function podScrollHandler(e: Event) {
    console.log('scroll');
    const target = e.target as HTMLElement
    podStyle.value.transform = `translate(${target.scrollLeft}px, ${target.scrollTop}px)`
}

onMounted(() => {
    if (podRef.value) {
        podRef.value.addEventListener('scroll', podScrollHandler)
    }
})

</script>

<template>
    <div ref="podRef" class="dtd-pod">
        <slot></slot>
        <dtd-aux-tool :style="podStyle"/>
        <dtd-ghost @mounted="ghostMounted">
            <slot name="ghost" v-if="carryNode.length" :item="carryNode[0]?.props" />
        </dtd-ghost>
    </div>
</template>

<style scoped>
.dtd-pod {
    position: relative;
    height: 100%;
    overflow: auto;
}
</style>
