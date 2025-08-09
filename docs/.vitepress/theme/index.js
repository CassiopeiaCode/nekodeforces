import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import RandomReadController from './RandomReadController.vue';
import { hydrateStore, startRandomRead } from './store.js';
import './custom.css';

/**
 * Attaches a click listener to the random read button.
 * This needs to be re-run on every page navigation.
 * @param {object} siteData - VitePress siteData object.
 */
function setupRandomReadButton(siteData) {
  // Use a more specific selector to avoid conflicts
  const randomReadLink = document.querySelector('a[href="#start-random-read"]');

  if (randomReadLink) {
    // Prevent attaching multiple listeners
    if (randomReadLink.dataset.listenerAttached) {
      return;
    }

    randomReadLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Extract the problem list from the sidebar config
      const allProblems = siteData.value.themeConfig.sidebar
        .find(group => group.text === 'Solutions')
        ?.items || [];

      if (allProblems.length > 0) {
        startRandomRead(allProblems);
      } else {
        alert('没有找到可供阅读的题目列表！');
      }
    });

    // Mark as attached
    randomReadLink.dataset.listenerAttached = 'true';
  }
}

export default {
  ...DefaultTheme,
  // Use Layout to inject the controller that is always present
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(RandomReadController),
    });
  },
  // Use enhanceApp to add global client-side behavior
  enhanceApp({ app, router, siteData }) {
    // Register the controller component globally (optional but good practice)
    app.component('RandomReadController', RandomReadController);

    // Hydrate the store from localStorage on client side
    if (typeof window !== 'undefined') {
      hydrateStore();

      // Initial setup
      router.onAfterRouteChanged = () => {
        setupRandomReadButton(siteData);
      };
    }
  },
};