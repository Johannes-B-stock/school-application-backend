const { isAdmin } = require("../common/utils");

module.exports = (policyContext, config, { strapi }) => {
  if (isAdmin(policyContext)) {
    // if a session is open
    // go to next policy or reach the controller's action
    return true;
  }

  return 403; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
