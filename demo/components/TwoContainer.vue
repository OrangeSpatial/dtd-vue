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
    <div class="title">渲染数据：</div>
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