//
// THIS IS A TEMPORARY WORKAROUND TO FIX THE ISSUE THAT ROLES ARE NOT INCLUDED IN THE USER
// See this github issue for updates:
// https://github.com/strapi/strapi/issues/11957
//

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

  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      { ...ctx.params, populate: ["role"] }
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

  return plugin;
};
