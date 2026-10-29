const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  modulePaths: ['<rootDir>'],
  // TODO: specs that no longer compile after the structured-query refactor
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/app/modules/feasibility-query/components/result/save-dialog/save-dialog.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/profile/reference/modal-window/profile-reference-modal.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/profile/reference/profile-reference.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/profile/profile-filter/token-filter/token-filter.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/criterion/header/criterion-header.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/filter-tabs/filter-tabs.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/profile/profile.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/criterion/criterion.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/reference/reference-edit.component.spec.ts',
    '<rootDir>/src/app/modules/data-query/data-query/cohort-definition/action-bar/cohort-definition-action-bar.component.spec.ts',
    '<rootDir>/src/app/modules/shared-filter/components/concept/concept-filter.component.spec.ts',
    '<rootDir>/src/app/modules/feasibility-query/components/result/result.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/action-bar/edit-action-bar.component.spec.ts',
    '<rootDir>/src/app/modules/data-selection/components/editor/display/display.component.spec.ts',
    '<rootDir>/src/app/modules/data-selection/components/search/search.component.spec.ts',
    '<rootDir>/src/app/modules/query-editor/components/editor-content/editor-content.component.spec.ts',
    '<rootDir>/src/app/modules/feasibility-query/components/editor/edit.component.spec.ts',
    '<rootDir>/src/app/modules/dashboard/components/dashboard/dashboard.component.spec.ts',
    '<rootDir>/src/app/shared/components/validation-modal/validation-modal.component.spec.ts',
    '<rootDir>/src/app/shared/components/search/searchbar.component.spec.ts',
    '<rootDir>/src/app/shared/components/save-dataquery-modal/save-dataquery-modal.component.spec.ts',
    '<rootDir>/src/app/shared/components/breadcrumbs/breadcrumbs.component.spec.ts',
    '<rootDir>/src/app/layout/components/error-log/error-log-modal.component.spec.ts',
    '<rootDir>/src/app/shared/components/filter-chips/filter-chips.component.spec.ts',
    '<rootDir>/src/app/layout/components/about-modal/about-modal.component.spec.ts',
    '<rootDir>/src/app/layout/components/header/header.component.spec.ts',
    '<rootDir>/src/app/layout/components/app-layout/app-layout.component.spec.ts',
    '<rootDir>/src/app/layout/components/side-menu/side-menu.component.spec.ts',
  ],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  globalSetup: '<rootDir>/jest.global-setup.js',
  setupFilesAfterEnv: ['<rootDir>/src/test.ts'],

  collectCoverage: true,

  collectCoverageFrom: [
    '<rootDir>/src/app/**/*.ts',
    '!<rootDir>/src/app/**/index.ts',
    '!<rootDir>/src/app/**/*.module.ts',
    '!<rootDir>/src/app/**/font-awesome-icons.ts',
  ],

  coverageReporters: ['html', 'text-summary', 'json', 'lcov', 'text', 'clover', 'cobertura'],

  reporters: ['default', 'jest-junit'],

  coverageDirectory: '<rootDir>/coverage',

  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: '<rootDir>/',
    }),

    '^(.*)/environments/(.*)$': '<rootDir>/src/environments/environment.test.ts',

    '^lodash-es$': '<rootDir>/node_modules/lodash/index.js',
  },
}
