<script setup lang="ts">
import { CSSProperties, inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { DTD_BASE_KEY, initStyle } from '../../common/presets';
import { DragEventType, Mouse } from '../../model/Mouse';
import { DTD_MOUSE } from '../../common/injectSymbol';
import { DtdNode, NodeLayout } from '../../model/DtdNode';
import { cursorAtContainerEdge, getBoundingRects, getCursorPositionInDtdNode, getLayoutNodeInContainer } from '../../common/dtdHelper';


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
function selectHandler(e: MouseEvent, targetNode?: DtdNode) {
    selectNodes.value = []
    mouse?.selectedNodes.forEach(selectNode => {
        selectNodes.value.push(selectNode.node)
        nextTick(() => {
            updateSelectionRectStyle(selectNode.e, targetNode, Boolean(targetNode))
        })
    })
}

function updateSelectionRectStyle(e: MouseEvent, targetNode?: DtdNode, isDragEnd = false) {
    if (!e) {
        resetSelectionRectStyle()
        return
    }
    const positionObj = getCursorPositionInDtdNode(e)
    if (!mouse?.selectedNodes.length || !positionObj) {
        resetSelectionRectStyle()
        return
    }
    // aux dom
    const container = props.parentEl?.parentElement
    if (!container) return
    // 容器偏移量
    const { x: offsetX, y: offsetY } = container.getBoundingClientRect()
    // 视窗偏移量
    const d_x = e.pageX - e.clientX
    const d_y = e.pageY - e.clientY
    // 选中框
    const selectBox = {
        left: Infinity,
        top: Infinity,
        width: 0,
        height: 0,
    }
    let selectedDoms: (Element | null)[]
    console.log('isDragEnd', isDragEnd);
    
    if (isDragEnd) {
        // 拖拽
        // 选中拖拽节点
        const isContainerEdge = cursorAtContainerEdge(positionObj.rect, e)
        // 获取所有拖拽节点对应的dom
        // 如果是放入容器，在容器内计算最大矩形
        if (targetNode?.droppable && !isContainerEdge) {
            // 在可放置的容器内
            selectedDoms = selectNodes.value.map(node => {
                return positionObj.targetEl.querySelector(`[${DTD_BASE_KEY}="${node.dragId}"]`)
            })
        } else {
            // 如果不是放入容器，计算所有拖拽节点父级dom的最大矩形
            const parentDtdDom = positionObj.targetEl.parentElement?.closest(`[${DTD_BASE_KEY}]`)
            if (!parentDtdDom) return
            selectedDoms = selectNodes.value.map(node => {
                return parentDtdDom.querySelector(`[${DTD_BASE_KEY}="${node.dragId}"]`)
            })
        }
        // 计算所有拖拽节点对应的dom的最大矩形
        if (!selectedDoms?.length) return
        const maxRect = getBoundingRects(selectedDoms)
        if (!maxRect) return
        selectBox.left = maxRect.left
        selectBox.top = maxRect.top
        selectBox.width = maxRect.width
        selectBox.height = maxRect.height
    } else {
         // 单选
        const { rect } = positionObj
        const left = d_x + rect.left
        const top = d_y + rect.top
        selectBox.left = left
        selectBox.top = top
        selectBox.width = rect.width
        selectBox.height = rect.height
    }
    selectBox.left -= offsetX
    selectBox.top -= offsetY
    selectionStyle.value = {
        transform: `perspective(1px) translate3d(${selectBox.left}px,${selectBox.top}px,0px)`,
        width: selectBox.width + 'px',
        height: selectBox.height + 'px',
        borderWidth: '2px',
    }
}
function resetSelectionRectStyle() {
    selectionStyle.value = initStyle
}
onMounted(() => {
    mouse.on(DragEventType.Select, selectHandler)
})
onBeforeUnmount(() => {
    mouse.off(DragEventType.Select, selectHandler)
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