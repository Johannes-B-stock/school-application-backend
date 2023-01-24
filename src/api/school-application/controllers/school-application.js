"use strict";

/**
 *  school-application controller
 */
const utils = require("@strapi/utils");
const { createCoreController } = require("@strapi/strapi").factories;
const { isNotAdmin, isAdmin } = require("../../../common/utils");
const { NotFoundError } = utils.errors;

module.exports = createCoreController(
  "api::school-application.school-application",
  ({ strapi }) => ({
    // find school applications
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

      const applications = await super.find(ctx);
      return applications;
    },

    async findOne(ctx) {
      if (isNotAdmin(ctx)) {
        ctx.query = {
          ...ctx.query,
          filters: {
            ...ctx.query?.filters,
            user: { id: ctx.state.user.id },
          },
        };
      }
      const application = await super.findOne(ctx);
      return application;
    },

    // Create application that belongs to user----------------------------------------
    async create(ctx) {
      if (!ctx.state.user.id) {
        return await super.create(ctx);
      }
      if (!ctx.request.body?.data?.user) {
        ctx.request.body = {
          ...ctx.request.body,
          data: {
            ...ctx.request.body?.data,
            user: ctx.state.user.id,
          },
        };
      }
      const application = await super.create(ctx);
      return application;
    },

    // Update a school application----------------------------------------
    async update(ctx) {
      if (!ctx.state.user) {
        return 403;
      }
      const { id } = ctx.params;
      const query = {
        ...ctx.query,
        filters: {
          ...ctx.query?.filters,
          id: id,
        },
        populate: {
          user: { populate: "role" },
          school: { populate: "students" },
        },
      };
      if (!isAdmin(ctx)) {
        query.filters = {
          user: { id: { $eq: ctx.state.user.id } },
        };
      }
      const applicationFind = await this.findOne({ ...ctx, query: query });
      if (!applicationFind.data) {
        return ctx.unauthorized(`You can't update this entry`);
      }

      const application = applicationFind.data;
      if (
        application.attributes.state !== "submitted" &&
        ctx.request.body?.data?.state === "submitted"
      ) {
        ctx.request.body.data.submittedAt = new Date().getTime();
      }

      const school = application.attributes.school.data;
      const user = application.attributes.user.data;
      if (
        application.attributes.state !== "approved" &&
        ctx.request.body?.data?.state === "approved"
      ) {
        // get students from school info
        const students = school.attributes.students.data.map(
          (student) => student.id
        );

        // get user id from application and add to students

        const updatedStudents = [...students, user.id];

        await strapi.entityService.update("api::school.school", school.id, {
          data: { students: updatedStudents },
        });

        if (
          user.attributes.role.data.attributes.name.toLowerCase() === "user"
        ) {
          // get roles
          const roles = await strapi.entityService.findMany(
            "plugin::users-permissions.role"
          );

          const studentRole = roles.find(
            (role) => role.name.toLowerCase() === "student"
          );

          // update user role to student
          await strapi.entityService.update(
            "plugin::users-permissions.user",
            user.id,
            { data: { role: studentRole.id } }
          );
        }
      }
      return await super.update(ctx);
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
