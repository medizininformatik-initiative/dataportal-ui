import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import fs from "fs-extra";
import path from "path";

export default defineConfig({
  env: {
    // Sensitive - read via cy.env() only, never exposed to the browser context.
    username: 'testuser',
    password: 'testpassword',
  },
  expose: {
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

       on('before:run', () => {
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
