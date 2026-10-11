<template>
  <Teleport to="body">
    <Transition name="widget-pop">
      <div
        v-show="isOpen"
        class="widget-pop"
        :class="widgetClass"
        :style="widgetStyle"
        @click.stop
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- 弹窗标题 -->
        <div v-if="title" class="widget-pop-title">
          {{ title }}
        </div>
        
        <!-- 弹窗内容 -->
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  isOpen: boolean
  triggerElement: HTMLElement | null
  title?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  align?: 'start' | 'center' | 'end'
  autoClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  position: 'right',
  offset: 8,
  align: 'start',
  autoClose: true
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'show': []
  'hide': []
}>()

const widgetRef = ref<HTMLElement | null>(null)
const position = ref({ top: 0, left: 0 })

// 计算弹窗样式
const widgetStyle = computed(() => {
  return {
    top: `${position.value.top}px`,
    left: `${position.value.left}px`,
    zIndex: 9999
  }
})

// 计算弹窗类名
const widgetClass = computed(() => {
  return {
    [`position-${props.position}`]: true,
    [`align-${props.align}`]: true
  }
})

// 计算弹窗位置
const calculatePosition = () => {
  if (!props.triggerElement) return
  
  const rect = props.triggerElement.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  switch (props.position) {
    case 'top':
      position.value = {
        top: rect.top + scrollTop - props.offset,
        left: getAlignedLeft(rect)
      }
      break
    case 'bottom':
      position.value = {
        top: rect.bottom + scrollTop + props.offset,
        left: getAlignedLeft(rect)
      }
      break
    case 'left':
      position.value = {
        top: getAlignedTop(rect),
        left: rect.left + scrollLeft - props.offset
      }
      break
    case 'right':
    default:
      position.value = {
        top: getAlignedTop(rect),
        left: rect.right + scrollLeft + props.offset
      }
      break
  }
}

// 计算对齐的左侧位置
const getAlignedLeft = (rect: DOMRect) => {
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  switch (props.align) {
    case 'center':
      return rect.left + scrollLeft + (rect.width / 2)
    case 'end':
      return rect.right + scrollLeft
    case 'start':
    default:
      return rect.left + scrollLeft
  }
}

// 计算对齐的顶部位置
const getAlignedTop = (rect: DOMRect) => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  switch (props.align) {
    case 'center':
      return rect.top + scrollTop + (rect.height / 2)
    case 'end':
      return rect.bottom + scrollTop
    case 'start':
    default:
      return rect.top + scrollTop
  }
}

// 处理鼠标进入
const handleMouseEnter = () => {
  if (props.autoClose) {
    // 鼠标进入弹窗时保持打开状态
  }
}

// 处理鼠标离开
const handleMouseLeave = () => {
  if (props.autoClose) {
    emit('update:isOpen', false)
    emit('hide')
  }
}

// 处理点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (props.isOpen && widgetRef.value && !widgetRef.value.contains(event.target as Node) && 
      props.triggerElement && !props.triggerElement.contains(event.target as Node)) {
    emit('update:isOpen', false)
    emit('hide')
  }
}

// 处理滚动和窗口大小变化
const handleScroll = () => {
  if (props.isOpen) {
    calculatePosition()
  }
}

const handleResize = () => {
  if (props.isOpen) {
    calculatePosition()
  }
}

// 监听打开状态变化
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      calculatePosition()
      emit('show')
    })
  } else {
    emit('hide')
  }
})

// 监听触发元素变化
watch(() => props.triggerElement, () => {
  if (props.isOpen) {
    nextTick(() => {
      calculatePosition()
    })
  }
})

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})

// 暴露方法
defineExpose({
  calculatePosition
})
</script>

<style lang="scss" scoped>
.widget-pop {
  position: fixed;
  min-width: 180px;
  padding: 0.5rem;
  background: #151A2D;
  border-radius: 0.625rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-family: inherit;
  
  // 位置调整
  &.position-top {
    transform: translateY(-100%);
  }
  
  &.position-left {
    transform: translateX(-100%);
  }
  
  &.align-center {
    transform: translateX(-50%);
  }
  
  &.align-end {
    transform: translateX(-100%);
  }
}

.widget-pop-title {
  padding: 0.5rem 0.75rem;
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.25rem;
}

// 动画效果
.widget-pop-enter-active,
.widget-pop-leave-active {
  transition: all 0.25s ease;
}

.widget-pop-enter-from,
.widget-pop-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

// 自定义内容样式
:deep(.widget-pop-content) {
  // 可以在这里定义默认的内容样式
}

:deep(.widget-pop-link) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: #F1F4FF;
  text-decoration: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>