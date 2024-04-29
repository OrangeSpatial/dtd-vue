<script setup lang="ts">
import { DtdNode, NodeLayout, insertNode, insertNodeInContainer } from '../model/DtdNode.ts'
import { useCursor } from '../hooks/cursorHook.ts'
import DtdAuxTool from './DtdAuxTool.vue'
import Dtd from './Dtd.vue'
import DtdGhost from './DtdGhost.vue'
import { computed, onBeforeUnmount, ref, provide } from 'vue';
import { DragEventType } from '../model/Mouse';
import { cursorAtContainerEdge, getCursorPositionInDtdNode, getLayoutNodeInContainer } from '../common/dtdHelper.ts';
import { DTD_MOUSE } from '../common/injectSymbol.ts'

defineOptions({
  name: 'DragToDrop',
})

const props = withDefaults(defineProps<{
  modelValue: any[]
  nodeKey?: string
  nodeClass?: string
}>(), {
  nodeKey: 'id'
})
const emits = defineEmits<{
  (event: 'update:modelValue', value: Array<any>): void
}>()
const dtdData = computed({
  get: () => {
    return DtdNode.fromList(props.modelValue || [])
  },
  set: (value: DtdNode) => {
    emits('update:modelValue', DtdNode.toList(value))
  }
})

const { mouse } = useCursor(dtdData.value)
provide(DTD_MOUSE, mouse)
mouse.on(DragEventType.DragEnd, dragEndHandler)
function dragEndHandler(e: MouseEvent, targetNode?: DtdNode) {
  const sourceNode = mouse.dataTransfer
  const positionObj = getCursorPositionInDtdNode(e)
  carryNode.value = undefined
  if (!targetNode || !sourceNode || !positionObj || !mouse.dragElement) return
  const dragType = sourceNode.dragType
  const isContainerEdge = cursorAtContainerEdge(positionObj.rect, e)
  const isVertical = getLayoutNodeInContainer(positionObj.targetEl) === NodeLayout.VERTICAL
  const insertBefore = isVertical ? positionObj.insertBefore : positionObj.isLeft
  if (targetNode?.droppable && !isContainerEdge) {
    insertNodeInContainer(targetNode, sourceNode, insertBefore, dragType)
  } else {
    insertNode(targetNode, sourceNode, isVertical ? positionObj.isTop : positionObj.isLeft, dragType)
  }
  dtdData.value = targetNode.root
}

const carryNode = ref<DtdNode>()

mouse.on(DragEventType.DragStart, () => {
  carryNode.value = mouse.dataTransfer as DtdNode
})

function ghostMounted(el: HTMLElement) {
  mouse.setGhostElement(el)
}

onBeforeUnmount(() => {
  mouse.off(DragEventType.DragEnd, dragEndHandler)
})

function init() {
  if(!props.nodeKey && !props.modelValue?.[0].id) {
    console.error('DragToDrop: key is required')
  }
}

init()
</script>

<template>
  <Dtd :nodeKey="nodeKey" :nodeClass :node="dtdData">
    <template #default="{ item }">
      <slot :item="item" />
    </template>
  </Dtd>
  <dtd-aux-tool />
  <dtd-ghost @mounted="ghostMounted">
    <slot name="ghost" v-if="carryNode" :item="carryNode?.props"/>
  </dtd-ghost>
</template>

<style scoped>
.drag-to-drop {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
