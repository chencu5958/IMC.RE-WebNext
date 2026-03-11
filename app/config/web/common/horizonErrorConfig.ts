export interface ErrorAction {
    text: string
    type: 'action' | 'link'
    value?: string
}

export interface ErrorConfig {
    title?: string
    descriptionKey: string
    action: ErrorAction
}

export interface HorizonErrorConfig {
    [statusCode: number]: ErrorConfig
}

export const horizonErrorConfig: HorizonErrorConfig = {
    400: {
        descriptionKey: 'i18n-common-string.error.400-desc',
        action: { text: 'i18n-common-string.uni.back', type: 'action', value: 'back' }
    },
    401: {
        descriptionKey: 'i18n-common-string.error.401-desc',
        action: { text: 'i18n-common-string.auth.login', type: 'link', value: '/login' }
    },
    403: {
        descriptionKey: 'i18n-common-string.error.403-desc',
        action: { text: 'i18n-common-string.uni.home', type: 'link', value: '/' }
    },
    404: {
        descriptionKey: 'i18n-common-string.error.404-desc',
        action: { text: 'i18n-common-string.uni.home', type: 'link', value: '/' }
    },
    500: {
        descriptionKey: 'i18n-common-string.error.500-desc',
        action: { text: 'i18n-common-string.uni.refresh', type: 'action', value: 'refresh' }
    },
    502: {
        descriptionKey: 'i18n-common-string.error.502-desc',
        action: { text: 'i18n-common-string.uni.refresh', type: 'action', value: 'refresh' }
    },
    503: {
        descriptionKey: 'i18n-common-string.error.503-desc',
        action: { text: 'i18n-common-string.uni.refresh', type: 'action', value: 'refresh' }
    }
}

export const horizonErrorDefaultConfig: ErrorConfig = {
    descriptionKey: 'i18n-common-string.error.client-error',
    action: { text: 'i18n-common-string.uni.home', type: 'link', value: '/' }
}

export const horizonServerErrorDefaultConfig: ErrorConfig = {
    descriptionKey: 'i18n-common-string.error.server-error',
    action: { text: 'i18n-common-string.uni.refresh', type: 'action', value: 'refresh' }
}
