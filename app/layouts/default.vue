<script lang="ts" setup>
import { createTitleWithInterpolation } from '~/utils/titleHelper'
const route = useRoute()
const { t } = useI18n()
const head = useLocaleHead()
const keyBrand = 'i18n-common-string.info.brand-full'
const keyDesc = 'i18n-common-string.uni.web-desc'
const keyKeywords = 'i18n-common-string.uni.web-keywords'
const keyUndefined = 'i18n-common-string.error.undefined-i18n-text'

const title = computed(() => createTitleWithInterpolation(t, keyBrand, route.meta, keyUndefined))
const description = computed(() => createTitleWithInterpolation(t, keyDesc, route.meta, keyUndefined))
const keywords = computed(() => createTitleWithInterpolation(t, keyKeywords, route.meta, keyUndefined))

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