"use strict";

/**
 *  school controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::school.school", ({ strapi }) => ({
  async addStudent(ctx) {
    const schoolId = ctx.request.body.school;
    const userId = ctx.request.body.user;

    const school = await strapi
      .service("api::school.school")
      .findOne(schoolId, ctx.query);

    const students = [...school.students, userId];

    ctx.request.body = JSON.stringify({
      data: {
        students: students,
      },
    });

    await super.update(ctx);
  },
}));
