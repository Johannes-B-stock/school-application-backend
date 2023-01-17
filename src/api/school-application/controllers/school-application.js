"use strict";

/**
 *  school-application controller
 */
const utils = require("@strapi/utils");
const { createCoreController } = require("@strapi/strapi").factories;
const { NotFoundError } = utils.errors;

module.exports = createCoreController(
  "api::school-application.school-application",
  ({ strapi }) => ({
    // find school applications
    async find(ctx) {
      let query = ctx.query;
      if (isNotAdmin(ctx)) {
        query = {
          ...query,
          filters: {
            ...query.filters,
            user: { id: ctx.state.user.id },
          },
        };
      }

      const applications = await super.find({ ...ctx, query });
      return applications;
    },

    async findOne(ctx) {
      let query = ctx.query;
      if (isNotAdmin(ctx)) {
        query = {
          ...query,
          filters: {
            ...query.filters,
            user: { id: ctx.state.user.id },
          },
        };
      }

      const application = await super.findOne({ ...ctx, query });
      return application;
    },

    // Create application that belongs to user----------------------------------------
    async create(ctx) {
      if (!ctx.state.user.id) {
      }
      const application = await super.create(ctx);

      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        { populate: ["school_applications"] }
      );
      if (!user) {
        throw new NotFoundError(`User not found`);
      }
      user.school_applications = [
        ...user.school_applications,
        application.data.id,
      ];

      const me = await strapi
        .controller("plugin::users-permissions.user")
        .updateMe({
          ...ctx,
          request: {
            ...ctx.request,
            body: {
              ...ctx.request.body,
              data: {
                ...user,
              },
            },
          },
        });

      return application;
    },
    // Update a user application----------------------------------------
    async update(ctx) {
      const applications = await this.find(ctx);
      if (!applications.data || !applications.data.length) {
        return ctx.unauthorized(`You can't update this entry`);
      }
      return super.update(ctx);
    },

    // Delete a user application----------------------------------------
    async delete(ctx) {
      const { id } = ctx.params;
      let query = ctx.query;
      if (isNotAdmin(ctx)) {
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
      const response = await super.delete(ctx);
      return response;
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
  })
);
function isNotAdmin(ctx) {
  return (
    ctx.state.user.role.name.toLowerCase() !== "schooladmin" &&
    ctx.state.user.role.name.toLowerCase() !== "admin"
  );
}
