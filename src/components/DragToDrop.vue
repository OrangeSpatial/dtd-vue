<script setup lang="ts">
import { computed, inject, isReactive, onBeforeUnmount, ref, watch } from 'vue'
import DtdRecursion from './DtdRecursion.vue'
import DtdItem from './DtdItem.vue'
import { DtdNode } from '../model/DtdNode'
import { DTD_MOUSE } from '../common/injectSymbol'
import { DragEventType, DragNodeType, Mouse } from '../model/Mouse'

defineOptions({
  name: 'DragToDrop',
})

const props = withDefaults(defineProps<{
  data: any[]
  nodeClass?: string
  dragType?: DragNodeType
}>(), {
  dragType: DragNodeType.MOVE
})

const emits = defineEmits(['change'])

const dtdData = ref<DtdNode>(new DtdNode({ children: [] }))

const mouse = inject<Mouse>(DTD_MOUSE)
mouse?.on(DragEventType.DragEnd, (e: MouseEvent, targetNode?: DtdNode) => {
  if (!mouse.dataTransfer.length) return
  if (targetNode && mouse.dataTransfer.find(node => node.isParentOf(targetNode))) return
  dtdData.value.children = dtdData.value.children.slice();
  emits('change', getData())
})

function getData() {
  return DtdNode.toList(dtdData.value)
}

onBeforeUnmount(() => {
  DtdNode.clearCacheAll()
})

function init() {
  if (!mouse) {
    throw new Error('DragToDrop: mouse is required')
  }
  const root = DtdNode.fromList(props.data || [])
  root.dragType = props.dragType
  dtdData.value = root
}

init()

defineExpose({
  getData
})
</script>

<template>
  <dtd-item :data="dtdData" :disabled="dtdData.disabled" :class="!dtdData?.children?.length ? 'full' : ''">
    <DtdRecursion :nodeClass :node="dtdData">
      <template #default="{ item }">
        <slot :item="item" />
      </template>
    </DtdRecursion>
  </dtd-item>
</template>

<style scoped>
.full {
  height: 100%;
  width: 100%;
}
</style>