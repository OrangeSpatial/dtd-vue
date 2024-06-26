<script setup lang="ts">
import { CSSProperties, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { DTD_BASE_KEY, initStyle } from '../../common/presets';
import { DragEventType, Mouse } from '../../model/Mouse';
import { DTD_MOUSE } from '../../common/injectSymbol';
import { DtdNode } from '../../model/DtdNode';
import { cursorAtContainerEdge, getBoundingRects, getCursorPositionInDtdNode, getLayoutNodeInContainer } from '../../common/dtdHelper';


defineOptions({
    name: 'AuxSelection',
})

const props = withDefaults(defineProps<{
    parentEl?: HTMLElement;
    scrollPosition: { scrollTop: number, scrollLeft: number };
}>(), {
    scrollPosition: () => ({ scrollTop: 0, scrollLeft: 0 })
})

const selectNodes = ref<{
    selectionStyle: CSSProperties;
    selectNode: DtdNode;
    startPosition: { x: number; y: number };
    startLeft: number;
    startTop: number;
}[]>([])

const mouse = inject<Mouse>(DTD_MOUSE)
if (!mouse) {
    throw new Error('DtdAuxTool: mouse is required')
}
function selectHandler(e: MouseEvent, targetNode?: DtdNode) {
    selectNodes.value = []
    mouse?.selectedNodes.forEach(selectNode => {
        selectNodes.value.push({
            selectNode: selectNode.node,
            selectionStyle: initStyle,
            startPosition: { x: props.scrollPosition.scrollLeft, y: props.scrollPosition.scrollTop },
            startLeft: 0,
            startTop: 0,
        })
        nextTick(() => {
            updateSelection(selectNode.e, targetNode, Boolean(targetNode))
        })
    })
}

function updateSelection(e: MouseEvent, targetNode?: DtdNode, isDragEnd = false) {
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
    // 节点对应的dom
    let selectedDoms: (Element | null)[]
    
    if (isDragEnd) {
        // 拖拽
        // 选中拖拽节点
        const isContainerEdge = cursorAtContainerEdge(positionObj.rect, e)
        // 获取所有拖拽节点对应的dom
        // 如果是放入容器，在容器内计算最大矩形
        if (targetNode?.droppable && !isContainerEdge) {
            // 在可放置的容器内
            selectedDoms = selectNodes.value.map(item => {
                return positionObj.targetEl.querySelector(`[${DTD_BASE_KEY}="${item.selectNode.dragId}"]`)
            })
        } else {
            // 如果不是放入容器，计算所有拖拽节点父级dom的最大矩形
            const parentDtdDom = positionObj.targetEl.parentElement?.closest(`[${DTD_BASE_KEY}]`)
            if (!parentDtdDom) return
            selectedDoms = selectNodes.value.map(item => {
                return parentDtdDom.querySelector(`[${DTD_BASE_KEY}="${item.selectNode.dragId}"]`)
            })
        }
    } else {
        selectedDoms = selectNodes.value.map(item => {
            return container.querySelector(`[${DTD_BASE_KEY}="${item.selectNode.dragId}"]`)
        })
    }
    // 计算所有拖拽节点对应的dom的最大矩形
    if (!selectedDoms?.length) return
    selectedDoms.map((dom, index) => {
        const rect = dom?.getBoundingClientRect()
        if (!rect) return
        const left = rect.left - offsetX
        const top = rect.top - offsetY
        const width = rect.width
        const height = rect.height
        selectNodes.value[index].startLeft = left
        selectNodes.value[index].startTop = top
        selectNodes.value[index].selectionStyle = {
            transform: `translate3d(${left}px,${top}px,0px)`,
            width: width + 'px',
            height: height + 'px',
            borderWidth: '2px',
        }
    })
}
function resetSelectionRectStyle() {
    selectNodes.value = []
}

function updateSelectionRectStyle() {
    selectNodes.value.map(item => {
        const dx = props.scrollPosition.scrollLeft - item.startPosition.x
        const dy = props.scrollPosition.scrollTop - item.startPosition.y
        const left = item.startLeft - dx
        const top = item.startTop - dy
        item.selectionStyle = {
            ...item.selectionStyle,
            transform: `translate3d(${left}px,${top}px,0px)`,
        }
    })
}

watch(() => props.scrollPosition, () => {
    updateSelectionRectStyle()
}, { deep: true })

onMounted(() => {
    mouse.on(DragEventType.Select, selectHandler)
})
onBeforeUnmount(() => {
    mouse.off(DragEventType.Select, selectHandler)
})
</script>

<template>
    <div v-for="(item) in selectNodes" :key="item.selectNode.dragId" class="dtd-aux-selection-box" :style="item.selectionStyle"></div>
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