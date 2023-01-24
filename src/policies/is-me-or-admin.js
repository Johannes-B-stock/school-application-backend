const { isAdmin } = require("../common/utils");

module.exports = (policyContext, config, { strapi }) => {
  if (isAdmin(policyContext)) {
    return true;
  }

  const { id } = policyContext.request.params;
  if (id == policyContext.state.user.id) {
    return true;
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
