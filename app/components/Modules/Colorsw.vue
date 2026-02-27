<script lang="ts" setup>
// Widget配置
const props = defineProps({
  // 是否使用Widget样式
  useWidgetStyle: {
    type: Boolean,
    default: false
  }
})

const colorMode = useColorMode();
const getIconName = () => {
    const currentPreference = colorMode.preference || 'system';
    switch (currentPreference) {
        case 'dark':
            return 'tdesign:mode-dark';
        case 'light':
            return 'tdesign:mode-light';
        default:
            return 'tdesign:brightness-1';
    }
};

const onClick = () => {
    const values = ['system', 'light', 'dark'] as const;
    // 确保preference不是undefined，提供默认值'system'
    const currentPreference = colorMode.preference || 'system';
    const index = values.indexOf(currentPreference as 'system' | 'light' | 'dark');
    const next = (index + 1) % values.length;

    // 添加背景切换动画效果
    const backgroundElement = document.querySelector('.rmc-background');
    if (backgroundElement) {
        backgroundElement.classList.add('theme-transitioning');

        // 在动画完成后移除类
        setTimeout(() => {
            backgroundElement.classList.remove('theme-transitioning');
        }, 800);
    }

    // 使用类型断言确保赋值类型正确
    colorMode.preference = values[next] as 'system' | 'light' | 'dark';
    //console.log('ColorMode=' + colorMode.preference + ' | ' + 'Value=' + colorMode.value )
};
</script>



<template>
  <!-- Widget模式 -->
  <div 
    v-if="props.useWidgetStyle" 
    class="horizon-widget-button" 
    @click="onClick"
    role="button"
    tabindex="0"
    aria-label="切换主题模式"
  >
    <client-only>
      <Transition name="theme-icon" mode="out-in">
        <Icon :key="colorMode.preference" :name="getIconName()" />
      </Transition>
    </client-only>
  </div>
  
  <!-- 传统按钮模式 -->
  <Button v-else v-slot="slotProps" asChild :link=true>
    <button v-bind="slotProps.a11yAttrs" @click="onClick" class="">
      <client-only>
        <Transition name="theme-icon" mode="out-in">
          <Icon :key="colorMode.preference" :name="getIconName()" class="theme-icon rmc-button-icon" />
        </Transition>
        <!--
        <span class="rmc-sr-only">{{ $t('rmc-common-string.uni.theme-toggle') }} : {{ $colorMode.value }}</span>-->
      </client-only>
    </button>
  </Button>
</template>