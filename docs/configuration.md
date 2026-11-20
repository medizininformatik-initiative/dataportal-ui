# Configuration Guide

The Data Portal UI is configured via a json config file and its attributes. See this sections for available variables and their defaults.
The variables are written here as json paths - which translate to the config json.


## Example configuration

```json
{
  "authBaseUrl": "http://localhost:8080",
  "authClientId": "dataportal-webapp",
  "authRealm": "dataportal",
  "backendBaseUrl": "http://localhost:8090",
  "copyrightOwner": "FDPG+ Team",
  "copyrightYear": "2025",
  "email": "info@forschen-fuer-gesundheit.de",
  "stylesheet": "FDPGTheme",
  "version": "6.4.0"
}
```


## Configuration Variables


---

#### `authBaseUrl`

Auth base URL to connect to the auth service (e.g. Keycloak).

**Default:** `http://localhost:8080`

---

#### `authClientId`

Client ID registered in the auth service used to identify the web application.

**Default:** `dataportal-webapp`

---

#### `authRealm`

The auth realm to authenticate against.

**Default:** `dataportal`

---

#### `backendBaseUrl`

Base URL of the dataportal backend API.

**Default:** `http://localhost:8090`

---

#### `copyrightOwner`

Name of the copyright owner displayed in the UI footer.

**Default:** `FDPG+ Team`

---

#### `copyrightYear`

Year displayed alongside the copyright notice in the UI footer.

**Default:** `2025`

---

#### `email`

Contact email address displayed in the UI.

**Default:** `info@forschen-fuer-gesundheit.de`

---

#### `stylesheet`

Name of the stylesheet/theme applied to the UI.

**Default:** `FDPGTheme`

---

#### `version`

Version string of the dataportal UI displayed in the interface.

**Default:** `6.4.0`

---
