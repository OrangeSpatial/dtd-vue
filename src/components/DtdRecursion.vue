<script setup lang="ts">
import { DtdNode } from "../model/DtdNode";
import DtdItem from "./DtdItem.vue";

defineOptions({
  name: "DtdRecursion",
});

const props = withDefaults(
  defineProps<{
    node: DtdNode;
    nodeKey?: string;
    nodeClass?: string;
  }>(),
  {}
);
const itemKey = (item: DtdNode) => {
  return props.nodeKey && item.props?.[props.nodeKey] || item.dragId;
};
</script>

<template>
  <dtd-item
    :class="nodeClass ? nodeClass : ''"
    v-for="n in node.children"
    :key="itemKey(n)"
    :data="n"
    :disabled="n.disabled"
  >
    <slot :item="n"></slot>
    <DtdRecursion :nodeClass v-if="n.children?.length" :node="n">
      <template #default="{ item }">
        <slot :item="item"></slot>
      </template>
    </DtdRecursion>
  </dtd-item>
</template>
