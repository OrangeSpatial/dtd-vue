import { uid } from '../common/uid.ts';
import { DragNodeType, Mouse } from './Mouse.ts'

interface IDtdNode {
  dragId?: string;
  droppable?: boolean;
  dragType?: DragNodeType;
  props?: Record<string | number | symbol, any>;
  children: IDtdNode[];
}

export enum NodeInPosition {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  TOP_RIGHT = 'top_right',
  BOTTOM_RIGHT = 'bottom_right',
  BOTTOM_LEFT = 'bottom_left',
  TOP_LEFT = 'top_left'
}

export enum NodeLayout {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

const TreeNodes = new Map<string, DtdNode>();

export class DtdNode {
  root!: DtdNode;
  parent!: DtdNode;
  depth = 0;
  dragId!: string;
  dragType: DragNodeType = DragNodeType.MOVE;
  droppable = false;
  disabled = false;
  props: IDtdNode['props'] = {};
  children: DtdNode[] = [];

  constructor(node: IDtdNode, parent?: DtdNode) {
    if (node instanceof DtdNode) {
      return node;
    }
    this.dragId = node.dragId || uid();
    if (parent) {
      this.depth = parent.depth + 1;
      this.parent = parent;
      this.root = parent.root;
    } else {
      this.droppable = true;
      this.root = this;
    }

    if (node) {
      this.props = node.props || node;
      if (node.droppable) this.droppable = node.droppable;
      if (node.dragType && Object.values(DragNodeType).includes(node.dragType)) {
        this.dragType = node.dragType;
      }
      this.children = (node?.children || []).map((child) => new DtdNode(child, this));
    }
    TreeNodes.set(this.dragId, this);
  }

  clone() {
    return new DtdNode(DtdNode.getIDtdNode(this), this.parent);
  }

  static fromList(list: IDtdNode[]) {
    return new DtdNode({ children: list });
  }

  static toList(node: DtdNode): any[] {
    return node.children.map((child) => {
      const children = child.children?.length ? DtdNode.toList(child) : undefined
      return {
        ...child.props,
        children
      };
    });
  }

  static getIDtdNode(node: DtdNode): IDtdNode {
    return {
      dragId: node.dragId,
      droppable: node.droppable,
      dragType: node.dragType,
      props: node.props,
      children: node.children.map((child) => DtdNode.getIDtdNode(child))
    };
  }

  static deleteCache(root: DtdNode) {
    TreeNodes.delete(root.dragId);
    root.children.forEach((child) => DtdNode.deleteCache(child));
  }

  static clearCacheAll() {
    TreeNodes.clear();
  }

  // 判断节点是否是自己或者父节点
  isParentOf(node: DtdNode): boolean {
    return node == this || node.parent && this.isParentOf(node.parent);
  }
}

function deleteNodeFromParentByDragId(parent: DtdNode, dragId: string) {
  parent.children = parent.children.filter((child) => child.dragId !== dragId);
}

export function deleteNode(node: DtdNode | DtdNode[], deleteCache = false) {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((n) => deleteNode(n));
    return;
  }
  const parent = node.parent || node;
  deleteNodeFromParentByDragId(parent, node.dragId)
  if (deleteCache) {
    TreeNodes.delete(node.dragId);
  }
}

/**
 * 插入到指定位置
 * @param targetNode 被插入节点
 * @param sourceNodes 待插入节点
 * @param insertBefore
 * @param type
 */
export function insertNode(
  targetNode: DtdNode,
  sourceNodes: DtdNode[],
  insertBefore: boolean,
  type: DragNodeType
) {
  if (!targetNode || !sourceNodes) return;
  const parent = targetNode.parent || targetNode;
  if (type === DragNodeType.MOVE) {
    // 删除原节点
    deleteNode(sourceNodes);
  }
  const insertNodes = sourceNodes.map(node => {
    node.parent = parent;
    // 如果是copy
    if (type === DragNodeType.COPY) {
      node = new DtdNode({ ...node, dragId: '' }, parent);
    }
    return node;
  });
  parent.children.splice(
    parent.children.findIndex(node => targetNode.dragId === node.dragId) + (insertBefore ? 0 : 1),
    0,
    ...insertNodes
  );
}

/**
 * 插入到容器
 * @param targetNode 
 * @param sourceNodes 
 * @param insertBefore 
 * @param type 
 * @returns 
 */
export function insertNodeInContainer(
  targetNode: DtdNode,
  sourceNodes: DtdNode[],
  insertBefore: boolean,
  type: DragNodeType
) {
  if (!targetNode || !sourceNodes) return;
  if (type === DragNodeType.MOVE) {
    // 删除原节点
    deleteNode(sourceNodes);
  }
  const insertNodes = sourceNodes.map(node => {
    node.parent = targetNode;
    if (type === DragNodeType.COPY) {
      node = new DtdNode({ ...node, dragId: '' }, targetNode);
    }
    return node;
  })
  insertBefore ? targetNode.children.unshift(...insertNodes) : targetNode.children.push(...insertNodes);
}

export function getNode(dragId: string) {
  if (!TreeNodes.has(dragId)) return undefined;
  return TreeNodes.get(dragId);
}

export function getClosetDroppableNode(dragId: string) {
  let node = getNode(dragId);
  while (node && !node.droppable) {
    node = node.parent;
  }
  return node;
}

export function clearTreeNodes() {
  TreeNodes.clear();
}
