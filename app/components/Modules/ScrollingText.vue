<script lang="ts" setup>
interface Props {
  text: string
  speed?: number // 滚动速度(px/s)
  repeatCount?: number // 重复次数(0表示无限)
  separator?: string // 自定义分隔符
  enableWordSplit?: boolean // 是否启用空格分词
  textStyle?: Record<string, any> // 文本样式配置（已废弃，建议使用textClass）
  textClass?: string // 文本CSS类名
}

const props = withDefaults(defineProps<Props>(), {
  speed: 30,
  repeatCount: 0, // 0表示无限滚动
  separator: ' • ', // 默认分隔符
  enableWordSplit: true, // 默认启用分词
  textStyle: () => ({}), // 默认空样式对象（已废弃）
  textClass: '' // 默认空类名
})

const containerRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const animationRef = ref<number | null>(null)
const isReady = ref(false)

// 处理文本内容
const processText = () => {
  const originalText = props.text

  // 根据分词开关处理文本
  let processedText: string
  if (props.enableWordSplit) {
    // 启用分词：在每个词组后添加自定义分隔符，但保留原始空格结构
    const parts = originalText.split(/(\s+)/) // 按空格分割，但保留空格作为独立元素
    processedText = parts
      .map(part => {
        if (part.trim() === '') {
          // 如果是纯空格，保持原样
          return part
        } else {
          // 如果是非空格内容，在后面添加分隔符
          return part + props.separator
        }
      })
      .join('')
  } else {
    // 不分词：直接在整个文本后添加分隔符
    processedText = originalText + props.separator
  }

  return processedText
}

// 初始化滚动内容 - 创建足够副本确保填满容器
const initScrollContent = () => {
  const wrapper = wrapperRef.value
  const container = containerRef.value
  
  if (!wrapper || !container) return

  // 立即隐藏容器以防止闪烁
  wrapper.style.opacity = '0'
  wrapper.style.transition = 'opacity 0s'

  const processedText = processText()

  // 清空现有内容
  container.innerHTML = ''

  // 创建内容容器
  const contentWrapper = document.createElement('div')
  contentWrapper.className = 'scrolling-text-content-wrapper'
  contentWrapper.style.display = 'flex'
  contentWrapper.style.width = 'fit-content'

  // 计算需要的副本数量确保填满容器
  const tempItem = document.createElement('div')
  tempItem.className = 'scrolling-text-item'
  tempItem.textContent = processedText
  tempItem.style.position = 'absolute'
  tempItem.style.visibility = 'hidden'
  tempItem.style.whiteSpace = 'pre'
  document.body.appendChild(tempItem)
  
  const itemWidth = tempItem.offsetWidth
  document.body.removeChild(tempItem)
  
  if (itemWidth === 0) return
  
  // 获取容器宽度并计算所需副本数
  const containerWidth = wrapper.clientWidth
  const minCopies = Math.ceil(containerWidth / itemWidth) + 2 // 多加2个确保充足
  
  // 创建足够多的副本
  for (let i = 0; i < Math.max(4, minCopies); i++) { // 至少4个副本
    const item = document.createElement('div')
    item.className = 'scrolling-text-item'
    
    // 添加自定义类名
    if (props.textClass) {
      item.classList.add(...props.textClass.split(' ').filter(cls => cls))
    }
    
    item.textContent = processedText
    item.style.whiteSpace = 'pre' // 确保保持空格
    
    // 应用传入的文本样式（兼容旧版，但标记为废弃）
    Object.entries(props.textStyle).forEach(([key, value]) => {
      //@ts-ignore
      item.style[key] = value
    })
    
    contentWrapper.appendChild(item)
  }

  container.appendChild(contentWrapper)

  // 标记准备就绪并淡入显示
  isReady.value = true
  nextTick(() => {
    wrapper.style.transition = 'opacity 0.3s ease'
    wrapper.style.opacity = '1'
  })

  // 启动JS动画
  startJSAnimation()
}

// JS动画实现 - 核心逻辑
const startJSAnimation = () => {
  const container = containerRef.value
  if (!container) return

  const contentWrapper = container.querySelector('.scrolling-text-content-wrapper') as HTMLElement
  if (!contentWrapper) return

  // 获取单个内容项的宽度
  const firstItem = contentWrapper.querySelector('.scrolling-text-item') as HTMLElement
  if (!firstItem) return

  const itemWidth = firstItem.offsetWidth
  if (itemWidth === 0) return

  // 设置容器宽度为两个内容项的总宽度
  contentWrapper.style.width = (itemWidth * 2) + 'px'

  // 使用requestAnimationFrame实现流畅动画
  const pixelsPerFrame = props.speed / 60 // 60fps下的每帧移动距离
  let currentPosition = 0

  const animate = () => {
    currentPosition -= pixelsPerFrame

    // 关键：当移动到一半位置时重置位置，实现无缝循环
    if (Math.abs(currentPosition) >= itemWidth) {
      currentPosition = currentPosition + itemWidth
    }

    contentWrapper.style.transform = `translateX(${currentPosition}px)`
    animationRef.value = requestAnimationFrame(animate)
  }

  // 启动动画循环
  animate()
}

// 停止动画
const stopAnimation = () => {
  if (animationRef.value) {
    cancelAnimationFrame(animationRef.value)
    animationRef.value = null
  }
}

// 监听内容、分隔符和分词开关变化
watch([() => props.text, () => props.separator, () => props.enableWordSplit, () => props.speed], () => {
  nextTick(() => {
    stopAnimation()
    initScrollContent()
  })
})

onMounted(async () => {
  await nextTick()
  initScrollContent()
})

onUnmounted(() => {
  stopAnimation()
})
</script>

<template>
  <div 
    ref="wrapperRef" 
    class="scrolling-text-wrapper"
    :style="{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease' }"
  >
    <div 
      ref="containerRef" 
      class="scrolling-text-container"
    >
      <!-- 内容将在脚本中动态生成 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scrolling-text-wrapper {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}

.scrolling-text-container {
  display: flex;
  width: max-content;
  position: relative;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
  min-width: 100%;
}

.scrolling-text-content-wrapper {
  display: flex;
  width: 100%;
}

.scrolling-text-item {
  flex-shrink: 0;
  display: inline-block;
  white-space: pre; /* 保持原始空格格式 */
}
</style>