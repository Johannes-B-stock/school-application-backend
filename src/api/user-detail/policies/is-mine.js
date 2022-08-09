module.exports = async (policyContext, config, { strapi }) => {
  if (!policyContext.state.user) {
    return 401;
  }

  const roleName = policyContext.state.user.role.name.toLowerCase();
  // if (roleName === "schooladmin" || roleName === "admin") {
  //   // if a session is open
  //   // go to next policy or reach the controller's action
  //   return true;
  // }
  const { id } = policyContext.params;
  const { query } = policyContext;

  console.log(policyContext.params);

  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    policyContext.state.user.id,
    { populate: ["details"] }
  );
  console.log(user);

  const userDetail = await strapi
    .service("api::user-detail.user-detail")
    .findOne(user.details.id, { ...query, populate: ["user"] });
  console.log(userDetail);

  if (userDetail?.user.id === policyContext.state.user.id) {
    return true;
  }

  return 401; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
