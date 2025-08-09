import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import RandomReadController from './RandomReadController.vue';
import RandomReadButton from './RandomReadButton.vue'; // 导入按钮组件
import { hydrateStore } from './store.js';
import './custom.css'; // 你可以创建一个空的 custom.css 文件，或用于自定义样式

export default {
  // 继承默认主题
  ...DefaultTheme,
  // 扩展 Layout 组件
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 使用 'layout-bottom' 插槽将我们的组件注入到每个页面的底部
      'layout-bottom': () => h(RandomReadController),
      // 在导航栏的末尾添加“开始随机阅读”按钮
      'nav-bar-content-after': () => h(RandomReadButton),
    });
  },
  // 扩展 enhanceApp 上下文
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('RandomReadButton', RandomReadButton);

    // 在客户端环境，调用 hydrateStore 从 localStorage 恢复状态
    if (typeof window !== 'undefined') {
      hydrateStore();
    }
  },
};