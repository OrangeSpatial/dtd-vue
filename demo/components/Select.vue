<script setup lang="ts">
import { ref } from 'vue'

const selectData = ref()

const data = ref([
  {
    id: 12,
    name: 'Input',
  },
  {
    id: 13,
    name: 'Button',
  },
  {
    id: 14,
    name: 'Card',
    droppable: true,
    children: [
      {
        id: 15,
        name: 'CardHeader',
      },
      {
        id: 16,
        name: 'CardBody',
      },
      {
        id: 17,
        name: 'CardFooter',
      },
    ],
  }
])
</script>

<template>
  <div class="flex">
    <div class="flex-1" style="padding: 24px;">
      <dtd-pod>
        <div>
          <DragToDrop nodeClass="node-class" class="dtd-root" :data="data" @change="d => data = d">
            <template #default="{ item }">
              <div class="dtd-item">{{ item.props?.name }}</div>
            </template>
          </DragToDrop>
        </div>
        <template #ghost="{ item }">
          <div class="ghost-custom">{{ item?.name }}</div>
        </template>
      </dtd-pod>
    </div>

    <div class="flex-1">
      <div class="title">选中数据：</div>
      <div class="code">
        <pre>{{ selectData }}</pre>
      </div>
    </div>
  </div>
  <div class="title">渲染数据：</div>
      <div class="code">
        <pre>{{ data }}</pre>
      </div>
</template>