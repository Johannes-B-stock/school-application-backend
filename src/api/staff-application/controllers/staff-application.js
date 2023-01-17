"use strict";

/**
 *  staff-application controller
 */

const utils = require("@strapi/utils");
const { createCoreController } = require("@strapi/strapi").factories;
const { UnauthorizedError } = utils.errors;

module.exports = createCoreController(
  "api::staff-application.staff-application",
  ({ strapi }) => ({
    // find staff applications
    async find(ctx) {
      let query = ctx.query;
      if (ctx.state.user.role.name.toLowerCase() !== "admin") {
        query = {
          ...query,
          filters: {
            ...query.filters,
            user: { id: ctx.state.user.id },
          },
        };
      }

      return await super.find({ ...ctx, query });
    },
    // Create application that belongs to user----------------------------------------
    async create(ctx) {
      ctx.request.body = {
        ...ctx.request.body,
        data: {
          ...ctx.request.body.data,
          user: ctx.state.user,
        },
      };
      return await super.create(ctx);
    },
    // Update a user application----------------------------------------
    async update(ctx) {
      const { id } = ctx.params;
      const query = {
        ...ctx.query,
        filters: {
          ...ctx.query?.filters,
          id: id,
        },
      };
      if (ctx.state.user.role.name.toLowerCase() !== "admin") {
        query.filters.user = { id: ctx.state.user.id };
      }
      const applications = await this.find({ ...ctx, query: query });
      if (!applications.data || !applications.data.length) {
        return ctx.unauthorized(`You can't update this entry`);
      }
      return await super.update(ctx);
    },

    // Delete a user application----------------------------------------
    async delete(ctx) {
      const { id } = ctx.params;
      let query = ctx.query;
      if (ctx.state.user.role.name.toLowerCase() !== "admin") {
        query = {
          filters: {
            id: id,
            user: { id: ctx.state.user.id },
          },
        };
      }

      const events = await this.find({ ...ctx, query: query });
      if (!events.data || !events.data.length) {
        return ctx.unauthorized(`You can't delete this entry`);
      }
      return await super.delete(ctx);
    },
    // Get applications that belong to logged in user----------------------------------------
    async me(ctx) {
      const user = ctx.state.user;
      let query = ctx.query;
      if (!user) {
        return ctx.badRequest(null, [
          { messages: [{ id: "No authorization header was found" }] },
        ]);
      }
      query = {
        ...query,
        filters: {
          ...query.filters,
          user: { id: ctx.state.user.id },
        },
      };
      const data = await this.find({ ...ctx, query });
      if (!data) {
        return ctx.badRequest();
      }
      return data;
    },
    async count(ctx) {
      const user = ctx.state.user;
      if (!user) {
        throw new UnauthorizedError("No user logged in");
      }
      if (user.role.name.toLowerCase() !== "admin") {
        throw new UnauthorizedError("Only admins can count staff applications");
      }
      let query = ctx.query;
      return strapi.entityService.count(
        "api::staff-application.staff-application",
        query
      );
    },
  })
);
