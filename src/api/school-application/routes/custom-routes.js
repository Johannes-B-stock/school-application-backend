"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/school-applications/me",
      handler: "school-application.me",
      config: {
        policies: [],
      },
    },
  ],
};
