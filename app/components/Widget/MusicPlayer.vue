<script lang="ts" setup>
// 全局音频状态
const globalState = (() => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__MUSIC_PLAYER_STATE__ = window.__MUSIC_PLAYER_STATE__ || {
      audio: null as HTMLAudioElement | null,
      initialized: false,
      userInteracted: false
    }
    // @ts-ignore
    return window.__MUSIC_PLAYER_STATE__
  }
  return {
    audio: null,
    initialized: false,
    userInteracted: false
  }
})()

// 播放状态键名
const PLAYBACK_STATE_KEY = 'music-player-state'

// 从localStorage获取播放状态
const getPlaybackState = () => {
  if (typeof localStorage === 'undefined') return null
  try {
    const state = localStorage.getItem(PLAYBACK_STATE_KEY)
    return state ? JSON.parse(state) : null
  } catch {
    return null
  }
}

// 保存播放状态到localStorage
const savePlaybackState = (state: { isPlaying: boolean; currentTime: number }) => {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(PLAYBACK_STATE_KEY, JSON.stringify(state))
  } catch {}
}

// Widget配置
const props = defineProps({
  // 是否使用Widget样式
  useWidgetStyle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['mouseenter'])

// 播放状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// 音频元素引用
const audio = ref<HTMLAudioElement | null>(null)

// 监听用户交互（只执行一次）
if (typeof window !== 'undefined' && !globalState.userInteracted) {
  const handleUserInteraction = () => {
    globalState.userInteracted = true
    window.removeEventListener('click', handleUserInteraction)
    window.removeEventListener('touchstart', handleUserInteraction)
    window.removeEventListener('keydown', handleUserInteraction)
    
    // 用户交互后尝试播放
    if (globalState.audio) {
      globalState.audio.play().then(() => {
        isPlaying.value = true
      }).catch(() => {})
    }
  }
  
  window.addEventListener('click', handleUserInteraction)
  window.addEventListener('touchstart', handleUserInteraction)
  window.addEventListener('keydown', handleUserInteraction)
}

// 状态同步函数
const syncState = () => {
  if (globalState.audio) {
    isPlaying.value = !globalState.audio.paused
    currentTime.value = globalState.audio.currentTime || 0
    duration.value = globalState.audio.duration || 0
  }
}

// 初始化音频（只执行一次）
onMounted(() => {
  // 如果已经初始化过了，直接使用现有实例
  if (globalState.initialized) {
    audio.value = globalState.audio
    syncState()
    
    // 添加状态变化监听
    const handlePlay = () => { syncState() }
    const handlePause = () => { syncState() }
    const handleTimeUpdate = () => { syncState() }
    
    globalState.audio?.addEventListener('play', handlePlay)
    globalState.audio?.addEventListener('pause', handlePause)
    globalState.audio?.addEventListener('timeupdate', handleTimeUpdate)
    
    // 组件卸载时移除监听
    onUnmounted(() => {
      globalState.audio?.removeEventListener('play', handlePlay)
      globalState.audio?.removeEventListener('pause', handlePause)
      globalState.audio?.removeEventListener('timeupdate', handleTimeUpdate)
    })
    
    return
  }
  
  // 创建全局唯一音频实例
  globalState.audio = new Audio('/assets/audio/铁痕电台-MSR,Kirara Magic - 春景故人来.mp3')
  globalState.initialized = true
  audio.value = globalState.audio
  
  // 设置音频事件监听
  globalState.audio.addEventListener('loadedmetadata', () => {
    duration.value = globalState.audio?.duration || 0
  })
  globalState.audio.addEventListener('timeupdate', () => {
    currentTime.value = globalState.audio?.currentTime || 0
    // 实时保存播放状态
    if (globalState.audio && !globalState.audio.paused) {
      savePlaybackState({
        isPlaying: true,
        currentTime: globalState.audio.currentTime
      })
    }
  })
  globalState.audio.addEventListener('play', () => {
    isPlaying.value = true
  })
  globalState.audio.addEventListener('pause', () => {
    isPlaying.value = false
  })
  globalState.audio.addEventListener('ended', () => {
    isPlaying.value = false
    currentTime.value = 0
    // 自动重播
    setTimeout(() => {
      globalState.audio?.play()
    }, 1000)
  })
  
  // 恢复播放状态
  const savedState = getPlaybackState()
  if (savedState?.isPlaying) {
    // 恢复播放位置
    if (savedState.currentTime > 0) {
      globalState.audio.currentTime = savedState.currentTime
    }
    // 延迟播放以确保音频准备就绪
    setTimeout(() => {
      if (globalState.userInteracted) {
        globalState.audio?.play().catch(() => {})
      }
    }, 100)
  }
  
  // 同步当前播放状态
  isPlaying.value = !globalState.audio.paused
  
  // 页面加载完成后自动播放
  if (globalState.userInteracted) {
    globalState.audio.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      // 等待元数据加载
      globalState.audio?.addEventListener('canplaythrough', () => {
        globalState.audio?.play().then(() => {
          isPlaying.value = true
        })
      }, { once: true })
    })
  }
})

// 清理资源（不暂停全局音频）
onUnmounted(() => {
  // 只清理本地引用，不暂停全局音频
  audio.value = null
})

// 音频控制
const togglePlay = () => {
  if (!globalState.audio) return
  
  if (isPlaying.value) {
    globalState.audio.pause()
  } else {
    globalState.audio.play()
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <!-- Widget模式 -->
  <div 
    v-if="props.useWidgetStyle" 
    class="horizon-widget-button music-player-widget" 
    @click="togglePlay"
    @mouseenter="$emit('mouseenter', $event)"
    role="button"
    tabindex="0"
    aria-label="音乐播放器"
  >
    <client-only>
      <div class="widget-icon-container">
        <Transition name="widget-icon" mode="out-in">
          <Icon 
            :key="isPlaying.toString()"
            :name="isPlaying ? 'tdesign:play-circle-filled' : 'tdesign:play-circle-stroke'" 
            class="widget-icon-inner"
          />
        </Transition>
      </div>
      <div class="player-tooltip" v-if="isPlaying">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(currentTime / duration) * 100}%` }"
          ></div>
        </div>
        <span class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </span>
      </div>
    </client-only>
  </div>
  
  <!-- 传统按钮模式 -->
  <Button v-else v-slot="slotProps" asChild :link=true>
    <button v-bind="slotProps.a11yAttrs" @click="togglePlay" class="">
      <client-only>
        <Icon 
          :name="isPlaying ? 'tdesign:play-circle-filled' : 'tdesign:play-circle-stroke'" 
          class="rmc-button-icon"
        />
      </client-only>
    </button>
  </Button>
</template>

<style lang="scss" scoped>
.music-player-widget {
  position: relative;
  
  .widget-icon-container {
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .player-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    background: rgba(0, 0, 0, 0.9);
    padding: 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
    margin-bottom: 0.5rem;
    opacity: 0;
    visibility: hidden;
    z-index: 6666;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    
    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid rgba(0, 0, 0, 0.9);
    }
    
    .music-player-widget:hover & {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  .progress-bar {
    width: 80px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    margin-bottom: 0.25rem;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #fff;
    border-radius: 2px;
    transition: width 0.1s linear;
  }
  
  .time-display {
    font-size: 0.7rem;
    color: #fff;
  }
}
</style>