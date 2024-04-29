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
        droppable: true
    }
])

const data1 = ref([
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
        ])
</script>

<template>
    <dtd-pod>
        <div class="container">
            <div class="left">
                <DragToDrop nodeClass="node-class" class="dtd-root" v-model="data">
                    <template #default="{ item }">
                        <div class="dtd-item">{{ item.props?.name }}</div>
                    </template>
                </DragToDrop>
            </div>
            <div class="right">
                <DragToDrop nodeClass="node-class" class="dtd-root" v-model="data1">
                    <template #default="{ item }">
                        <div class="dtd-item">{{ item.props?.name }}</div>
                    </template>
                </DragToDrop>
            </div>
        </div>
    </dtd-pod>
    <h1>渲染数据：</h1>
    <div class="container">
        <div class="left">
            <div class="code">
                <pre>{{ data }}</pre>
            </div>
        </div>
        <div class="right">
            <div class="code">
                <pre>{{ data1 }}</pre>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 20px;

    .left, .right {
        flex: 1;
    }
}
.ghost-custom {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 5px;
}

:deep(.node-class) {
    background-color: #f0f0f0;
    padding: 10px;
    border: 1px solid #0ac385;
}

.dtd-root {
    background-color: #ececec;
    padding: 4px;
}

.dtd-item {
    padding: 10px;
    background-color: white;
}

.code {
    background-color: #f0f0f0;
    padding: 10px;
}
</style>