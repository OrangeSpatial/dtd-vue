<script setup lang="ts">
import { ref } from 'vue'

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
  <div style="padding: 24px;">
    <dtd-pod>
        <div class="container">
          <DragToDrop nodeClass="node-class" class="dtd-root" v-model="data">
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
  
  <h1>渲染数据：</h1>
  <div class="code">
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped>

:deep(.node-class) {
    flex: 1;
    background-color: #f0f0f0;
    padding: 10px;
    border: 1px solid #0ac385;
}

.dtd-root {
    display: flex;
    background-color: #ececec;
    padding: 4px;
}

.dtd-item {
    padding: 10px;
    background-color: white;
}
.ghost-custom {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
}

.code {

  background-color: #f0f0f0;
  padding: 10px;
}
</style>
