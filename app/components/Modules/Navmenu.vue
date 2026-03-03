<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import ScrollingText from './ScrollingText.vue'

// 导航 data 属性常量 - 集中管理自定义 data 属性
const NavDataActions = {
    DesktopExpand: 'desktop-nav-expand',
} as const

// 使用导航状态 store
const navigationStore = useNavigationStore()

// 从媒体查询获取断点信息
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
    <div class="horizon-navSectionContainer" :class="{ 'input-type-touch': inputType === 'touch' }"
        @pointerdown="handlePointerDown">
        <!-- 开发环境调试面板 -->
        <ClientOnly>
            <div v-if="devMode" class="dev-debug-panel">
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

        <!-- 移动端显示 -->
        <ClientOnly>
            <Transition name="nav-transition" mode="out-in">
                <!-- 移动端导航 -->
                <div v-if="isMobileView" key="mobile" class="mobile-nav-wrapper">
                    <div class="mobile-nav">
                        <div class="horizon-navSection-mobile">
                            <div>
                                123456
                            </div>
                            <div>
                                123
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 桌面端显示 -->
                <div v-else key="desktop" class="desktop-nav-wrapper">
                    <div class="horizion-widget-pop horizon-widget-container" :style="widgetPopStyle">
                        User Account
                    </div>
                    <!-- 实际导航栏 -->
                    <div class="desktop-nav" :class="{ 'expanded': isExpanded, 'always-expanded': isAlwaysExpanded }"
                        @mouseenter="isHovered = true" @mouseleave="isHovered = false" @touchstart="handleTouch">
                        <div class="horizon-navSection-desktop">
                            <div class="horizon-navLogo">
                                <img class="horizon-navLogo-img" src="@/assets/imgs/common/logo.svg" alt="Logo">
                            </div>
                            <div class="nav-content-wrapper">
                                <div class="nav-item-container">
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
                                <div class="menu-widget-container">
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
@use "~/assets/css/themes/mixins" as HorizonMixins;

.test {
    background-color: #fff;
}

.dev-debug-panel {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    border-radius: 6px;
    color: white;
    font-size: 12px;

    .debug-btn {
        background: #666;
        border: 1px solid #999;
        color: white;
        padding: 4px 8px;
        margin-right: 5px;
        border-radius: 3px;
        cursor: pointer;

        &.active {
            background: #4CAF50;
            border-color: #45a049;
        }
    }
}


// 桌面端包装器
.desktop-nav-wrapper {
    min-width: 5rem;
}

// 移动端包装器
.mobile-nav-wrapper {
    min-height: 3rem; // 基础高度
}

// 导航切换动画 - wrapper 层级
.nav-transition-enter-active,
.nav-transition-leave-active {
    transition: all 0.4s ease;
}

// 桌面端 wrapper 进场/离场动画
.nav-transition-enter-active.desktop-nav-wrapper,
.nav-transition-leave-active.desktop-nav-wrapper {
    transition: min-width 0.4s ease;
}

// 移动端 wrapper 进场/离场动画
.nav-transition-enter-active.mobile-nav-wrapper,
.nav-transition-leave-active.mobile-nav-wrapper {
    transition: min-height 0.4s ease;
}

// 移动端实际层进场/离场动画
.nav-transition-enter-active .mobile-nav,
.nav-transition-leave-active .mobile-nav {
    transition: height 0.4s ease, transform 0.4s ease;
}

// 移动端实际层进场动画 - 从上方滑入
.nav-transition-enter-from .mobile-nav {
    transform: translateY(-3rem);
    height: 3rem; // 基础高度
}

// 移动端实际层离场动画 - 向上滑出，height 从实际值收起到基础值
.nav-transition-leave-to .mobile-nav {
    transform: translateY(-3rem);
    height: 3rem; // 收起到基础高度
}

// 桌面端 wrapper 进场动画 - min-width 从 0 到 5rem
.nav-transition-enter-from.desktop-nav-wrapper {
    min-width: 0;
}

// 桌面端 wrapper 离场动画 - min-width 从 5rem 到 0
.nav-transition-leave-to.desktop-nav-wrapper {
    min-width: 0;
}

// 移动端 wrapper 进场动画 - min-height 从 0 到基础值
.nav-transition-enter-from.mobile-nav-wrapper {
    min-height: 0;
}

// 移动端 wrapper 离场动画 - min-height 从基础值到 0
.nav-transition-leave-to.mobile-nav-wrapper {
    min-height: 0;
}

// 桌面端导航栏本身的动画
.nav-transition-enter-active .desktop-nav,
.nav-transition-leave-active .desktop-nav {
    transition: width 0.4s ease, transform 0.4s ease;
}

// 桌面端进场 - 导航栏从左滑入
.nav-transition-enter-from .desktop-nav {
    transform: translateX(-5rem); // 和 wrapper 的 min-width 一致
    width: 5rem; // 基础宽度
}

// 桌面端进场 - 如果是展开状态，宽度直接设置为 12rem
.nav-transition-enter-from .desktop-nav.expanded {
    width: 12rem;
}

// 桌面端离场 - 导航栏向左滑出，和 wrapper 的 min-width 同步
.nav-transition-leave-to .desktop-nav {
    transform: translateX(-5rem); // 向左移动 5rem，和 wrapper 的 min-width 归零同步
    width: 5rem; // 收起到基础宽度 5rem
}

// 展开状态的离场特殊处理 - 从 12rem 慢慢收起到 5rem，同时向左移动
.nav-transition-leave-to .desktop-nav.expanded {
    width: 5rem;
    transform: translateX(-5rem); // 和 wrapper 的 min-width 同步
}

// 桌面端导航栏本身的动画 - 进场和离场都要控制
.nav-transition-enter-active .desktop-nav,
.nav-transition-leave-active .desktop-nav {
    transition: width 0.4s ease, transform 0.4s ease;
}

// 桌面端进场 - 导航栏从左滑入
.nav-transition-enter-from .desktop-nav {
    transform: translateX(-5rem); // 和 wrapper 的 min-width 一致
    width: 5rem; // 基础宽度
}

// 桌面端进场 - 如果是展开状态，宽度直接设置为 12rem
.nav-transition-enter-from .desktop-nav.expanded {
    width: 12rem;
}

// 桌面端离场 - 导航栏向左滑出，和 wrapper 的 min-width 同步
.nav-transition-leave-to .desktop-nav {
    transform: translateX(-5rem); // 向左移动 5rem，和 wrapper 的 min-width 归零同步
    width: 5rem; // 收起到基础宽度 5rem
}

// 展开状态的离场特殊处理 - 从 12rem 慢慢收起到 5rem，同时向左移动
.nav-transition-leave-to .desktop-nav.expanded {
    width: 5rem;
    transform: translateX(-5rem); // 和 wrapper 的 min-width 同步
}

// 给容器添加过渡，确保布局平滑变化
.horizon-navSectionContainer {
    transition: min-width 0.4s ease;
}

.mobile-nav {
    position: fixed;
}

.desktop-nav {
    width: 5rem;
    background: var(--horizon-nav-desktop-background-color);
    @include HorizonMixins.viewport-viewport-height(100); // 自动处理兼容性
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    // 简化动画，模仿示例的实现方式
    transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    overflow: hidden;

    // 展开状态
    &.expanded {
        width: 12rem;
    }

    // 伪元素作为装饰性 Mask
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0; // 拉伸到右侧
        bottom: 0; // 拉伸到底部
        background-image: url('@/assets/imgs/res/endless_mask.svg');
        background-size: 120px; // 启用拉伸填充
        background-repeat: no-repeat;
        opacity: 0.5; // 收回时的透明度
        z-index: 0;
        transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }

    // 展开时调整 Mask 透明度
    &.expanded::before {
        opacity: 0.5; // 展开时的透明度
    }

    &>div {
        position: relative;
        z-index: 1;
        white-space: nowrap;
        overflow: hidden;
        transition: padding 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        //height: 100vh; // 确保容器占满视口高度
        display: flex;
        flex-direction: column;
    }

}

// 导航内容包装器
.nav-content-wrapper {
    flex: 1; // 自动填充剩余空间
    display: flex;
    flex-direction: column;
    min-height: 0; // 允许子元素收缩
}

// NavItem 容器
.nav-item-container {
    flex: 2; // 默认占用2份空间
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 1rem;
    min-height: 0; // 允许内容收缩
}

// 导航菜单项样式
.horizon-navMenuItem {

    .menu-icon {
        font-size: 1.25rem;
        color: white;
        min-width: 1.25rem;
        transform: translateZ(0); // GPU加速
        will-change: transform, margin;
        transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), margin 0.4s cubic-bezier(0.23, 1, 0.32, 1);

        // 未展开时图标居中
        .desktop-nav:not(.expanded) & {
            margin-left: 0.5rem;
            transform: translateX(0);
        }

        // 展开时恢复正常定位
        .desktop-nav.expanded & {
            margin: 0;
            transform: translateX(0);
        }
    }

    .menu-text {
        color: white;
        font-size: 0.9rem;
        font-weight: 500;
        margin-left: 0.5rem;
        white-space: nowrap;
        animation: textAppear 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }
}

// 文字出现动画
@keyframes textAppear {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

// MenuWidget 容器
.menu-widget-container {
    flex: 1; // 默认占用1份空间
    display: flex;
    flex-direction: column;
    align-items: stretch; // 拉伸子元素填充容器宽度
    justify-content: flex-end; // 内容靠底部对齐
    min-height: 0; // 允许内容收缩
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);

    // 展开状态下的widget容器动画
    .desktop-nav.expanded & {
        transition-delay: 0.15s;
    }
}

.horizon-widget-pop {
    position: fixed;
    background: var(--horizon-color-blue-400);
    padding: 1rem;
    border-radius: 0 8px 8px 0;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    min-width: 200px;
    transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>