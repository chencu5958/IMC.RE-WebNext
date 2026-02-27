<script lang="ts" setup>
const route = useRoute()
const { t } = useI18n()
const head = useLocaleHead()
const keyBrand = 'rmc-common-string.info.brand-full'
const keyDesc = 'rmc-common-string.uni.web-desc'
const keyKeywords = 'rmc-common-string.uni.web-keywords'

// 添加错误处理
const getTitle = () => {
  try {
    return t(keyBrand, { title: t(route.meta.title as string || keyBrand) })
  } catch (e) {
    return 'IMC.RE'
  }
}

const getDescription = () => {
  try {
    return t(keyDesc, { title: t(route.meta.title as string || keyDesc) })
  } catch (e) {
    return 'IMC.RE Official Website'
  }
}

const getKeywords = () => {
  try {
    return t(keyKeywords, { title: t(route.meta.title as string || keyKeywords) })
  } catch (e) {
    return 'IMC, IMC.RE, official website'
  }
}

const title = computed(() => getTitle())
const description = computed(() => getDescription())
const keywords = computed(() => getKeywords())

useHead({
  title: title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
  ],
});
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">

  <Head>
    <Title>{{ title }}</Title>
    <template v-for="link in head.link" :key="link.id">
      <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
    </template>
    <template v-for="meta in head.meta" :key="meta.id">
      <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
    </template>
  </Head>

  <Body>
    <slot />
  </Body>

  </Html>
</template>