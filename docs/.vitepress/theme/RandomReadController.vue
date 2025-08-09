<template>
  <div
    v-if="store.isActive"
    class="read-controller"
    :style="{ opacity: controllerOpacity }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="controller-content">
      <p>随机阅读中...</p>
      <div class="controls">
        <label for="speed-control">速度:</label>
        <input type="range" id="speed-control" min="1" max="10" v-model="store.speed" />
        <span>{{ store.speed }}</span>
        <button @click="stop">停止</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted, onUnmounted, ref } from 'vue';
import { store, stopRandomRead, selectAndGoToNextProblem } from './store.js';
import { useRouter, useData } from 'vitepress';

const router = useRouter();
const { page } = useData();
let animationFrameId = null;
let virtualScrollY = 0;

const stop = () => stopRandomRead();

const selectNextProblem = () => {
  selectAndGoToNextProblem(router, page.value.relativePath);
};

// --- 控制器淡出逻辑 ---
const controllerOpacity = ref(1);
let fadeTimeoutId = null;

const handleMouseEnter = () => {
  if (fadeTimeoutId) clearTimeout(fadeTimeoutId);
  controllerOpacity.value = 1;
};

const handleMouseLeave = () => {
  if (fadeTimeoutId) clearTimeout(fadeTimeoutId);
  fadeTimeoutId = setTimeout(() => {
    controllerOpacity.value = 0.05;
  }, 1000);
};

// --- 核心滚动逻辑 ---
const startScrolling = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  let lastTime = 0;
  virtualScrollY = window.scrollY;

  const animateScroll = (timestamp) => {
    if (!store.isActive) {
      cancelAnimationFrame(animationFrameId);
      return;
    }
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // 同步用户手动滚动
    const actualY = window.scrollY;
    if (Math.abs(virtualScrollY - actualY) > 10) {
      virtualScrollY = actualY;
    }

    // 物理计算
    const endY = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (virtualScrollY >= endY - 1) {
      selectNextProblem();
      return;
    }

    const totalDistance = endY;
    const timeEase = 2000;
    const maxSpeed = 10 * Math.pow(1.6, store.speed - 1);
    const acceleration = maxSpeed / (timeEase / 1000);
    const distEase = 0.5 * acceleration * Math.pow(timeEase / 1000, 2);

    let currentSpeed;
    if (virtualScrollY < distEase) {
      currentSpeed = Math.sqrt(2 * acceleration * virtualScrollY);
    } else if (virtualScrollY >= totalDistance - distEase) {
      const distanceFromEnd = totalDistance - virtualScrollY;
      currentSpeed = Math.sqrt(2 * acceleration * distanceFromEnd);
    } else {
      currentSpeed = maxSpeed;
    }
    currentSpeed = Math.max(0, Math.min(currentSpeed, maxSpeed));

    const scrollAmount = (currentSpeed * deltaTime) / 1000;
    virtualScrollY += Math.max(scrollAmount, 0.01);

    window.scrollTo(0, virtualScrollY);
    animationFrameId = requestAnimationFrame(animateScroll);
  };
  animationFrameId = requestAnimationFrame(animateScroll);
};

// --- 生命周期和监听器 ---
onMounted(() => {
  if (store.isActive) {
    startScrolling();
    handleMouseLeave();
  }
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (fadeTimeoutId) clearTimeout(fadeTimeoutId);
});

watch(() => store.isActive, (isActive) => {
  if (isActive) {
    startScrolling();
    handleMouseLeave();
  } else {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    handleMouseEnter();
  }
});

watch(() => page.value.relativePath, () => {
  if (store.isActive) {
    setTimeout(() => {
      if (store.isActive) {
        window.scrollTo(0, 0);
        virtualScrollY = 0;
        startScrolling();
      }
    }, 500);
  }
});
</script>

<style scoped>
.read-controller {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: opacity 1s linear;
}
.controller-content p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-size: 0.9rem;
}
.controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.controls label {
  font-size: 0.85rem;
}
.controls button {
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 15px;
  background-color: transparent;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: all 0.2s ease;
}
.controls button:hover {
  background-color: var(--vp-c-brand-soft);
}
</style>