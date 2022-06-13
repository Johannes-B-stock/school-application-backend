"use strict";

module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/school/add-student",
      handler: "school.addStudent",
      config: {
        policies: [],
      },
    },
  ],
};
