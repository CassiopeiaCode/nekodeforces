import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NekoForces",
  description: "An AI-driven competitive programming solution blog.",
  base: '/nekodeforces/', // <-- Important for GitHub Pages deployment
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Solutions', link: '/Solution/' }
    ],

    sidebar: {
      '/Solution/': [
        {
          text: 'Solutions',
          items: [
            // This will be populated by your script later
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CassiopeiaCode/nekodeforces' }
    ]
  }
})