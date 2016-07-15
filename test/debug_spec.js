
/* eslint  no-shadow: 0, no-var: 0 */

const hooksCommon = require('../lib');

var hook;

describe('debug', () => {
  it('does not crash', () => {
    hook = {
      type: 'before',
      method: 'create',
      data: { a: 'a' },
      params: { query: { b: 'b' } },
      results: { c: 'c' },
    };
    hooksCommon.debug('my message')(hook);
  });
});
