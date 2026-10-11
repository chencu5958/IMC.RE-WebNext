// 标题处理工具函数
import type { RouteMeta } from 'vue-router'

/**
 * 安全地获取路由元信息中的标题键
 * @param meta - 路由元信息
 * @param defaultKey - 默认标题键
 * @returns 标题键字符串
 */
export function getMetaTitleKey(meta: RouteMeta | undefined, defaultKey: string): string {
  if (meta?.title && typeof meta.title === 'string') {
    return meta.title
  }
  return defaultKey
}

/**
 * 创建带标题插值的翻译函数
 * @param t - i18n翻译函数
 * @param templateKey - 模板键
 * @param meta - 路由元信息
 * @param defaultKey - 默认标题键
 * @returns 翻译后的字符串
 */
export function createTitleWithInterpolation(
  t: (key: string, named?: Record<string, string>) => string,
  templateKey: string,
  meta: RouteMeta | undefined,
  defaultKey: string
): string {
  const titleKey = getMetaTitleKey(meta, defaultKey)
  return t(templateKey, { title: t(titleKey) })
}