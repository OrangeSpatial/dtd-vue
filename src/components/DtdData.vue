<script setup lang="ts">
import { computed, inject } from 'vue'
import Dtd from './Dtd.vue'
import { DtdNode } from '../model/DtdNode'
import { DTD_MOUSE } from '../common/injectSymbol'
import { DragEventType, Mouse } from '../model/Mouse'

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
    console.log('props.modelValue', props.modelValue);
    return DtdNode.fromList(props.modelValue || [])
  },
  set: (value: DtdNode) => {
    emits('update:modelValue', DtdNode.toList(value))
  }
})

const mouse = inject<Ref<Mouse>>(DTD_MOUSE)
mouse.on(DragEventType.DragEnd, (e: MouseEvent, targetNode?: DtdNode) => {
    // 更新
    dtdData.value = dtdData.value
})

</script>

<template>
    <Dtd :nodeKey="nodeKey" :nodeClass :node="dtdData">
      <template #default="{ item }">
        <slot :item="item" />
      </template>
    </Dtd>
  </template>