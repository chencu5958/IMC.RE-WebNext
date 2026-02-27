<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

// 错误处理函数
// 错误处理函数
const getErrorInfo = (error: NuxtError) => {
    const { statusCode, message, data } = error
    
    // 提取path信息（如果存在）
    // 类型断言：data可能包含path属性
    const errorPath = (data as any)?.path || ''
    
    // 4xx 客户端错误
    if (statusCode >= 400 && statusCode < 500) {
        switch (statusCode) {
            case 400:
                return {
                    title: '400 Bad Request',
                    description: '请求参数错误，请检查您的输入',
                    path: errorPath,
                    action: { text: '返回上一页', action: 'back' }
                }
            case 401:
                return {
                    title: '401 Unauthorized',
                    description: '您需要登录才能访问此页面',
                    path: errorPath,
                    action: { text: '登录', link: '/login' }
                }
            case 403:
                return {
                    title: '403 Forbidden',
                    description: '您没有权限访问此页面',
                    path: errorPath,
                    action: { text: '返回首页', link: '/' }
                }
            case 404:
                return {
                    title: '404 Not Found',
                    description: `抱歉，您访问的页面 ${errorPath || ''} 不存在`,
                    path: errorPath,
                    action: { text: '返回首页', link: '/' }
                }
            default:
                return {
                    title: `${statusCode} Client Error`,
                    description: message || '客户端请求错误',
                    path: errorPath,
                    action: { text: '返回首页', link: '/' }
                }
        }
    }

    // 5xx 服务器错误
    if (statusCode >= 500 && statusCode < 600) {
        switch (statusCode) {
            case 500:
                return {
                    title: '500 Internal Server Error',
                    description: '服务器内部错误，我们正在处理中',
                    path: errorPath,
                    action: { text: '刷新页面', action: 'refresh' }
                }
            case 502:
                return {
                    title: '502 Bad Gateway',
                    description: '网关错误，请稍后再试',
                    path: errorPath,
                    action: { text: '刷新页面', action: 'refresh' }
                }
            case 503:
                return {
                    title: '503 Service Unavailable',
                    description: '服务暂时不可用，请稍后再试',
                    path: errorPath,
                    action: { text: '刷新页面', action: 'refresh' }
                }
            default:
                return {
                    title: `${statusCode} Server Error`,
                    description: '服务器错误，请稍后再试',
                    path: errorPath,
                    action: { text: '刷新页面', action: 'refresh' }
                }
        }
    }

    // 未知错误
    return {
        title: 'Unknown Error',
        description: message || '发生了未知错误',
        path: errorPath,
        action: { text: '返回首页', link: '/' }
    }
}


const errorInfo = computed(() => getErrorInfo(props.error))

const handleAction = () => {
    const action = errorInfo.value.action
    if (action?.action === 'refresh') {
        location.reload()
    } else if (action?.action === 'back') {
        history.back()
    }
}
</script>

<template>
    <nuxt-layout name="default">
        <header>
            <AppHeader />
        </header>
        <main>
            <div class="error-container">
                <div class="error-content">
                    <h1>{{ error.statusCode }}</h1>
                    <h2>{{ errorInfo.title }}</h2>
                    <p>{{ errorInfo.description }}</p>
                    <div v-if="errorInfo.path" class="error-path">
                        <span>请求路径: </span>
                        <code>{{ errorInfo.path }}</code>
                    </div>
                    <button v-if="errorInfo.action?.action" @click="handleAction">
                        {{ errorInfo.action.text }}
                    </button>
                    <nuxt-link v-else :to="errorInfo.action?.link || '/'">
                        {{ errorInfo.action?.text || '返回首页' }}
                    </nuxt-link>
                </div>
            </div>
        </main>
        <footer>
            <AppFooter />
        </footer>
    </nuxt-layout>
</template>

<style scoped>
.error-path {
    margin: 1rem 0;
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.error-path code {

    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.2rem 0.4rem;
    border-radius: 2px;
}
</style>
