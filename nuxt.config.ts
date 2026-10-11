import dotenv from 'dotenv';
import { createRuntimeConfig } from './utils/runtime';

// 自动检测并加载 env 目录下的环境变量文件
dotenv.config({
  path: `${process.cwd()}/env/.env.${process.env.NODE_ENV || 'development'}`
})

const runtimeConfig = createRuntimeConfig();
const runtimeInfo = runtimeConfig.runtimeConfig.public;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    multiApp: true,
    compatibilityVersion: 5
  },
  // App配置
  app: {
    head: {
      title: process.env.NUXT_SITE_NAME || "Untitled",
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
      ],
      noscript: [
        { innerHTML: 'This Website requires JavaScript.' }
      ]
    },
    rootId: 'app',
    buildAssetsDir: '/starbow/'
  },

  // CSS样式
  css: [
    '~/assets/css/entry.scss'
  ],

  // Site配置
  site: {
    url: process.env.NUXT_SITE_URL || 'https://example.com',
    name: process.env.NUXT_SITE_NAME || 'Example Site'
  },

  // Robots配置
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
        contentUsage: [
          'ai=n train-ai=n' // 禁止AI索引
        ]
      }
    ]
  },

  // i18n配置
  i18n: {
    baseUrl: process.env.NUXT_SITE_URL || 'https://example.com',
    strategy: 'no_prefix',
    langDir: '',
    defaultLocale: 'zh-CN',
    detectBrowserLanguage: {
      cookieKey: 'horizon-i18n-lang',
      useCookie: true,
      alwaysRedirect: true
    },
    locales: [
      // CoreUI Flags Icon
      // https://icon-sets.iconify.design/cif/?keyword=cif
      { code: 'zh-CN', name: '简体中文', language: 'zh-CN', file: 'zh-CN.yml', flag: 'cn' },
      { code: 'zh-Hant', name: '繁體中文', language: 'zh-Hant', file: 'zh-Hant.yml', flag: 'hk' },
      { code: 'en-US', name: 'English', language: 'en-US', file: 'en-US.yml', flag: 'us' }
    ]
  },

  // Experimental功能配置
  experimental: {
    payloadExtraction: true,
  },

  // Color Mode配置
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    globalName: '__HORIZON_COLOR_MODE__',
    componentName: 'colorscheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'horizon-color-preference'
  },

  // Modules模块
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@unocss/nuxt'
  ],

  runtimeConfig: {
    public: {
      horizon: runtimeInfo,
    },
  },

  // Nitro配置
  nitro: {
    minify: true,
    sourceMap: 'hidden'
    // EdgeOnePages上不要启用esbulid相关的优化，会导致构建失败
  },

  // Vite配置
  vite: {
    build: {
      minify: 'esbuild',
      target: 'es2020',
      cssMinify: true
    }
  },

  // UnoCSS配置
  unocss: {
    nuxtLayers: true,
    attributify: true,
    preflight: false,
    icons: {
      scale: 1.2,
    },
  }
})
