<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n' // 根据实际项目调整导入路径，Nuxt 通常无需导入
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
    return locales.value.filter(i => i.code !== locale.value)
})

const handleSwitch = (code: string) => {
    setLocale(code as "zh-CN" | "zh-Hant" | "en-US")
}
</script>

<template>
    <PopoverRoot>
        <PopoverTrigger>
            <div class="cursor-pointer">{{ locale }}</div>
        </PopoverTrigger>
        <PopoverPortal>
            <PopoverContent>
                <div class="flex flex-col gap-2">
                    <a 
                        v-for="item in availableLocales" 
                        :key="item.code" 
                        class="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        @click="handleSwitch(item.code)"
                    >
                        <Icon 
                            style="width: 24px; margin-right: 6px;"
                            :name="`cif:${item.flag}`" 
                        />
                        <div>{{ item.name }}</div>
                    </a>
                </div>
                <PopoverClose class="PopoverClose" aria-label="Close">
                    <PopoverArrow />
                </PopoverClose>
            </PopoverContent>
        </PopoverPortal>
    </PopoverRoot>
</template>