"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/staff-applications/me",
      handler: "staff-application.me",
      config: {
        policies: [],
      },
    },
  ],
};
