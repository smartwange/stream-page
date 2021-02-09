const test = require('ava')
const autotow = require('..')

// TODO: Implement module test
test('<test-title>', t => {
  const err = t.throws(() => autotow(100), TypeError)
  t.is(err.message, 'Expected a string, got number')

  t.is(autotow('w'), 'w@zce.me')
  t.is(autotow('w', { host: 'wedn.net' }), 'w@wedn.net')
})
