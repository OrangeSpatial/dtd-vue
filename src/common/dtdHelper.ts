import { NodeLayout } from "../model/DtdNode"
import { ICursorPosition } from "../model/Mouse"
import { DTD_BASE_KEY, edgeGap } from "./presets"

export function getClosestDtdNode(e: MouseEvent) {
  // 拖拽内元素
  const target = e.target as HTMLElement
  return target.closest(`[${DTD_BASE_KEY}]`) as HTMLElement
}

export function getCursorPositionInDtdNode(e: MouseEvent) {
  const target = getClosestDtdNode(e)
  if (!target) return null
  const rect = target.getBoundingClientRect()
  const { clientX, clientY } = e
  const { left, top, width, height } = rect
  const isTop = clientY < top + height / 2
  const isLeft = clientX < left + width / 3
  const isRight = clientX > left + width / 3
  const isBottom = clientY > top + height / 2
  return {
    rect,
    isTop,
    isLeft,
    isRight,
    isBottom,
    insertBefore: isTop && isLeft,
    targetEl: target
  }
}

export function cursorAtContainerEdge(rect: DOMRect, e: MouseEvent) {
  return (e.clientY - rect.top < edgeGap) || (rect.top + rect.height - e.clientY  < edgeGap)
  || (e.clientX - rect.left < edgeGap) || (rect.left + rect.width - e.clientX < edgeGap)
}

export function setMoveElStyle(el: HTMLElement, position: ICursorPosition) {
  if(!el) return
  const { pageX, pageY } = position
  el.style.height = 'auto'
  el.style.width = 'auto'
  el.style.transform = `perspective(1px) translate3d(${pageX}px, ${pageY}px, 0)`
}

export function removeGhostElStyle(el: HTMLElement) {
  if(!el) return
  el.style.height = '0'
  el.style.width = '0'
  el.style.transform = `perspective(1px) translate3d(0, 0, 0)`
}

export function getLayoutNodeInContainer(container: HTMLElement) {
  const nodeParentELStyle = getComputedStyle(container.parentElement!)
    // support for flex and grid layout
    if (nodeParentELStyle.display === 'flex' && nodeParentELStyle.flexDirection === 'row') {
      return NodeLayout.HORIZONTAL
    }
    if (nodeParentELStyle.display === 'grid' && nodeParentELStyle.gridTemplateColumns) {
      return NodeLayout.HORIZONTAL
    }
    return NodeLayout.VERTICAL
}

/**
 * 计算多个dom的最大外接矩形
 */
export function getBoundingRects(els: (Element | null)[]) {
  const rects = els.filter((el) => el).map((el) => el!.getBoundingClientRect())
  if (!rects.length) return null
  const top = Math.min(...rects.map((rect) => rect.top))
  const left = Math.min(...rects.map((rect) => rect.left))
  const bottom = Math.max(...rects.map((rect) => rect.bottom))
  const right = Math.max(...rects.map((rect) => rect.right))
  return {
    top,
    left,
    bottom,
    right,
    width: right - left,
    height: bottom - top
  }
}