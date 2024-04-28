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
    <div class="container">
        <div class="left">
        <DragToDrop v-model="data">
            <template #default="{ item }">
                <div class="wwww">{{ item.props?.name }}</div>
            </template>
            <template #ghost="{ item }">
                <div class="ghost-custom">{{ item?.name }}</div>
            </template>
        </DragToDrop>
    </div>

    <div class="right">
        <DragToDrop v-model="data1">
            <template #default="{ item }">
                <div class="wwww">{{ item.props?.name }}</div>
            </template>
            <template #ghost="{ item }">
                <div class="ghost-custom">{{ item?.name }}</div>
            </template>
        </DragToDrop>
    </div>
    </div>

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

.code {
    background-color: #f0f0f0;
    padding: 10px;
}
</style>