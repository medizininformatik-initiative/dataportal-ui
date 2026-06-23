import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "Dataportal GUI",
  description: "Documentation for Dataportal GUI",
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
    ],
    outline: {
      level: [2, 3],
    },
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/getting-started' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Backend & Auth', link: '/backend' }
        ]
      },
      {
        text: 'Usage',
        items: [
          { text: 'Feasibility', link: '/usage/feasibility' },
          { text: 'Data Selection', link: '/usage/data-selection' },

        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'FAQ', link: '/faq' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/medizininformatik-initiative/feasibility-gui' }
    ]
  }
})
