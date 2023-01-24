function isNotAdmin(ctx) {
  return !isAdmin(ctx);
}

function isAdmin(ctx) {
  return (
    ctx.state.user?.role?.name.toLowerCase() === "schooladmin" ||
    ctx.state.user?.role?.name.toLowerCase() === "admin"
  );
}

module.exports = {
  isNotAdmin,
  isAdmin,
};
