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
        <div class="horizon-loading-bg"></div>
        <div class="horizon-loading-top">
            <div class="horizon-loading-logo">//IMC.RE</div>
        </div>
        <div class="horizon-loading-center">
            <div class="horizon-loading-hollow">
                <div class="hollow-line">STARBOW</div>
                <div class="hollow-line">SYSTEM</div>
                <div class="hollow-line">INIT</div>
                <div class="hollow-line">{{ progress }}%</div>
            </div>
        </div>
        <div class="horizon-loading-bottom">
            <div class="horizon-loading-text-bg">
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

    &-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        backdrop-filter: blur(var(--horizon-common-blur));
        -webkit-backdrop-filter: blur(var(--horizon-common-blur));
    }

    &-bg {
        position: absolute;
        inset: 0;
        background-image: url(https://images.unsplash.com/photo-1756806983702-1fdd1574aa6f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        opacity: 1;
        z-index: 0;
        pointer-events: none;
    }

    &-top {
        padding: 20px;
        position: relative;
        z-index: 1;
    }

    &-logo {
        font-size: 2rem;
        color: #FFD700;
        font-family: "DingTalk JinBuTi";
        user-select: none;
    }

    &-bottom {
        padding: 0;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
    }

    &-text-bg {
        font-size: 20px;
        font-family: "DingTalk JinBuTi";
        color: rgba(255, 255, 255, 0.5);
        font-weight: 900;
        user-select: none;
        z-index: 0;
        margin-bottom: -6px;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
    }

    &-center {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        z-index: 1;
    }

    &-progress {
        height: 25px;
        width: 100%;
        background: rgba(65, 65, 65, 0.4);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    &-text {
        position: relative;
        z-index: 2;
        font-size: 16px;
        font-family: "DingTalk JinBuTi";
        color: transparent;
        padding-left: 12px;
        white-space: nowrap;
        font-weight: 900;
        background: linear-gradient(135deg,
                #a0a0a0 0%,
                #d4d4d4 25%,
                #ffffff 50%,
                #d4d4d4 75%,
                #a0a0a0 100%);
        -webkit-background-clip: text;
        background-clip: text;
        text-shadow: none;
        filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.9));
    }
}
</style>
