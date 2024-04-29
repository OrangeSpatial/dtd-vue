<script setup lang="ts">
import { computed, inject } from 'vue'
import DtdRecursion from './DtdRecursion.vue'
import DtdItem from './DtdItem.vue'
import { DtdNode } from '../model/DtdNode'
import { DTD_MOUSE } from '../common/injectSymbol'
import { DragEventType, Mouse } from '../model/Mouse'

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
  get: () => DtdNode.fromList(props.modelValue || []),
  set: (value: DtdNode) => {
    emits('update:modelValue', DtdNode.toList(value))
  }
})

const mouse = inject<Mouse>(DTD_MOUSE)
mouse.on(DragEventType.DragEnd, (e: MouseEvent, targetNode?: DtdNode) => {
  // 更新
  dtdData.value = dtdData.value
})
function init() {
    if (!props.nodeKey && !props.modelValue?.[0].id) {
        console.error('DragToDrop: key is required')
    }
    if (!mouse) {
        throw new Error('DragToDrop: mouse is required')
    }
}

init()
</script>

<template>
  <dtd-item :data="dtdData" :disabled="dtdData.disabled" :class="!dtdData?.children?.length ? 'full' : ''">
    <DtdRecursion :nodeKey="nodeKey" :nodeClass :node="dtdData">
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