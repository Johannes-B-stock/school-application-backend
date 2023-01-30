"use strict";

/**
 *  school-application controller
 */
const utils = require("@strapi/utils");
const { createCoreController } = require("@strapi/strapi").factories;
const { isNotAdmin, isAdmin } = require("../../../common/utils");
const { NotFoundError, ForbiddenError } = utils.errors;

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
        const query = {
          populate: "user",
        };
        const application = await strapi.entityService.findOne(
          "api::school-application.school-application",
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
        throw new ForbiddenError("You have to be logged in for this");
      }
      try {
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
          ctx.request.body.data.approvedAt = new Date().getTime();

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

          // send approval email

          const pageContent = await strapi.entityService.findMany(
            "api::page-content.page-content"
          );

          const siteName = pageContent.pageTitle;
          await strapi
            .plugin("email-designer")
            .service("email")
            .sendTemplatedEmail(
              {
                // required
                to: application.attributes.user.data.attributes.email,
              },
              {
                // required - Ref ID defined in the template designer (won't change on import)
                templateReferenceId:
                  school.attributes.approvalEmailTemplateId ?? 2,
              },
              {
                // this object must include all variables you're using in your email template
                applicant: application.attributes.user.data.attributes,
                school: { id: school.id, ...school.attributes },
                site: {
                  name: siteName,
                  url: process.env.NEXT_URL,
                },
                SITE: {
                  name: siteName,
                  url: process.env.NEXT_URL,
                },
              }
            );
        }
      } catch (err) {
        strapi.log.debug("📺: ", err);
        return ctx.badRequest(null, err);
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
