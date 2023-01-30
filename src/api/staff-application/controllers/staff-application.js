"use strict";

/**
 *  staff-application controller
 */

const utils = require("@strapi/utils");
const { isAdmin } = require("../../../common/utils");
const { createCoreController } = require("@strapi/strapi").factories;
const { UnauthorizedError } = utils.errors;

module.exports = createCoreController(
  "api::staff-application.staff-application",
  ({ strapi }) => ({
    // find staff applications
    async find(ctx) {
      let query = ctx.query;
      if (!isAdmin(ctx)) {
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

    async findOne(ctx) {
      if (!isAdmin(ctx)) {
        const query = {
          populate: "user",
        };
        const application = await strapi.entityService.findOne(
          "api::staff-application.staff-application",
          ctx.params.id,
          query
        );
        if (application.user.id !== ctx.state.user.id) {
          throw new ForbiddenError(
            "Only admins can see other applications then their own."
          );
        }
      }
      return await super.findOne(ctx);
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
    // Update a staff application----------------------------------------
    async update(ctx) {
      if (!ctx.state.user) {
        return 403;
      }

      const application = await this.findOne({
        ...ctx,
        query: { ...ctx.query, populate: { user: { populate: "role" } } },
      });
      if (!application?.data) {
        return ctx.unauthorized(`You can't update this entry`);
      }
      if (
        application.data.attributes.state !== "submitted" &&
        ctx.request.body?.data?.state === "submitted"
      ) {
        ctx.request.body.data.submittedAt = new Date().getTime();
      }
      if (
        application.data.attributes.state !== "approved" &&
        ctx.request.body?.data?.state === "approved"
      ) {
        ctx.request.body.data.approvedAt = new Date().getTime();

        const user = application.data.attributes.user?.data;

        if (
          user.attributes.role.data.attributes.name.toLowerCase() === "user" ||
          user.attributes.role.data.attributes.name.toLowerCase() === "student"
        ) {
          // update user and switch role to staff

          const roles = await strapi.entityService.findMany(
            "plugin::users-permissions.role"
          );

          const staffRole = roles.find(
            (role) => role.name.toLowerCase() === "staff"
          );

          await strapi.entityService.update(
            "plugin::users-permissions.user",
            user.id,
            { data: { role: staffRole.id } }
          );
        }
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
