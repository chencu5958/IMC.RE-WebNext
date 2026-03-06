<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import ScrollingText from './ScrollingText.vue'

const NavDataActions = {
    DesktopExpand: 'desktop-nav-expand',
} as const

const navigationStore = useNavigationStore()
const { width, height, currentBreakpoint } = useMediaQuery()

// 使用 storeToRefs 保持所有属性的响应性
const { devMode, forceMobile, forceDesktop, isMobileView } = storeToRefs(navigationStore)

// 控制展开状态
const isAlwaysExpanded = ref(false) // 按钮控制的始终展开状态（优先级最高）
const isHoverEnabled = ref(true) // 是否启用 hover 展开功能
const isHovered = ref(false) // hover 状态

// 检测输入类型（鼠标/触摸）
const inputType = ref<'mouse' | 'touch' | 'pen'>('mouse')

// 计算展开状态：始终展开 > hover展开（仅当启用时且使用鼠标时）
const isExpanded = computed(() => isAlwaysExpanded.value || (isHoverEnabled.value && inputType.value === 'mouse' && isHovered.value))

// 监听指针事件来检测输入类型
const handlePointerDown = (e: PointerEvent) => {
    inputType.value = e.pointerType as 'mouse' | 'touch' | 'pen'
}

// 计算 widgetpop 的定位样式
const widgetPopStyle = computed(() => {
    const navWidth = isExpanded.value ? '12.5rem' : '4.5rem'
    return {
        position: 'fixed',
        left: navWidth,
        top: 'auto',
        bottom: '2rem',
        zIndex: '1000'
    }
})

// 切换展开状态
const toggleExpand = () => {
    isAlwaysExpanded.value = !isAlwaysExpanded.value
}

// 调试控制函数（使用 store 的方法）
const toggleForceMobile = () => navigationStore.toggleForceMobile()
const toggleForceDesktop = () => navigationStore.toggleForceDesktop()

// 触摸处理 - 触摸时强制展开
const handleTouch = (e: PointerEvent) => {
    inputType.value = 'touch'
    const target = e.target as HTMLElement
    const isButtonClick = target.closest(`[data-action="${NavDataActions.DesktopExpand}"]`)

    if (!isButtonClick) {
        isAlwaysExpanded.value = true
    }
}

// 动画定时器
const animationTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// 监听视图变化，控制导航动画状态
watch(isMobileView, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        // 清除之前的定时器
        if (animationTimer.value) {
            clearTimeout(animationTimer.value)
        }

        // 通过 store 设置动画状态
        navigationStore.setNavAnimating(true)

        // 动画时长（与 CSS 过渡时长一致）
        animationTimer.value = setTimeout(() => {
            navigationStore.setNavAnimating(false)
            animationTimer.value = null
        }, 400)
    }
})

// 暴露状态给父组件
defineExpose({
    isExpanded
})

// 组件卸载时清除定时器
onUnmounted(() => {
    if (animationTimer.value) {
        clearTimeout(animationTimer.value)
    }
})
</script>

<template>
    <div class="horizon-navContainer" :class="{ 'input-type-touch': inputType === 'touch' }"
        @pointerdown="handlePointerDown">
        <!-- 开发环境调试面板 -->
        <ClientOnly>
            <div v-if="devMode" class="horizon-nav__debug-panel">
                <button @click="toggleForceMobile" :class="{ active: forceMobile }" class="debug-btn">
                    强制移动端
                </button>
                <button @click="toggleForceDesktop" :class="{ active: forceDesktop }" class="debug-btn">
                    强制桌面端
                </button>

                <div style="color: white; margin-top: 10px; font-size: 10px;">
                    调试状态: Mobile={{ forceMobile }}, Desktop={{ forceDesktop }}, Hover={{ isHoverEnabled }}
                </div>
                <div style="color: white; margin-top: 5px; font-size: 10px;">
                    当前断点: {{ currentBreakpoint }}
                </div>
            </div>
        </ClientOnly>


        <ClientOnly>
            <Transition name="horizon-nav-transition" mode="out-in"> 
                <div v-if="isMobileView" key="mobile" class="horizon-nav-wrapper-mobile">
                    <div class="horizon-nav-mobile horizon-nav-wrapper-mobile">
                        <div class="horizon-navSection-mobile menubar">
                            <div class="horizon-navLogo-mobile">
                                <img class="horizon-navLogo-img" src="@/assets/imgs/common/logo.svg" alt="Logo">
                            </div>
                            <div>
                                123
                            </div>
                        </div>
                        <!--
                        <div class="horizon-navSection-mobile h5menu">
                            <div>
                                123456
                            </div>
                            <div>
                                123
                            </div>
                            <ScrollingText text="OVER THE FRONTIER" separator=" // " :enable-word-split="false"
                                :speed="30" text-class="horizon-navSection-mobile h5menu-scrolling-text"
                                class="horizon-navSection-mobile h5menu-mask-text" />
                        </div>-->
                    </div>
                </div>

                <div v-else key="desktop" class="horizon-nav-wrapper-desktop"><!--
                    <div class="horizon-nav__popup horizon-widget-container" :style="widgetPopStyle">
                        User Account
                    </div>-->
                    <div class="horizon-nav-desktop"
                        :class="{ 'expanded': isExpanded, 'always-expanded': isAlwaysExpanded }"
                        @mouseenter="isHovered = true" @mouseleave="isHovered = false" @touchstart="handleTouch">
                        <div class="horizon-navSection-desktop">
                            <div class="horizon-navLogo-desktop">
                                <img class="horizon-navLogo-img" src="@/assets/imgs/common/logo.svg" alt="Logo">
                            </div>
                            <div class="horizon-nav__content">
                                <div class="horizon-nav__items">
                                    <div class="horizon-navMenuItem">
                                        <Icon class="menu-icon" name="tdesign:home" />
                                        <span v-if="isExpanded" class="menu-text">Home</span>
                                    </div>
                                    <div class="horizon-navMenuItem">
                                        <Icon class="menu-icon" name="tdesign:system-components" />
                                        <span v-if="isExpanded" class="menu-text">About US</span>
                                    </div>
                                    <div class="horizon-navMenuItem">
                                        <Icon class="menu-icon" name="tdesign:shrimp" />
                                        <span v-if="isExpanded" class="menu-text">Community</span>
                                    </div>
                                    <div class="horizon-navMenuItem">
                                        <Icon class="menu-icon" name="tdesign:folder-open" />
                                        <span v-if="isExpanded" class="menu-text">Blog</span>
                                    </div>
                                </div>
                                <div class="horizon-nav__widgets">
                                    <div class="horizon-widget-container">
                                        <div class="horizon-widget-button">
                                            <Icon class="test" name="tdesign:user-1" />
                                        </div>
                                        <div class="horizon-widget-button">
                                            <Icon class="test" name="tdesign:translate" />
                                        </div>
                                        <div class="horizon-widget-button">
                                            <Icon class="test" name="tdesign:artboard" />
                                        </div>
                                        <div class="horizon-widget-button" @click="isHoverEnabled = !isHoverEnabled"
                                            :class="{ active: isHoverEnabled }"
                                            :title="isHoverEnabled ? '关闭Hover展开' : '开启Hover展开'">
                                            <Icon class="test"
                                                :name="isHoverEnabled ? 'tdesign:center-focus-strong-filled' : 'tdesign:center-focus-strong'" />
                                        </div>
                                        <WidgetColorsw use-widget-style />
                                        <WidgetMusicPlayer use-widget-style />
                                    </div>
                                </div>
                                <button @click="toggleExpand" :data-action="NavDataActions.DesktopExpand"
                                    class="horizon-navUtils-desktop-scaleSwitcher">
                                    <Icon class="horizon-navUtils-desktop-scaleSwitcher-icon" v-if="!isExpanded"
                                        name="tdesign:component-breadcrumb" />
                                    <Icon class="horizon-navUtils-desktop-scaleSwitcher-icon"
                                        v-else-if="!isAlwaysExpanded" name="tdesign:component-breadcrumb" />
                                    <Icon class="horizon-navUtils-desktop-scaleSwitcher-icon" v-else
                                        name="tdesign:component-breadcrumb-filled" style="transform: scaleX(-1);" />
                                    <ScrollingText text="OVER THE FRONTIER" separator=" // " :enable-word-split="false"
                                        :speed="30" text-class="horizon-navUtils-desktop-scaleSwitcher-scrolling-text"
                                        class="horizon-navUtils-desktop-scaleSwitcher-mask-text" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </ClientOnly>
    </div>
</template>

<style lang="scss" scoped>
.test {
    background-color: #fff;
}
</style>