const _ = require("lodash");

// This policy is needed for the update route so that answers can only be updated if the answer
// belongs to the user or is a reference answer

module.exports = async (policyContext, config, { strapi }) => {
  const { id } = policyContext.request.params;

  if (!id) {
    return false;
  }

  // find reference and check if the given uid in query is the same as the reference uid
  const { uid } = policyContext.request.query;
  if (uid) {
    const reference = await strapi.entityService.findMany(
      "api::reference.reference",
      {
        filters: {
          $and: [
            {
              answers: {
                id: {
                  $eq: id,
                },
              },
            },
            { uid: { $eq: uid } },
          ],
        },
      }
    );
    return reference.length > 0;
  }

  // find user and his applications and only retrieve answers that belong to user
  if (!policyContext.state.user) {
    return false;
  }
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
