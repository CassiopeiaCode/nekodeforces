import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.js'
import { katex } from '@mdit/plugin-katex'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Moe's CF Life",
  description: "An AI-powered archive of competitive programming solutions.",
  base: '/',
  head: [
    // Favicon configuration from mts
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', type: 'image/png', sizes: '16x16' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'mask-icon', href: '/favicon.svg', color: '#ffffff' }],
    
    // Existing configuration from js
    [
      'link',
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css' }
    ],
    [
      'script',
      {},
      `
      document.addEventListener('error', (e) => {
        const target = e.target;
        if (target && target.tagName === 'IMG') {
          target.style.display = 'none';
        }
      }, true);
      `
    ],
    [
      'script',
      { type: 'text/javascript' },
      `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "s8pfa0uv88");`
    ]
  ],
  markdown: {
    config: (md) => {
      md.use(katex)
    }
  },
  // The vite plugin from the original config.js is no longer needed
  // because the pre-processing script in deploy_frontend.py now handles this.
  
  themeConfig: {
    logo: '/favicon.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '题解', link: '/Solution/' }, // VitePress will automatically resolve this to /Solution/index.md
      { text: '关于', link: '/about-me' },
      { text: '随机阅读', link: '#start-random-read' }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CassiopeiaCode/nekodeforces' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Moe'
    },

    search: {
      provider: 'local'
    }
  }
})