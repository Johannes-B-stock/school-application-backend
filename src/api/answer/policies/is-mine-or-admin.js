const { isAdmin } = require("../../../common/utils");
const _ = require("lodash");

module.exports = async (policyContext, config, { strapi }) => {
  if (isAdmin(policyContext)) {
    // Go to next policy or will reach the controller's action.
    return true;
  }
  if (!policyContext.state.user) {
    return false;
  }
  const { id } = policyContext.request.params;

  if (!id) {
    return false;
  }
  // find user and his applications and only retrieve answers that belong to user

  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    policyContext.state.user.id,
    {
      populate: {
        school_applications: { populate: "answers" },
        staff_applications: { populate: "answers" },
      },
    }
  );

  const allUserAnswers = [];
  allUserAnswers.push(
    ..._.flatten(
      user.school_applications.map((application) =>
        application.answers.map((answer) => answer.id)
      )
    )
  );
  allUserAnswers.push(
    ..._.flatten(
      user.staff_applications.map((application) =>
        application.answers.map((answer) => answer.id)
      )
    )
  );
  if (allUserAnswers.find((answerId) => answerId == id)) {
    return true;
  }
  return false;
};
