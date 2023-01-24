"use strict";

/**
 *  address controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { isNotAdmin } = require("../../../common/utils");

module.exports = createCoreController("api::address.address", ({ strapi }) => ({
  async find(ctx) {
    if (isNotAdmin(ctx)) {
      ctx.query = {
        ...ctx.query,
        filters: {
          ...ctx.query?.filters,
          user: { id: { $eq: ctx.state.user.id } },
        },
      };
    }
    const found = await super.find(ctx);
    return found;
  },
  async findOne(ctx) {
    const found = await super.findOne(ctx);
    return found;
  },
  async create(ctx) {
    const address = await super.create(ctx);
    return address;
  },
}));
