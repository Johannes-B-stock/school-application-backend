"use strict";

/**
 *  school-application controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::school-application.school-application",
  ({ strapi }) => ({
    // find school applications
    async find(ctx) {
      let query = ctx.query;
      if (ctx.state.user.role.name !== "SchoolAdmin") {
        query = {
          ...query,
          filters: {
            ...query.filters,
            user: { id: ctx.state.user.id },
          },
        };
      }

      const objects = await super.find({ ...ctx, query });
      return objects;
    },
    // Create application that belongs to user----------------------------------------
    async create(ctx) {
      let entity;
      ctx.request.body.data.user = ctx.state.user;
      entity = await super.create(ctx);
      return entity;
    },
    // Update a user application----------------------------------------
    async update(ctx) {
      let entity;
      const { id } = ctx.params;
      const query = {
        filters: {
          id: id,
          user: { id: ctx.state.user.id },
        },
      };
      const applications = await this.find({ query: query });
      console.log(applications);
      if (!applications.data || !applications.data.length) {
        return ctx.unauthorized(`You can't update this entry`);
      }
      entity = await super.update(ctx);
      return entity;
    },

    // Delete a user application----------------------------------------
    async delete(ctx) {
      const { id } = ctx.params;
      const query = {
        filters: {
          id: id,
          user: { id: ctx.state.user.id },
        },
      };
      const events = await this.find({ query: query });
      if (!events.data || !events.data.length) {
        return ctx.unauthorized(`You can't delete this entry`);
      }
      const response = await super.delete(ctx);
      return response;
    },
    // Get applications that belong to logged in user----------------------------------------
    async me(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest(null, [
          { messages: [{ id: "No authorization header was found" }] },
        ]);
      }
      const data = await this.find(ctx);
      if (!data) {
        return ctx.badRequest();
      }
      return data;
      //   console.log(data);
      //   const sanitizedEntity = await this.sanitizeOutput(data, ctx);
      //   console.log(sanitizedEntity);
      //   return this.transformResponse(sanitizedEntity);
    },
  })
);
