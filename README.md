## feathers-hooks-common

Useful hooks for use with Feathersjs services.

Work in progress.

[![Build Status](https://travis-ci.org/eddyystop/feathers-hooks-common.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-common)
[![Coverage Status](https://coveralls.io/repos/github/eddyystop/feathers-hooks-common/badge.svg?branch=master)](https://coveralls.io/github/eddyystop/feathers-hooks-common?branch=master)

## Code Example

(1) Add created timestamp.

```javascript
const lib = require('feathers-hooks-common');
module.exports.before = {
  create: [ lib.setCreatedAt({ as: 'createdAt' }) ] // added to hook.data
};
```

(2) Add or updated timestamp.

```javascript
module.exports.before = {
  create: [ lib.setUpdatedAt({ as: 'updatedAt' }) ], // added to hook.data
  update: [ lib.setUpdatedAt({ as: 'updatedAt' }) ], // added to hook.data.$set
  patch: [ lib.setUpdatedAt({ as: 'updatedAt' }) ]
};
```

(3) Normalize URL slug, e.g. https://.../stores/:storeid/...,
between feathers-socketio, featgers-rest and raw HTTP transports.

```javascript
module.exports.before = {
  create: [ lib.setSlug('storeid') ], // slug value at hook.params.query.storeid
  update: [ lib.setSlug('storeid') ],
  patch: [ lib.setSlug('storeid') ]
};
module.exports.after = {
  create: [ lib.setSlug('storeid') ] // slug value at hook.params.query.storeid
};
```

(4) Display current info about the hook to console.

```javascript
module.exports.after = {
  create: [ lib.setUpdatedAt('step 1') ]
  // * step 1
  // type: before, method: create
  // data: { name: 'Joe Doe' }
  // query: { sex: 'm' }
  // results: { assigned: true }
};
```

(5) Wrapper for `require('feathers-authentication').hooks.restrictToRoles`.

```javascript
const authorizer = lib.restrictToRoles([], 'authorizedRoles', false, 'userId');
module.exports.before = {
  create: [ authorizer(['purchasing", 'receiving']) ]
};
```

## Motivation

Feathers [services](http://docs.feathersjs.com/services/readme.html)
can be developed faster if the
[hooks](http://docs.feathersjs.com/hooks/readme.html)
you need are at hand.

This package provides some commonly needed hooks.

## Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-hooks-common --save` in your project folder.

`/src` on GitHub contains the ES6 source. It will run on Node 6+ without transpiling.

## API Reference

Each module is fully documented.

## Tests

`npm test` to run tests.

`npm run cover` to run tests plus coverage.

## Contributors

- [eddyystop](https://github.com/eddyystop)

## License

MIT. See LICENSE.