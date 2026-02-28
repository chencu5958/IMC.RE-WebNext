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
        <div class="content-wrapper">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.horizon-container {
    display: flex;
    flex-direction: v-bind(containerFlexDirection);
    width: 100vw;
    height: 100vh;
    position: relative;
    transition: flex-direction 0.3s ease;
}

.content-wrapper {
    flex: 1;
    overflow: auto;
}
</style>
