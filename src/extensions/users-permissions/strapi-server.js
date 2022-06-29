//
// THIS IS A TEMPORARY WORKAROUND TO FIX THE ISSUE THAT ROLES ARE NOT INCLUDED IN THE USER
// See this github issue for updates:
// https://github.com/strapi/strapi/issues/11957
//
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

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

  plugin.controllers.user.changePassword = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const userId = ctx.state.user.id;
    const currentPassword = ctx.request.body.currentPassword;
    const newPassword = ctx.request.body.newPassword;

    if (!userId || !currentPassword || !newPassword) {
      return ctx.throw(400, "provide-userId-currentPassword-newPassword");
    }
    let user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ id: userId });
    const validPassword = await strapi
      .service("plugin::users-permissions.user")
      .validatePassword(currentPassword, user.password);

    if (!validPassword) {
      return ctx.throw(401, "Wrong current password");
    } else {
      // Generate new hashed password
      await getService("user").edit(user.id, {
        resetPasswordToken: null,
        password: newPassword,
      });

      // Return new jwt token
      ctx.send({
        jwt: strapi.service("plugin::users-permissions.jwt").issue({
          id: user.id,
        }),
        user: sanitizeOutput(user),
      });
    }
  };

  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        ...ctx,
        filters: ctx.query.filters,
        populate: [...ctx.query?.populate, "role"],
      }
    );

    ctx.body = users.map((user) => sanitizeOutput(user));
  };

  plugin.controllers.user.getStaff = async (ctx) => {
    const staffFilter = {
      role: {
        name: {
          $in: ["Staff", "SchoolAdmin", "Admin"],
        },
      },
    };
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        ...ctx,
        filters: { ...staffFilter, ...ctx.query.filters },
        populate: [...ctx.query?.populate, "role"],
      }
    );

    ctx.body = users.map((user) => sanitizeOutput(user));
  };

  plugin.controllers.user.findOne = async (ctx) => {
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      ctx.params.id,
      ctx.query
    );

    ctx.body = user;
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
    method: "PUT",
    path: "/users/change-password",
    handler: "user.changePassword",
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
