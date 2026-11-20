import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "Dataportal UI",
  description: "Documentation for the FDPG Dataportal UI",
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Usage', link: '/usage/overview' },
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
          { text: 'Overview', link: '/usage/overview' },
          { text: 'Cohort Selection (Feasibility)', link: '/usage/feasibility' },
          { text: 'Feature Selection', link: '/usage/data-selection' },
          { text: 'Data Definition', link: '/usage/data-definition' },
          { text: 'Saved Data Definitions', link: '/usage/saved-queries' },
          { text: 'Errors and Messages', link: '/usage/errors' },
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Behaviour Specification (Gherkin)', link: '/testing' },
          { text: 'FAQ', link: '/faq' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/medizininformatik-initiative/dataportal-ui' }
    ]
  }
})
