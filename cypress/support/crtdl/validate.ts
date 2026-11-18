/**
 * Ask backend whether it accepts every generated case: `npm run crtdl:validate`. Run after
 * changing `ontology.ts`, `cases.ts` or builders, and after ontology upgrade. Defaults = local
 * docker stack (cypress/docker). Override with `BACKEND_URL` / `AUTH_URL`.
 * */
import { CASES, MUTANTS } from './cases'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8090/api/v6'
const AUTH =
  process.env.AUTH_URL ?? 'http://localhost:8080/realms/dataportal/protocol/openid-connect/token'

/**
 * Fetch auth token.
 * */
async function token(): Promise<string> {
  const response = await fetch(AUTH, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: 'dataportal-webapp',
      username: 'testuser',
      password: 'testpassword',
    }),
  })
  return (await response.json()).access_token
}

/**
 * Validate every case and mutant, exit non-zero when case is rejected or mutant accepted.
 * */
async function main() {
  const bearer = await token()
  let wrong = 0
  const expectations = [
    ...Object.entries(CASES).map(([name, body]) => ({ name, body, valid: true })),
    ...Object.entries(MUTANTS).map(([name, body]) => ({ name, body, valid: false })),
  ]
  for (const { name, body, valid } of expectations) {
    const response = await fetch(`${BACKEND}/validation/crtdl`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${bearer}` },
      body: JSON.stringify(body),
    })
    if ((response.status === 200) !== valid) {
      wrong++
      console.log(
        `${valid ? 'INVALID ' : 'ACCEPTED'}  ${name}  (${response.status})  ${(
          await response.text()
        ).slice(0, 240)}`
      )
    }
  }
  console.log(`${expectations.length} cases and mutants, ${wrong} wrong`)
  process.exit(wrong ? 1 : 0)
}

main()
