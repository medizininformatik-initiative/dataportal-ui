[//]: <> Installation and configuration instructions for the Dataportal GUI application.
[//]: <> Eventuell auf die Datapportal Doku verweisen/ nutzen hier
[//]: <> oder nur die Unterschiede hier dokumentieren
[//] : <> Verweis auf Keycloak, Elasticsearch, backend doku
[//]: <> Config der GUi erklären in der config.js was man einstellen kann --> Link zur datei#
[//]: <> Hinweis auf die Lang Datei??
[//]: <> 



# Configuration Guide

This guide covers all configuration options available in the Feasibility GUI application.

## Overview

The application configuration is managed through JSON files located in `src/assets/config/`. The main configuration file is `config.dev.json` for development environments.

## Configuration Structure

### Backend Connection

```json
{
  "env": "dev",
  "uiBackendApi": {
    "baseUrl": "http://localhost:8090/api/v1"
  }
}
```

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `env` | string | Environment name | `"dev"` |
| `uiBackendApi.baseUrl` | string | Backend API base URL | `"http://localhost:8090/api/v1"` |

### Authentication (Keycloak)

```json
{
  "auth": {
    "baseUrl": "http://localhost:8080",
    "realm": "codex-develop",
    "clientId": "feasibility-gui"
  }
}
```

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `auth.baseUrl` | string | Keycloak server URL | `"http://localhost:8080"` |
| `auth.realm` | string | Keycloak realm name | `"codex-develop"` |
| `auth.clientId` | string | OAuth2 client ID | `"feasibility-gui"` |

### Feature Flags

#### Query Features (V2)

```json
{
  "features": {
    "v2": {
      "multiplevaluedefinitions": true,
      "multiplegroups": true,
      "dependentgroups": true,
      "timerestriction": true
    }
  }
}
```

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `multiplevaluedefinitions` | boolean | Allow multiple value restrictions per criterion | `true` |
| `multiplegroups` | boolean | Allow multiple groups of criteria | `true` |
| `dependentgroups` | boolean | Enable group dependencies | `true` |
| `timerestriction` | boolean | Enable time restrictions for criteria | `true` |

#### Extra Features

```json
{
  "features": {
    "extra": {
      "displayvaluefiltericon": false,
      "showoptionspage": false,
      "sendsqcontexttobackend": true
    }
  }
}
```

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `displayvaluefiltericon` | boolean | Use icons instead of UTF-8 characters for comparators | `false` |
| `showoptionspage` | boolean | Enable live configuration options page | `false` |
| `sendsqcontexttobackend` | boolean | Include context information in Structured Query | `true` |

#### Options

```json
{
  "features": {
    "options": {
      "pollingtimeinseconds": 10,
      "pollingintervallinseconds": 1,
      "lowerboundarypatientresult": 10
    }
  }
}
```

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `pollingtimeinseconds` | number | Total polling duration (seconds) | `10` |
| `pollingintervallinseconds` | number | Polling interval (seconds) | `1` |
| `lowerboundarypatientresult` | number | Obfuscation threshold for small counts | `10` |

### Styling & Branding

```json
{
  "features": {
    "stylesheet": "codexTheme"
  }
}
```

| Property | Type | Description | Options |
|----------|------|-------------|---------|
| `stylesheet` | string | UI theme/branding | `"codexTheme"`, `"abideTheme"` |

### Query Version

```json
{
  "features": {
    "queryVersion": "v1"
  }
}
```

| Property | Type | Description | Options |
|----------|------|-------------|---------|
| `queryVersion` | string | Structured Query version | `"v1"` (CODEX), `"v2"` (ABIDE) |

### FHIR Configuration

```json
{
  "features": {
    "fhirport": 8082
  }
}
```

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `fhirport` | number | FHIR server port | `8082` |

## Development-Only Configuration

For development and testing purposes, the following mock flags are available:

```json
{
  "mock": {
    "terminology": false,
    "query": false,
    "result": false
  }
}
```

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `mock.terminology` | boolean | Use mocked terminology (no backend) | `false` |
| `mock.query` | boolean | Mock query sending (no backend) | `false` |
| `mock.result` | boolean | Simulate results (no backend) | `false` |

## Environment-Specific Configuration

### Development (`config.dev.json`)

```json
{
  "env": "dev",
  "uiBackendApi": {
    "baseUrl": "http://localhost:8090/api/v1"
  },
  "auth": {
    "baseUrl": "http://localhost:8080",
    "realm": "codex-develop",
    "clientId": "feasibility-gui"
  }
}
```

### Production

For production deployments, create `config.prod.json` with appropriate values:

```json
{
  "env": "production",
  "uiBackendApi": {
    "baseUrl": "https://api.yourserver.com/api/v1"
  },
  "auth": {
    "baseUrl": "https://keycloak.yourserver.com",
    "realm": "production-realm",
    "clientId": "feasibility-gui-prod"
  },
  "features": {
    "extra": {
      "showoptionspage": false
    },
    "options": {
      "pollingtimeinseconds": 30,
      "lowerboundarypatientresult": 20
    }
  }
}
```

## Best Practices

1. **Never commit sensitive credentials** to version control
2. **Use environment variables** for deployment-specific values
3. **Keep mock flags disabled** in production
4. **Set appropriate polling times** based on backend performance
5. **Configure obfuscation thresholds** according to privacy requirements
6. **Test configuration changes** in development before production deployment

## Troubleshooting

### Common Configuration Issues

**Backend Connection Fails**
- Verify `uiBackendApi.baseUrl` is correct
- Check CORS settings on the backend
- Ensure backend service is running

**Authentication Errors**
- Confirm Keycloak is running at `auth.baseUrl`
- Verify `realm` and `clientId` match Keycloak configuration
- Check redirect URIs are configured in Keycloak

**Polling Issues**
- Increase `pollingtimeinseconds` for slower backends
- Adjust `pollingintervallinseconds` to reduce server load
- Check backend logs for timeout errors

**Results Not Displayed**
- Verify `lowerboundarypatientresult` threshold
- Check if counts are below obfuscation threshold
- Review backend result format

## Related Documentation

- [Getting Started](./getting-started.md)
- [Backend Integration](./integration.md)
- [Feature Flags](./features.md)
