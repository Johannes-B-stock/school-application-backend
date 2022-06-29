module.exports = (policyContext) => {
  const roleName = policyContext.state.user.role.name.toLowerCase();
  if (
    roleName === "schooladmin" ||
    roleName === "admin" ||
    roleName === "staff"
  ) {
    // if a session is open
    // go to next policy or reach the controller's action
    return true;
  }

  return 401; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
