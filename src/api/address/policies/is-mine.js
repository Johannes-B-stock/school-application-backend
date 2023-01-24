const { isAdmin } = require("../../../common/utils");

module.exports = async (policyContext, config, { strapi }) => {
  if (!policyContext.state.user) {
    return false;
  }
  // find user and his addresses and check if the requested address belongs to the user
  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    policyContext.state.user.id,
    {
      populate: { addresses: true },
    }
  );

  const allUserAddresses = user.addresses.map((address) => address.id);

  const { id } = policyContext.request.params;

  if (!id) {
    return false;
  }
  if (allUserAddresses.find((userAddressId) => userAddressId == id)) {
    return true;
  }
  return false;
};
