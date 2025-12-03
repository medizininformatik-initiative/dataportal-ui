---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Feasibility GUI"
  text: "Build, run, and review feasibility queries with a terminology-aware UI"
  tagline: "Angular app with ElasticSearch-powered search, DSE editing, and resilient results workflow"
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: Usage Overview
      link: /usage/feasibility
    - theme: alt
      text: Configuration
      link: /configuration
    - theme: alt
      text: Backend & Auth
      link: /integration

features:
  - title: Feasibility Query Builder
    details: Author queries with inclusion/exclusion groups, dependencies, multi-value & date/time restrictions.
  - title: Terminology Search
    details: ElasticSearch-backed search with infinite scroll, list/tree views, and ValueSet scoping.
  - title: Data Selection (DSE)
    details: Profile-based editor with required/recommended/optional fields and referenced profiles handling.
  - title: Resilient Execution & Results
    details: Robust polling, synchronized summary/detail, obfuscation thresholds, and downloadable artifacts.
  - title: Operations & Security
    details: Keycloak authentication, backend-driven settings, feature flags, and About page with version info.
  - title: Internationalization & Theming
    details: ngx-translate (EN/DE), theme hooks, and branded styles.

