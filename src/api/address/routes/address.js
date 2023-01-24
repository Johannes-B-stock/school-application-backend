"use strict";

/**
 * address router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::address.address", {
  config: {
    find: {
      policies: ["global::is-admin"],
    },
    findOne: {
      policies: ["is-mine-or-admin"],
    },
    update: {
      policies: ["is-mine"],
    },
  },
});
