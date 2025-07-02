import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.js'

import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.js'

const solutionPathSegment = '/docs/Solution/';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NekoForces",
  description: "An AI-driven competitive programming solution collector.",
  base: '/',
  vite: {
    plugins: [
      {
        name: 'escape-ai-generated-templates',
        transform(code, id) {
          if (id.includes(solutionPathSegment)) {
            // For files in the Solution directory, we escape Vue's default
            // template delimiters to prevent them from being parsed.
            const newCode = code.replace(/\{\{/g, '{\\{').replace(/\}\}/g, '}\\}');
            return { code: newCode, map: null };
          }
        }
      }
    ]
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