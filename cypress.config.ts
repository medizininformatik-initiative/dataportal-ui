import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import fs from "fs-extra";
import path from "path";

// Backend caps saved queries per user (`maxSavedQueriesPerUser`, 10): earlier runs leave queries
// behind and the save in later runs is rejected with 403. Start every run from an empty list.
async function clearSavedQueries(username: string, password: string): Promise<void> {
  const token = 'http://localhost:8080/realms/dataportal/protocol/openid-connect/token';
  const backend = 'http://localhost:8090/api/v6/query/data';
  const login = await fetch(token, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: 'dataportal-webapp',
      username,
      password,
    }),
  });
  const headers = { Authorization: `Bearer ${(await login.json()).access_token}` };
  const queries: { id: number }[] = await (await fetch(backend, { headers })).json();
  await Promise.all(
    queries.map(({ id }) => fetch(`${backend}/${id}`, { method: 'DELETE', headers }))
  );
}

export default defineConfig({
  env: {
    // Sensitive - read via cy.env() only, never exposed to the browser context.
    username: 'testuser',
    password: 'testpassword',
  },
  expose: {
    // UI language the suite runs in: 'en' (default) or 'de'. Override per run with
    // `npx cypress run --expose language=de`. See cypress/support/i18n.ts.
    language: 'en',
    // Theme the suite runs in: 'light' (default) or 'dark'. `--expose theme=dark` stores the choice before the app starts.
    theme: 'light',
    // Non-sensitive - safe for synchronous Cypress.expose() access, including
    // as cy.origin()'s plain string URL argument.
    homeUrl: 'http://localhost:4200/data-query/cohort-definition',
    redirectUrl: 'http://localhost:8080',
  },
  e2e: {
    specPattern: "**/*.feature",
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {

       on('before:run', async () => {
        await clearSavedQueries(config.env.username, config.env.password);

        const foldersToClear = [
          path.join(__dirname, 'cypress', 'downloads'),
          path.join(__dirname, 'cypress', 'screenshots'),
        ];

        foldersToClear.forEach((folder) => {
          if (fs.existsSync(folder)) {
            fs.removeSync(folder);
            console.log(`✅ Cleared folder: ${folder}`);
          } else {
            console.log(`ℹ️ Folder not found: ${folder}`);
          }
        });
      });

      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },

    testIsolation: true,
    baseUrl: "http://localhost:4200",
    port: 4300,
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
});
