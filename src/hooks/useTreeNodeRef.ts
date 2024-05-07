import { customRef, reactive } from "vue";

export function useTreeNodeRef(node: any) {
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                console.log('get', node);
                return node;
            },
            set(value) {
                node = treeReactive(value);
                trigger();
            },
        };
    });
}

function treeReactive(node: any) {
    if (Array.isArray(node.children)) {
        node.children = reactive(node.children.map((child: any) => treeReactive(child)));
    }
    return reactive(node);
}