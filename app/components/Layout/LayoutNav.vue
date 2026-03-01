<script lang="ts" setup>
import HorizonNav from '@/components/Modules/Navmenu.vue'

// 使用导航状态 store
const navigationStore = useNavigationStore()

// 从 store 获取动画状态
const { isNavAnimating } = storeToRefs(navigationStore)

// 计算实际的 flex-direction（根据导航动画状态延迟切换）
const actualFlexDirection = computed(() => {
    const isMobile = navigationStore.isMobileView
    
    if (isNavAnimating.value) {
        // 动画期间返回反向值，延迟切换布局
        return isMobile ? 'row' : 'column'
    }
    return isMobile ? 'column' : 'row'
})
</script>

<template>
    <div class="horizon-container">
        <HorizonNav />
        <div class="content-wrapper">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.horizon-container {
    flex-direction: v-bind(actualFlexDirection);
}

.content-wrapper {
    flex: 1;
    overflow: auto;
}
</style>
