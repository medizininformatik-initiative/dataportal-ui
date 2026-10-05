/**
 * Asks the backend whether it accepts every generated case: `npm run crtdl:validate`.
 * Run it after changing `ontology.ts`, `cases.ts` or the builders, and after an ontology upgrade.
 * Defaults are the local docker stack (cypress/docker); override with BACKEND_URL / AUTH_URL.
 */
import { CASES } from './cases'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8090/api/v6'
const AUTH = process.env.AUTH_URL ?? 'http://localhost:8080/realms/dataportal/protocol/openid-connect/token'

async function token(): Promise<string> {
  const response = await fetch(AUTH, {
    method: 'POST',
    body: new URLSearchParams({ grant_type: 'password', client_id: 'dataportal-webapp', username: 'testuser', password: 'testpassword' }),
  })
  return (await response.json()).access_token
}

async function main() {
  const bearer = await token()
  let invalid = 0
  for (const [name, body] of Object.entries(CASES)) {
    const response = await fetch(`${BACKEND}/validation/crtdl`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${bearer}` },
      body: JSON.stringify(body),
    })
    if (response.status !== 200) {
      invalid++
      console.log(`INVALID  ${name}  (${response.status})  ${(await response.text()).slice(0, 240)}`)
    }
  }
  console.log(`${Object.keys(CASES).length} cases, ${invalid} invalid`)
  process.exit(invalid ? 1 : 0)
}

main()
