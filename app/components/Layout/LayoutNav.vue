<script lang="ts" setup>
import HorizonNav from '@/components/Modules/Navmenu.vue'

// 使用导航状态 store
const navigationStore = useNavigationStore()

// 计算容器的 flex 方向
const containerFlexDirection = computed(() => {
    return navigationStore.isMobileView ? 'column' : 'row'
})
</script>

<template>
    <div class="horizon-container">
        <HorizonNav />
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.horizon-container {
    display: flex;
    flex-direction: v-bind(containerFlexDirection);
    min-height: 100vh;
    transition: flex-direction 0.3s ease;
}
</style>
