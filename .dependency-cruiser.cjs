/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    tsConfig: { fileName: 'tsconfig.app.json' },
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    exclude: { path: '\\.spec\\.ts$' },
  },
  forbidden: [
    {
      name: 'service-not-to-ui',
      comment: 'Services must not depend on components, modules or layout (opening a modal is allowed).',
      severity: 'error',
      from: { path: '^src/app/(service|shared/service)/' },
      to: { path: '^src/app/(modules|layout|site|shared/components)/', pathNot: '-modal\\.component\\.ts$' },
    },
    {
      name: 'model-not-to-ui-or-service',
      severity: 'error',
      from: { path: '^src/app/model/' },
      to: { path: '^src/app/(modules|layout|site|service|shared/components|shared/service)/' },
    },
    {
      name: 'shared-types-not-to-domain',
      comment: 'shared/types stays domain-neutral.',
      severity: 'error',
      from: { path: '^src/app/shared/types/' },
      to: { path: '^src/app/', pathNot: '^src/app/shared/types/' },
    },
    { name: 'no-circular', severity: 'warn', from: {}, to: { circular: true } },
  ],
}
