
/* eslint  max-len: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */

const hooks = require('feathers-authentication').hooks;
const utils = require('feathers-hooks-utils');

/**
 * Add a createdAt field (for before/after, create/update/patch).
 * @param {object} options. Field name is options.as or 'createdAt'.
 * @returns {Function} hook function
 *
 * module.exports.before = {
 *   create: [ hooksCommon.setCreatedAt() ]
 * };
 */

module.exports.setCreatedAt = (options) => {
  const name = (options && options.as) ? options.as : 'createdAt';
  return (hook) => {
    utils.set(hook, name, new Date());
  };
};

/**
 * Add/update an updatedAt field (for before/after, create/update/patch).
 * @param {object} options. Field name is options.as or 'updatedAt'.
 * @returns {Function} hook function
 *
 * module.exports.before = {
 *   all: [ hooksCommon.setUpdatedAt() ]
 * };
 */

module.exports.setUpdatedAt = (options) => {
  const name = (options && options.as) ? options.as : 'updatedAt';
  return (hook) => {
    utils.set(hook, name, new Date());
  };
};

/**
 * Normalize slug, placing it in hook.params.query.
 * @param {string} slug name e.g. 'storeId' for http://.../stores/:storeId/...
 *
 * A service may have a slug in its path e.g. app.use('/stores/:storeId/candies', new Service());
 * The service gets slightly different values depending on the transport used by the client.
 *
 * hook.params.
 * transport         storeId   hook.params.query                 code on client
 * ----------------- --------- --------------------------------- ------------------------
 * feathers-socketio undefined { size: 'large', storeId: '123' } candies.create({ name: 'Gummi', qty: 100 }, { query: { size: 'large', storeId: '123' } }, cb)
 * feathers-rest     :storeId  { size: 'large', storeId: '123' } ... same as above
 * raw HTTP          123       { size: 'large' }                 fetch('/stores/123/candies?size=large', ...
 *
 * This hook normalizes the difference between the transports. A hook of
 * all: [ hooksCommon.setSlug('storeId') ]
 * provides a normalized hook.params.query of { size: 'large', storeId: '123' }.
 *
 * module.exports.before = {
 *   all: [ hooksCommon.setSlug('storeId') ]
 * };
 */

module.exports.setSlug = (slug) => ((hook) => {
  if (hook.params && hook.params.provider === 'rest') {
    const value = hook.params[slug];

    // Handle raw HTTP call. feathers-client rest api calls cannot send a slug value.
    // They must already include the slug in the query object.
    if (typeof value === 'string' && value[0] !== ':') {
      if (!hook.params.query) { hook.params.query = {}; }
      hook.params.query[slug] = value;
    }
  }
});

/**
 * Display debug info in hooks
 * @param {string} msg
 *
 * module.exports.before = {
 *   create: [ hooksCommon.debug('step 1') ]
 * };
 */
module.exports.debug = (msg) => (
  (hook) => {
    console.log(`* ${msg || ''}\ntype:${hook.type}, method: ${hook.method}`);
    if (hook.data) { console.log('data:', hook.data); }
    if (hook.params && hook.params.query) { console.log('query:', hook.params.query); }
    if (hook.results) { console.log('results:', hook.results); }
  }
);

/**
 * Factory for Feathers hooks.restrictToRoles
 * @param {array|string|undefined} defaultRoles authorized to continue. Default [].
 * @param {string} rolesFieldName name of field containing roles. Default 'roles'.
 * @param {boolean} defaultIfOwner if record owner authorized to continue. Default false.
 * @param {string} ownerFieldName name of field containing owner ID. Default 'ownerId'.
 *
 * const authorizer = hooksCommon.restrictToRoles([], 'allowedRoles', false, 'ownerId');
 * module.exports.before = {
 *   all: [ authorizer(['purchasing', 'accounting']) ]
 * }
 */
module.exports.restrictToRoles =
  (defaultRoles, rolesFieldName = 'roles', defaultIfOwner = false, ownerFieldName = 'ownerId') => {
    if (typeof defaultRoles === 'string') { defaultRoles = [defaultRoles]; }
    if (!defaultRoles) { defaultRoles = []; }

    return (roles, ifOwner) => hooks.restrictToRoles({
      roles: roles || defaultRoles,
      fieldName: rolesFieldName || 'roles',
      owner: typeof ifOwner === 'undefined' ? defaultIfOwner : ifOwner,
      ownerField: ownerFieldName || 'createdById'
    })
  };
