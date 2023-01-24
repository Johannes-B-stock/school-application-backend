"use strict";

const utils = require("@strapi/utils");
const { ForbiddenError } = utils.errors;

/**
 *  answer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::answer.answer", ({ strapi }) => ({
  async findOne(ctx) {
    const found = await super.findOne(ctx);
    return found;
  },
  async create(ctx) {
    const answer = await super.create(ctx);
    return answer;
  },
  async update(ctx) {
    return super.update(ctx);
  },
}));
