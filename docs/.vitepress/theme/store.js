import { reactive, watch } from 'vue';

// 用于 localStorage 的键，确保唯一性
const STORE_KEY = 'randomReadState';
// 24小时的毫秒数，用于判断进度是否过期
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// 返回一个纯净的初始状态对象
const getInitialState = () => ({
  isActive: false,       // 模式是否激活
  speed: 5,              // 默认速度 (范围 1-10)
  problemList: [],       // 当前会话的完整题目列表 (临时的)
  problemStats: [],      // 阅读统计 (将被持久化)
  lastReadTimestamp: 0,  // 上次阅读的时间戳
});

// 创建全局响应式 store
export const store = reactive(getInitialState());

/**
 * 从 localStorage 恢复状态。
 * 这个函数必须在客户端环境中调用。
 */
export function hydrateStore() {
  const savedState = localStorage.getItem(STORE_KEY);
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      // 安全地合并状态，防止因 localStorage 数据损坏导致应用崩溃
      store.isActive = parsedState.isActive || false;
      store.speed = typeof parsedState.speed === 'number' ? parsedState.speed : 5;
      store.problemStats = Array.isArray(parsedState.problemStats) ? parsedState.problemStats : [];
      store.lastReadTimestamp = typeof parsedState.lastReadTimestamp === 'number' ? parsedState.lastReadTimestamp : 0;
    } catch (e) {
      console.error("无法从 localStorage 解析状态", e);
    }
  }
}

// 使用 watch 自动将状态变更持久化到 localStorage
watch(
  () => ({ // 监听一个包含所有需持久化属性的对象
    isActive: store.isActive,
    speed: store.speed,
    problemStats: store.problemStats,
    lastReadTimestamp: store.lastReadTimestamp,
  }),
  (newState) => {
    // 注意：我们特意没有保存 problemList，因为它体积可能很大且是动态的
    localStorage.setItem(STORE_KEY, JSON.stringify(newState));
  },
  { deep: true } // 必须使用 deep: true 来侦听数组内部的变化
);

/**
 * 启动随机阅读模式
 * @param {Array} problems - 从侧边栏等地方获取的完整题目列表，格式：[{text, link}]
 */
export function startRandomRead(problems) {
  const now = Date.now();
  // 如果距离上次阅读超过一天，则重置统计数据
  if (now - store.lastReadTimestamp > ONE_DAY_MS) {
    store.problemStats = [];
  }

  store.problemList = problems.map(p => ({ text: p.text, link: p.link }));

  // 同步 problemStats 和最新的 problemList
  const currentLinks = new Set(store.problemList.map(p => p.link));
  store.problemStats = store.problemStats.filter(stat => currentLinks.has(stat.link));
  store.problemList.forEach(p => {
    if (!store.problemStats.some(stat => stat.link === p.link)) {
      store.problemStats.push({ link: p.link, count: 0 });
    }
  });

  store.isActive = true;
  store.lastReadTimestamp = now;
}

/**
 * 停止随机阅读模式
 */
export function stopRandomRead() {
  store.isActive = false;
}

/**
 * 为指定链接的页面增加阅读计数
 * @param {string} link - 页面的链接
 */
export function incrementProblemCount(link) {
    const stat = store.problemStats.find(s => s.link === link);
    if (stat) {
        stat.count++;
    }
    store.lastReadTimestamp = Date.now();
}

/**
 * 智能选择下一篇文章并跳转
 * @param {object} router - VitePress 的 router 实例
 * @param {string} currentPageRelativePath - 当前页面的相对路径，用于避免重复跳转
 */
export function selectAndGoToNextProblem(router, currentPageRelativePath = '') {
  if (store.problemList.length === 0) {
    stopRandomRead();
    return;
  }

  // 1. 找到当前列表中的最低阅读次数
  const relevantStats = store.problemStats.filter(stat => store.problemList.some(p => p.link === stat.link));
  if (relevantStats.length === 0) return; // 容错
  const minCount = Math.min(...relevantStats.map(stat => stat.count));

  // 2. 筛选出所有阅读次数为最低的候选项
  let candidates = relevantStats.filter(stat => stat.count === minCount);

  // 3. 如果候选项多于一个，且当前页面在其中，则排除当前页
  if (candidates.length > 1) {
    candidates = candidates.filter(stat => stat.link !== currentPageRelativePath);
  }
  
  // 4. 如果排除后没有候选项了，则恢复
  if (candidates.length === 0) {
      candidates = relevantStats.filter(stat => stat.count === minCount);
  }

  // 5. 从最终的候选项中随机选择一个
  const randomIndex = Math.floor(Math.random() * candidates.length);
  const nextProblemStat = candidates[randomIndex];
  
  // 6. 增加新页面的计数并使用 router 跳转
  incrementProblemCount(nextProblemStat.link);
  router.go(nextProblemStat.link.replace('.md', '.html'));
}