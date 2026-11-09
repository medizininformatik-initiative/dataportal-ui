import { defineStep } from '../defineStep'

/**
 * Fixed wait step for rare unavoidable sleeps.
 * */
export class Timeout {
  /**
   * Wait `seconds`.
   * */
  public waitFor(seconds: number) {
    cy.wait(seconds * 1000, { log: true })
  }
}

export const timeout = new Timeout()

defineStep('I wait for {int} seconds', (seconds: number) => timeout.waitFor(seconds))
