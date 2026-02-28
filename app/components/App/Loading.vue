<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { animate } from 'animejs';
import { useNuxtApp } from '#app';
import ScrollingText from '~/components/Modules/ScrollingText.vue';

const isLoading = ref(true);
const progress = ref(0);
const scrollText = ref('少女祈祷中'); // 可配置的滚动文本
const nuxtApp = useNuxtApp();
let interval: NodeJS.Timeout | null = null;

nuxtApp.hook('page:start', () => {
    isLoading.value = true;
    progress.value = 0;
    startProgress();
});

nuxtApp.hook('page:finish', () => {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
    progress.value = 100;
    animate('.horizon-loading-overlay', {
        opacity: 0,
        duration: 1000,
        ease: 'inQuad',
        onComplete: () => {
            setTimeout(() => { isLoading.value = false; }, 500);
        }
    });
});

const startProgress = () => {
    let currentProgress = 0;
    interval = setInterval(() => {
        if (currentProgress >= 90) {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }
        currentProgress += 1;
        progress.value = currentProgress;
    }, 200);
};

onMounted(async () => {
    await nextTick();
});

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
});
</script>

<template>
    <div v-if="isLoading" class="horizon-loading-overlay">
        <div class="horizon-loading-splash"></div>
        <div class="horizon-loading-position-top">
            <div class="horizon-loading-logo">//IMC.RE</div>
        </div>
        <div class="horizon-loading-position-center">
            <div class="horizon-loading-hollow">
                <div class="hollow-line">STARBOW</div>
                <div class="hollow-line">SYSTEM</div>
                <div class="hollow-line">INIT</div>
                <div class="hollow-line">{{ progress }}%</div>
            </div>
        </div>
        <div class="horizon-loading-position-bottom">
            <div class="horizon-loading-scrolling-wrapper">
                <ScrollingText :text="scrollText" :speed="30" :repeat-count="0" separator=" • "
                    :enable-word-split="true" text-class="horizon-loading-scrolling-text" />
            </div>
            <div class="horizon-loading-progress">
                <div class="horizon-loading-text">
                    Loading - {{ progress }}%
                </div>
                <div class="horizon-loading-progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.horizon-loading {
    // 全局禁用文本选择
    &-overlay,
    &-overlay * {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
}
</style>
