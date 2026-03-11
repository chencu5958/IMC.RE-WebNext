<script lang="ts" setup>
import LayoutNav from '~/components/Layout/LayoutNav.vue';
import ScrollingText from '~/components/Modules/ScrollingText.vue'
import type { NuxtError } from '#app'
import { horizonErrorConfig, horizonErrorDefaultConfig, horizonServerErrorDefaultConfig } from '~/config/web/common/horizonErrorConfig'

const props = defineProps<{ error: NuxtError }>()

const getErrorInfo = (error: NuxtError) => {
    const { status, message } = error
    const errorPath = (error.data as any)?.path || ''

    const isServerError = status && status >= 500
    const config = horizonErrorConfig[status as number] || (isServerError ? horizonServerErrorDefaultConfig : horizonErrorDefaultConfig)

    return {
        title: `${status}`,
        description: $t(config.descriptionKey, [errorPath || message || '']),
        path: errorPath,
        action: config.action
    }
}

const errorInfo = computed(() => getErrorInfo(props.error))

const handleAction = () => {
    const action = errorInfo.value?.action
    if (action?.type === 'action') {
        if (action.value === 'refresh') {
            location.reload()
        } else if (action.value === 'back') {
            history.back()
        }
    }
}
</script>

<template>
    <LayoutNav>
        <div class="horizon-section-container horizon-error-background">
            <div class="horizon-error-layout">
                <div class="horizon-section-container">
                    <div class="horizon-error-title">{{ errorInfo?.title }}</div>
                    <div class="horizon-error-content">
                        <div class="horizon-error-content-title">
                            {{ errorInfo?.description }}
                        </div>
                        <div class="horizon-error-nav">
                            <button class="horizon-error-nav-item" v-if="errorInfo?.action.type === 'action'" @click="handleAction">
                                {{ $t(errorInfo?.action.text || '') }}
                            </button>
                            <NuxtLink class="horizon-error-nav-item" v-else :to="errorInfo?.action.value || '/'">
                                {{ $t(errorInfo?.action.text || '') }}
                            </NuxtLink>
                        </div>
                        <div class="horizon-error-copyright">
                            <NuxtLink class="horizon-error-copyright-text no-underline" to="/">
                                {{ $t('i18n-common-string.info.copyright') }}
                            </NuxtLink>
                            <NuxtLink class="horizon-error-copyright-text no-underline" target="_blank"
                                to="https://beian.miit.gov.cn/">
                                {{ $t('i18n-common-string.info.icp-filing') }}
                            </NuxtLink>
                            <NuxtLink class="horizon-error-copyright-text no-underline" target="_blank"
                                to="https://beian.mps.gov.cn/">{{
                                    $t('i18n-common-string.info.icp-public-security-filing') }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="horizon-error-decorator">
                    <ScrollingText text="ACCESS DENIED" separator=" // " :enable-word-split="false" :speed="30"
                        text-class="horizon-error-scrolling-text" class="horizon-error-mask-text" />
                </div>
            </div>
            <div class="horizon-error-vertical-text">
                <span class="bracket">[</span>
                <span class="text">OVER THE HORIZON</span>
                <span class="bracket">]</span>
            </div>
        </div>
    </LayoutNav>
</template>

<style lang="scss" scoped>
@use '@/assets/css/themes/mixins' as HorizonMixins;

.horizon-error {
    &-layout {
        height: 100vh;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        z-index: 1;
    }

    &-title {
        font-family: "DingTalk JinBuTi";
        font-size: clamp(6rem, 10vw, 10rem);
        font-weight: bold;
        color: rgba(255, 255, 255, 0.1);
    }

    &-copyright {
        background-color: rgba(255, 255, 255, 0.1);
        //@include HorizonMixins.decorator-warning-stripe-pattern(0.5rem, #222222, #000);
        padding: clamp(0.2rem, 2vw, 0.5rem) clamp(0.5rem, 2vw, 1rem);
        max-width: fit-content;
        border-radius: 0 0.5rem 0 0;
        display: flex;
        flex-direction: column;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0.2rem;
            width: 0.2rem;
            height: 80%;
            background-color: var(--horizon-color-yellow-400);
        }


        &-text {
            font-size: clamp(0.8rem, 2vw, 1rem);
            //font-weight: bold;
            color: rgba(255, 255, 255, 0.5);
            font-family: "DingTalk JinBuTi";
        }
    }

    &-nav {
        padding: 1rem 0;
        display: flex;
        flex-direction: row;

        &-item {
            width: fit-content;
            background-color: rgba(255, 255, 255, 1);
            padding: 0.5rem 1rem;
            border-radius: 0 0.5rem 0.5rem 0;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 0.2rem;
                width: 0.2rem;
                height: 80%;
                background-color: var(--horizon-color-yellow-400);
            }
        }
    }

    &-decorator {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    &-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        &-title {
            font-size: clamp(2rem, 5vw, 2rem);
            font-weight: bold;
            color: rgba(255, 255, 255, 0.8);
            font-family: "DingTalk JinBuTi";
            padding-bottom: 1rem;
            flex: 1;

            padding-right: 1.2rem;
        }
    }

    &-mask-text {
        z-index: 1;
        position: relative;

        &::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50%;
            @include HorizonMixins.decorator-warning-stripe-pattern(0.5rem, #222222, #000);
        }
    }

    &-vertical-text {
        @include HorizonMixins.vertical-text-vertical-text();
    }
}
</style>

<style lang="scss">
.horizon-error-scrolling-text {
    font-size: 3rem;
    font-weight: blod;
    color: rgba(174, 174, 174);
    font-family: "DingTalk JinBuTi";
    opacity: 0.7;
}
</style>