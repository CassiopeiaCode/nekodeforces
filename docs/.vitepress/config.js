import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NekoForces",
  description: "An AI-driven competitive programming solution collector.",
  base: '/',
  markdown: {
    // By changing the default Vue template delimiters, we prevent VitePress
    // from misinterpreting text like `{{1, 2}}` as a Vue expression.
    vue: {
      template: {
        compilerOptions: {
          delimiters: ['((%', '%))']
        }
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Solutions', link: '/Solution/' }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CassiopeiaCode/nekodeforces' }
    ]
  }
})