"use strict";

/**
 * answer router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::answer.answer", {
  config: {
    find: {
      policies: ["global::is-admin"],
    },
    findOne: {
      policies: ["is-mine-or-admin"],
    },
    update: {
      policies: ["is-mine-or-reference"],
    },
  },
});
