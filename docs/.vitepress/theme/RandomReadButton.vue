<template>
  <button @click="start">开始随机阅读</button>
</template>

<script setup>
import { useData } from 'vitepress';
import { startRandomRead } from './store.js';

const { theme } = useData();

const start = () => {
  // 从 theme.sidebar 获取所有题目 (已适配为 'Solutions')
  const allProblems = theme.value.sidebar
    .find(group => group.text === 'Solutions')
    ?.items || [];
  
  if (allProblems.length > 0) {
    startRandomRead(allProblems);
  } else {
    alert('没有找到可供阅读的题目列表！');
  }
};
</script>