import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Feasibility GUI",
  description: "Documentation for Feasibility GUI",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Usage', link: '/usage/feasibility' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/getting-started' },
          { text: 'Configuration', link: '/configuration' },
          { text: 'Backend & Auth', link: '/integration' }
        ]
      },
      {
        text: 'Usage',
        items: [
          {
            text: 'Feasibility',
            link: '/usage/feasibility',
            items: [
              { text: 'Standard Search', link: '/usage/feasibility#standard-search' },
              { text: 'Bulk Search', link: '/usage/feasibility#bulk-search' },
              { text: 'Edit', link: '/usage/feasibility#edit' },
              { text: 'Result', link: '/usage/feasibility#result' },
              { text: 'Bulk Concept Selection', link: '/usage/feasibility#bulk-concept-selection' }
            ]
          },
          {
            text: 'Data Selection',
            link: '/usage/data-selection',
            items: [
              { text: 'Search', link: '/usage/data-selection#search' },
              { text: 'Edit', link: '/usage/data-selection#edit' }
            ]
          }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'FAQ', link: '/faq' },
          { text: 'Troubleshooting', link: '/troubleshooting' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/medizininformatik-initiative/feasibility-gui' }
    ]
  }
})
