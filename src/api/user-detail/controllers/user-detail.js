"use strict";

/**
 *  user-detail controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::user-detail.user-detail",
  ({ strapi }) => ({
    // find school applications
    async findMe(ctx) {
      ctx.filters = { ...ctx.filters, user: ctx.state.user.id };
      return super.find(ctx);
    },
    async updateMe(ctx) {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        { populate: ["details"] }
      );
      ctx.params = { ...ctx.params, id: user.details.id };
      return super.update(ctx);
    },
    async createMe(ctx) {
      ctx.request.body.data.user = ctx.state.user.id;
      return super.create(ctx);
    },
  })
);
