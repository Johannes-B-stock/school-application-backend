//
// THIS IS A TEMPORARY WORKAROUND TO FIX THE ISSUE THAT ROLES ARE NOT INCLUDED IN THE USER
// See this github issue for updates:
// https://github.com/strapi/strapi/issues/11957
//
const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const utils = require("@strapi/utils");

const { sanitize } = utils;

// const sanitizeOutput = (user, ctx) => {
//   const schema = strapi.getModel("plugin::users-permissions.user");
//   const { auth } = ctx.state;

//   return sanitize.contentAPI.output(user, schema, { auth });
// };

module.exports = (plugin) => {
  const sanitizeOutput = (user) => {
    const {
      password,
      resetPasswordToken,
      confirmationToken,
      ...sanitizedUser
    } = user; // be careful, you need to omit other private attributes yourself
    return sanitizedUser;
  };

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      { populate: ctx.query.populate }
    );
    ctx.body = sanitizeOutput(user);
  };

  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    await strapi
      .query("plugin::users-permissions.user")
      .update({
        where: { id: ctx.state.user.id },
        data: ctx.request.body.data,
      })
      .then((res) => {
        ctx.body = sanitizeOutput(res);
        ctx.response.status = 200;
      })
      .catch((error) => {
        ctx.response.status = 500;
        ctx.response.message = error?.message ?? error;
      });
  };

  plugin.controllers.user.getStaff = async (ctx) => {
    const staffFilter = {
      role: {
        name: {
          $in: ["Staff", "SchoolAdmin", "Admin"],
        },
      },
    };
    const { results, pagination } = await strapi.entityService.findPage(
      "plugin::users-permissions.user",
      {
        ...ctx.query,
        filters: { ...staffFilter, ...ctx.query.filters },
        populate: [...ctx.query?.populate, "role"],
      }
    );
    const users = results.map((user) => sanitizeOutput(user));
    ctx.body = { staff: users, pagination };
  };

  // CUSTOM ROUTES

  // Add the custom route
  plugin.routes["content-api"].routes.unshift({
    method: "PUT",
    path: "/users/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.unshift({
    method: "GET",
    path: "/users/staff",
    handler: "user.getStaff",
    config: {
      prefix: "",
      policies: ["global::is-staff"],
    },
  });

  return plugin;
};
