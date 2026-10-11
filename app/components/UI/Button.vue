/**Horizon Design System Button */
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  text: string;
  to: string;
  target?: string;
  primaryIcon: string;
  secondaryIcon: string;
  buttonId?: string;
  type?: 'primary' | 'secondary' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
  target: '_blank',
  buttonId: 'btn',
  type: 'secondary'
});

const buttonClass = computed(() => {
  return [
    'custom-btn',
    `btn-${props.type}`
  ].join(' ');
});

const handleMouseMove = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  button.style.setProperty('--mouse-x', `${x}px`);
  button.style.setProperty('--mouse-y', `${y}px`);
};

const handleMouseEnter = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  button.classList.add('is-hovered');
};

const handleMouseLeave = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement;
  button.classList.remove('is-hovered');
};

const handleTouchStart = (event: TouchEvent) => {
  const button = event.currentTarget as HTMLElement;
  const touch = event.touches[0];
  if (touch) {
    const rect = button.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    button.style.setProperty('--mouse-x', `${x}px`);
    button.style.setProperty('--mouse-y', `${y}px`);
    button.classList.add('is-touched');
  }
};

const handleTouchEnd = (event: TouchEvent) => {
  const button = event.currentTarget as HTMLElement;
  button.classList.remove('is-touched');
};
</script>

<template>
  <NuxtLink
    :to="to"
    :target="target"
    :class="buttonClass"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="icon-wrapper">
      <Icon class="icon primary" :name="primaryIcon" />
      <Icon class="icon secondary" :name="secondaryIcon" />
    </div>
    <span class="button-text">{{ text }}</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.custom-btn {
  // CSS 自定义属性
  --mouse-x: 50%;
  --mouse-y: 50%;
  --blur-amount: 20px;
  --border-radius: 16px;

  // 基础样式
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transform: translateZ(0);

  // Liquid Glass 基础样式
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  color: rgba(255, 255, 255, 0.9);

  // 阴影系统
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);

  // 过渡动画
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

  // 响应式设计
  @media (max-width: 640px) {
    padding: 0.75em 0.1em;

    .button-text {
      font-size: 14px;
    }
  }

  // 按钮文本
  .button-text {
    position: relative;
    display: inline-block;
    transform: translateZ(0);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 2;
  }

  // 图标容器
  .icon-wrapper {
    position: relative;
    width: 1.2rem;
    height: 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    //margin-right: 0.5rem;

    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 1.2rem;
      transform-origin: center;
      backface-visibility: hidden;
      -webkit-font-smoothing: antialiased;
      pointer-events: none;
      transition:
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);

      &.primary {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }

      &.secondary {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.7) rotate(-15deg);
      }
    }
  }

  // 光效背景
  &::before {
    content: '';
    position: absolute;
    top: var(--mouse-y);
    left: var(--mouse-x);
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%) scale(0);
    background: radial-gradient(circle,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.2) 30%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 70%);
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    transition:
      transform 0.5s cubic-bezier(0.85, 0, 0.15, 1),
      opacity 0.5s cubic-bezier(0.85, 0, 0.15, 1);
  }

  // 流动效果
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.08) 50%,
        transparent 70%);
    background-size: 300% 300%;
    border-radius: var(--border-radius);
    opacity: 0;
    pointer-events: none;
    z-index: 0;
    animation: liquidFlow 4s ease-in-out infinite;
    transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  // 悬停状态
  &.is-hovered {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px) translateZ(0);
    box-shadow:
      0 16px 48px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1);

    .button-text {
      transform: scale(1.02);
    }

    .icon-wrapper {
      .icon {
        &.primary {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.7) rotate(15deg);
        }

        &.secondary {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.1) rotate(0deg);
        }
      }
    }

    &::before {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.6;
    }

    &::after {
      opacity: 0.4;
      animation-duration: 2s;
    }
  }

  // 触摸状态
  &.is-touched {
    transform: translateY(-1px) scale(0.98) translateZ(0);

    .button-text {
      transform: scale(0.96);
    }

    .icon-wrapper {
      .icon {
        &.primary {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.7) rotate(15deg);
        }

        &.secondary {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
      }
    }

    &::before {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
      transition: all 0.1s ease;
    }

    &::after {
      opacity: 0.6;
      background: radial-gradient(circle at var(--mouse-x) var(--mouse-y),
          rgba(255, 255, 255, 0.2) 0%,
          rgba(255, 255, 255, 0.1) 40%,
          transparent 70%);
    }
  }

  // 活动状态
  &:active {
    transform: translateY(0) scale(0.96) translateZ(0);
    transition: all 0.1s ease;
  }

  0% {
    background-position: -300% -300%;
  }

  50% {
    background-position: 300% 300%;
  }

  100% {
    background-position: -300% -300%;
  }
}
</style>