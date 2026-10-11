<template>
  <div class="nav-widget">
    
    <!-- 触发按钮 -->
    <button 
      ref="widgetTriggerRef"
      class="nav-widget-button"
      @click="togglePopup"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <Icon name="tdesign:more-vertical" />
    </button>
    
    <!-- 悬浮弹窗 -->
    <WidgetPop
      v-model:isOpen="isPopupOpen"
      :trigger-element="widgetTriggerRef"
      position="bottom"
      align="end"
      :auto-close="true"
    >
      <!-- 弹窗内容 -->
      <div class="widget-pop-content">
        <a href="#" class="widget-pop-link">
          <Icon name="tdesign:user" />
          <span>个人中心</span>
        </a>
        <a href="#" class="widget-pop-link">
          <Icon name="tdesign:settings" />
          <span>设置</span>
        </a>
        <a href="#" class="widget-pop-link">
          <Icon name="tdesign:help-circle" />
          <span>帮助</span>
        </a>
        <a href="#" class="widget-pop-link">
          <Icon name="tdesign:logout" />
          <span>退出登录</span>
        </a>
      </div>
    </WidgetPop>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WidgetPop from './WidgetPop.vue'

const widgetTriggerRef = ref<HTMLElement | null>(null)
const isPopupOpen = ref(false)

// 切换弹窗状态
const togglePopup = () => {
  isPopupOpen.value = !isPopupOpen.value
}

// 鼠标进入
const handleMouseEnter = () => {
  isPopupOpen.value = true
}

// 鼠标离开
const handleMouseLeave = () => {
  // 这里不立即关闭，让 WidgetPop 自己处理鼠标离开逻辑
}
</script>

<style lang="scss" scoped>
.nav-widget {
  position: relative;
}

.nav-widget-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #151A2D;
  color: #F1F4FF;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  .i-tdesign\:more-vertical {
    font-size: 1.25rem;
  }
}
</style>