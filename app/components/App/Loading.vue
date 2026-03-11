<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { animate } from 'animejs';
import { useNuxtApp } from '#app';
import ScrollingText from '~/components/Modules/ScrollingText.vue';

const isLoading = ref(true);
const progress = ref(0);
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
            <div class="horizon-loading-logo">//{{ $t('i18n-common-string.info.brand') }}</div>
        </div>
        <div class="horizon-loading-vertical-text">
            <span class="bracket">[</span>
            <span class="text">OVER THE HORIZON</span>
            <span class="bracket">]</span>
        </div>
        <div class="horizon-loading-position-bottom">
            <div class="horizon-loading-scrolling-wrapper">
                <ScrollingText :text="$t('i18n-common-string.uni.web-loading-desc')" :speed="30" :repeat-count="0"
                    separator=" • " :enable-word-split="true" text-class="horizon-loading-scrolling-text" />
            </div>
            <div class="horizon-loading-progress">
                <div class="horizon-loading-text">
                    {{ $t('i18n-common-string.uni.web-loading', [progress]) }}
                </div>
                <div class="horizon-loading-progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/css/themes/mixins' as HorizonMixins;

.horizon-loading {
    &-vertical-text {
        @include HorizonMixins.vertical-text-vertical-text();
    }

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
