# Backend & Auth

## Runtime configuration

The UI reads its settings at startup from `assets/config/config.<env>.json`, not at build time. One Docker image therefore works in every environment. In `config.deploy.json`, values like `#{authBaseUrl}` are placeholders that the deployment replaces.

See [Configuration](./configuration) for every key.

## Sign-in with Keycloak

The UI signs in with OpenID Connect (authorization code flow with PKCE) through `angular-oauth2-oidc`.

| Setting               | Value                                           |
| --------------------- | ----------------------------------------------- |
| Issuer                | `<authBaseUrl>/realms/<authRealm>`              |
| Client ID             | `authClientId`                                  |
| Redirect URI          | `<UI origin>/home`                              |
| Silent refresh URI    | `<UI origin>/assets/silent-refresh.html`        |
| Scopes                | `openid profile email roles`                    |

The Keycloak client must list the redirect URI and the silent refresh URI under **Valid redirect URIs**. For logout, the UI origin must be allowed under **Valid post logout redirect URIs**.

The UI refreshes the access token silently in the background. A user who is no longer signed in is sent to the sign-in page (see [Errors and Messages](./usage/errors#session)).

Every request to the backend carries the access token as a bearer token. Requests to `assets/` and to the local Keycloak are sent without a token.

## Startup sequence

Before the UI is shown, it runs these steps in order. If one step fails, the UI does not start, and the browser console names the failed step.

1. Load the runtime configuration
2. Sign in (redirect to Keycloak if needed)
3. Load the portal settings from the backend
4. Load the user profile
5. Check the backend health (`/actuator/health`)
6. Load the UI profiles (filters per criterion)
7. Load the backend information (version, shown in **About the Portal**)
8. Load the terminology systems
9. Load the patient profile
10. Initialise the data providers

## Backend API

The UI talks to the dataportal backend (`backendBaseUrl`). Main areas:

| Area                      | Used for                                                  |
| ------------------------- | --------------------------------------------------------- |
| Terminology search        | Criteria search, bulk search, concept filters             |
| Feasibility query         | Send a query, poll the result, load site details          |
| Saved queries             | Save, list, load and delete data definitions              |
| Data selection profiles   | Feature search and profile details                        |
| Actuator                  | Health check and version information                      |
