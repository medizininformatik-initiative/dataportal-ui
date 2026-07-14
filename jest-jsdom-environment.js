const { default: JSDOMEnvironment } = require('jest-environment-jsdom');

class FixedJSDOMEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    this.global.Uint8Array = Uint8Array;
  }
}

module.exports = FixedJSDOMEnvironment;
