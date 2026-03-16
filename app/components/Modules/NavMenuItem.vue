<script lang="ts" setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'

interface SubMenuItem {
  label: string
  href?: string
  icon?: string
  linkTarget?: string
  subItems?: SubMenuItem[] // 支持嵌套子菜单
}

interface Props {
  icon: string
  label: string
  href?: string
  subItems?: SubMenuItem[]
  isExpanded: boolean
  mode: 'expand' | 'float'
  linkTarget?: string
}

const props = withDefaults(defineProps<Props>(), {
  href: '#',
  subItems: () => [],
  mode: 'expand',
  linkTarget: undefined
})

const isOpen = ref(false)
const menuItemRef = ref<HTMLElement | null>(null)
const isFloatVisible = ref(false)
const nestedOpenState = ref<Record<string, boolean>>({}) // 使用唯一键存储嵌套子菜单状态
const floatMenuRef = ref<HTMLElement | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)
const rafId = ref<number | null>(null) // requestAnimationFrame ID
const isTracking = ref(false) // 是否正在跟踪位置
const hideTimer = ref<ReturnType<typeof setTimeout> | null>(null) // 延迟隐藏定时器
const NAV_TRANSITION_DURATION = 50 // 导航栏过渡时间 ms
const floatMenuStyle = ref({
  position: 'fixed' as const,
  zIndex: 9999
})

const hasSubMenu = computed(() => props.subItems && props.subItems.length > 0)

// 展开模式：仅当 mode 为 expand 且 isExpanded 为 true 时
const isExpandMode = computed(() => props.mode === 'expand' && props.isExpanded)

// 悬浮模式：只要 mode 为 float，无论 isExpanded 是什么值
const isFloatMode = computed(() => props.mode === 'float')

// 生成唯一键
const getUniqueKey = (item: SubMenuItem, index: number) => {
  return `${item.label}-${index}-${item.href || ''}`
}

// 计算悬浮菜单位置 - 直接操作 DOM 避免 Vue 响应式开销
const calculateFloatPosition = () => {
  if (!menuItemRef.value || !floatMenuRef.value) return

  const rect = menuItemRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const padding = 8
  const el = floatMenuRef.value

  const spaceAbove = rect.top
  const spaceBelow = viewportHeight - rect.bottom

  // 直接操作 DOM
  el.style.left = `${rect.right + 4}px`

  if (spaceAbove >= spaceBelow) {
    el.style.top = 'auto'
    el.style.bottom = `${window.innerHeight - rect.top}px`
    el.style.maxHeight = `${spaceAbove - padding}px`
  } else {
    el.style.top = `${rect.top}px`
    el.style.bottom = 'auto'
    el.style.maxHeight = `${spaceBelow - padding}px`
  }
}

// 过渡期间持续跟踪位置（requestAnimationFrame）
const startTracking = () => {
  if (isTracking.value) return
  isTracking.value = true

  const track = () => {
    if (!isTracking.value) return
    calculateFloatPosition()
    rafId.value = requestAnimationFrame(track)
  }
  rafId.value = requestAnimationFrame(track)
}

const stopTracking = () => {
  isTracking.value = false
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}

const showFloatMenu = () => {
  if (!isFloatMode.value || !hasSubMenu.value) return

  // 取消任何待定的隐藏
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }

  isFloatVisible.value = true
  // 等元素显示后再开始追踪
  nextTick(() => {
    calculateFloatPosition()
    startTracking()
  })
}

const hideFloatMenu = () => {
  // 如果正在追踪（有过渡在进行），延迟隐藏让动画完成
  if (isTracking.value) {
    if (hideTimer.value) clearTimeout(hideTimer.value)
    hideTimer.value = setTimeout(() => {
      isFloatVisible.value = false
      stopTracking()
      nestedOpenState.value = {}
      hideTimer.value = null
    }, NAV_TRANSITION_DURATION)
    return
  }

  // 否则立即隐藏
  isFloatVisible.value = false
  stopTracking()
  nestedOpenState.value = {}
}

const toggleDropdown = () => {
  if (!hasSubMenu.value || isFloatMode.value) return

  isOpen.value = !isOpen.value

  if (!isOpen.value) {
    // 重置嵌套子菜单状态
    nestedOpenState.value = {}
  }
}

const toggleNestedDropdown = (item: SubMenuItem, index: number) => {
  const key = getUniqueKey(item, index)
  nestedOpenState.value[key] = !nestedOpenState.value[key]
  // 嵌套菜单展开/收起时更新位置
  nextTick(() => {
    if (isFloatVisible.value) {
      calculateFloatPosition()
    }
  })
}

const closeDropdown = () => {
  if (isExpandMode.value) {
    isOpen.value = false
    nestedOpenState.value = {}
  }
}

// 监听滚动和 resize（备用，rAF 已持续更新，但这些监听器可以处理 rAF 暂停的情况）
const handleScroll = () => {
  // rAF 已经在跟踪，这里不需要额外处理
}

const handleResize = () => {
  // rAF 已经在跟踪，这里不需要额外处理
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)

  if (menuItemRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      if (isFloatVisible.value) {
        calculateFloatPosition()
      }
    })
    resizeObserver.value.observe(menuItemRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
  // 清理定时器和动画帧
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
  }
  stopTracking()
})

watch(() => props.isExpanded, (newVal, oldVal) => {
  if (!newVal && isExpandMode.value) {
    closeDropdown()
  }

  // 菜单可见时，确保追踪在进行（展开和收回都跟随）
  if (isFloatVisible.value) {
    if (!isTracking.value) {
      startTracking()
    }
    // 收回时设置延迟隐藏，让菜单跟随过渡完成
    if (!newVal && !hideTimer.value) {
      hideTimer.value = setTimeout(() => {
        isFloatVisible.value = false
        stopTracking()
        nestedOpenState.value = {}
        hideTimer.value = null
      }, NAV_TRANSITION_DURATION)
    }
  }
})

watch(() => props.mode, () => {
  // 切换模式时隐藏悬浮菜单
  hideFloatMenu()
  // 切换到展开模式时关闭下拉菜单
  if (isExpandMode.value) {
    closeDropdown()
  }
})

defineExpose({
  closeDropdown
})
</script>

<template>
  <div ref="menuItemRef" class="nav-menu-item" :class="{
    'has-submenu': hasSubMenu,
    'is-open': isOpen,
    'mode-expand': isExpandMode,
    'mode-float': isFloatMode
  }" @mouseenter="isFloatMode ? showFloatMenu() : null" @mouseleave="isFloatMode ? hideFloatMenu() : null">
    <!-- 主菜单项 -->
    <a :href="href" :target="linkTarget" class="nav-menu-link horizon-navMenuItem"
      @click="(e: MouseEvent) => { if (hasSubMenu && isExpandMode) { e.preventDefault(); toggleDropdown(); } }">
      <Icon class="menu-icon" :name="icon" />
      <span v-if="isExpanded" class="menu-text">{{ label }}</span>
      <span v-if="hasSubMenu && isExpandMode" class="dropdown-icon" :class="{ 'is-rotated': isOpen }">
        <Icon name="tdesign:chevron-down" />
      </span>
    </a>

    <!-- 展开模式：内嵌下拉菜单 -->
    <div v-if="hasSubMenu && isExpandMode" class="dropdown-menu dropdown-menu--expand" :class="{ 'is-open': isOpen }">
      <!-- 子菜单项 -->
      <div v-for="(item, index) in subItems" :key="getUniqueKey(item, index)">
        <!-- 普通子菜单项 -->
        <a v-if="!item.subItems" :href="item.href || '#'" :target="item.linkTarget" class="dropdown-link ">
          <Icon v-if="item.icon" class="dropdown-link-icon" :name="item.icon" />
          <span>{{ $t(item.label) }}</span>
        </a>

        <!-- 嵌套子菜单项 -->
        <div v-else class="nested-submenu">
          <div class="nested-submenu-title" @click="toggleNestedDropdown(item, index)">
            <Icon v-if="item.icon" class="dropdown-link-icon" :name="item.icon" />
            <span>{{ $t(item.label) }}</span>
            <span class="nested-submenu-arrow" :class="{ 'is-rotated': nestedOpenState[getUniqueKey(item, index)] }">
              <Icon name="tdesign:chevron-down" />
            </span>
          </div>
          <div class="nested-submenu-content" :class="{ 'is-open': nestedOpenState[getUniqueKey(item, index)] }">
            <a v-for="(subItem, subIndex) in item.subItems" :key="getUniqueKey(subItem, subIndex)"
              :href="subItem.href || '#'" :target="subItem.linkTarget" class="nested-dropdown-link">
              <Icon v-if="subItem.icon" class="dropdown-link-icon" :name="subItem.icon" />
              <span>{{ $t(subItem.label) }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮模式：固定定位下拉菜单 -->
    <Transition name="float-menu">
      <div ref="floatMenuRef" v-show="isFloatVisible" class="dropdown-menu dropdown-menu--float" :style="floatMenuStyle"
        @mouseenter="showFloatMenu" @mouseleave="hideFloatMenu">
        <!-- 下拉菜单标题 -->
        <div class="dropdown-title">{{ label }}</div>

        <!-- 子菜单项 -->
        <div v-for="(item, index) in subItems" :key="getUniqueKey(item, index)">
          <!-- 普通子菜单项 -->
          <a v-if="!item.subItems" :href="item.href || '#'" :target="item.linkTarget" class="dropdown-link">
            <Icon v-if="item.icon" class="dropdown-link-icon" :name="item.icon" />
            <span>{{ $t(item.label) }}</span>
          </a>

          <!-- 嵌套子菜单项 -->
          <div v-else class="nested-submenu nested-submenu--float">
            <div class="nested-submenu-title" @click="toggleNestedDropdown(item, index)">
              <Icon v-if="item.icon" class="dropdown-link-icon" :name="item.icon" />
              <span>{{ $t(item.label) }}</span>
              <span class="nested-submenu-arrow" :class="{ 'is-rotated': nestedOpenState[getUniqueKey(item, index)] }">
                <Icon name="tdesign:chevron-right" />
              </span>
            </div>
            <div class="nested-submenu-content"
              :style="{ height: nestedOpenState[getUniqueKey(item, index)] ? 'auto' : '0' }">
              <a v-for="(subItem, subIndex) in item.subItems" :key="getUniqueKey(subItem, subIndex)"
                :href="subItem.href || '#'" :target="subItem.linkTarget" class="nested-dropdown-link">
                <Icon v-if="subItem.icon" class="dropdown-link-icon" :name="subItem.icon" />
                <span>{{ $t(subItem.label) }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/css/themes/mixins' as HorizonMixins;

.nav-menu-item {
  position: relative;
  min-width: 100%;
}

.nav-menu-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem;
  color: #ffffff;
  background-color: #222222;
  text-decoration: none;
  //border-radius: 0.2rem 0 0 0.2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  //@include HorizonMixins.decorator-horizon-transition-bar();

  &:hover {
    color: #151A2D;
    background: #474747;
  }
}

.menu-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.menu-text {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.dropdown-icon {
  margin-left: auto;
  font-size: 1rem;
  transition: transform 0.3s ease;

  &.is-rotated {
    transform: rotate(180deg);
  }
}

// 展开模式（移动端/展开态）
.dropdown-menu--expand {
  overflow: hidden;
  list-style: none;
  padding-left: 1rem;
  max-height: 0;
  transition: max-height 0.3s ease;

  &.is-open {
    max-height: 500px; // 足够大的值，确保能容纳所有内容
  }

  .dropdown-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: #F1F4FF;
    text-decoration: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .dropdown-link-icon {
    font-size: 1rem;
  }

  // 嵌套子菜单
  .nested-submenu {
    margin: 0.25rem 0;

    .nested-submenu-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      color: #F1F4FF;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      .nested-submenu-arrow {
        margin-left: auto;
        font-size: 0.75rem;
        transition: transform 0.3s ease;

        &.is-rotated {
          transform: rotate(90deg);
        }
      }
    }

    .nested-submenu-content {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease;
      margin-left: 1.5rem;
      // margin-top: 0.25rem;

      &.is-open {
        max-height: 300px; // 足够大的值，确保能容纳所有嵌套内容
      }

      .nested-dropdown-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 1rem;
        color: #F1F4FF;
        text-decoration: none;
        border-radius: 0.375rem;
        font-size: 0.8rem;
        transition: all 0.2s ease;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
}

// 悬浮模式（PC折叠态）- 固定定位
.dropdown-menu--float {
  min-width: 180px;
  padding: 0.5rem;
  background: #222222;
  border-radius: 0.5rem;
  @include HorizonMixins.decorator-svg-background-overlay(0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  // GPU 加速，让位置更新更流畅
  will-change: left, top, bottom, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .dropdown-title {
    padding: 0.5rem 0.75rem;
    color: #fff;
    font-weight: 600;
    font-size: 0.875rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 0.25rem;
    position: relative;
    @include HorizonMixins.decorator-horizon-transition-bar();

  }

  .dropdown-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: #F1F4FF;
    text-decoration: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    position: relative;

    @include HorizonMixins.decorator-horizon-transition-bar();

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .dropdown-link-icon {
    font-size: 1rem;
  }

  // 嵌套子菜单（悬浮模式）
  .nested-submenu {
    //margin: 0.25rem 0;

    .nested-submenu-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: #F1F4FF;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;

      @include HorizonMixins.decorator-horizon-transition-bar();

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      .nested-submenu-arrow {
        margin-left: auto;
        font-size: 0.75rem;
        transition: transform 0.3s ease;

        &.is-rotated {
          transform: rotate(90deg);
        }
      }
    }

    .nested-submenu-content {
      overflow: hidden;
      transition: height 0.3s ease;
      margin-left: 0.5rem;
      //margin-top: 0.25rem;

      .nested-dropdown-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.75rem;
        color: #F1F4FF;
        text-decoration: none;
        border-radius: 0.375rem;
        font-size: 0.8rem;
        transition: all 0.2s ease;

        position: relative;

        @include HorizonMixins.decorator-horizon-transition-bar($colors: (#ff6b6b, #feca57, #48dbfb));

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
}

// 悬浮菜单动画 - 只用 opacity，不用 transform（避免和 JS 位置更新冲突）
.float-menu-enter-active,
.float-menu-leave-active {
  transition: opacity 0.2s ease;
}

.float-menu-enter-from,
.float-menu-leave-to {
  opacity: 0;
}

.float-menu-enter-to,
.float-menu-leave-from {
  opacity: 1;
}

// 悬浮模式下隐藏展开模式的下拉箭头
.mode-float .dropdown-icon {
  display: none;
}
</style>
